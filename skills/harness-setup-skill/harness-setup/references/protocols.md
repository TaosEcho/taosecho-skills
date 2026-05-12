# Harness Protocols

Reference version: 0.5.3

Use this file with `SKILL.md` for setup, update, resume, closeout, template assembly, evidence, and reference integration.

## Section Index

| Mode | Read sections |
|---|---|
| Setup | Preflight Mapping, Reference Integration, Template Assembly, Evidence Standard, Runtime Graduation, Template Promotion |
| Update | Preflight Mapping, Update Mode, Scope Change Decision, Evidence Standard, Template Assembly, Staleness Check, Runtime Graduation |
| Resume | Preflight Mapping, Resume Mode, Staleness Check, Context Budget |
| Closeout | Closeout Mode, Evidence Standard |
| Mode switch | Mode Switch |

## Preflight Mapping

Map preflight output into setup fields:

| Preflight field | Setup field or section | Rule |
|---|---|---|
| `candidate_state_files` | Existing Harness Handling / State file | Present update, supersede, or separate choices |
| `entrypoints` | Activation decision / Entrypoint file | Prefer the existing project entrypoint when wire-up is selected |
| `project_docs` | Context Map / Existing Project Docs / Authority Map | Load only docs needed to infer defaults |
| `git.dirty` and `git.status` | Risks / Recovery | Record dirty state and preserve user changes |
| `learnings_files` | Context Map / Template Notes | Read compactly when recurring decisions matter |
| `recommendation.default_state_file_when_empty` | State file | Use only when no candidate state file exists |
| `candidate_state_file_details` | Existing Harness Handling / Staleness Check | Show age and modification status when choosing a candidate |

If multiple state files exist, list them as candidates and wait for a chosen path before writing.

Candidate selection order:

1. Active Harness block target in the chosen entrypoint.
2. State file whose slug matches the user task.
3. Most recently modified candidate.
4. User selection when candidates remain ambiguous.

## Reference Integration

Route references into the main Harness state file:

| Reference | Adds to Harness | Domain artifact |
|---|---|---|
| `coding.md` | Execution Track, Tools, Verification Gates, Recovery | code diff, tests, screenshots |
| `research.md` | Context Map, Source tiers, Verification Gates | research report, `sources.md`, `findings.md` |
| `design-prototype.md` | Design constraints, Tools, visual gates | prototype, screenshots, review notes |
| `business-ops.md` | Authority Map, writeback rules, receipt path | workflow doc, work log, receipt |
| `architecture.md` | Production policies and lifecycle | loop contract, policy files, runbook |

Harness state owns execution state. Domain artifacts own domain content. Record each artifact in `State Files` with its update rule.

## Template Assembly

Before writing a state file:

1. Select Harness depth.
2. Copy the Standard Template sections that apply.
3. Add Production Additions only for Production depth.
4. Include exactly one writeback shape for the selected depth.
5. Include reference-derived domain artifact rows in `State Files`.
6. Fill Phase 0 with: done, files changed, evidence, decisions, entrypoint status/path, next action, remaining.
7. Remove unused placeholder rows.

Unused placeholder rows are rows that still contain empty cells, `{placeholder}` text, `pending` without a concrete reason, or template-only examples after the final state file has real values.

## Evidence Standard

Use these evidence classes:

| Evidence class | Examples | Gate status |
|---|---|---|
| Command output | test, build, lint, typecheck, API call | passed or failed with command summary |
| Visual artifact | screenshot path, video path, browser state | passed or failed with artifact path |
| Source citation | URL, doc path, line reference, accessed date | passed or deferred with source quality |
| Diff evidence | changed files, git diff summary, patch path | passed with diff summary |
| User approval | explicit user reply, approval note, decision table | passed with approval source |
| Checklist | reviewer checklist with dated result | passed, failed, or deferred |

A gate reaches `passed with evidence` only when the recorded evidence can be inspected later.

## Scope Change Decision

Choose the Harness action by dependency:

| Situation | Action |
|---|---|
| New request shares the same outcome and same verification path | Update current phase |
| New request shares the outcome and adds work | Add a phase |
| New request may run independently beside current work | Create separate Harness |
| New request replaces the current outcome | Supersede existing Harness |
| New request conflicts with current outcome or authority | Stop before execution and ask for one priority |

Record user confirmation for medium, large, and conflicting changes.

## Update Mode

When an existing Harness continues:

1. Run preflight and identify candidate state files.
2. Select the active state file using Candidate selection order.
3. Read the state file and keep existing Phase Log, Decisions, Evaluation Results, Risks, and Closeout.
4. Run Staleness Check.
5. Compare the user request with Outcome, Current Phase, and Next Action.
6. Classify the change as same phase, new phase, separate Harness, supersede, or conflict.
7. Present an Update Confirmation with state file path, change classification, fields to change, preserved sections, verification impact, and next action.
8. Write changes only after confirmation or explicit automatic-default instruction.
9. Append Harness Revision Log and a phase writeback row.

Update Mode changes current execution state. It preserves historical logs by default.

## Mode Switch

When the user redirects to another mode mid-flow:

1. Stop the current mode before writes or execution.
2. Report the previous mode, requested mode, and any drafted but unwritten changes.
3. Reuse preflight output when it is still current; rerun preflight when files may have changed.
4. Follow the requested mode's confirmation or gate-report path.
5. Continue only after required confirmation for writes, entrypoint changes, supersession, or closeout.

## Staleness Check

Run this check before Resume and Update:

| Signal | Action |
|---|---|
| State file is older than 14 days | report stale risk before continuing |
| Referenced project docs changed after the state file | reload changed docs and update Context Map |
| Referenced files are missing | record risk and ask before execution |
| Git dirty state touches Harness-owned files | inspect diff before proposing changes |
| Skill version differs from state file version when recorded | append Harness Revision Log |

## Resume Mode

When the user asks to continue:

1. Run preflight.
2. Read the selected Harness state file.
3. Report Current Phase, Next Action, last evidence, open risks, and activation status.
4. Ask before executing work covered by a Hard Stop.
5. Resume from `Next Action` only after the user gives an execution instruction.

## Context Budget

Use these reset triggers:

| Signal | Action |
|---|---|
| More than five material phases in one thread | write phase summary and resume from state file |
| Large source set or long research notes | save sources/findings as domain artifacts |
| Conversation context contains obsolete decisions | update Decisions and Recovery before continuing |
| Tool output is too large to keep in context | summarize into Evidence and store artifact path |

## Closeout Mode

When the task is complete or the user asks to close:

1. Run all required verification gates or record deferred gates with reasons.
2. Append closeout results to Evaluation Results and Phase Log.
3. Update canonical docs and work log according to Authority Map.
4. Mark `Current Phase` as closed.
5. Record final recovery path and archive status.
6. Ask before removing or changing any Active Harness block in entrypoint files.

Entrypoint closeout options:

| Option | Use when |
|---|---|
| Keep active | Follow-up work is expected soon |
| Mark closed | Historical visibility matters |
| Remove block | Project should return to general startup behavior |

## Runtime Graduation

Record runtime graduation only as guidance during setup or update:

| Need | Runtime layer | Setup action |
|---|---|---|
| Hard Stop enforcement | Hooks such as `.claude/settings.json` `PreToolUse`, `PostToolUse`, or `Stop` | record recommendation |
| Permission boundary | runtime permissions or sandbox settings | record recommendation |
| Evaluator role | project subagent definition | record reviewer scope |
| Real verification gate | CI, MCP tool, browser tool, or gate runner | record command/tool path |
| State/writeback automation | project script, MCP server, or workflow tool | record candidate owner |

Create runtime configuration only when the user gives a separate instruction for runtime enforcement.

## Template Promotion

Promote a reusable template only when the user asks or an existing learning/template note shows repeated use.

Valid signals:

- user asks for a repeatable scaffold
- the task recurs on a schedule
- verification gates, context map, and recovery path stay stable across tasks

Template file should include outcome pattern, required fields, phase track, verification gates, recovery rule, and writeback shape.

## Learnings

Use a lightweight append-only learning file only when it already exists or the user asks for reusable setup memory:

```text
docs/harness/learnings.jsonl
.codex/harness/learnings.jsonl
```

Each line:

```json
{"date":"YYYY-MM-DD","scope":"task or project","lesson":"what changed future setup","source":"state file or user decision"}
```

Read learnings only when preflight finds them or the user asks to reuse prior patterns.

Template promotion can reference `learnings.jsonl`, existing template notes, or explicit user confirmation. This skill records the signal; later executing agents operate the template.
