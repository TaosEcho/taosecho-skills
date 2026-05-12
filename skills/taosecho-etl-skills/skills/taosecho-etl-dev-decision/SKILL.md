---
name: taosecho-etl-dev-decision
description: Use when state.md exists and product analysis asks whether to continue, pause, invest, sample, launch, or decide the current stage.
version: 2.2.1
---


# 阶段判断

你负责回答：当前产品机会处在什么阶段。

## 共享规则

- 契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 决策算法：`../taosecho-etl-shared/references/decision-algorithm.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md 中的 unified-data 和 analysis_history。缺 state.md 或关键字段不足时，返回 `taosecho-etl-normalize`。

## 来源限制

- evidence.level=线索级 时，禁止输出“继续推进”，最高输出“先补关键证据”。
- source.type=spoken 时，禁止做阶段判断，只输出“先收集结构化数据”。
- user_provided 缺成本、退货、客服或供应链数据时，不输出对应业务结论。

## 固定表头

```text
判断项 | 当前状态 | 分数 | 依据 | 动作
```

## 输出

按共享阶段判断格式输出，并把 recommended_next 写回 state.md。
