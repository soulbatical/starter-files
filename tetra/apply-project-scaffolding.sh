#!/bin/bash
# Applies tetra/project-scaffolding/ onto an existing project directory —
# meant to run AFTER `npx create-tetra`, into the directory it just created.
#
# .claude/ never collides with anything create-tetra generates, so a plain
# no-clobber copy is enough there. AGENTS.md and CLAUDE.md do collide:
# create-tetra's scaffolder ships its own (real project content: exact
# command list, {{NAME}} substituted, Tetra rules), and this bundle's
# install/manifest-ritual sections are what the .claude/ hooks and skills
# cite by number. Neither "skip" nor "overwrite" keeps both, so this appends
# — create-tetra's own content stays first, this bundle's follows under a
# separator, and the section numbers resolve regardless of which step ran
# first (this script, or create-tetra).
#
# Safe to run twice: a marker comment in the appended block makes a second
# run a no-op on AGENTS.md/CLAUDE.md instead of duplicating the append.
#
# Usage: apply-project-scaffolding.sh <target-dir>
set -euo pipefail

target="${1:?usage: apply-project-scaffolding.sh <target-dir>}"
src="$(cd "$(dirname "${BASH_SOURCE[0]}")/project-scaffolding" && pwd)"

marker='<!-- tetra-project-scaffolding:applied -->'

mkdir -p "$target"

if [ -d "$src/.claude" ]; then
  mkdir -p "$target/.claude"
  cp -Rn "$src/.claude/." "$target/.claude/"
fi

for doc in AGENTS.md CLAUDE.md; do
  if [ -f "$target/$doc" ] && grep -qF "$marker" "$target/$doc" 2>/dev/null; then
    echo "$doc heeft de scaffolding al — overgeslagen (idempotent)."
  elif [ -f "$target/$doc" ]; then
    printf '\n\n---\n\n%s\n\n' "$marker" >> "$target/$doc"
    cat "$src/$doc" >> "$target/$doc"
  else
    printf '%s\n\n' "$marker" > "$target/$doc"
    cat "$src/$doc" >> "$target/$doc"
  fi
done

echo "project-scaffolding toegepast op $target"
