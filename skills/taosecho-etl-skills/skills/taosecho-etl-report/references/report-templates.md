# 三档报告模板

## brief 模式（2-3 页）

```text
# {产品名} 产品判断简报

## 基本信息
（按 decision-summary.md 第 1 块）

## 阶段判断
（按 decision-summary.md 第 2-3 块）

## 接下来做什么
（按 decision-summary.md 第 4 块）

## 不能忽视的风险
（按 decision-summary.md 第 5 块）

## 关键证据缺口
（如适用，按 decision-summary.md 第 6 块）

## 关键证据摘要
- 列出 1-3 个最重要的数据点
- 来自已完成的核心分析 skill（buy-reason / buy-concern / risk-check 优先）
```

## standard 模式（8-12 页）

```text
第 1 页：决策摘要（按 decision-summary.md 完整 5-6 块）

第 2 章：数据基础
- 数据覆盖表（来自 normalize 的输出）
- 数据形态 + 样本量 + 判断等级

第 3 章：需求理解
- buy-reason 完整表 + 关键依据
- usage-scene 完整表 + 关键依据
- buy-concern 完整表 + 关键依据

第 4 章：竞品与机会
- competitor-opportunity 完整表 + 关键依据

第 5 章：产品要求（如已跑）
- product-definition 完整表 + 边界说明

第 6 章：风险与核验
- risk-check 完整表
- validation-plan 完整表（如已跑）

第 7 章：页面与运营
- page-trust 完整表
- ops-feedback 完整表（如已跑）

第 8 章：阶段判断详情
- dev-decision 完整决策表（含分数列）
- 主要风险
- 详细动作建议
```

## full 模式（15-25 页）

```text
standard 模式所有内容 +

第 9 章：证据缺口完整清单
- evidence.gaps 全部列出
- 每条缺口的补数建议

第 10 章：来源完整性
- 各字段来源标记
- user_provided 数据清单
- 数据可信度备注

附录 A：state.md 完整字段
- 产品基础信息
- listing 全字段
- market 全字段
- 评论分布
- 关键词清单
- 竞品池

附录 B：方法学说明
- 六维评分算法
- 来源等级矩阵
- 字段降级规则

附录 C：分析历史
- analysis_history 完整记录
- 各 skill 完成时间
- key_findings 时间序列
```

## 通用规则

- 章节顺序固定。
- 每章节内部使用各 skill 的固定表头。
- 表格 3-5 行，最多 6 列。
- 每条结论带数据点。
- 未完成的章节标“该项分析未完成，建议先跑 X”。
