# Public Release Readiness

Use before publishing or tagging a public skill release.

## Required Checks

- Root `README.md` describes packages, install commands, and verification commands.
- Root `manifest.json` lists every public package and entry skill.
- Every public package has a package `manifest.json`.
- `CHANGELOG.md` records the public-facing change.
- `CONTRIBUTING.md` lists current local verification commands.
- CI passes on install syntax, package verification, and smoke installs.
- Public examples use placeholder data.
- Skill descriptions explain trigger conditions clearly.
- Host-specific tools have plain-text fallback language.

## Release Evidence

Record these before publishing:

```text
verify-repo:
etl verify:
harness preflight:
install smoke:
tag or commit:
```
