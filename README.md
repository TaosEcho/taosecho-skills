# TaosEcho Skills

[![Verify](https://github.com/TaosEcho/taosecho-skills/actions/workflows/verify.yml/badge.svg)](https://github.com/TaosEcho/taosecho-skills/actions/workflows/verify.yml)

Canonical public monorepo for TaosEcho skill packs.

## Quickstart

Codex:

```bash
git clone --depth 1 https://github.com/TaosEcho/taosecho-skills.git
cd taosecho-skills
./scripts/install.sh codex
```

Claude Code:

```bash
git clone --depth 1 https://github.com/TaosEcho/taosecho-skills.git
cd taosecho-skills
./scripts/install.sh claude
```

Install one pack:

```bash
./scripts/install.sh codex --pack etl
./scripts/install.sh codex --pack harness
```

Preview install actions:

```bash
./scripts/install.sh codex --dry-run
./scripts/install.sh --list
```

## Packages

| Package | Version | Path | Purpose |
|---|---:|---|---|
| TaosEcho ETL Skills | `2.3.0` | `skills/taosecho-etl-skills` | Normalize-first product analysis with dynamic single-step routing, evidence-bounded workers, `state.md`, and report generation. |
| Harness Setup Skill | `0.5.3` | `skills/harness-setup-skill` | Durable task harness setup for long-running, high-risk, or multi-agent work. |

Package metadata lives in `manifest.json` at the repository root and in each package directory.

## Manual Install

Install TaosEcho ETL skills into Codex:

```bash
mkdir -p ~/.codex/skills
cp -R skills/taosecho-etl-skills/skills/taosecho-etl-* ~/.codex/skills/
```

Install TaosEcho ETL skills into Claude Code:

```bash
mkdir -p ~/.claude/skills
cp -R skills/taosecho-etl-skills/skills/taosecho-etl-* ~/.claude/skills/
```

Install Harness Setup into Codex:

```bash
mkdir -p ~/.codex/skills
cp -R skills/harness-setup-skill/harness-setup ~/.codex/skills/harness-setup
```

Install Harness Setup into Claude Code:

```bash
mkdir -p ~/.claude/skills
cp -R skills/harness-setup-skill/harness-setup ~/.claude/skills/harness-setup
```

## Verify

```bash
node scripts/verify-repo.js
node skills/taosecho-etl-skills/skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
```

Successful runs print `repo verification passed` and `taosecho etl skill verification passed` and exit with status 0.

Run Harness Setup preflight against a project:

```bash
python3 skills/harness-setup-skill/harness-setup/scripts/preflight.py /path/to/project
```

## TaosEcho ETL Usage

Start with `taosecho-etl-product`.

1. Raw data enters `taosecho-etl-normalize` and becomes unified-data in `state.md`.
2. The entry router selects one current analysis or delivery action.
3. The worker writes findings, signals, unresolved items, evidence references, and a checkable completion result.
4. The entry router reads that result and decides again.
5. `taosecho-etl-dev-decision` enforces the evidence gate; `taosecho-etl-report` assembles completed work.

Large goals such as “完整分析” and “判断是否值得做” are stored as outcomes. They are not converted into unconditional multi-skill queues.

## Repository Layout

```text
manifest.json
docs/
  adr/
checklists/
skills/
  taosecho-etl-skills/
    manifest.json
    checklists/
    skills/
      taosecho-etl-product/
      taosecho-etl-normalize/
      taosecho-etl-*/
      taosecho-etl-shared/
        references/workflow-contract.md
        examples/workflow-routing-scenarios.json
  harness-setup-skill/
    manifest.json
    checklists/
    harness-setup/
```

Each package keeps its own README, version, examples, and verification flow.
