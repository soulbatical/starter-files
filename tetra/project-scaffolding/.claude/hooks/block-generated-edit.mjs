#!/usr/bin/env node
// PreToolUse hook: refuses an Edit/Write/MultiEdit targeting .tetra/generated/.
// That tree is overwritten on the next `tetra manifest compile`, so a hand
// edit there is lost silently — the manifest is the only place a change
// survives. Exit 2 blocks the tool call; Claude Code shows stderr to the
// model so it can fix the manifest instead.
let input = '';
for await (const chunk of process.stdin) input += chunk;

let payload;
try {
  payload = JSON.parse(input);
} catch {
  // Malformed input is not this hook's problem to solve; let the tool run.
  process.exit(0);
}

const paths = JSON.stringify(payload.tool_input ?? {});
if (/\.tetra[\\/]generated[\\/]/.test(paths)) {
  process.stderr.write(
    [
      'Geblokkeerd: .tetra/generated/ wordt overschreven bij de volgende',
      '`npx tetra manifest compile`. Wijzig het manifest in manifests/ en',
      'compileer opnieuw — zie AGENTS.md §3.',
    ].join('\n'),
  );
  process.exit(2);
}

process.exit(0);
