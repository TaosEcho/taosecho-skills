---
name: taosecho-etl-product-definition
description: Turn product-analysis evidence into traceable requirements and boundaries. Use when TaosEcho state.md exists and the user asks about specifications, features, priority, or product definition.
version: 2.3.0
---

# 产品要求整理

你负责回答一个问题：现有证据支持怎样的产品定义。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 和 analysis_history。缺 state.md 时返回 normalize；关键上游分析缺失时，把它写为 unresolved，不虚构要求。

## 分析链路

```text
购买原因 + 场景 + 顾虑 + 竞品缺口 -> 产品要求 -> 优先级与边界
```

## 字段降级

- 上游分析不完整时，仅输出可追溯到现有证据的要求。
- `competitors.pool` 缺失时，不输出相对竞品优先级。
- `user_provided.supplier_info` 缺失时，不输出制造可行性结论。
- 成本字段缺失时，不输出目标成本或利润结论。

## 固定表头

```text
产品要求 | 来源信号 | 适用场景 | 优先级 | 证据量 | 边界说明
```

## 完成条件

- 每条要求都能追溯到一个或多个来源信号；
- 每条要求都有适用场景、优先级和边界；
- 相互冲突的要求已显式标记并列出取舍依据；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `requirements_traceable` 或 `requirements_conflict` 等信号；unresolved 写未决取舍和缺失可行性证据。追加 completed_skills；`suggested_next` 至多一个。
