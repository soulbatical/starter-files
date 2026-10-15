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
    // This hook only runs because .claude/settings.json already exists in
    // this directory, so "nothing here at all" can never be the case by the
    // time it fires — the one real branch left is "scaffolding present,
    // create-tetra not yet run" (the "scaffolding before create-tetra"
    // order). That order needs both create-tetra >=0.1.2 and the matching
    // @soulbatical/create-app it delegates to, which create-tetra installs
    // unpinned at install time — neither is published as of this writing
    // (review measured it against the real registry). Say so, and point at
    // the route that works today instead of a dead end.
    lines.push('De agent-scaffolding staat er al, maar create-tetra nog niet.');
    lines.push(
      'Dit vereist create-tetra >=0.1.2 én een bijgewerkte @soulbatical/create-app ' +
        '— controleer met `npx create-tetra --version`. Is dat nog niet beschikbaar: ' +
        'verplaats deze bestanden tijdelijk opzij, draai create-tetra in de lege map, ' +
        'zet ze terug en draai dan tetra/apply-project-scaffolding.sh.',
    );
  }

  process.stdout.write(lines.join('\n') + '\n');
} catch {
  // A status line is a courtesy, not a gate; a failure here must never stop
  // the session from starting.
}
