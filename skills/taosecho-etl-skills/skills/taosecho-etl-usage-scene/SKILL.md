---
name: taosecho-etl-usage-scene
description: Analyze where and how buyers use a product. Use when TaosEcho state.md exists and the user asks about usage scenes, actions, environments, or constraints.
version: 2.3.0
---

# 使用场景分析

你负责回答一个问题：买家在哪里用、怎么用。

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
场景 -> 动作 -> 环境限制 -> 产品要求
```

## 字段降级

- `listing.bullets` 缺失时，仅基于 reviews 输出页面表达层潜在缺口，标线索级。
- `listing.a_plus_content` 缺失时，跳过 A+ 相关判断。
- `listing.qa` 缺失时，跳过 Q&A 反复提问类判断。
- `market.rank` 缺失时，不输出 BSR 或排名相关结论。
- `user_provided` 为空时，不输出退货、转化、成本、客服和库存相关结论。

## 固定表头

```text
使用场景 | 使用动作 | 环境限制 | 证据量 | 信号强度 | 产品影响
```

## 完成条件

- 每个重要场景都有具体动作、环境限制、证据量/强度和产品影响；
- 把相似场景合并，把相互冲突的使用条件分开；
- 每个重要场景有 evidence_refs 或明确缺口；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `use_context_clear` 或 `use_context_unclear` 等信号；unresolved 写缺失环境、动作或样本。追加 completed_skills；`suggested_next` 至多一个，由入口复核。
