# Intake State

State files are written at:

```text
tasks/YYYYMMDD-{product.id}/state.md
```

state.md uses the full Unified Data Contract v2.0 shape:

- schema_version
- source
- product
- listing
- market
- reviews
- keywords
- competitors
- user_provided
- evidence
- analysis_history

Analysis skills read state.md and write completed skill records into analysis_history.completed_skills.
