# Coding Harness

Reference version: 0.5.2

Use for features, bugs, refactors, app workflows, tests, and repo maintenance.

## Intake

Ask or infer:

- Feature or bug objective
- Affected repo and modules
- User-facing behavior
- Existing tests and dev server commands
- Required browser or API verification
- Risky files or user-owned changes

## Default Track

| Phase | Action | Exit gate |
|---|---|---|
| Preflight | `pwd`, `git status --short`, identify package manager, find relevant files | Scope and dirty files known |
| Context | Read entry docs, nearby code, tests, route/component/API contracts | Implementation surface known |
| Plan | Define smallest change set and verification commands | User-facing behavior mapped |
| Implement | Edit scoped files, preserve existing changes | Diff matches plan |
| Verify | Run targeted tests, typecheck/lint where relevant, browser check for UI | Evidence captured |
| Handoff | Record changed files, commands, risks, next action | Resume is clear |

## State Files

Use existing repo docs when present. Otherwise create one of:

- `docs/harness/{task-slug}.md`
- `.codex/harness/{task-slug}.md`
- project-specific work log

## Verification Gates

Prefer targeted checks:

- Unit/integration test for behavior
- Typecheck for shared contracts
- Browser screenshot and interaction for UI
- API request for backend behavior
- `git diff --check` scoped to touched files when broad checks surface unrelated noise

## Recovery

For long work, add checkpoints after each phase:

```markdown
## Checkpoint {n}
- Done:
- Files changed:
- Decisions:
- Verification:
- Remaining:
- Resume from:
```

Use context reset when the task spans multiple phases: write the checkpoint, then resume from the state file and current git diff.
