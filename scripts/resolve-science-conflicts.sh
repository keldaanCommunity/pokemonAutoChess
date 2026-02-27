#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCI_DIR="app/models/precomputed/scientific-method"

cd "$ROOT_DIR"

CONFLICTS=$(git diff --name-only --diff-filter=U || true)
if [[ -z "${CONFLICTS}" ]]; then
  echo "No unresolved conflicts in working tree."
  exit 0
fi

SCI_CONFLICTS=$(printf "%s\n" "$CONFLICTS" | awk 'NF' | grep "^${SCI_DIR}/" || true)
if [[ -z "$SCI_CONFLICTS" ]]; then
  echo "No unresolved conflicts found under ${SCI_DIR}."
  exit 0
fi

echo "Prioritizing incoming changes (--theirs) for scientific-method conflicts..."
printf '%s\n' "$SCI_CONFLICTS"

# Resolve generated scientific artifacts in favor of incoming branch.
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  git checkout --theirs -- "$f"
  git add "$f"
  echo "Resolved with --theirs: $f"
done <<< "$SCI_CONFLICTS"

# If source files are conflicted, also prioritize incoming to reduce manual work.
for src in \
  gen/extract-scientific-dataset.js \
  gen/science/validate-science-data.js \
  docs/scientific-method-data.md \
  package.json
  do
  if printf "%s\n" "$CONFLICTS" | grep -qx "$src"; then
    git checkout --theirs -- "$src"
    git add "$src"
    echo "Resolved with --theirs: $src"
  fi
done

# Optional deterministic regeneration to ensure consistency after incoming resolution.
npm run extract-science-data
npm run validate-science-data

# Stage regenerated artifacts.
git add "$SCI_DIR"

echo "Scientific conflict resolution complete (incoming changes prioritized and staged)."
