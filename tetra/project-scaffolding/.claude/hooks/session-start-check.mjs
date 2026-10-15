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
  } else if (existsSync(at('AGENTS.md')) || existsSync(at('.claude'))) {
    // The scaffolding is already here but create-tetra has not run yet —
    // the "scaffolding before create-tetra" order, which only works on
    // create-tetra >=0.1.2 (its own directoryIsFree allowlist). On an
    // older version `npx create-tetra .` refuses with "map is niet leeg".
    lines.push('De agent-scaffolding staat er al, maar create-tetra nog niet.');
    lines.push(
      'Controleer eerst `npx create-tetra --version`: dit werkt alleen op 0.1.2+. ' +
        'Op een oudere versie weigert `npx create-tetra .` deze map als "niet leeg".',
    );
  } else {
    lines.push('Dit project is nog niet geïnstalleerd. Draai eerst: npx create-tetra .');
    lines.push('Zie AGENTS.md §1 voor het goedkeuringsproces — het gedrag bij een verlopen code hangt van de create-tetra-versie af.');
  }

  process.stdout.write(lines.join('\n') + '\n');
} catch {
  // A status line is a courtesy, not a gate; a failure here must never stop
  // the session from starting.
}
