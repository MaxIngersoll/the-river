#!/usr/bin/env bash
# install-skills.sh — Copy SKILL.md templates to scheduled-tasks directories
# Run this once after pulling the auto-build v2 changes:
#   bash scripts/install-skills.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TASKS_DIR="$HOME/.claude/scheduled-tasks"

echo "Installing SKILL.md files..."

cp "$SCRIPT_DIR/SKILL-continuer.md" "$TASKS_DIR/continuer/SKILL.md" && \
  echo "  OK: continuer/SKILL.md installed" || \
  echo "  FAIL: could not write continuer/SKILL.md"

cp "$SCRIPT_DIR/SKILL-dry-run-test.md" "$TASKS_DIR/dry-run-test/SKILL.md" && \
  echo "  OK: dry-run-test/SKILL.md installed" || \
  echo "  FAIL: could not write dry-run-test/SKILL.md"

echo "Done. Verify with:"
echo "  wc -l $TASKS_DIR/continuer/SKILL.md"
echo "  wc -l $TASKS_DIR/dry-run-test/SKILL.md"
