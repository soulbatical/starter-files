#!/usr/bin/env node
// SessionStart hook: a one-glance status line so an AI assistant does not
// waste a round trip discovering what Tetra itself can report instantly.
// Stdout here becomes context for the session; keep it short.
import { existsSync } from 'node:fs';

const lines = [];

const major = Number(process.versions.node.split('.')[0]);
lines.push(
  major === 24
    ? 'Node 24 — ok.'
    : `Node ${process.versions.node} — Tetra vereist Node 24. Gebruik fnm/nvm om te wisselen.`,
);

if (existsSync('package.json') && existsSync('.tetra')) {
  lines.push('Dit project is al door create-tetra ingericht.');
  lines.push(existsSync('.env') ? '.env is aanwezig.' : 'Let op: .env ontbreekt — npm run dev:local zal falen zonder licentiesleutel.');
} else {
  lines.push('Dit project is nog niet geïnstalleerd. Draai eerst: npx create-tetra .');
  lines.push('Zie AGENTS.md §1 voor het goedkeuringsproces — wacht erop, herstart niet.');
}

process.stdout.write(lines.join('\n') + '\n');
