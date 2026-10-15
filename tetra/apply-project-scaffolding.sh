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
# Usage: apply-project-scaffolding.sh <target-dir>
set -euo pipefail

target="${1:?usage: apply-project-scaffolding.sh <target-dir>}"
src="$(cd "$(dirname "${BASH_SOURCE[0]}")/project-scaffolding" && pwd)"

mkdir -p "$target"

if [ -d "$src/.claude" ]; then
  mkdir -p "$target/.claude"
  cp -Rn "$src/.claude/." "$target/.claude/"
fi

for doc in AGENTS.md CLAUDE.md; do
  if [ -f "$target/$doc" ]; then
    printf '\n\n---\n\n' >> "$target/$doc"
    cat "$src/$doc" >> "$target/$doc"
  else
    cp "$src/$doc" "$target/$doc"
  fi
done

echo "project-scaffolding toegepast op $target"
