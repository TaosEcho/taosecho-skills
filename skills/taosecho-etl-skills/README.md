# TaosEcho ETL Skills

TaosEcho ETL is a host-neutral product-analysis skill pack.

## Contents

- `skills/taosecho-etl-product`: single entry and dynamic router
- `skills/taosecho-etl-normalize`: raw-data normalization
- `skills/taosecho-etl-*`: bounded analysis workers
- `skills/taosecho-etl-dev-decision`: evidence-gated stage decision
- `skills/taosecho-etl-report`: report generation
- `skills/taosecho-etl-shared`: contracts, routing, examples, and verifier

## Version

Current pack version: `2.3.0`

All public SKILL.md files in this pack use the same pack-level version.

## Install

Codex:

```bash
mkdir -p ~/.codex/skills
cp -R skills/taosecho-etl-* ~/.codex/skills/
```

Claude Code:

```bash
mkdir -p ~/.claude/skills
cp -R skills/taosecho-etl-* ~/.claude/skills/
```

## Verify

Codex install:

```bash
node ~/.codex/skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
```

Local package:

```bash
node skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
```

A successful run prints `taosecho etl skill verification passed` and exits with status 0.

## Design

- Normalize first: all raw user data enters `taosecho-etl-normalize`.
- One current step: `taosecho-etl-product` selects one action, reads its result, and routes again.
- Bounded workers: each analysis skill answers one question and has a checkable completion condition.
- Routable results: workers write `workflow.latest_result` with findings, signals, unresolved items, evidence references, and completion state.
- Canonical route: `workflow.next_action` is the single source of truth; v2.2 `recommended_next` fields are read-only compatibility inputs.
- Evidence gate: clue-level and spoken-only data cannot produce a positive stage decision.
- Markdown is the guaranteed report output; PDF / DOCX / HTML conversion remains optional.

## Compatibility

Existing v2.2 state.md files remain readable. The first legacy route is treated as a candidate and is re-evaluated against the latest user goal and evidence. Remaining legacy queue items are not obligations.

## Compliance

Examples use placeholder product data:

- Product ID: `SAMPLE_ASIN_A001`
- Product name: `Sample Product A`

The verifier guards contract and version drift, routing scenarios, source boundaries, placeholder usage, sensitive examples, worker completion criteria, and report structure.
