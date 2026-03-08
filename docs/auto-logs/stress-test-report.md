# Auto-Build Stress Test Report

**Date:** 2026-03-08
**Branch:** claude/musing-nightingale
**Panel:** Charity Majors, Kelsey Hightower, Julia Evans, Jessie Frazelle, Will Larson

---

## Executive Summary

The auto-build system (v2) has solid fundamentals: circuit breaker, structured JSONL logging, per-task attempt tracking, and one-task-per-invocation discipline. However, we found **1 critical issue** (skills not installed), **3 high-severity bugs** (race conditions, shell injection, cleanup trap conflict), and **5 medium issues** (missing observability, edge cases).

## CRITICAL: Installed SKILL.md Files Are Stale (v1, Not v2)

**Found by:** Kelsey Hightower

The installed SKILL.md files in `~/.claude/scheduled-tasks/` are the OLD v1 versions that:
- Directly manipulate AUTOPILOT.json (bypassing auto-build.sh locking)
- Run raw git commands (bypassing commit_push with retry)
- Pick MULTIPLE tasks per invocation (violating one-task-per-invocation)
- Do NOT use the circuit breaker, preflight checks, or structured logging
- Do NOT respect the per-task attempt counter

**Evidence:** The installed `continuer/SKILL.md` says "Pick the FIRST task from next_tasks" and "repeat steps 8-12" (multi-task loop). The v2 template in `scripts/SKILL-continuer.md` says "ONE task per invocation. After completing or failing one task, STOP."

**Impact:** Every scheduled invocation runs the v1 protocol, making auto-build.sh effectively dead code. The locking, circuit breaker, and logging infrastructure is never used.

**Fix:** Run `bash scripts/install-skills.sh` to overwrite with v2 templates. See "Fixes Applied" section below.

---

## High Severity Issues

### H1: TOCTOU Race in Lock Acquisition (Charity Majors)

**File:** `scripts/auto-build.sh`, `cmd_lock()` (lines 217-271)

The lock check and lock acquire are not atomic. Two concurrent invocations can both read `locked_by: null`, both decide to acquire, and both write their timestamp. The last writer wins silently.

**Scenario:**
1. Invocation A reads AUTOPILOT.json, sees `locked_by: null`
2. Invocation B reads AUTOPILOT.json, sees `locked_by: null` (A hasn't written yet)
3. A writes lock timestamp
4. B overwrites with its own lock timestamp
5. Both proceed, operating on the same files concurrently

**Mitigation:** Use a filesystem lockfile (`flock` on Linux, or a mkdir-based atomic lock) as the primary lock, with AUTOPILOT.json lock as secondary documentation. Or use `mkdir /tmp/river-auto-build.lock` which is atomic on all POSIX systems.

### H2: Shell Injection in record_failure (Jessie Frazelle)

**File:** `scripts/auto-build.sh`, `cmd_record_failure()` (lines 482-523)

The error message is interpolated directly into Python code via bash string:
```python
t['last_error'] = '''$error_msg'''[:200]
```

If `$error_msg` contains `'''` (triple quotes), it breaks out of the Python string literal. A task that produces error output like `File '''config''' not found` would cause a Python syntax error, silently failing to record the failure. Worse, carefully crafted error messages could execute arbitrary Python.

**Fix:** Pass the error message via environment variable or stdin instead of shell interpolation.

### H3: Cleanup Trap Clears Lock Unconditionally (Julia Evans)

**File:** `scripts/auto-build.sh`, `cleanup()` (lines 89-116)

The EXIT trap always clears `locked_by` to null, even for subcommands that should NOT touch the lock (like `status`, `preflight`, `next_task`). If you run `bash auto-build.sh status` while the builder is actively working, it clears the builder's lock as a side effect.

**Scenario:**
1. Continuer acquires lock, starts working on a task
2. Someone runs `bash auto-build.sh status` to check progress
3. Status command exits, cleanup trap fires, clears lock in AUTOPILOT.json
4. A second invocation now also acquires the lock
5. Two builders working simultaneously, potential merge conflicts

**Fix:** Only set the cleanup trap after `cmd_lock()` succeeds, or track whether this invocation holds the lock.

---

## Medium Severity Issues

### M1: No Heartbeat File Created (Charity Majors)

The heartbeat file path is `/Users/Max/Claude/Guitar Tracking App/.claude/auto-heartbeat` but this file does not exist. The `status` command reports "NO FILE (builder may never have run)" which means either:
- The builder has genuinely never run (likely, given the stale SKILL.md issue above)
- Or the heartbeat directory doesn't exist

This is the single most important observability signal and it's missing.

### M2: sessions.jsonl Does Not Exist

The structured log file `docs/auto-logs/sessions.jsonl` does not exist. Combined with M1, there is zero observability into what the auto-builder has been doing. The `_ensure_log_dir` creates the directory but the file is only written on actual log events, which never happen because the v2 SKILL.md is not installed.

### M3: Bundle Size Parsing Is Fragile (Julia Evans)

**File:** `scripts/auto-build.sh`, `cmd_build_gate()` (lines 400-420)

The regex `grep -E '\.js\s'` assumes Vite output format. If Vite changes its output format (which it does between major versions), the bundle size check silently passes because `JS_SIZE` is empty and the `-gt` comparison is never reached. This is a "green when broken" failure mode.

**Fix:** Add a check: if JS_SIZE is empty after parsing, emit a warning. Or parse the `dist/` directory directly with `du` or `wc -c`.

### M4: commit_push Falls Back to `git add -A` (Kelsey Hightower)

**File:** `scripts/auto-build.sh`, `cmd_commit_push()` (lines 427-465)

When no specific files are passed, it runs `git add -A` which adds EVERYTHING. This could accidentally commit:
- `.env` files, credentials
- The `.claude/` directory
- `node_modules/` (if .gitignore is wrong)
- Temporary debug files

The SKILL.md templates don't specify which files to pass to commit_push, so the LLM will likely call it with just a message, triggering `git add -A`.

### M5: Task ID Injection in complete_task (Jessie Frazelle)

**File:** `scripts/auto-build.sh`, `cmd_complete_task()` (lines 325-379)

Similar to H2: `task_id = '$task_id'` is interpolated into Python. A task ID containing single quotes would break the Python code. Task IDs are currently safe (kebab-case), but there's no validation.

---

## Low Severity / Observations

### L1: Stash Archive Grows Unbounded
The `stash_archive` array in AUTOPILOT.json has no size limit, unlike `session_log` which is capped at 20. After many failures, it could grow large.

### L2: Lock Timeout Is Wall-Clock Only
The 45-minute lock timeout doesn't account for system sleep. If Max closes the laptop for 2 hours, the lock is stale but the builder that acquired it may still be running when the laptop wakes.

### L3: No Idempotency Check in complete_task
If `complete_task` is called twice for the same task ID, the second call fails with `TASK_NOT_FOUND` because it was already moved. This is correct behavior but the error message could be clearer ("already completed" vs "not found").

### L4: The v1 SKILL.md Says "Read CLAUDE.md"
The installed (stale) SKILL.md tells the LLM to read CLAUDE.md, which then triggers reading VISION.md, HANDOFF.md, Bridge Notes, etc. This wastes significant context window on every invocation. The v2 templates correctly say "Do NOT spend time reading CLAUDE.md."

---

## SKILL.md Version Comparison

| Feature | Installed (v1) | Template (v2) |
|---|---|---|
| Uses auto-build.sh | No | Yes |
| Lock mechanism | Direct JSON edit | `bash $SCRIPTS lock` |
| Circuit breaker | No | Yes (3 failures) |
| Per-task attempts | No | Yes (2 max) |
| Tasks per invocation | Multiple (loop) | ONE then stop |
| Structured logging | No | JSONL per event |
| Build gate | Manual npm + parse | `bash $SCRIPTS build_gate` |
| Stash on failure | Manual | `bash $SCRIPTS stash_and_log` |
| Preflight checks | No | Yes (node, python3, JSON, npm) |
| Protected files | No | Yes (TimerFAB, QuickLog, storage.js) |
| Reads CLAUDE.md | Yes (wastes tokens) | No (task-only context) |

---

## Fixes Applied In This Session

### Fix 1: Shell Injection in record_failure
Pass error_msg via environment variable instead of shell interpolation.

### Fix 2: Cleanup Trap Lock-Clear Scoping
Track whether this invocation actually acquired the lock. Only clear on cleanup if we hold it.

### Fix 3: Bundle Size Parse Warning
Emit BUNDLE_SIZE_UNKNOWN warning when Vite output parsing returns empty.

### Fix 4: Validate task_id Format
Reject task IDs that contain quotes or special characters.

---

## Recommendations (Not Implemented)

1. **Run install-skills.sh** immediately to deploy v2 SKILL.md to scheduled tasks
2. **Add filesystem-level locking** (mkdir-based) to prevent TOCTOU race
3. **Add a `--no-cleanup-trap` flag** for read-only commands (status, next_task, preflight)
4. **Cap stash_archive** at 10 entries, oldest-first eviction
5. **Add direct bundle size measurement** from dist/ as fallback for Vite output parsing
6. **Add .gitignore audit** to preflight to ensure .env, .claude/, node_modules/ are ignored

---

## Panel Signatures

- **Charity Majors:** "You can't debug what you can't observe. The heartbeat + JSONL are great ideas but they're inert because the installed skills bypass them entirely. Fix the skill install and you instantly light up the whole observability layer."

- **Kelsey Hightower:** "The simplest thing that could work: install the v2 skills. Everything else is refinement. The system design is sound — one task, circuit breaker, fail fast. It just isn't wired up."

- **Julia Evans:** "The cleanup trap bug is my favorite because it's so sneaky. You run a harmless status check and accidentally unlock the door for a second builder. Classic 'helpful side effect that isn't.'"

- **Jessie Frazelle:** "Shell injection in a build system is how you get supply chain attacks. Even though the inputs are controlled today, the error_msg one is a real risk because error messages come from npm/Vite output which could contain anything."

- **Will Larson:** "From a systems perspective, the v1-to-v2 migration is incomplete. The architecture is upgraded but the deployment isn't. This is the most common failure mode in platform engineering: shipping the new system without decommissioning the old one."
