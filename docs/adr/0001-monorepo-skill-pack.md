# ADR 0001: Monorepo Skill Pack

## Status

Accepted.

## Context

TaosEcho publishes multiple public skills that share installation, verification, and maintenance rules. Earlier standalone repositories made version tracking and public cleanup harder.

## Decision

Use `TaosEcho/taosecho-skills` as the canonical public monorepo. Keep each package under `skills/{package-name}` with its own README, manifest, examples, and verification flow.

## Consequences

- One clone can install all public TaosEcho skills.
- CI can verify cross-package installation for Codex and Claude Code.
- Standalone package repositories remain retired in favor of the monorepo.
- Package-specific skill folders stay installable as plain skill directories.
