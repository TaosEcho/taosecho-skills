# ADR 0005: Dynamic Single-Step ETL Routing

## Status

Accepted.

## Context

TaosEcho ETL already has a sound normalize-first boundary: raw data enters `taosecho-etl-normalize`, analysis skills read `state.md`, and reports consume `analysis_history`.

The previous routing layer also stored fixed multi-skill queues. Those queues were convenient for simple demos, but created three problems:

- a later skill could run before an earlier result changed the best route;
- the agent could optimize for finishing the queue instead of completing the current analysis thoroughly;
- `recommended_next` was documented in different locations across the unified contract and intake guidance.

The reference designs reviewed for this change use complementary ideas:

- small orchestration entrypoints separated from reusable worker disciplines;
- dynamic navigation that chooses one current skill from the latest result;
- explicit, checkable completion criteria before advancing.

## Decision

Keep the normalize-first data architecture and adopt a dynamic single-step workflow contract.

- `taosecho-etl-product` remains the single front door.
- Every routing decision selects at most one current action.
- Large requests are stored as `workflow.requested_outcome`, not expanded into an unconditional chain.
- Worker skills write findings, signals, unresolved items, evidence references, and completion state.
- The entry skill re-evaluates the route after each result.
- `workflow.next_action` is the canonical route field.
- Existing `recommended_next` fields remain readable as compatibility inputs, but new writes never contain a multi-item queue.
- State recovery reads the current user message first, then workflow state, recent results, evidence, and finally legacy routing fields.

## Consequences

- Routing adapts when evidence gaps or analysis findings change the best next step.
- Each skill is evaluated against a local completion criterion.
- Large requests may auto-continue, but every hop requires a fresh routing decision.
- Existing v2.2 state remains readable.
- Scenario fixtures cover direct routing, post-result routing, evidence blockers, goal changes, report delivery, and stop behavior.
- Worker skills point to one shared workflow contract rather than duplicating the whole journey.
