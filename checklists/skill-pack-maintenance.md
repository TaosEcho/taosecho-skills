# Skill Pack Maintenance

Use when modifying a public skill pack.

## Before Editing

- Identify the package and entry skill.
- Check whether the change affects install layout, examples, output format, or shared contract.
- Read the nearest package README and manifest.

## Required Updates

- Update examples when output shape changes.
- Update verifier coverage when adding fields, skills, templates, or source types.
- Update README when install or usage changes.
- Update CHANGELOG for public behavior changes.
- Update ADR when a durable design decision changes.

## Verification

Run:

```bash
bash -n scripts/install.sh
node scripts/verify-repo.js
node skills/taosecho-etl-skills/skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
python3 skills/harness-setup-skill/harness-setup/scripts/preflight.py "$PWD"
```
