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
- Completed two core analyses routes to stage rough check.
- Complete-look requests run in segments: buy reason + usage scene, check, concern + competitor + page trust, check.
