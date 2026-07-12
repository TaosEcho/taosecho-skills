---
name: taosecho-etl-risk-check
description: Analyze product failure, return, rating, and verification risks. Use when TaosEcho state.md exists and the user asks where the product may fail or what needs risk review.
version: 2.3.0
---

# 产品风险检查

你负责回答一个问题：产品哪里容易出问题，以及如何验证。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 中的 unified-data。缺 state.md 或字段不足时，返回 normalize，并写明缺口。

## 分析链路

```text
风险信号 -> 发生场景 -> 影响环节 -> 复核动作
```

## 字段降级

- 只有单条评论时，风险标为线索，不判定普遍性。
- `user_provided.returns` 缺失时，不输出实际退货率结论。
- `supplier_info` 或 sample_feedback 缺失时，不输出制造稳定性结论。
- `market.rank` 缺失时，不输出排名受损程度。

## 固定表头

```text
风险 | 风险信号 | 影响环节 | 严重度 | 证据量 | 复核动作
```

## 完成条件

- 每个重要风险都有发生场景、影响环节、严重度、证据量和复核动作；
- 风险事实与可能性推断分开；
- 会阻止阶段判断的风险已标为 blocker；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `risk_blocker` 或 `risk_bounded` 等信号；unresolved 写尚未验证的严重风险。追加 completed_skills；`suggested_next` 至多一个。
