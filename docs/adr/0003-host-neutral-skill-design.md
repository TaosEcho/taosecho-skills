# ADR 0003: Host-Neutral Skill Design

## Status

Accepted.

## Context

The public skills target Codex and Claude Code. Host-specific tools differ across environments, especially structured question tools and platform-specific MCP names.

## Decision

Keep public skill instructions host-neutral. Use plain-text questioning as the guaranteed path. Treat host-specific tools as optional external enhancements when explicitly available.

## Consequences

- Skills remain usable after copy install into Codex or Claude Code.
- Examples and instructions avoid mandatory host-specific tool calls.
- CI verifies installed skill packs in both target skill roots.
- Future host-specific improvements need explicit fallback language.
