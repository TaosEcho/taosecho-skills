# TaosEcho ETL Routing

Normalize is the only raw-data entry route. The router selects one current action, waits for its result, and decides again.

## Direct Intent Map

| 用户问题 | 当前 skill | 完成后应交付 |
| --- | --- | --- |
| 数据来源识别、CSV、文本、PDF、ASIN、TikTok、Walmart | taosecho-etl-normalize | unified-data state.md |
| 为什么买、需求是什么 | taosecho-etl-buy-reason | 购买原因表 |
| 哪里用、怎么用 | taosecho-etl-usage-scene | 使用场景表 |
| 下单前顾虑、差评主题 | taosecho-etl-buy-concern | 购买顾虑表 |
| 竞品缺口、差异化机会 | taosecho-etl-competitor-opportunity | 竞品机会表 |
| 产品规格、功能、边界 | taosecho-etl-product-definition | 产品要求表 |
| 产品风险、退货风险、差评风险 | taosecho-etl-risk-check | 风险表 |
| Listing 转化、页面证据 | taosecho-etl-page-trust | 页面信任证据表 |
| 下一步核验 | taosecho-etl-validation-plan | 核验清单 |
| 运营反馈、广告转化、排名评分 | taosecho-etl-ops-feedback | 运营反馈表 |
| 是否推进、是否投入 | taosecho-etl-dev-decision | 阶段判断 |
| 完整报告、归档、给团队看 | taosecho-etl-report | Markdown 报告 |

## Routing Precedence

按以下优先级选择第一个适用动作：

1. 用户当前消息中明确指定的目标或目标变化。
2. 缺 state.md、新数据到达或数据过期 → normalize。
3. 会让目标结论失效的证据阻塞 → validation-plan 或问一个补数问题。
4. `workflow.latest_result.signals` 与 `unresolved` 指向的动作。
5. `workflow.requested_outcome` 尚未满足的最高信息价值动作。
6. 默认探索并列决胜规则。

每次只写一个 `workflow.next_action`。两个动作同样合理时，只问一个能区分它们的问题。

## Outcome Guidance

| requested_outcome | 当前选择规则 |
| --- | --- |
| 购买原因 / 场景 / 顾虑 / 竞品机会等单项分析 | 选择对应 worker；完成后停止 |
| 是否值得做 / 给开发建议 | 先处理会改变阶段判断的最大未知项；证据门槛满足后才选择 dev-decision |
| 完整看一轮 | 根据最新缺口选择一个未完成核心分析；每项完成后重新路由 |
| 输出报告 | 已有足够已完成分析时选择 report；否则先选择一个最影响报告结论的缺失分析 |

大目标只存为 outcome，不转换为固定队列。

## Default Exploration Tie-Breaker

仅在用户没有指定单项、没有证据阻塞、最新结果也没有明确指向时使用：

1. 需求是否存在不清楚 → buy-reason。
2. 使用环境与动作不清楚 → usage-scene。
3. 下单阻力不清楚 → buy-concern。
4. 差异化依据不清楚且有竞品数据 → competitor-opportunity。
5. 失败与退货风险未界定 → risk-check。
6. 仍有关键未知 → validation-plan。
7. 用户要求判断且证据门槛满足 → dev-decision。
8. 用户要求交付且已有分析可用 → report。

该顺序只是并列决胜规则，不是必须完成的链条。

## Result Signal Map

workers 可使用以下稳定信号；也可增加更具体的同类信号：

| signal / unresolved | 当前候选动作 |
| --- | --- |
| `demand_signal_unclear` | buy-reason 或补评论/搜索证据 |
| `use_context_unclear` | usage-scene |
| `purchase_friction_material` | buy-concern；若用户目标是页面转化则 page-trust |
| `competitor_gap_unproven` | competitor-opportunity 或补竞品数据 |
| `risk_blocker` | validation-plan |
| `ops_anomaly_material` | ops-feedback 或 risk-check，按异常来源选择 |
| `decision_blocked_by_evidence` | validation-plan 或 ask |
| `decision_ready` | dev-decision |
| `report_ready` | report |
| `requested_outcome_satisfied` | stop |

worker 的 `suggested_next` 只提供一个候选，入口拥有最终选择权。

## Auto-Continue Rules

用户在同一轮给出可用数据和明确目标时，可以自动继续：

```text
normalize → one selected analysis → fresh routing decision
```

第二跳前重新检查：

- 当前目标是否已经满足；
- 最新结果是否产生新阻塞；
- evidence.level 是否允许下一结论；
- 用户是否暂停、简化或切换目标；
- 另一项分析是否真的会改变结论。

任何一项要求停止时，写入 ask、stop 或 blocked，而不是继续旧队列。

## Empty-Start Rules

用户只说“这个产品”或“这个链接”但没有具体对象时，先取得对象：

```text
给我一个 ASIN（商品页链接里的 10 位编号）、商品链接、产品名，或一句话产品描述就能开始。
```

可接受的补充材料：

- 20 条以上评论或差评
- 竞品表格
- Listing 文案、五点或页面截图文字
- 退货、广告、客服、成本等运营记录
- 口述产品想法

## First-Turn Pressure Rules

第一轮要求绝对结论且没有具体产品或证据时，选择 ask：

```text
判断需要产品信息和证据。最快路径：给我产品名、商品链接，或一句话描述产品；我会先给线索级初判。
```

## Spoken Product Start

自然语言描述包含品类/产品名、价格区间、目标用户/场景、卖点/顾虑/痛点中的任意两类时，视为有效输入：

```text
product → normalize(source.type=spoken, evidence.level=线索级) → one clue-level analysis → fresh routing decision
```

spoken-only 数据不进入阶段判断。

## Multi-Turn State

| Signal | State | Behavior |
| --- | --- | --- |
| “简单点”“太长”“直接说结论” | workflow.response_mode=brief | 前 3 行先给结论和动作 |
| 连续追问、催促、质疑边界 | workflow.interaction_state=impatient | 先给最短路径，再说明证据边界 |
| 用户换目标 | workflow.requested_outcome 更新 | 保留 state.md，按新目标重路由 |
| 用户要求完整报告 | workflow.requested_outcome=report | report-ready 时进入 report，否则补一个关键分析 |
| 用户说暂停 | workflow.status=paused | 停止自动继续 |
