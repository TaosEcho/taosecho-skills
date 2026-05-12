# TaosEcho Skills

Public monorepo for TaosEcho skill packs.

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

## Packages

| Package | Version | Path | Purpose |
|---|---:|---|---|
| TaosEcho ETL Skills | `2.2.0` | `skills/taosecho-etl-skills` | Host-neutral product analysis through normalize-first ETL, `state.md`, analysis skills, and report generation. |
| Harness Setup Skill | `0.5.2` | `skills/harness-setup-skill` | Durable task harness setup for long-running, high-risk, or multi-agent work. |

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

Verify TaosEcho ETL skills:

```bash
node skills/taosecho-etl-skills/skills/taosecho-etl-shared/scripts/verify-taosecho-etl-skills.js
```

Expected result:

```text
taosecho etl skill verification passed: 450/450
```

Run Harness Setup preflight against a project:

```bash
python3 skills/harness-setup-skill/harness-setup/scripts/preflight.py /path/to/project
```

## Repository Layout

```text
skills/
  taosecho-etl-skills/
    skills/taosecho-etl-*/
  harness-setup-skill/
    harness-setup/
```

Each package keeps its own README, version, examples, and verification flow.
