#!/usr/bin/env node
// SessionStart hook: a one-glance status line so an AI assistant does not
// waste a round trip discovering what Tetra itself can report instantly.
// Stdout here becomes context for the session; keep it short.
//
// Resolved against $CLAUDE_PROJECT_DIR rather than the bare cwd: review
// measured that a hook invoked while the shell's cwd is a subdirectory of
// the project (e.g. the user cd'd into backend/) would otherwise check the
// wrong package.json and report a false "not installed yet".
//
// Delegates the actual diagnosis to `tetra doctor --json` once a project
// exists, instead of re-implementing Node/license/registry/project checks
// here — this hook and a human running `npx tetra doctor` by hand always
// see the same answer, and a future doctor check needs no second copy here.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const DOCTOR_TIMEOUT_MS = 8000;

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
    lines.push(...runDoctor(root));
  } else {
    // This hook only runs because .claude/settings.json already exists in
    // this directory, so "nothing here at all" can never be the case by the
    // time it fires — the one real branch left is "scaffolding present,
    // create-tetra not yet run" (the "scaffolding before create-tetra"
    // order).
    lines.push('De agent-scaffolding staat er al, maar create-tetra nog niet.');
    lines.push(
      'Draai `npx create-tetra .` in deze map (of `npx create-tetra <naam>` in ' +
        'een lege map) om het project aan te maken; daarna werkt `npx tetra doctor`.',
    );
  }

  process.stdout.write(lines.join('\n') + '\n');
} catch {
  // A status line is a courtesy, not a gate; a failure here must never stop
  // the session from starting.
}

function runDoctor(root) {
  try {
    const result = spawnSync('npx', ['--no-install', 'tetra', 'doctor', '--json'], {
      cwd: root,
      encoding: 'utf8',
      timeout: DOCTOR_TIMEOUT_MS,
    });
    if (result.error || typeof result.stdout !== 'string' || result.stdout.trim() === '') {
      return [
        '`npx tetra doctor` niet beschikbaar (nog geen `npm install` gedraaid?) — ' +
          'draai `npm install --include=optional` en probeer het opnieuw.',
      ];
    }
    const report = JSON.parse(result.stdout);
    const failing = (report.checks ?? []).filter((check) => check.status === 'fail');
    if (failing.length === 0) {
      return ['tetra doctor: alle checks groen.'];
    }
    const firstIssue = report.issues?.[0];
    const nextStep = firstIssue?.recovery?.manual ?? firstIssue?.fix ?? 'npx tetra doctor voor details.';
    return [
      `tetra doctor: ${failing.length} check(s) falen (${failing.map((c) => c.id).join(', ')}).`,
      `Volgende stap: ${nextStep}`,
    ];
  } catch {
    return ['`npx tetra doctor` kon niet worden uitgevoerd of gaf geen geldige JSON terug.'];
  }
}
