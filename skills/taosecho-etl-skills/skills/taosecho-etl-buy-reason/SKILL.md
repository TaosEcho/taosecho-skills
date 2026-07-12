---
name: taosecho-etl-buy-reason
description: Analyze why buyers purchase and what demand exists. Use when TaosEcho state.md exists and the user asks about purchase motivation, desired outcomes, or demand signals.
version: 2.3.0
---

# 购买原因分析

你负责回答一个问题：买家为什么下单。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 中的 unified-data。缺 state.md 或字段不足时，返回 `taosecho-etl-normalize`，并把具体缺口写入 unresolved。

## 分析链路

```text
原来麻烦 -> 想要结果 -> 证据 -> 产品启发
```

## 字段降级

- `listing.bullets` 缺失时，仅基于 reviews 输出页面表达层潜在缺口，标线索级。
- `listing.a_plus_content` 缺失时，跳过 A+ 相关判断。
- `listing.qa` 缺失时，跳过 Q&A 反复提问类判断。
- `market.rank` 缺失时，不输出 BSR 或排名相关结论。
- `user_provided` 为空时，不输出退货、转化、成本、客服和库存相关结论。

## 固定表头

```text
购买原因 | 原来麻烦 | 想要结果 | 证据量 | 信号强度 | 产品启发
```

## 完成条件

同时满足才算完成：

- 每个重要购买原因都包含原来麻烦、想要结果、证据量/强度和产品启发；
- 每个重要判断都能指向 state.md 证据，或明确标注证据缺口；
- 候选原因已合并去重，冲突信号已保留；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `demand_signal_strong` 或 `demand_signal_unclear` 等信号，把未解决的场景、样本或来源问题写入 unresolved。向 `analysis_history.completed_skills` 追加记录；`suggested_next` 至多一个，由入口重新路由。
