#!/usr/bin/env node
// SessionStart hook: a one-glance status line so an AI assistant does not
// waste a round trip discovering what Tetra itself can report instantly.
// Stdout here becomes context for the session; keep it short.
//
// Resolved against $CLAUDE_PROJECT_DIR rather than the bare cwd: review
// measured that a hook invoked while the shell's cwd is a subdirectory of
// the project (e.g. the user cd'd into backend/) would otherwise check the
// wrong package.json and report a false "not installed yet".
import { existsSync } from 'node:fs';
import { join } from 'node:path';

try {
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const at = (...segments) => join(root, ...segments);
  const lines = [];

  const major = Number(process.versions.node.split('.')[0]);
  lines.push(
    major === 24
      ? 'Node 24 — ok.'
      : `Node ${process.versions.node} — Tetra vereist Node 24. Gebruik fnm/nvm om te wisselen.`,
  );

  if (existsSync(at('package.json')) && existsSync(at('.tetra'))) {
    lines.push('Dit project is al door create-tetra ingericht.');
    lines.push(
      existsSync(at('.env'))
        ? '.env is aanwezig.'
        : 'Let op: .env ontbreekt — npm run dev:local zal falen zonder licentiesleutel.',
    );
  } else {
    lines.push('Dit project is nog niet geïnstalleerd. Draai eerst: npx create-tetra .');
    lines.push('Zie AGENTS.md §1 voor het goedkeuringsproces — wacht erop, herstart niet.');
  }

  process.stdout.write(lines.join('\n') + '\n');
} catch {
  // A status line is a courtesy, not a gate; a failure here must never stop
  // the session from starting.
}
