---
name: taosecho-etl-ops-feedback
description: Use when state.md exists and analysis asks what operations, ads, ranking, rating, returns, service, traffic, or seller metrics mean.
version: 2.2.0
---


# 运营反馈诊断

你负责回答：运营数据暴露了什么问题。

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
运营信号 -> 指向问题 -> 证据来源 -> 处理动作
```

## 判断等级

- 观察：单一数据点或待补业务字段。
- 异常：同一指标在 2 个以上记录中重复出现。
- 明确异常：运营数据、评论信号或 user_provided 业务数据相互印证。

## 字段降级

- `listing.bullets` 缺失时，仅基于 reviews 输出页面表达层潜在缺口，标线索级。
- `listing.a_plus_content` 缺失时，跳过 A+ 相关判断。
- `listing.qa` 缺失时，跳过 Q&A 反复提问类判断。
- `market.rank` 缺失时，不输出 BSR 或排名相关结论。
- `user_provided` 为空时，不输出退货、转化、成本、客服和库存相关结论。

## 固定表头

```text
运营信号 | 指向问题 | 来源 | 影响环节 | 判断等级 | 处理动作
```

## 输出

按共享输出格式执行。下一步动作按 `routing.md` 选择，并写回 state.md 的 analysis_history。
