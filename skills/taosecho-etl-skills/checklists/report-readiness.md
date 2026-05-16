# Report Readiness

Use before generating a TaosEcho ETL report.

## Required Inputs

- `state.md` exists.
- `analysis_history.completed_skills` has at least one completed skill.
- `evidence.level` is present.
- `source.type` is present.
- `recommended_next` or decision output exists when available.

## Mode Gates

| Mode | Minimum Evidence |
|---|---|
| brief | One completed analysis skill |
| standard | Four completed analysis skills |
| full | Six completed analysis skills |

## Output Checks

- First page answers decision, next action, and evidence gaps.
- Tables use fixed skill headers.
- Unfinished sections are marked as unfinished.
- Markdown output path follows `tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md`.
- Optional PDF, DOCX, or HTML conversion is asked after Markdown is ready.
