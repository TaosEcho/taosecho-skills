# Harness Setup Readiness

Use before writing a harness state file or entrypoint update.

## Required Setup Fields

- Task name and slug.
- Harness depth.
- Desired outcome.
- Scope.
- Evidence sources.
- Verification method.
- State file path.
- Activation decision.
- Recovery rule.
- Handoff rule.

## Hard Stops

- Replacing an existing state file.
- Editing `AGENTS.md`, `CLAUDE.md`, or another entrypoint.
- Marking a verification gate passed.
- Superseding an existing harness.
