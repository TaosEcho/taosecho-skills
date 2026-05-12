# TaosEcho ETL Routing

Normalize is the only data-entry route. Analysis skills read state.md.

| 用户问题 | 目标 skill | 输出 |
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

## Continue Rules

- Missing state.md routes to normalize.
- If normalized data is available and the user already gave a clear goal, continue to the next required skill without asking for confirmation.
- Completed two core analyses routes to stage rough check when the user is exploring.
- Complete-look requests run in segments: buy reason + usage scene, check, concern + competitor + page trust, check.

## Auto-Run Rules

Auto-run is enabled when the user provides usable data and a clear output request in the same turn.

Clear output requests include:

- "完整分析"
- "是否值得做"
- "给开发建议"
- "给我结论"
- "输出报告"
- "分析购买原因 / 场景 / 顾虑 / 竞品机会"

Recommended queues:

| 用户目标 | 自动队列 |
| --- | --- |
| 购买原因 | normalize → buy-reason |
| 是否值得做 / 给开发建议 | normalize → buy-reason → usage-scene → buy-concern → competitor-opportunity → risk-check → dev-decision |
| 完整看一轮 | normalize → buy-reason → usage-scene → rough check → buy-concern → competitor-opportunity → page-trust → validation-plan → dev-decision |
| 输出报告 | normalize → required analysis queue → report |

Auto-run stops when:

- required fields for the next skill are missing
- evidence.level is 线索级 and the next skill would make a stage decision
- user asks to pause, simplify, or switch target

## Empty-Start Rules

When the user says "这个产品" or "这个链接" without a concrete object, ask for the object first.

Fastest path:

```text
给我一个 ASIN、商品链接或产品名就能开始。
```

Fallback paths:

- 20 条以上评论 or 差评
- 竞品表格
- Listing 文案 / 五点 / 页面截图文字
- 退货、广告、客服、成本等运营记录
- 口述产品想法

## Multi-Turn State

Track lightweight interaction state in the current context:

| Signal | State | Behavior |
| --- | --- | --- |
| "简单点"、"太长"、"直接说结论" | response_mode=brief | 后续输出先给 3 行内结论，再给必要证据 |
| 连续追问、催促、质疑边界 | interaction_state=impatient | 先给最短可执行路径，再说明证据边界 |
| 用户换目标 | goal_switched=true | 保留 state.md，按新目标路由 |
| 用户要求完整报告 | report_requested=true | 分析队列完成后进入 taosecho-etl-report |
