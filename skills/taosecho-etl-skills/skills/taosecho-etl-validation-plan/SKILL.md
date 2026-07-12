---
name: taosecho-etl-validation-plan
description: Build the next evidence-gathering plan before development, sampling, launch, or investment. Use when TaosEcho state.md exists and the user asks what to verify next.
version: 2.3.0
---

# 下一步确认清单

你负责回答一个问题：当前最影响判断的未知项怎样被验证。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md、evidence.gaps、workflow.latest_result.unresolved 和 analysis_history。缺 state.md 时返回 normalize。

## 分析链路

```text
证据缺口 -> 确认对象 -> 确认方式 -> 通过信号
```

## 字段降级

- 只有线索级输入时，优先设计低成本证据获取，不给阶段结论。
- 缺 user_provided 时，把业务侧数据采集写成具体动作。
- 缺竞品或评论样本时，说明最低样本与来源要求。
- 无法给出可观察通过信号的动作不进入清单。

## 固定表头

```text
确认动作 | 确认对象 | 依据数据 | 确认方式 | 需要材料 | 通过信号
```

## 完成条件

- 每个会改变当前判断的重要 unresolved 都有对应确认动作；
- 每个动作包含对象、方法、材料和可观察通过信号；
- 动作按决策影响和成本排序；
- 清单明确第一项当前动作，而不是把整套清单当作自动队列；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `validation_plan_ready` 或 `decision_blocked_by_evidence` 等信号；unresolved 保留尚无验证方法的缺口。追加 completed_skills；`suggested_next` 至多一个。
