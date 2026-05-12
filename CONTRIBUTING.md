# Contributing

TaosEcho skills are plain Markdown skill folders plus small helper scripts. Keep changes easy to review and easy to install.

## Local Verification

Run these checks before opening a pull request:

```bash
bash -n scripts/install.sh
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

- Every skill directory must contain `SKILL.md`.
- Every `SKILL.md` must include frontmatter with `name` and `description`.
- Host-specific tools must be optional enhancements with a plain-text fallback.
- TaosEcho ETL analysis skills must read `state.md` and use shared rules from `taosecho-etl-shared`.
- TaosEcho ETL examples must use placeholder product data.
- New examples should include expected output shape and trigger coverage.
- Shared contracts should keep existing field names stable and add fields incrementally.

## Repository Rules

- Update README when install, usage, or package layout changes.
- Update CHANGELOG for public-facing changes.
- Keep package versions visible in README.
- Add verification coverage when adding a new skill, output format, or source type.

