# Structured Normalize Example

source.type: structured
product.id: SAMPLE_ASIN_A001
product.title: Sample Product A

数据覆盖：

| 数据项 | 目标量 | 已获取 | 来源形态 | 判断等级 |
| --- | --- | --- | --- | --- |
| 产品字段 | title/rating/reviews | title/rating/reviews | structured | 判断级 |
| 评论字段 | 80 条 | 96 条 | structured | 判断级 |
| Q&A 字段 | 10 条 | 23 条 | structured | 判断级 |

关键限制：缺少成本和退货数据。
建议先看：taosecho-etl-buy-reason。
