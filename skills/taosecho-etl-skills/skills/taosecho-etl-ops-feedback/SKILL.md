---
name: taosecho-etl-ops-feedback
description: Diagnose what operations, ads, ranking, rating, returns, service, traffic, or seller metrics reveal. Use when TaosEcho state.md exists and the user asks what operating data means.
version: 2.3.0
---

# 运营反馈诊断

你负责回答一个问题：运营数据暴露了什么可行动异常。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md。缺 state.md 或运营指标没有来源/时间范围时，返回 normalize 或写入补数动作。

## 分析链路

```text
运营信号 -> 指向问题 -> 证据来源 -> 处理动作
```

## 判断等级

- 观察：单一数据点或待补业务字段。
- 异常：同一指标在 2 个以上记录中重复出现，或相对明确基线偏离。
- 明确异常：运营数据、评论信号或 user_provided 业务数据相互印证。

## 字段降级

- 没有时间范围或比较基线时，只能标观察。
- `market.rank` 缺失时，不输出排名变化结论。
- `user_provided` 为空时，不输出退货、广告、成本、客服和库存结论。
- 指标定义不清时，把定义问题写入 unresolved。

## 固定表头

```text
运营信号 | 指向问题 | 来源 | 影响环节 | 判断等级 | 处理动作
```

## 完成条件

- 每个重要信号都有指标定义、来源、时间/基线、影响环节和处理动作；
- 单点与重复异常分级准确；
- 相关性与因果判断分开；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `ops_anomaly_material` 或 `ops_signal_inconclusive` 等信号；unresolved 写缺基线、指标定义或业务字段。追加 completed_skills；`suggested_next` 至多一个。
