---
name: taosecho-etl-dev-decision
description: Make an evidence-bounded product stage decision. Use when TaosEcho state.md exists and the user asks whether to continue, pause, invest, sample, develop, or launch.
version: 2.3.0
---

# 阶段判断

你负责回答一个问题：现有证据允许做出什么阶段动作。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 决策算法：`../taosecho-etl-shared/references/decision-algorithm.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md、workflow.latest_result 和 analysis_history。缺 state.md 时返回 normalize。缺少会改变结论的核心分析时，先返回一个阻塞项，不补造分数。

## 来源限制

- `evidence.level=线索级` 时，最高动作是“补证据”，不输出“继续推进”。
- `source.type=spoken` 时，不做阶段判断，只输出“先收集结构化数据”。
- user_provided 缺成本、退货、客服或供应链数据时，不输出对应业务结论。
- 决策必须使用已完成分析和 state.md 字段，不能仅凭 worker 建议。

## 固定表头

```text
判断项 | 当前状态 | 分数 | 依据 | 动作
```

## 完成条件

- 决策算法要求的判断项均已填入，缺项明确标为阻塞而非默认得分；
- 每个分数都有 evidence_refs 或 completed_skills 依据；
- 阶段动作与 evidence.level 一致；
- 主要风险和会推翻结论的缺口已列出；
- 当前下一步只有一个有边界的动作；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享阶段判断格式输出。满足门槛时使用 `decision_ready`；否则使用 `decision_blocked_by_evidence`。追加 completed_skills；`suggested_next` 至多一个，入口决定 ask、validation-plan、report 或 stop。
