---
name: taosecho-etl-competitor-opportunity
description: Analyze competitor weaknesses and differentiation opportunities. Use when TaosEcho state.md exists and the user asks what opportunity remains or how to differentiate.
version: 2.3.0
---

# 竞品机会分析

你负责回答一个问题：竞品暴露了什么可验证缺口。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 中的 unified-data。缺 state.md 或竞品证据不足时，返回 normalize 或写入补数动作。

## 分析链路

```text
竞品表现 -> 用户不满 -> 未满足结果 -> 切入动作
```

## 字段降级

- `competitors.pool` 缺失时，只能输出待验证假设，标线索级。
- `listing.bullets` 缺失时，不比较页面承诺完整性。
- `listing.a_plus_content` 缺失时，跳过 A+ 差异判断。
- `market.rank` 缺失时，不输出排名优势结论。
- `user_provided` 为空时，不输出成本、供应链或运营可行性结论。

## 固定表头

```text
竞品缺口 | 竞品信号 | 用户不满 | 机会类型 | 信号强度 | 切入动作
```

## 完成条件

- 每个机会都同时连接竞品信号、用户不满、未满足结果和切入动作；
- 单个无来源观点不升级为机会结论；
- 机会的可验证条件和冲突证据已写明；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `competitor_gap_supported` 或 `competitor_gap_unproven` 等信号；unresolved 写缺失竞品、样本或可行性证据。追加 completed_skills；`suggested_next` 至多一个。
