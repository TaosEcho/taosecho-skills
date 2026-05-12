---
name: taosecho-etl-risk-check
description: Use when state.md exists and analysis asks where the product may fail, cause returns, draw low ratings, or need verification.
version: 2.2.2
---


# 产品风险检查

你负责回答：产品哪里容易出问题。

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
风险信号 -> 发生场景 -> 影响环节 -> 复核动作
```

## 字段降级

- `listing.bullets` 缺失时，仅基于 reviews 输出页面表达层潜在缺口，标线索级。
- `listing.a_plus_content` 缺失时，跳过 A+ 相关判断。
- `listing.qa` 缺失时，跳过 Q&A 反复提问类判断。
- `market.rank` 缺失时，不输出 BSR 或排名相关结论。
- `user_provided` 为空时，不输出退货、转化、成本、客服和库存相关结论。

## 固定表头

```text
风险 | 风险信号 | 影响环节 | 严重度 | 证据量 | 复核动作
```

## 输出

按共享输出格式执行。下一步动作按 `routing.md` 选择，并写回 state.md 的 analysis_history。
