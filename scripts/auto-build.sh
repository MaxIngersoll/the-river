#!/usr/bin/env bash
# auto-build.sh v2.2 — Infrastructure for The River's autonomous builder
# v2.2 fixes: sync_state command, auto-sync after build, stale state prevention
# v2.1 fixes: shell injection, cleanup trap scoping, bundle parse warning, task ID validation
#
# DESIGN PRINCIPLES (from 5-expert reliability review):
#   1. LLM does creative work only — this script owns ALL infrastructure
#   2. One task per invocation — no multi-task ambition
#   3. Fail loudly — every outcome logged to docs/auto-logs/sessions.jsonl
#   4. Fail fast — preflight checks before creative work
#   5. Fail safely — circuit breaker, stash, no force-push
#   6. Quick wins first — sort by estimated_min, skip broken tasks
#
# COMMANDS:
#   preflight    — validate worktree, node, npm, git status, JSON integrity
#   setup        — cd, PATH, git pull, ensure dirs
#   lock         — acquire lock (exits non-zero if locked/paused/circuit-broken)
#   unlock       — release lock
#   next_task    — print the next task as JSON (smallest estimated_min first, skip broken)
#   build_gate   — npm run build + bundle size check
#   commit_push  — git add, commit, push with retry
#   complete_task <id> — move task from next_tasks to completed in AUTOPILOT.json
#   record_success — reset consecutive_failures to 0
#   record_failure <task_id> <error_msg> — increment failures, log, optionally pause
#   stash_and_log — stash changes, record ref
#   log_session <outcome> <task_id> <message> — append structured log entry
#   heartbeat <context> — update heartbeat file with timestamp + what we're doing
#   status       — print current builder status (heartbeat age, lock, failures)

# Don't use set -e globally — we handle errors per-command
set +e

# ─── Config ──────────────────────────────────────────────────────────────────
WORKTREE="/Users/Max/Claude/Guitar Tracking App/.claude/worktrees/musing-nightingale"
BRANCH="claude/musing-nightingale"
NODE20="/usr/local/opt/node@20/bin"
AUTOPILOT="AUTOPILOT.json"
HEARTBEAT_FILE="/Users/Max/Claude/Guitar Tracking App/.claude/auto-heartbeat"
LOG_DIR="docs/auto-logs"
SESSION_LOG="docs/auto-logs/sessions.jsonl"
BUNDLE_RAW_LIMIT=420  # KB
BUNDLE_GZIP_LIMIT=125 # KB
MAX_TASK_ATTEMPTS=2    # skip task after this many failures
CIRCUIT_BREAKER_LIMIT=3
_THIS_INVOCATION_HOLDS_LOCK=false  # Only true after cmd_lock succeeds

# ─── Helpers ─────────────────────────────────────────────────────────────────
timestamp() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

die() {
  echo "FATAL: $1" >&2
  # Log the fatal error
  _log_to_file "fatal" "" "$1"
  exit 1
}

_ensure_worktree() {
  cd "$WORKTREE" || die "Cannot cd to worktree: $WORKTREE"
}

_ensure_node() {
  export PATH="$NODE20:$PATH"
}

_ensure_python() {
  command -v python3 &>/dev/null || die "python3 required for JSON parsing"
}

_ensure_log_dir() {
  mkdir -p "$WORKTREE/$LOG_DIR"
}

_log_to_file() {
  # Append a structured JSONL line to the session log
  # Usage: _log_to_file <outcome> <task_id> <message>
  local outcome="${1:-unknown}"
  local task_id="${2:-none}"
  local message="${3:-}"
  local ts
  ts=$(timestamp)

  _ensure_log_dir

  # Escape message for JSON (replace quotes, newlines)
  local safe_msg
  safe_msg=$(echo "$message" | tr '\n' ' ' | sed 's/"/\\"/g' | head -c 500)

  echo "{\"time\":\"$ts\",\"outcome\":\"$outcome\",\"task\":\"$task_id\",\"message\":\"$safe_msg\"}" >> "$WORKTREE/$SESSION_LOG"
}

# ─── Cleanup trap ────────────────────────────────────────────────────────────
cleanup() {
  local exit_code=$?
  cd "$WORKTREE" 2>/dev/null || true

  # Only clear lock if THIS invocation acquired it (Fix: H3 — don't clobber
  # another builder's lock when running read-only commands like status/preflight)
  if [ "$_THIS_INVOCATION_HOLDS_LOCK" = "true" ]; then
    if command -v python3 &>/dev/null && [ -f "$AUTOPILOT" ]; then
      python3 -c "
import json, sys
try:
    with open('$AUTOPILOT', 'r') as f:
        data = json.load(f)
    data['locked_by'] = None
    with open('$AUTOPILOT', 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')
except Exception as e:
    print(f'Warning: could not clear lock: {e}', file=sys.stderr)
" 2>/dev/null
    fi
  fi

  # Update heartbeat with exit status (only if we were doing real work)
  if [ "$_THIS_INVOCATION_HOLDS_LOCK" = "true" ] && [ -n "$HEARTBEAT_FILE" ]; then
    echo "{\"time\":\"$(timestamp)\",\"status\":\"exited\",\"exit_code\":$exit_code}" > "$HEARTBEAT_FILE" 2>/dev/null
  fi

  exit $exit_code
}
trap cleanup EXIT

# ─── Commands ────────────────────────────────────────────────────────────────

cmd_preflight() {
  # Validate everything before the LLM starts creative work
  # Exits 0 if all checks pass, non-zero with descriptive error if not
  local errors=0

  # 1. Worktree exists
  if [ ! -d "$WORKTREE" ]; then
    echo "PREFLIGHT_FAIL: worktree missing at $WORKTREE"
    errors=$((errors + 1))
  fi

  # 2. Can cd there
  cd "$WORKTREE" 2>/dev/null || {
    echo "PREFLIGHT_FAIL: cannot cd to $WORKTREE"
    return 1
  }

  # 3. Node 20 available
  if [ ! -x "$NODE20/node" ]; then
    echo "PREFLIGHT_FAIL: node not found at $NODE20/node"
    errors=$((errors + 1))
  fi

  # 4. python3 available
  if ! command -v python3 &>/dev/null; then
    echo "PREFLIGHT_FAIL: python3 not found"
    errors=$((errors + 1))
  fi

  # 5. AUTOPILOT.json exists and parses
  if [ ! -f "$AUTOPILOT" ]; then
    echo "PREFLIGHT_FAIL: $AUTOPILOT not found"
    errors=$((errors + 1))
  else
    python3 -c "
import json, sys
try:
    with open('$AUTOPILOT', 'r') as f:
        data = json.load(f)
    # Verify required keys
    required = ['next_tasks', 'completed', 'consecutive_failures', 'paused']
    missing = [k for k in required if k not in data]
    if missing:
        print('PREFLIGHT_FAIL: AUTOPILOT.json missing keys: {}'.format(missing))
        sys.exit(1)
    print('AUTOPILOT_OK: {} tasks queued, {} completed, {} consecutive failures'.format(
        len(data['next_tasks']), len(data['completed']), data.get('consecutive_failures', 0)))
except json.JSONDecodeError as e:
    print('PREFLIGHT_FAIL: AUTOPILOT.json is corrupt: {}'.format(e))
    sys.exit(1)
" || errors=$((errors + 1))
  fi

  # 6. npm packages installed
  export PATH="$NODE20:$PATH"
  if [ ! -d "$WORKTREE/node_modules" ]; then
    echo "PREFLIGHT_WARN: node_modules missing, running npm install..."
    npm install --silent 2>/dev/null || {
      echo "PREFLIGHT_FAIL: npm install failed"
      errors=$((errors + 1))
    }
  fi

  # 7. Git status clean (warn, don't fail)
  local dirty
  dirty=$(git status --porcelain 2>/dev/null | head -5)
  if [ -n "$dirty" ]; then
    echo "PREFLIGHT_WARN: dirty working tree:"
    echo "$dirty"
  fi

  if [ $errors -gt 0 ]; then
    echo "PREFLIGHT_FAILED: $errors errors"
    return 1
  fi

  echo "PREFLIGHT_PASSED"
  return 0
}

cmd_setup() {
  # cd to worktree, set PATH, pull latest, ensure dirs
  _ensure_worktree
  _ensure_node
  cmd_heartbeat "setup: pulling latest"
  echo "OK: in worktree at $WORKTREE"

  # Ensure directories
  _ensure_log_dir
  mkdir -p docs/overnight-screenshots

  # Git pull (non-fatal if it fails)
  git pull origin "$BRANCH" --no-edit 2>/dev/null || echo "WARN: git pull failed (may be offline or no remote changes)"
  cmd_heartbeat "setup: complete"
  echo "OK: setup complete"
}

cmd_lock() {
  _ensure_worktree
  _ensure_python

  python3 -c "
import json, sys
from datetime import datetime, timezone, timedelta

try:
    with open('$AUTOPILOT', 'r') as f:
        data = json.load(f)
except json.JSONDecodeError as e:
    print('JSON_CORRUPT: {}'.format(e))
    sys.exit(4)

# Check if paused
if data.get('paused', False):
    print('PAUSED')
    sys.exit(2)

# Check circuit breaker
failures = data.get('consecutive_failures', 0)
if failures >= $CIRCUIT_BREAKER_LIMIT:
    data['paused'] = True
    with open('$AUTOPILOT', 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')
    print('CIRCUIT_BREAKER: {} consecutive failures, auto-pausing'.format(failures))
    sys.exit(3)

# Check lock
locked = data.get('locked_by')
timeout = data.get('lock_timeout_minutes', 45)
if locked:
    try:
        lock_time = datetime.fromisoformat(locked.replace('Z', '+00:00'))
        now = datetime.now(timezone.utc)
        age_min = int((now - lock_time).total_seconds() / 60)
        if age_min < timeout:
            print('LOCKED: lock is {} minutes old (timeout={})'.format(age_min, timeout))
            sys.exit(1)
        else:
            print('STALE_LOCK: overriding {}min old lock'.format(age_min))
    except ValueError:
        print('INVALID_LOCK: overriding')

# Acquire lock
now_str = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
data['locked_by'] = now_str
with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('LOCKED_OK: acquired at {}'.format(now_str))
"
  local lock_exit=$?
  if [ $lock_exit -eq 0 ]; then
    _THIS_INVOCATION_HOLDS_LOCK=true
  fi
  return $lock_exit
}

cmd_unlock() {
  _ensure_worktree
  _ensure_python
  python3 -c "
import json
with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)
data['locked_by'] = None
with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('UNLOCKED')
"
}

cmd_next_task() {
  # Print the next task as JSON, picking the quickest unbroken task
  # Exits 0 with task JSON on stdout, exits 1 if no tasks available
  _ensure_worktree
  _ensure_python

  python3 -c "
import json, sys

with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)

tasks = data.get('next_tasks', [])
if not tasks:
    print('NO_TASKS')
    sys.exit(1)

# Sort by estimated_min (quick wins first)
tasks_with_idx = [(i, t) for i, t in enumerate(tasks)]
tasks_with_idx.sort(key=lambda x: x[1].get('estimated_min', 999))

# Skip tasks that have been attempted too many times
max_attempts = $MAX_TASK_ATTEMPTS
for idx, task in tasks_with_idx:
    attempts = task.get('attempts', 0)
    if attempts >= max_attempts:
        continue
    # Found a viable task — print it
    print(json.dumps(task))
    sys.exit(0)

# All tasks are broken
print('ALL_TASKS_BROKEN: every task has failed {} or more times'.format(max_attempts))
sys.exit(2)
"
}

cmd_complete_task() {
  # Move a task from next_tasks to completed
  # Usage: auto-build.sh complete_task <task_id>
  local task_id="$1"
  [ -z "$task_id" ] && die "task_id required"

  # Fix M5: Validate task_id is safe for Python interpolation (kebab-case only)
  if ! echo "$task_id" | grep -qE '^[a-z0-9][a-z0-9-]*$'; then
    die "Invalid task_id format: '$task_id' (must be kebab-case: a-z, 0-9, hyphens)"
  fi

  _ensure_worktree
  _ensure_python

  python3 -c "
import json, sys
from datetime import datetime, timezone

task_id = '$task_id'
with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)

# Find and remove from next_tasks
found = None
remaining = []
for t in data.get('next_tasks', []):
    if t.get('id') == task_id:
        found = t
    else:
        remaining.append(t)

if not found:
    print('TASK_NOT_FOUND: {}'.format(task_id))
    sys.exit(1)

# Add to completed with timestamp
found['shipped'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
data['next_tasks'] = remaining
data.setdefault('completed', []).append(found)

# Update session log
last_commit = data.get('last_commit', 'unknown')
log_entry = {
    'time': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    'tasks': [task_id],
    'commits': 1
}
data.setdefault('session_log', []).append(log_entry)

# Trim session_log to max
max_log = data.get('session_log_max', 20)
if len(data['session_log']) > max_log:
    data['session_log'] = data['session_log'][-max_log:]

with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('TASK_COMPLETED: {}'.format(task_id))
"
}

cmd_build_gate() {
  _ensure_worktree
  _ensure_node
  cmd_heartbeat "build_gate: running npm run build"

  echo "Running npm run build..."
  local BUILD_OUTPUT
  BUILD_OUTPUT=$(npm run build 2>&1)
  local build_exit=$?

  if [ $build_exit -ne 0 ]; then
    echo "BUILD_FAILED (exit code $build_exit)"
    echo "$BUILD_OUTPUT" | tail -20
    return 1
  fi

  echo "$BUILD_OUTPUT"

  # Extract bundle size from Vite output
  local JS_SIZE GZIP_SIZE
  JS_SIZE=$(echo "$BUILD_OUTPUT" | grep -E '\.js\s' | grep -oE '[0-9]+\.[0-9]+ kB' | head -1 | grep -oE '[0-9]+\.[0-9]+' || true)
  GZIP_SIZE=$(echo "$BUILD_OUTPUT" | grep -E '\.js\s' | grep -oE 'gzip: [0-9]+\.[0-9]+ kB' | head -1 | grep -oE '[0-9]+\.[0-9]+' || true)

  if [ -n "$JS_SIZE" ]; then
    local JS_INT=${JS_SIZE%.*}
    echo "Bundle: ${JS_SIZE}kB raw"
    if [ "$JS_INT" -gt "$BUNDLE_RAW_LIMIT" ]; then
      echo "BUNDLE_TOO_LARGE: ${JS_SIZE}kB > ${BUNDLE_RAW_LIMIT}kB limit"
      return 1
    fi
  else
    # Fix M3: Warn when Vite output format is unrecognizable rather than silently passing
    echo "BUNDLE_SIZE_UNKNOWN: could not parse JS bundle size from build output"
    echo "  (build passed but size gate is blind — verify dist/ manually)"
  fi

  if [ -n "$GZIP_SIZE" ]; then
    local GZIP_INT=${GZIP_SIZE%.*}
    echo "Bundle gzip: ${GZIP_SIZE}kB"
    if [ "$GZIP_INT" -gt "$BUNDLE_GZIP_LIMIT" ]; then
      echo "BUNDLE_GZIP_TOO_LARGE: ${GZIP_SIZE}kB > ${BUNDLE_GZIP_LIMIT}kB limit"
      return 1
    fi
  else
    echo "GZIP_SIZE_UNKNOWN: could not parse gzip size from build output"
  fi

  # Sync state with actual build output
  cmd_sync_state 2>/dev/null

  cmd_heartbeat "build_gate: passed"
  echo "BUILD_PASSED"
  return 0
}

cmd_commit_push() {
  # Usage: auto-build.sh commit_push "commit message" [file1 file2 ...]
  _ensure_worktree
  local msg="$1"
  shift

  [ -z "$msg" ] && die "commit message required"

  # Add files
  if [ $# -gt 0 ]; then
    git add "$@"
  else
    git add -A
  fi

  # Check if there's actually something to commit
  if git diff --cached --quiet; then
    echo "NOTHING_TO_COMMIT"
    return 0
  fi

  git commit -m "$msg

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

  cmd_heartbeat "commit_push: pushing"

  # Push with retry
  if ! git push origin "$BRANCH" 2>/dev/null; then
    echo "Push rejected, rebasing..."
    git pull --rebase origin "$BRANCH" || die "Rebase failed"
    git push origin "$BRANCH" || die "Push failed after rebase"
  fi

  local HASH
  HASH=$(git log -1 --format=%H)
  cmd_heartbeat "commit_push: done ($HASH)"
  echo "COMMIT_PUSHED: $HASH"
}

cmd_record_success() {
  _ensure_worktree
  _ensure_python
  python3 -c "
import json
with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)
data['consecutive_failures'] = 0
with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('FAILURES_RESET: consecutive_failures = 0')
"
}

cmd_record_failure() {
  # Usage: auto-build.sh record_failure <task_id> <error_message>
  local task_id="${1:-unknown}"
  local error_msg="${2:-unspecified error}"

  # Validate task_id: reject special characters that could break Python interpolation
  if echo "$task_id" | grep -qE "['\"\`\\\\]"; then
    echo "INVALID_TASK_ID: contains unsafe characters: $task_id" >&2
    task_id="sanitized"
  fi

  _ensure_worktree
  _ensure_python

  # Log the failure
  _log_to_file "failure" "$task_id" "$error_msg"

  # Fix H2: Pass error_msg via env var to avoid shell injection in Python
  RIVER_ERROR_MSG="$error_msg" python3 -c "
import json, os, sys

task_id = '$task_id'
error_msg = os.environ.get('RIVER_ERROR_MSG', 'unspecified error')[:200]

with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)

# Increment global consecutive failures
failures = data.get('consecutive_failures', 0) + 1
data['consecutive_failures'] = failures

# Increment per-task attempt counter
for t in data.get('next_tasks', []):
    if t.get('id') == task_id:
        t['attempts'] = t.get('attempts', 0) + 1
        t['last_error'] = error_msg
        break

if failures >= $CIRCUIT_BREAKER_LIMIT:
    data['paused'] = True
    print('CIRCUIT_BREAKER: pausing after {} consecutive failures'.format(failures))
else:
    print('FAILURE_RECORDED: {} consecutive (task {} attempt {})'.format(
        failures, task_id,
        next((t.get('attempts',0) for t in data.get('next_tasks',[]) if t.get('id')==task_id), '?')))

with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
"
}

cmd_stash_and_log() {
  _ensure_worktree
  local STASH_OUTPUT
  STASH_OUTPUT=$(git stash 2>&1)
  if echo "$STASH_OUTPUT" | grep -q "No local changes"; then
    echo "NOTHING_TO_STASH"
    return 0
  fi
  local STASH_REF
  STASH_REF=$(git stash list | head -1 | cut -d: -f1)

  _ensure_python
  python3 -c "
import json
with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)
data.setdefault('stash_archive', []).append('$STASH_REF')
with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('STASHED: $STASH_REF')
"
}

cmd_log_session() {
  # Usage: auto-build.sh log_session <outcome> <task_id> <message>
  local outcome="${1:-unknown}"
  local task_id="${2:-none}"
  local message="${3:-}"
  _log_to_file "$outcome" "$task_id" "$message"
  echo "LOGGED: $outcome/$task_id"
}

cmd_heartbeat() {
  # Usage: auto-build.sh heartbeat "what I'm doing"
  local context="${1:-alive}"
  local ts
  ts=$(timestamp)
  echo "{\"time\":\"$ts\",\"status\":\"running\",\"context\":\"$context\"}" > "$HEARTBEAT_FILE"
}

cmd_sync_state() {
  # Sync AUTOPILOT.json with reality: HEAD commit hash + latest bundle size
  _ensure_worktree
  _ensure_python
  _ensure_node

  local HEAD_HASH
  HEAD_HASH=$(git log -1 --format=%h 2>/dev/null || echo "unknown")

  # Get bundle size from dist/ if it exists
  local JS_RAW=0
  local JS_GZIP=0
  if [ -d "$WORKTREE/dist/assets" ]; then
    JS_RAW=$(find "$WORKTREE/dist/assets" -name '*.js' -not -name '*.js.map' -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print int($1/1024)}')
    JS_GZIP=$(find "$WORKTREE/dist/assets" -name '*.js' -not -name '*.js.map' -exec gzip -c {} + 2>/dev/null | wc -c | awk '{print int($1/1024)}')
  fi
  [ -z "$JS_RAW" ] && JS_RAW=0
  [ -z "$JS_GZIP" ] && JS_GZIP=0

  python3 -c "
import json
with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)
data['last_commit'] = '$HEAD_HASH'
if $JS_RAW > 0:
    data.setdefault('build_gate', {})['current_bundle'] = {'js_raw_kb': $JS_RAW, 'js_gzip_kb': $JS_GZIP}
with open('$AUTOPILOT', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('STATE_SYNCED: commit=$HEAD_HASH bundle=${JS_RAW}kB/${JS_GZIP}kB gzip')
"
}

cmd_status() {
  # Print current builder status — useful for monitoring
  echo "=== Auto-Builder Status ==="

  # Heartbeat
  if [ -f "$HEARTBEAT_FILE" ]; then
    echo "Heartbeat: $(cat "$HEARTBEAT_FILE")"
  else
    echo "Heartbeat: NO FILE (builder may never have run)"
  fi

  # AUTOPILOT state
  _ensure_worktree
  if [ -f "$AUTOPILOT" ]; then
    _ensure_python
    python3 -c "
import json
with open('$AUTOPILOT', 'r') as f:
    data = json.load(f)
print('Paused: {}'.format(data.get('paused', False)))
print('Locked: {}'.format(data.get('locked_by', 'no')))
print('Consecutive failures: {}'.format(data.get('consecutive_failures', 0)))
print('Tasks remaining: {}'.format(len(data.get('next_tasks', []))))
print('Tasks completed: {}'.format(len(data.get('completed', []))))
# Show broken tasks
for t in data.get('next_tasks', []):
    attempts = t.get('attempts', 0)
    if attempts > 0:
        print('  BROKEN: {} ({} attempts, last error: {})'.format(
            t['id'], attempts, t.get('last_error', '?')[:80]))
"
  fi

  # Recent logs
  if [ -f "$WORKTREE/$SESSION_LOG" ]; then
    echo ""
    echo "Last 5 log entries:"
    tail -5 "$WORKTREE/$SESSION_LOG"
  fi
}

# ─── Main dispatcher ─────────────────────────────────────────────────────────
case "${1:-help}" in
  preflight)      cmd_preflight ;;
  setup)          cmd_setup ;;
  lock)           cmd_lock ;;
  unlock)         cmd_unlock ;;
  next_task)      cmd_next_task ;;
  complete_task)  shift; cmd_complete_task "$@" ;;
  build_gate)     cmd_build_gate ;;
  commit_push)    shift; cmd_commit_push "$@" ;;
  record_success) cmd_record_success ;;
  record_failure) shift; cmd_record_failure "$@" ;;
  stash_and_log)  cmd_stash_and_log ;;
  log_session)    shift; cmd_log_session "$@" ;;
  heartbeat)      shift; cmd_heartbeat "$@" ;;
  sync_state)     cmd_sync_state ;;
  status)         cmd_status ;;
  help)
    echo "auto-build.sh v2.2 — The River's autonomous builder infrastructure"
    echo ""
    echo "Commands:"
    echo "  preflight              Validate worktree, node, npm, git, JSON"
    echo "  setup                  cd + PATH + git pull + ensure dirs"
    echo "  lock                   Acquire lock (exits non-zero if blocked)"
    echo "  unlock                 Release lock"
    echo "  next_task              Print next task JSON (quick wins first)"
    echo "  complete_task <id>     Move task to completed array"
    echo "  build_gate             npm run build + bundle size check"
    echo "  commit_push <msg> [f]  git add + commit + push"
    echo "  record_success         Reset consecutive_failures"
    echo "  record_failure <id> <msg>  Increment failures + per-task attempts"
    echo "  stash_and_log          Stash changes + record ref"
    echo "  log_session <o> <t> <m>  Append to sessions.jsonl"
    echo "  heartbeat <context>    Update heartbeat with what we're doing"
    echo "  sync_state             Sync AUTOPILOT.json with HEAD + bundle size"
    echo "  status                 Print current builder status"
    ;;
  *)
    die "Unknown command: $1. Run 'auto-build.sh help' for usage."
    ;;
esac
