---
name: harness-setup
version: "0.5.2"
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - Grep
  - Glob
metadata:
  triggers:
    - harness setup
    - harness engineering
    - task harness
    - long task setup
    - resume harness
    - close harness
description: |
  Build a task harness for long-running, complex, multi-tool, multi-agent, or high-risk work.
  Use when the user asks to set up an agent workflow, long task execution system, project
  operating loop, coding/research/design/business harness, verification gates, recovery flow,
  context map, handoff protocol, or reusable task setup. The skill works through conversation:
  ask focused questions, infer defaults from the repo and user feedback, then produce concrete
  harness files, plans, checklists, handoff blocks, state files, and operating rules. This skill
  focuses on harness setup; downstream skills are user-directed phase tools.
---

# Harness Setup

Initialize the operating frame around an AI task so the executing agent can run, verify, recover, and hand off.

The harness is the initial environment around the model: context supply, tool access, execution track,
state, verification gates, constraints, recovery, and handoff.

This skill initializes the harness. The executing agent and project tools operate it after setup.

## Source Model

Combine prompt clarity, context supply, state tracking, verification gates, recovery, and handoff. Downstream tools and skills are user-directed phase tools.

## Trigger Triage

Classify the task before designing the harness:

| Signal | Route |
|---|---|
| Code feature, bug, refactor, app workflow | Read `references/coding.md` |
| Research, report, market/technical analysis | Read `references/research.md` |
| Page, prototype, deck-like web experience, design workflow | Read `references/design-prototype.md` |
| Business workflow, operating system, thread/process governance | Read `references/business-ops.md` |
| Agent runtime, long-running autonomous task, production workflow | Read `references/architecture.md` |

When the task spans routes, load the smallest set of references that covers the risk.

Use `references/protocols.md` as the protocol index. Load only the sections needed for the selected mode.

## Setup Protocol

Run setup in this order.

1. Run preflight when filesystem access is available.
2. Inspect the workspace just enough to draft setup defaults.
3. Present a Setup Confirmation.
4. Get confirmation before writing files, except when the user explicitly asks for automatic defaults.
5. Create or update the Harness state file.
6. Apply the confirmed activation decision.
7. Write the Phase 0 checkpoint.
8. Stop at setup completion.

Preflight command:

```bash
python3 {skill_dir}/scripts/preflight.py "{project_root}"
```

Manual fallback:

```bash
python3 ~/.codex/skills/harness-setup/scripts/preflight.py "{project_root}"
python3 ~/.claude/skills/harness-setup/scripts/preflight.py "{project_root}"
```

Use preflight output to detect existing Harness state files, project entrypoints, git status, and possible update targets.

Filesystem access is available when the project root is readable and the shell can run the preflight command. When unavailable, record the reason in Preflight status and continue from user-provided context.

Setup Confirmation must cover:

| Field | Meaning |
|---|---|
| Preflight status | Script result, skipped reason, or unavailable reason |
| Task name | Short human name for the Harness |
| Task slug | File-safe slug for `docs/harness/{task-slug}.md` or `.codex/harness/{task-slug}.md` |
| Harness depth | Lightweight, Standard, or Production |
| Outcome | Concrete artifact or result that should exist at the end |
| Scope | Repo, docs folder, app, design/prototype surface, external page, or business workspace |
| Evidence sources | Files, URLs, logs, APIs, screenshots, databases, prior decisions |
| Verification | Tests, screenshots, review checklist, acceptance criteria, source citations, user approval |
| State file | Where progress, decisions, phase logs, and next-step handoff live |
| Activation decision | Project entrypoint wire-up, mixed-agent wire-up, or state-file-only setup |
| Entrypoint file | `AGENTS.md`, `CLAUDE.md`, or another project startup/read-order file when wire-up is selected |
| Evaluator mode | Same-agent checklist, separate reviewer, or user review |
| Recovery | Resume read order, rollback path, context reset trigger, handoff rule |

When the workspace already contains strong project docs, infer defaults from those docs and still confirm outcome, verification, state file, activation decision, and entrypoint when wire-up is selected.

Task slug rule:

- Derive the slug from task name or outcome.
- Prefer lower-case kebab-case ASCII.
- Keep a user-provided slug exactly when it is file-safe.

Activation default rule:

| Detected entrypoints | Default activation |
|---|---|
| `CLAUDE.md` only | Project entrypoint wire-up to `CLAUDE.md` |
| `AGENTS.md` only | Project entrypoint wire-up to `AGENTS.md` |
| Both `AGENTS.md` and `CLAUDE.md` | Mixed-agent wire-up |
| No entrypoint | State-file-only setup, unless the user asks to create an entrypoint |

Confirmation response rules:

- Present the full Setup Confirmation table in one message.
- End with: `Reply approve, modify <field>, or ask <question>.`
- If the user modifies any field, update the defaults, re-render the full table, and wait for approval.
- Writing files begins only after `approve` or an explicit automatic-default instruction.

## Invocation Modes

Use preflight and user wording to choose the mode:

| Mode | Trigger | Action |
|---|---|---|
| Setup | No matching Harness exists | Draft Setup Confirmation |
| Update | Existing Harness continues | Read state file, run staleness check, preserve history, append revision |
| Resume | User asks to continue | Read Current Phase and Next Action, then ask before execution |
| Closeout | Task is done or user asks to close | Run closeout gates and update entrypoint status |

Mode-specific details live in `references/protocols.md`.

## Existing Harness Protocol

When a Harness state file already exists, read it before proposing setup.

Present one of these choices in Setup Confirmation:

| Choice | Use when | Required action |
|---|---|---|
| Update existing Harness | Same task or same phase continues | Preserve prior Phase Log, Decisions, and Evaluation Results; append Harness Revision Log |
| Supersede existing Harness | Same project has a new major task | Link the previous Harness in Existing Project Docs and record supersession reason |
| Create separate Harness | New task runs in parallel | Create a new state file with a distinct slug and entrypoint rule |

Replacement of an existing state file requires explicit confirmation naming the target path.

## Hard Stops

These actions require user confirmation or an explicit automatic-default instruction:

- writing or replacing a Harness state file
- creating, modifying, or removing `AGENTS.md`, `CLAUDE.md`, or another startup/read-order file
- changing or removing an Active Harness block
- changing activation decision
- changing Harness depth
- marking a verification gate as passed without evidence
- superseding an existing Harness

Hard Stop response:

1. Stop before writing files, changing entrypoints, marking gates passed, or starting execution.
2. Report the blocked action, target file or gate, and required confirmation.
3. Ask for the missing approval or decision.
4. Continue only after a new user reply explicitly approves the action or explicitly redirects with a new instruction.

## Harness Depth

Choose the smallest depth that covers the task:

| Depth | Use when | Output |
|---|---|---|
| Lightweight | Routine task with clear goal, low risk, one verification path | Outcome, context, verification, next action, optional state file |
| Standard | Long task, multi-step work, multiple files or tools | Full Harness state file plus activation decision |
| Production | Agent runtime, autonomous workflow, high risk, multi-agent, permissions, long lifecycle | Full state file, activation decision, and loop, memory, context, error, permission, lifecycle policies |

## Task Boundary

Use this boundary before choosing depth:

| Task class | Definition | Harness need | Evaluator need |
|---|---|---|---|
| Routine | Single-step or short task, clear desired output, low blast radius, one evidence path, easy rollback | Lightweight or direct execution | Usually no |
| Standard | Multi-step task, multiple files or sources, meaningful user-facing output, needs state continuity | Standard | Decide explicitly |
| Production | High-risk, autonomous, multi-agent, externally visible, hard rollback, permissions, long lifecycle, business-critical | Production | Yes |

Routine task examples:
- Routine: narrow answer, one read-only command, one small obvious edit, one file or URL inspection.
- Standard: multi-file change, UI/prototype work, source-backed research, workflow docs, multi-session task.
- Production: autonomous workflow, destructive/external action, multi-agent coordination, business-critical or high-stakes work.

When classification is ambiguous, choose the stronger depth.

## Evaluator Gate

For Standard and Production harnesses, add an evaluation plan.

Evaluator is required when any condition applies:

- user-facing behavior changes
- UI/design output is produced
- multiple modules, files, or sources are touched
- claims need source support
- task uses subagents or parallel work
- task has high business, operational, or external impact
- recovery would be costly
- user asks for review or quality check

Evaluator mode must be explicit:

| Mode | Use when | Setup action |
|---|---|---|
| Same-agent checklist | Deterministic command, schema, or source checks | Add checklist and evidence rows to the state file |
| Separate reviewer | Multi-file, source-backed, high-impact, or parallel-agent work | Add reviewer instructions, scope, and required evidence |
| User review | UI/design, user-facing copy, taste, business direction, approval, or external commitment | Add approval gate and decision fields |

Spawning a separate reviewer requires explicit user instruction or a later execution-phase instruction.

Evaluator owns:

- reading the Harness state file
- checking outputs against verification gates
- inspecting evidence quality
- identifying missing tests, unsupported claims, visual defects, or recovery gaps
- appending QA results to the Harness state file

Evaluator scope is review and gate validation.

UI/design and user-facing copy use `user review` or `separate reviewer` by default. Same-agent checklist is reserved for mechanical gates with inspectable evidence.

## Verification Execution

Every verification gate must record:

| Field | Meaning |
|---|---|
| Owner | same agent, separate reviewer, user, CI, browser tool, command |
| Trigger | phase exit, before handoff, before final response, scheduled check |
| Evidence | command output, screenshot path, citation URL, diff, log, checklist |
| Failure action | fix, revise Harness, ask user, split scope, roll back, pause |

Gate status values:

- pending
- running
- passed with evidence
- failed with evidence
- deferred with reason

Evidence standards live in `references/protocols.md`.

## Entrypoint Wire-up

A Harness has project-level routing after the project entrypoint points to its state file.

Activation options:

| Option | Result |
|---|---|
| Project entrypoint wire-up | Future sessions load the Harness through the project startup file |
| Mixed-agent wire-up | Codex and Claude both load the Harness through their project entrypoints |
| State-file-only setup | The Harness state file is created and the entrypoint decision records scoped manual use |

Choose the entrypoint this project already uses:

| Environment | Entrypoint |
|---|---|
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |
| Mixed-agent workspace | `AGENTS.md` and `CLAUDE.md` |
| Custom workflow | the project's startup/read-order file |

When wire-up is selected and the project has no entrypoint, create the smallest appropriate one at the project root.

Use this block, adapted to the project:

```markdown
## Active Harness

For this task, read first:

- `{state-file-path}`

Before continuing any phase:

- Read the Harness state file.
- Follow `Current Phase` and `Next Action`.
- Append a phase writeback before handoff or pause.
- Run the recorded verification gates for completed work.

Agent responsibilities:

- Read the state file before any material action.
- Write phase writeback after each phase.
- Run verification gates or record escalation.
- Stop at Hard Stops and request confirmation.
- Propose project runtime config when enforcement is needed.
```

Adapt the block language to the entrypoint file's main language. Keep the same structure, state file pointer, and responsibility list.

## Harness Output

Use `references/state-file-template.md` for the written Harness state file.

The Harness state file is the execution authority. The chat report is a compact summary of the written state file. When they differ, update the state file first and report the correction.

Use this compact shape for the setup report to the user:

```markdown
# Harness: {task name}

## Outcome
{concrete end state}

## Context Map
| Source | Why it matters | How to load |
|---|---|---|

## Execution Track
| Phase | Action | Exit gate |
|---|---|---|

## Tools
| Tool | Purpose | Command or access path |
|---|---|---|

## State Files
| File | Role | Update rule |
|---|---|---|

## Entrypoint
{activation decision and entrypoint status}

## Verification Gates
| Gate | Owner | Trigger | Evidence | Status | Failure action |
|---|---|---|---|---|---|

## Evaluation Plan
| Phase | Evaluator needed | Method | Evidence |
|---|---|---|---|

## Recovery
{checkpoint, rollback, context reset, resume instructions}

## Next Action
{the next execution instruction to wait for}
```

Default state file path:

- Prefer `docs/harness/{task-slug}.md`
- Use `.codex/harness/{task-slug}.md` when the project has no `docs/`

When the user asks to set up the harness, create or update the state file.

Use exactly one Phase Writeback shape matching the selected Harness depth.

## Existing Docs Policy

When the project already has `README`, `PROJECT.md`, work logs, specs, or planning docs, use the Harness state file as the active execution index.

Record the relationship clearly:

```markdown
## Existing Project Docs
| Document | Role | Relationship to Harness |
|---|---|---|
```

The Harness state file should store current phase, next action, gates, decisions, and resume instructions. Canonical project background can stay in its existing source document.

Authority rule:

| Information | Authority | Sync rule |
|---|---|---|
| Current phase, next action, recovery, gate status | Harness state file | update before pause or handoff |
| Durable project background, product definition, architecture, permanent decisions | Existing canonical docs | update after phase close when needed |
| Chronological trace | Existing work log when present | append compact trace after material phase |
| Conflict between Harness and canonical docs | Pause state in Harness Risks | resolve before execution |

## System Management

Use three layers for long-term continuity:

| Layer | File | Role |
|---|---|---|
| Workspace rule | `AGENTS.md`, `CLAUDE.md`, or project entry instructions | Long-term routing rule when wire-up is selected |
| Task state | `docs/harness/{task-slug}.md` or `.codex/harness/{task-slug}.md` | Single-task operating record and resume entry |
| Time log | Existing work log when the project has one | Chronological trace of material work |

For recurring task types, promote repeated patterns into:

```text
docs/harness/templates/
```

Each task state file should link any related work-log entries when the project maintains a work log.

For append-only continuity, add a compact event row to the Phase Log after every material phase. Keep long narrative in the existing work log when the project has one.

Template promotion and learnings rules live in `references/protocols.md`.

## Runtime Graduation

Record this pointer in Production or high-risk Standard harnesses:

| Need | Runtime layer |
|---|---|
| Hard Stop enforcement | Claude Code hooks such as `.claude/settings.json` `PreToolUse`, `PostToolUse`, or `Stop` |
| Permission boundary | Runtime permissions or sandbox settings |
| Evaluator role | Project subagent definition such as `.claude/agents/{reviewer}.md` |
| Real verification gate | CI command, MCP tool, browser tool, or project gate runner |
| State/writeback automation | Project script, MCP server, or workflow tool |

This skill records runtime graduation recommendations. Creating runtime config requires a separate user instruction.

## Build Rules

- Keep entry files short. Put durable detail in references, docs, specs, plans, and state files.
- Make context explicit: what to read first, what to load on demand, what to ignore until needed.
- Define one execution track with phase exit gates.
- Define state files before long work starts.
- Record the activation decision before declaring setup complete.
- Wire the Harness state file into the project entrypoint when wire-up is selected.
- Write Phase 0 immediately after setup, including done, files changed, evidence, decisions, entrypoint status/path, next action, and remaining work.
- Use real verification: tests, browser actions, screenshots, logs, API calls, diffs, or source citations.
- Separate creation from evaluation when quality risk is high.
- For long work, write a progress or handoff file after every material phase.
- For code work, use git status before editing and preserve user changes.
- For UI work, verify with browser screenshots across relevant viewports.
- For research work, cite source URLs and record evidence quality.
- For business workflows, write the operating rule into the startup/read-order surface.
- Treat downstream tools and skills as optional phase tools selected by the user.
- When the user names a downstream tool or skill, provide a compact handoff block with outcome, state file, constraints, and writeback rule.
- For reusable task scaffolds, load `references/state-file-template.md`.
- For production-grade agent runtimes, load `references/architecture.md`.
- When SKILL.md behavior changes, update `agents/openai.yaml` in the same edit.

## Scope Change Protocol

When the user changes scope mid-task, classify the change before continuing:

| Change | Action |
|---|---|
| Small within current outcome | Add to current phase and update exit gate |
| Medium within same task | Add a phase and append Harness Revision Log |
| Large new outcome | Create a separate Harness or supersede with explicit confirmation |
| Conflicting direction | Stop before execution, record conflict, ask for a single priority |

Scope changes update Outcome, Execution Track, Verification Gates, Recovery, and Next Action.

Use `references/protocols.md` for the separate-vs-supersede decision.

## Phase Writeback Weight

Use the writeback size that matches Harness depth:

| Depth | Writeback shape |
|---|---|
| Lightweight | one row: done, evidence, next; write in the state file when present, otherwise in chat plus the existing work log when present |
| Standard | phase block: done, files/artifacts, evidence, decisions, remaining, resume from |
| Production | phase block plus policy updates, evaluator result, failure action, lifecycle state |

Use exactly one writeback shape in the final state file.

## Harness Revision

Update the Harness when any of these change:

- outcome or scope
- verification gate
- evaluator mode
- tool access or permissions
- state file path
- entrypoint file
- activation decision
- recovery path
- phase order

Append the reason to `Harness Revision Log` in the state file.

## Skill Boundary

Harness Setup owns:

- outcome framing
- context map
- execution track
- state file
- verification gates
- recovery and resume path
- handoff block format

User-directed downstream tools and skills own their own phase work after the user invokes them.

Execution agent owns phase execution, phase writeback, gate execution, and ongoing maintenance after setup. This skill defines those obligations during initialization.

## Conversation Pattern

Choose the opening by mode:

| Mode | Opening |
|---|---|
| Setup | I will set up a harness for this task: outcome, context map, execution track, tools, verification, and recovery. |
| Update | I will update the existing harness after checking current state, changes, and confirmation needs. |
| Resume | I will resume from the active harness: current phase, next action, evidence, risks, and activation status. |
| Closeout | I will close this harness by checking gates, writeback, canonical docs, and entrypoint status. |

After the opening, follow the selected mode steps in `references/protocols.md`. Setup mode drafts defaults and presents Setup Confirmation. Update, Resume, and Closeout mode present the confirmation or gate report required by that mode.

After setup, report files changed, the activation decision, entrypoint status, state file, and the next execution instruction. Start phase execution only after the user gives a separate execution instruction.

## Completion Standard

Blocking conditions:

| Condition | Failure action |
|---|---|
| Setup Confirmation is recorded or explicitly accepted with defaults | stop before writes and ask for confirmation |
| Preflight output is recorded or skipped with reason | stop before writes and record unavailable reason |
| Harness state file exists when Standard or Production depth is selected | stop before execution |
| Activation decision is recorded | stop before writes and ask for activation decision |
| Project entrypoint points to the Harness state file when wire-up is selected | stop before completion and fix or record deferred reason |
| Phase 0 checkpoint is written | stop before completion and write it |
| Verification gates include owner, trigger, evidence, status, and failure action | revise gates before setup completion |
| Production depth includes loop, tool, memory, context, error, permission, verification, and lifecycle policies | revise Production sections |

Best-effort conditions:

| Condition | Fallback |
|---|---|
| Existing project docs are mapped when present | record unmapped docs in Risks |
| Work log is linked when present | record unavailable work log in Risks |
| Learnings file is read when present | record absence or skipped reason |

The final response says setup, update, resume, or closeout is complete and states:

- current session can use the Harness immediately
- future sessions load it through the entrypoint when wire-up is active
- after `/clear` or context compaction, run Resume Mode before execution
- the next user-controlled execution step
