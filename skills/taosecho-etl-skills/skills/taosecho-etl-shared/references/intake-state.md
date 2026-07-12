# Intake State

State files are written at:

```text
tasks/YYYYMMDD-{product.id}/state.md
```

## State Shape

state.md contains the Unified Data Contract v2.0 blocks plus the additive workflow block:

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
- workflow
- analysis_history

`analysis_history.completed_skills` is append-only history. `workflow.latest_result` is the compact result used for the next routing decision.

## Canonical Workflow Block

```yaml
workflow:
  requested_outcome: "判断是否值得做"
  status: routing
  response_mode: standard
  interaction_state: normal
  current_skill: null
  next_action:
    type: skill
    target: taosecho-etl-buy-reason
    reason: "需求依据仍是阶段判断的最大未知项"
  latest_result:
    skill: taosecho-etl-normalize
    level: 判断级
    key_findings:
      - "评论和页面字段可用于需求初判"
    signals:
      - normalized_data_ready
    unresolved:
      - competitor_gap_unproven
    evidence_refs:
      - source
      - reviews
    suggested_next: taosecho-etl-buy-reason
    completion:
      criterion_met: true
      note: "字段、来源、证据等级、冲突和缺口已写入"
  route_history:
    - action: taosecho-etl-normalize
      reason: "收到新原始数据"
      timestamp: "2026-01-01T00:00:00Z"
```

## Read Order

恢复或继续任务时按以下顺序读取：

1. 用户当前消息。
2. `workflow.requested_outcome` 与状态。
3. `workflow.latest_result`。
4. `evidence`。
5. `analysis_history.completed_skills`。
6. 旧版 routing 字段。

用户当前消息可以覆盖旧目标。旧队列不能覆盖新用户意图。

## State Transitions

### Before a skill runs

```yaml
workflow:
  status: running
  current_skill: taosecho-etl-buy-reason
  next_action: null
```

### After a worker finishes

worker 写入 `workflow.latest_result`，追加 `analysis_history.completed_skills`，然后把状态设为 `routing`。入口根据最新结果选择一个 next action。

### Waiting for input

```yaml
workflow:
  status: waiting_for_input
  next_action:
    type: ask
    target: null
    reason: "缺少会改变阶段判断的成本或退货证据"
```

### Outcome satisfied

```yaml
workflow:
  status: satisfied
  next_action:
    type: stop
    target: null
    reason: "用户要求的购买原因分析已完成"
```

## Compatibility

v2.2 state 可能包含：

```yaml
recommended_next:
  auto_run: true
  response_mode: brief
  queue:
    - taosecho-etl-buy-reason
    - taosecho-etl-usage-scene
```

也可能包含 `analysis_history.recommended_next`。

兼容读取规则：

1. 只把第一个旧 route 当作候选。
2. 按当前用户目标、证据和 latest_result 重新检查。
3. 选择结果写入 `workflow.next_action`。
4. 新写入不生成多项 queue。
5. 旧 queue 剩余项目不代表必须完成。

## Spoken Product Start

```yaml
source:
  type: spoken
evidence:
  level: 线索级
workflow:
  requested_outcome: "{用户目标}"
  status: routing
  response_mode: brief
  latest_result:
    skill: taosecho-etl-normalize
    level: 线索级
    signals: [normalized_data_ready]
    unresolved: [structured_evidence_missing]
    completion:
      criterion_met: true
      note: "口述信息已规范化为线索级 state"
```

默认只显示一行数据回执。用户要求查看字段时再展开覆盖表。
