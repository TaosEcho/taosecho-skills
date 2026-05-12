# Harness State File Template

Reference version: 0.5.2

Use this template when creating or updating a harness state file.

Assemble the final state file from this template. Include only the sections and writeback shape that match the selected Harness depth.

## Standard Template

```markdown
# Harness State: {task-slug}

## Setup Confirmation
| Field | Value |
|---|---|
| Confirmation status | pending / approved / automatic defaults requested |
| Confirmation source | user reply / user instruction / project default |
| Confirmation date | |
| Skill version | |
| Preflight status | |
| Task name | |
| Task slug | |
| Harness depth | |
| Outcome | |
| Scope | |
| Evidence sources | |
| Verification | |
| State file | |
| Activation decision | |
| Entrypoint file | |
| Evaluator mode | |
| Recovery | |

## Outcome
{concrete end state}

## Harness Depth
Lightweight | Standard | Production

## Current Phase
{phase name}

## Activation Decision
| Mode | Entrypoint | Harness pointer | Status |
|---|---|---|---|
| project entrypoint / mixed-agent / state-file-only | `{AGENTS.md or CLAUDE.md or startup file}` | `Read {this state file} before continuing this task` | pending / active / scoped |

## Context Map
| Source | Why it matters | Load rule |
|---|---|---|

## Existing Project Docs
| Document | Role | Relationship to Harness |
|---|---|---|

## Existing Harness Handling
| Existing file | Modified | Decision | Reason | Preservation rule | User confirmation |
|---|---|---|---|---|---|

## Execution Track
| Phase | Action | Exit gate |
|---|---|---|

## Tools
| Tool | Purpose | Access |
|---|---|---|

## State Files
| File | Role | Update rule |
|---|---|---|

## System Links
| Surface | Path | Role |
|---|---|---|
| Workspace rule | `AGENTS.md`, `CLAUDE.md`, or project entry instructions | Long-term routing rule when wire-up is selected |
| Task state | this file | Single-task operating record |
| Time log | `{project work log path}` | Chronological trace |
| Template candidate | `docs/harness/templates/{template-name}.md` | Reusable scaffold when this pattern repeats |

## Verification Gates
| Gate | Owner | Trigger | Evidence | Status | Failure action |
|---|---|---|---|---|---|

## Evaluator Mode
| Selected mode | Reason | Gate owner |
|---|---|---|

Use `user review` or `separate reviewer` for UI/design and user-facing copy gates. Use `same-agent checklist` for deterministic command, schema, or source checks.

## Evaluation Plan
| Phase | Evaluator needed | Method | Evidence |
|---|---|---|---|

## Evaluation Results
| Phase | Result | Findings | Follow-up |
|---|---|---|---|

## Authority Map
| Information | Authority | Sync rule |
|---|---|---|
| Current phase, next action, recovery, gate status | Harness state file | update before pause or handoff |
| Durable project background, architecture, permanent decisions | canonical project docs | update after phase close when needed |
| Chronological trace | work log when present | append compact trace after material phase |

## Decisions
| Decision | Rationale | Date |
|---|---|---|

## Phase Log

### Phase 0: Harness Setup
- Done:
- Files changed:
- Evidence:
- Decisions:
- Entrypoint status/path:
- Next action:
- Remaining:

## Phase Writeback
{insert exactly one writeback shape from Phase Writeback Selection}

## Scope Changes
| Date | Change | Classification | Harness action | User confirmation |
|---|---|---|---|---|

## Risks
| Risk | Signal | Response |
|---|---|---|

## Template Notes
- Reusable pattern:
- Fields worth standardizing:
- Verification gates worth reusing:
- Context sources worth adding to future tasks:

## Recovery
- Checkpoint rule:
- Resume read order:
- Resume command or instruction:
- Rollback path:
- Context reset trigger:
- Handoff rule:

## Runtime Graduation
| Need | Runtime layer | Setup status |
|---|---|---|
| Hard Stop enforcement | hooks / runtime settings | recorded / deferred |
| Permission boundary | runtime permissions / sandbox | recorded / deferred |
| Evaluator role | project subagent definition | recorded / deferred |
| Real verification gate | CI / MCP / browser / gate runner | recorded / deferred |
| State/writeback automation | project script / MCP / workflow tool | recorded / deferred |

## Staleness Check
| Signal | Result | Action |
|---|---|---|

## Context Budget
| Signal | Action |
|---|---|

## Harness Revision Log
| Date | Change | Reason |
|---|---|---|

## Closeout
| Field | Value |
|---|---|
| Status | open / closed / archived |
| Final gates | |
| Canonical docs updated | |
| Work log updated | |
| Entrypoint status | active / marked closed / removed |
| Archive path | |

## Next Action
{next execution instruction to wait for}

## Setup Stop
Harness setup is complete. Wait for a separate user instruction before phase execution.
```

## Production Additions

Add these sections for agent runtimes, autonomous tasks, multi-agent work, or high-risk workflows:

```markdown
## Loop Contract
| Step | Rule |
|---|---|
| Assemble input | |
| Model call | |
| Tool execution | |
| Result packaging | |
| State update | |
| Verification | |
| Termination | |

## Tool Scope
| Phase | Visible tools | Permission level |
|---|---|---|

## Memory Policy
| Memory type | Storage | Update rule |
|---|---|---|

## Context Policy
| Context type | Load rule | Compaction rule |
|---|---|---|

## Error Policy
| Error | Retry | Escalation | Recovery |
|---|---|---|---|

## Permission Policy
| Action class | Approval rule | Evidence |
|---|---|---|

## Verification Policy
| Gate type | Cadence | Evidence | Owner | Failure action |
|---|---|---|---|---|

## Lifecycle
| Event | Required action |
|---|---|
| Start | |
| Pause | |
| Resume | |
| Context reset | |
| Closeout | |
```

## Entrypoint Block

Add this to the project entrypoint and adapt the path:

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

## Phase Writeback Selection

Use the writeback shape already embedded in the state file:

### Lightweight

```markdown
| Done | Evidence | Next |
|---|---|---|
```

### Standard

```markdown
- Done:
- Files or artifacts:
- Evidence:
- Decisions:
- Remaining:
- Resume from:
```

### Production

```markdown
- Done:
- Files or artifacts:
- Evidence:
- Decisions:
- Policy updates:
- Evaluator result:
- Failure action:
- Lifecycle state:
- Remaining:
- Resume from:
```
