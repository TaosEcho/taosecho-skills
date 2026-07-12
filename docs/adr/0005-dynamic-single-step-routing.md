# ADR 0005: Dynamic Single-Step ETL Routing

## Status

Proposed.

## Context

TaosEcho ETL already has a sound normalize-first boundary: raw data enters `taosecho-etl-normalize`, analysis skills read `state.md`, and reports consume `analysis_history`.

The current routing layer also stores fixed multi-skill queues. Those queues are convenient for simple demos, but they create three problems:

- a later skill can run before an earlier result changes the best route;
- the agent can optimize for finishing the queue instead of completing the current analysis thoroughly;
- `recommended_next` is documented in different locations across the unified contract and intake guidance.

The reference designs reviewed for this change use complementary ideas:

- small orchestration entrypoints separated from reusable worker disciplines;
- dynamic navigation that chooses one current skill from the latest result;
- explicit, checkable completion criteria before advancing.

## Decision

Keep the normalize-first data architecture and introduce a dynamic single-step workflow contract.

- `taosecho-etl-product` remains the single front door.
- Every routing decision selects at most one current skill.
- Large user requests are stored as `workflow.requested_outcome`, not expanded into an unconditional chain.
- Worker skills write findings, signals, unresolved items, and completion state.
- The entry skill re-evaluates the route after each result.
- `workflow.next_action` becomes the canonical route field.
- Existing `recommended_next.queue` remains readable as a compatibility mirror, but new writes contain at most one skill.
- State recovery reads the current user message first, then workflow state, recent results, evidence, and finally legacy routing fields.

## Consequences

- Routing adapts when evidence gaps or analysis findings change the best next step.
- Each skill can be evaluated against a local completion criterion.
- Long requests may still auto-continue, but every hop requires a fresh routing decision.
- Existing v2.2 state remains usable.
- The verifier should evolve from phrase-presence checks toward scenario-based routing and state-transition fixtures.
- Future worker-skill edits should remove duplicated workflow prose and point to the shared workflow contract.
