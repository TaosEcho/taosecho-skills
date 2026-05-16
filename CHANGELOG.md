# Changelog

## 2026-05-15

- Added repository and package manifests for public skill metadata.
- Added ADRs for monorepo packaging, normalize-first ETL, host-neutral design, and harness state-first setup.
- Added out-of-scope and release, sensitive-content, maintenance, ETL, and harness checklists.
- Added TaosEcho ETL report Markdown templates and a report validation script.
- Added `scripts/verify-repo.js` and wired it into CI.

## 2026-05-12

- Deleted standalone repositories from GitHub: `taosecho-etl-skills` and `harness-setup-skill`.
- Kept `taosecho-skills` as the single canonical public repository.

## 2026-05-12

- Marked `taosecho-skills` as the canonical public monorepo.
- Archived standalone compatibility repositories: `taosecho-etl-skills` and `harness-setup-skill`.

## 2026-05-12

- Updated Harness Setup skill to `0.5.3`.
- Added a Harness Engineering concept reference and README explanation for harness concept questions.

## 2026-05-12

- Updated TaosEcho ETL skill pack to `2.2.2`.
- Added spoken-product startup, first-turn pressure handling, and compact normalize receipts.
- Expanded ETL verifier for the v2 pressure-test regression cases.

## 2026-05-12

- Updated TaosEcho ETL skill pack to `2.2.1`.
- Added auto-run flow for clear-goal users who provide usable data.
- Improved empty-start and multi-turn brief-mode behavior.
- Expanded ETL verifier from 450 to 461 checks.

## 2026-05-11

- Created the public TaosEcho skills monorepo.
- Added `taosecho-etl-skills` pack version `2.2.0`.
- Added `harness-setup-skill` pack version `0.5.2`.
- Added `scripts/install.sh` for Codex and Claude Code installs.
- Added root README quickstart and package index.
- Added GitHub Actions verification.
- Added root MIT license and contribution guide.
- Added installer options for `--pack`, `--dry-run`, `--list`, and `claude-code`.
