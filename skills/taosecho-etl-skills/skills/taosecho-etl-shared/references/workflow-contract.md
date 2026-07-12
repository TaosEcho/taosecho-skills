# TaosEcho ETL Workflow Contract

This contract defines how the entry, normalize, analysis, decision, and report skills cooperate. It does not replace the Unified Data Contract; it adds a small orchestration layer around it.

## Core Invariant

**One current step, then a fresh decision.**

A user may request a large outcome such as “完整分析” or “判断是否值得做”. Store that as an outcome. Do not translate it into an unconditional chain. Select the single action with the highest current information value, execute it, read the result, and decide again.

## Skill Roles

| Role | Skills | Responsibility |
| --- | --- | --- |
| Front door | `taosecho-etl-product` | Read context and state, select one current skill, stop when the user outcome is satisfied |
| Data gate | `taosecho-etl-normalize` | Convert raw user-provided data into unified-data and assess evidence quality |
| Analysis primitives | `taosecho-etl-buy-*`, `usage-scene`, `competitor-*`, `product-definition`, `risk-check`, `page-trust`, `validation-plan`, `ops-feedback` | Perform one bounded analysis and emit result signals |
| Decision | `taosecho-etl-dev-decision` | Make a stage judgment only when the evidence gate permits it |
| Delivery | `taosecho-etl-report` | Assemble completed work; clearly mark missing sections |

The front door orchestrates. Worker skills do not own a multi-skill journey.

## Router Modes

### 1. Intake

Use when `state.md` is missing, new raw data arrives, or normalized data is stale.

Route to normalize.

### 2. Direct Task

Use when `state.md` exists and the user names a concrete analysis outcome.

Route to the matching worker skill. Do not ask the user to invoke it again.

### 3. Post-Result Navigation

Use after a worker skill finishes or when the user says “继续” or “下一步”.

Read the latest result signals and select one action. The next action may be another analysis, validation, decision, report, a request for one missing input, or stop.

## Routing Precedence

Use the first applicable rule:

1. Explicit current user goal.
2. Normalize gate.
3. Evidence blocker that can invalidate the requested conclusion.
4. Latest `signals` and `unresolved`.
5. Remaining work needed for `workflow.requested_outcome`.
6. Default exploration path.

When two actions remain equally plausible, ask one discriminating question. Do not present a full menu.

## Worker Result Contract

Every analysis skill writes or returns:

```yaml
result:
  skill: taosecho-etl-buy-reason
  level: 判断级
  key_findings:
    - "..."
  signals:
    - demand_signal_strong
  unresolved:
    - use_context_unclear
  evidence_refs:
    - reviews.positive[0:12]
  completion:
    criterion_met: true
    note: "购买动机、证据强度和产品启发已覆盖"
```

A worker may suggest one next action, but the entry router makes the final routing decision.

## Completion Criteria

### Front door

Complete when one of these is true:

- one selected skill has completed;
- one routing-critical question has been asked;
- the requested outcome is already satisfied;
- the task is blocked and the exact missing evidence is stated.

### Normalize

Complete when state is readable, provenance is retained, evidence level is assigned, conflicts and gaps are recorded, and at most one next action is suggested.

### Analysis primitive

Complete when the skill-specific question is answered, each material finding has evidence or an explicit evidence gap, the fixed output schema is populated, and result signals are written back.

### Decision

Complete when the stage judgment is traceable to completed analyses, disqualifying gaps are explicit, and the action is bounded to the current evidence level.

### Report

Complete when the report is generated, missing analyses are named rather than invented, and the output passes available validation.

## Auto-Continue

Auto-continue is allowed when the user gave usable data and a clear goal in the same turn.

It remains single-step:

```text
normalize → one selected analysis → fresh routing decision
```

Do not silently execute every item from a legacy queue. A second auto-continue requires a new check that the first result did not satisfy the outcome, introduce a blocker, or change the best route.

## Stop Rules

Stop rather than append another skill when:

- the user’s requested outcome is satisfied;
- the user asked only for normalization or one named analysis;
- evidence is too weak for the next conclusion;
- the next action requires new user data;
- the user pauses or changes target;
- another analysis would add detail but not change the decision.

## Compatibility

Existing v2.2 state may contain:

```yaml
recommended_next:
  auto_run: true
  queue:
    - skill-a
    - skill-b
```

Migration behavior:

1. Read only the first item as a candidate.
2. Re-check it against the current goal, evidence, and latest result.
3. Write the chosen action to `workflow.next_action`.
4. New writes keep at most one item in the compatibility queue.
5. Never infer that the remaining old queue must be completed.

## Positive Operating Rules

- Carry forward information already present in the conversation.
- Prefer a concrete current action over a menu.
- State the evidence boundary alongside the conclusion.
- Use a single source of truth for each rule; other skills point here rather than restating the full workflow.
- Keep host-specific tools optional. The guaranteed path is plain-text instructions plus filesystem state when available.
