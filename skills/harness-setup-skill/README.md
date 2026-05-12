# Harness Setup Skill

`harness-setup` initializes a task harness before long-running, complex, multi-tool, multi-agent, or high-risk work.

It creates a task harness with:

- setup, update, resume, and closeout modes
- clear boundary between harness initialization and later phase execution
- preflight detection for candidate state files, project docs, entrypoints, and git status
- state file age and project doc modification details
- setup confirmation
- task name, slug, and depth confirmation
- outcome
- context map
- execution track
- tool list
- state files
- activation decision
- project entrypoint wire-up when selected
- verification gates
- verification owner, trigger, evidence, status, and failure action
- evaluator mode
- evaluation plan
- recovery and resume path
- closeout path
- existing harness update/supersede/split decision
- scope change protocol
- depth-specific phase writeback
- Active Harness agent responsibility checklist
- runtime graduation pointer for hooks, permissions, subagents, gates, and state automation
- reference integration rules
- optional learnings file
- staleness and context budget checks
- Phase 0 checkpoint

Setup stops after Phase 0. The executing agent owns later phase work, gate execution, writeback, and maintenance.

## Install

Copy or symlink the skill folder into your Codex or Claude skills directory.

Codex:

```bash
mkdir -p ~/.codex/skills
cp -R harness-setup ~/.codex/skills/harness-setup
```

Claude:

```bash
mkdir -p ~/.claude/skills
cp -R harness-setup ~/.claude/skills/harness-setup
```

Shared install:

```bash
ln -sfn ~/.codex/skills/harness-setup ~/.claude/skills/harness-setup
```

## Use

Invoke `harness-setup` before tasks that need durable state, verification, recovery, or handoff.

Run preflight when filesystem access is available:

```bash
python3 harness-setup/scripts/preflight.py /path/to/project
```

Manual fallback after install:

```bash
python3 ~/.codex/skills/harness-setup/scripts/preflight.py /path/to/project
python3 ~/.claude/skills/harness-setup/scripts/preflight.py /path/to/project
```

Recommended state file path:

```text
docs/harness/{task-slug}.md
```

Fallback path:

```text
.codex/harness/{task-slug}.md
```

The skill records an activation decision. When entrypoint wire-up is selected, it wires the active state file into the project entrypoint:

| Environment | Entrypoint |
|---|---|
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |
| Mixed-agent workspace | `AGENTS.md` and `CLAUDE.md` |
| Scoped/manual setup | state file only |

## Task Classes

| Class | Harness depth |
|---|---|
| Routine | Lightweight or direct execution |
| Standard | Full task state file plus activation decision |
| Production | Full state file, activation decision, and loop, memory, context, error, permission, verification, and lifecycle policies |

## Version

0.5.2

## License

MIT
