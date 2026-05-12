# Business Ops Harness

Reference version: 0.5.2

Use for operating systems, thread workflows, governance, content pipelines, marketplace workflows, or repeatable business processes.

## Intake

Ask or infer:

- Business objective
- Owner or thread
- Canonical docs and read order
- Inputs and outputs
- Decision rights
- Work log or receipt path
- Escalation path

## Default Track

| Phase | Action | Exit gate |
|---|---|---|
| Authority | Read glossary, startup docs, governance docs, work log | Current rule known |
| Scope | Map responsibility, inputs, outputs, acceptance | Thread boundary known |
| Nodes | Convert repeated work into atomic nodes | Repeat path known |
| Writeback | Update startup/read-order/workflow docs | Rule can take effect |
| Receipt | Log changes, send receipts, mark escalation | Cross-thread visibility |
| Handoff | State current status, blocker, next 1-3 actions | Continuity clear |

## Operating Surfaces

Use existing canonical files first:

- glossary / ubiquitous language
- startup or START-HERE file
- workflow guide
- thread entry file
- work log
- thread mail inbox/receipts

## Verification Gates

- Rule appears in startup/read order
- Node has owner, trigger, input, output, acceptance, writeback
- Work log records change
- Escalation or receipt path is explicit

## Recovery

For long operations, write a compact status:

```markdown
## Current State
- Owner:
- Active node:
- Completed:
- Blocker:
- T0 / escalation:
- Next actions:
```
