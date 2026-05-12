---
name: taosecho-etl-product-definition
description: Use when state.md exists and analysis asks how to define requirements, specifications, feature priority, or product boundaries.
version: 2.2.1
---


# 产品要求整理

你负责回答：产品应该怎么定义。

## 共享规则

- 契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 中的 unified-data。缺 state.md 或字段不足时，返回 `taosecho-etl-normalize`。

## 分析链路

```text
购买原因 + 场景 + 顾虑 + 竞品缺口 -> 产品要求 -> 优先级
```

## 字段降级

- `listing.bullets` 缺失时，仅基于 reviews 输出页面表达层潜在缺口，标线索级。
- `listing.a_plus_content` 缺失时，跳过 A+ 相关判断。
- `listing.qa` 缺失时，跳过 Q&A 反复提问类判断。
- `market.rank` 缺失时，不输出 BSR 或排名相关结论。
- `user_provided` 为空时，不输出退货、转化、成本、客服和库存相关结论。

## 固定表头

```text
产品要求 | 来源信号 | 适用场景 | 优先级 | 证据量 | 边界说明
```

## 输出

按共享输出格式执行。下一步动作按 `routing.md` 选择，并写回 state.md 的 analysis_history。
