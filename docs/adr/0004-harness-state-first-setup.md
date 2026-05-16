# ADR 0004: Harness State-First Setup

## Status

Accepted.

## Context

Harness Setup supports long-running, high-risk, and multi-agent work. These tasks need durable context, recovery paths, verification gates, and handoff rules.

## Decision

Harness Setup creates or updates a task state file first, then optionally wires project entrypoints such as `AGENTS.md` or `CLAUDE.md`.

## Consequences

- The state file is the durable operating surface.
- Entrypoint wiring is explicit and confirmable.
- Resume and closeout flows have a stable read order.
- Routine tasks can use lightweight setup while larger tasks get full state tracking.
