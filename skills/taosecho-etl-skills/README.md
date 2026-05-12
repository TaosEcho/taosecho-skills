# TaosEcho ETL Skills

TaosEcho ETL is a host-neutral product-analysis skill pack.

## Contents

- `skills/taosecho-etl-product`: entrypoint
- `skills/taosecho-etl-normalize`: data normalization
- `skills/taosecho-etl-*`: analysis skills
- `skills/taosecho-etl-report`: report generation
- `skills/taosecho-etl-shared`: shared contract, rules, examples, and verifier

## Version

Current pack version: `2.2.0`

All `SKILL.md` files in this pack use the same pack-level version.

## Install

Codex:

```bash
rsync -a skills/taosecho-etl-* ~/.codex/skills/
```

Claude Code:

```bash
rsync -a skills/taosecho-etl-* ~/.claude/skills/
```

## Verify

Codex:

```bash
node ~/.codex/skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
```

Local package:

```bash
node skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
```

Expected result:

```text
taosecho etl skill verification passed: 450/450
```

## Design

- Normalize first: all source data enters `taosecho-etl-normalize`.
- Analysis reads `state.md`.
- Report generation reads `state.md` and `analysis_history`.
- Markdown is the guaranteed report output.
- Optional PDF / DOCX / HTML conversion depends on host capabilities.

## Compliance

Examples use placeholder product data:

- Product ID: `SAMPLE_ASIN_A001`
- Product name: `Sample Product A`

The verifier guards against real product identifiers, real brand names, sensitive example terms, stale source types, and pack version drift.
