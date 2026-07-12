---
name: taosecho-etl-buy-concern
description: Analyze why buyers hesitate and what low-star feedback reveals. Use when TaosEcho state.md exists and the user asks about purchase concerns, objections, or friction.
version: 2.3.0
---

# 购买顾虑分析

你负责回答一个问题：买家下单前会因为什么犹豫。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 中的 unified-data。缺 state.md 或字段不足时，返回 `taosecho-etl-normalize`，并写明缺口。

## 分析链路

```text
犹豫点 -> 触发证据 -> 影响环节 -> 证明材料
```

## 字段降级

- `listing.bullets` 缺失时，仅基于 reviews 输出页面表达层潜在缺口，标线索级。
- `listing.a_plus_content` 缺失时，跳过 A+ 相关判断。
- `listing.qa` 缺失时，跳过 Q&A 反复提问类判断。
- `market.rank` 缺失时，不输出 BSR 或排名相关结论。
- `user_provided` 为空时，不输出退货、转化、成本、客服和库存相关结论。

## 固定表头

```text
购买顾虑 | 触发原因 | 证据量 | 影响环节 | 信号强度 | 需要补的证明
```

## 完成条件

- 每个重要顾虑都有触发原因、影响环节、证据量/强度和需要补的证明；
- 评论事实、页面缺口和推断分开表达；
- 每个重要顾虑有 evidence_refs 或明确缺口；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `purchase_friction_material` 或 `purchase_friction_low` 等信号；unresolved 写未验证顾虑和缺失证明。追加 completed_skills；`suggested_next` 至多一个。
