# Source Quality Matrix

Normalize uses this matrix to calculate evidence.level based on data form, not platform.

| 形态 | 可信度系数 | 线索级阈值 | 判断级阈值 | 强判断阈值 |
|---|---:|---|---|---|
| structured（含平台 API、已规范化数据） | 1.0x | 主产品 + 40 条评论字段 | 主产品 + 80 条 或 主+1 竞品 320 条 | 主+3 竞品 + 900 条 + 多源印证 |
| structured（第三方平台导出，如 Helium10 / Keepa / 卖家精灵） | 0.9x | structured 阈值 x 1.1 | structured 阈值 x 1.1 | structured 阈值 x 1.1 |
| tabular（CSV / Excel 导出） | 0.85x | 至少 30 条评论 + 完整字段 | 至少 80 条评论 + 完整字段 | 至少 200 条 + 多平台来源 |
| textual（粘贴评论文本） | 0.7x | 至少 20 条 | 至少 60 条 + 评分分布 | 不允许达到强判断 |
| document（PDF / DOCX 报告） | 0.7x | 报告含明确样本量 | 报告含原始数据 | 不允许达到强判断 |
| spoken（口述描述） | 0.4x | 永远停在线索级 | 不允许 | 不允许 |
| user_provided（业务侧数据，独立块） | 1.0x | 至少 1 张完整表 | 至少 2 个独立时段 | 至少 6 个月数据 |
| mixed（多形态合并） | 取最高 | 按主形态阈值 | 主形态阈值 + 辅形态 >= 1/3 | 多源印证 >= 3 类形态 |

## Hard Rules

- 数据低于线索级阈值 → evidence.level = 不足。
- textual / document / spoken 永远不能达到强判断。
- spoken-only 数据 → dev-decision 输出“先收集结构化数据”。
- 平台信息（amazon / tiktok / walmart）只作为元数据。
