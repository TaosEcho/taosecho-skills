# Contributing

TaosEcho skills are plain Markdown skill folders plus small helper scripts. Keep changes easy to review, install, and verify.

## Local Verification

Run before opening a pull request:

```bash
bash -n scripts/install.sh
node scripts/verify-repo.js
node skills/taosecho-etl-skills/skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
python3 skills/harness-setup-skill/harness-setup/scripts/preflight.py "$PWD"
```

Smoke test installation in a temporary directory:

```bash
tmp="$(mktemp -d)"
CODEX_SKILLS_DIR="$tmp/codex-skills" ./scripts/install.sh codex
node "$tmp/codex-skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js"
```

## Skill Rules

- Every skill directory contains `SKILL.md` with `name`, `description`, and pack version.
- Host-specific tools are optional enhancements with a plain-text fallback.
- Raw product data enters `taosecho-etl-normalize`; analysis workers read `state.md`.
- `taosecho-etl-product` is the only workflow router.
- Each worker answers one bounded question and defines a checkable `## 完成条件`.
- Each worker writes `workflow.latest_result` and appends `analysis_history.completed_skills`.
- `workflow.next_action` is the canonical route field and contains one action only.
- Large outcomes are re-routed after each result; do not encode unconditional multi-skill queues.
- Shared workflow behavior belongs in `workflow-contract.md`, not duplicated across workers.
- Examples use placeholder product data and include expected output shape.
- Changes to routing behavior add or update `workflow-routing-scenarios.json`.
- Shared data contracts keep existing field names stable and add fields incrementally.

## Repository Rules

- Update README and manifests when package behavior or version changes.
- Update CHANGELOG for public-facing changes.
- Update ADRs when durable design decisions change.
- Update out-of-scope docs when package boundaries change.
- Add verification coverage for new skills, state fields, output formats, source types, or routing branches.
