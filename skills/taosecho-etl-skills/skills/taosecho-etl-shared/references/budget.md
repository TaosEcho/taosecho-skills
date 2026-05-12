# Data Budget

Normalize has zero built-in external calls. Data retrieval tools are optional user-side helpers; after the user provides their output, normalize classifies the data by shape.

| 场景 | 数据形态 | 目标数据 | normalize 外部调用 |
| --- | --- | --- | ---: |
| 快速判断 | structured 或 textual | 主产品 + 20-60 条评论/反馈 | 0 |
| 标准分析 | structured 或 tabular | 主产品 + 1-3 竞品 + 80-320 条评论/反馈 | 0 |
| 深度投入前分析 | mixed | 主产品 + 3-5 竞品 + 业务侧成本/退货/广告数据 | 0 |
| 口述初看 | spoken | 评分、价格、主要反馈描述 | 0 |

外部工具调用预算由用户侧数据获取流程决定，并记录到 source.detail。
