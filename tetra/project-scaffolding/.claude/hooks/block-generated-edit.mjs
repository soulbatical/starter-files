#!/usr/bin/env node
// PreToolUse hook: refuses an Edit/Write/MultiEdit targeting .tetra/generated/.
// That tree is overwritten on the next `tetra manifest compile`, so a hand
// edit there is lost silently — the manifest is the only place a change
// survives. Exit 2 blocks the tool call; Claude Code shows stderr to the
// model so it can fix the manifest instead.
//
// Only `tool_input.file_path` is checked, never the whole tool_input: Edit,
// Write and MultiEdit all carry the target as that one field, and an earlier
// version of this hook stringified the entire tool_input instead — which
// also matches the *content* being written, not just where it is written.
// Review measured that blocking a plain edit to this scaffolding's own
// AGENTS.md, a .gitignore line, or a source comment that merely mentions
// the path.
//
// Anything unexpected (malformed JSON, a missing field, a thrown error) exits
// 0 rather than letting an exception escape with whatever exit code Node
// happens to pick — a code other than 0 or 2 is not a defined outcome for
// this hook, so it has to be avoided on purpose, not left to chance.
try {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;

  const payload = JSON.parse(input);
  const filePath = payload?.tool_input?.file_path;

  if (typeof filePath === 'string' && /\.tetra[\\/]generated[\\/]/.test(filePath)) {
    process.stderr.write(
      [
        'Geblokkeerd: .tetra/generated/ wordt overschreven bij de volgende',
        '`npx tetra manifest compile`. Wijzig het manifest in manifests/ en',
        'compileer opnieuw — zie AGENTS.md §3.',
      ].join('\n'),
    );
    process.exit(2);
  }
} catch {
  // Falls through to the exit(0) below.
}

process.exit(0);
