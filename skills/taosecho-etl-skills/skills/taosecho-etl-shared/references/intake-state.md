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

## recommended_next

Normalize may write a routing recommendation:

```yaml
recommended_next:
  auto_run: true | false
  response_mode: brief | standard
  queue:
    - taosecho-etl-buy-reason
  reason: "用户目标明确，数据已可分析"
```

`auto_run=true` means the entry skill should continue to the queued analysis skill without an extra confirmation turn.

`response_mode=brief` means downstream skills put the answer first and keep the first block within 3 lines.
