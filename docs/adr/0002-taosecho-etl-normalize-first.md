# ADR 0002: TaosEcho ETL Normalize-First Flow

## Status

Accepted.

## Context

Product analysis receives data from structured sources, tables, pasted reviews, documents, screenshots, and spoken descriptions. Analysis skills become brittle when each skill handles source-specific parsing directly.

## Decision

Route all raw product data through `taosecho-etl-normalize`. Normalize writes `state.md` using the shared Unified Data Contract. Analysis and report skills consume `state.md` and `analysis_history`.

## Consequences

- Source handling is centralized.
- Analysis skills stay platform-neutral.
- Field degradation and evidence level rules can be shared across skills.
- Contract changes require verifier coverage and migration notes.
