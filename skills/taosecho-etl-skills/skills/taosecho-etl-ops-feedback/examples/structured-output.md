# Structured Example (Sample Product A)

source.type: structured
product.id: SAMPLE_ASIN_A001
product.title: Sample Product A

数据表：

| 运营信号 | 指向问题 | 来源 | 影响环节 | 判断等级 | 处理动作 |
| --- | --- | --- | --- | --- | --- |
| 核心词集中 core_use_case / scenario_match | 需求入口清晰 | structured | 流量 | 异常 | 保留核心场景表达 |
| Q&A 数 23 条且重复尺寸/兼容 | 页面信任不足 | structured + user_provided | 转化 | 明确异常 | 加适配清单和兼容图 |
| 低星 Review 集中稳定性 | 产品体验 | structured | 评价 | 明确异常 | 复核连接模块 |
| ACOS 待用户提供 | 广告效率 | user_provided | 广告 | 观察 | 补 ACOS 和搜索词数据 |

关键依据：
- 来源 / 样本：核心信号在多个样本中重复出现。
- 来源 / 样本：Q&A 或业务数据补充了字段解释。
