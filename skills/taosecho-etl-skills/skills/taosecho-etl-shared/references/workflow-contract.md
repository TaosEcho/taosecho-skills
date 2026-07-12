# TaosEcho ETL Workflow Contract

This contract defines how the entry, normalize, analysis, decision, and report skills cooperate. It complements the Unified Data Contract with a small orchestration layer.

## Core Invariant

**One current step, then a fresh decision.**

A user may request a large outcome such as “完整分析” or “判断是否值得做”. Store that request in `workflow.requested_outcome`. Select one current action, execute it to its completion criterion, read the result, and route again. A large outcome is not an unconditional queue.

## Skill Roles

| Role | Skills | Responsibility |
| --- | --- | --- |
| Front door | `taosecho-etl-product` | Read conversation and state, select one current action, and stop when the requested outcome is satisfied |
| Data gate | `taosecho-etl-normalize` | Convert raw user-provided data into unified-data and assess evidence quality |
| Analysis primitives | `taosecho-etl-buy-*`, `usage-scene`, `competitor-*`, `product-definition`, `risk-check`, `page-trust`, `validation-plan`, `ops-feedback` | Perform one bounded analysis and emit a structured result |
| Decision | `taosecho-etl-dev-decision` | Make a stage judgment only when its evidence gate permits it |
| Delivery | `taosecho-etl-report` | Assemble completed work and name missing sections |

The front door owns navigation. Worker skills own one bounded question. Workers do not own a multi-skill journey.

## Canonical Workflow State

`workflow.next_action` is the single source of truth for routing.

```yaml
workflow:
  requested_outcome: string?
  status: routing | running | waiting_for_input | satisfied | blocked | paused
  response_mode: brief | standard
  interaction_state: normal | impatient
  current_skill: string?
  next_action:
    type: skill | ask | stop
    target: string?
    reason: string
  latest_result:
    skill: string
    level: 不足 | 线索级 | 判断级 | 强判断
    key_findings: [string]
    signals: [string]
    unresolved: [string]
    evidence_refs: [string]
    suggested_next: string?
    completion:
      criterion_met: boolean
      note: string
  route_history:
    - action: string
      reason: string
      timestamp: ISO8601
```

`analysis_history.completed_skills` remains the append-only audit trail. `workflow.latest_result` is the compact routing surface for the most recent step.

## Router Modes

### 1. Intake

Use when `state.md` is missing, new raw data arrives, or normalized data is stale. Route to `taosecho-etl-normalize`.

### 2. Direct Task

Use when `state.md` exists and the user names a concrete analysis outcome. Route to the matching worker and stop when that bounded request is satisfied.

### 3. Post-Result Navigation

Use after a worker finishes, or when the user says “继续” or “下一步”. Read `workflow.latest_result` and select one action. The action may be another skill, one missing-input question, or stop.

## Routing Precedence

Use the first applicable rule:

1. The user’s latest explicit goal or goal change.
2. The normalize gate for missing, new, or stale data.
3. An evidence blocker that can invalidate the requested conclusion.
4. The latest result’s `signals` and `unresolved` items.
5. Remaining work required to satisfy `workflow.requested_outcome`.
6. The default exploration tie-breaker in `routing.md`.

When two actions remain equally plausible, ask one discriminating question. A full skill menu is not a routing decision.

## Worker Result Contract

Every worker writes `workflow.latest_result` and appends one record to `analysis_history.completed_skills`.

```yaml
workflow:
  latest_result:
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
    suggested_next: taosecho-etl-usage-scene
    completion:
      criterion_met: true
      note: "购买动机、证据强度和产品启发已覆盖"
```

A worker may suggest at most one next skill. The front door re-checks that suggestion against the current goal, evidence, and latest user message before writing `workflow.next_action`.

## Completion Criteria

### Front door

Complete the current turn when one of these is true:

- one selected skill has completed and its result is written;
- one routing-critical question has been asked;
- the requested outcome is already satisfied;
- the task is blocked and the exact missing evidence is stated.

### Normalize

Complete when state is readable, provenance is retained, evidence level is assigned, conflicts and gaps are recorded, and at most one next skill is suggested.

### Analysis primitive

Complete when the skill-specific question is answered, every material finding has evidence or an explicit gap, the fixed output schema is populated, and `workflow.latest_result.completion` is written.

### Decision

Complete when the stage judgment is traceable to completed analyses, disqualifying gaps are explicit, and the action is bounded to the current evidence level.

### Report

Complete when the report is generated, missing analyses are named rather than invented, and available validation passes.

## Auto-Continue

Auto-continue is allowed when the user gives usable data and a clear goal in the same turn. It remains single-step:

```text
normalize → one selected analysis → fresh routing decision
```

A second automatic hop requires a new routing check. Continue only when the previous result did not satisfy the request, did not introduce a blocker, and did not change the highest-value next action.

## Stop Rules

Choose `next_action.type=stop` when:

- the requested outcome is satisfied;
- the user asked only for normalization or one named analysis;
- evidence is too weak for the next conclusion;
- the next action requires new user data;
- the user pauses or changes target;
- another analysis would add detail without changing the decision.

## Compatibility

Existing v2.2 state may contain root-level `recommended_next.queue` or `analysis_history.recommended_next`.

Migration behavior:

1. Treat the first legacy route as a candidate, not an obligation.
2. Re-check it against the latest user goal, evidence, and result.
3. Write the selected action to `workflow.next_action`.
4. New compatibility writes contain at most one route.
5. Never infer that the remainder of an old queue must be completed.

## Positive Operating Rules

- Carry forward information already present in the conversation.
- Prefer one concrete action over a menu.
- State the evidence boundary alongside the conclusion.
- Keep each rule in one authoritative file; other skills point here.
- Keep host-specific tools optional. The guaranteed path is plain text plus filesystem state when available.
