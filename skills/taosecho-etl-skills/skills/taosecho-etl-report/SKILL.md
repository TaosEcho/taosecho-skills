---
name: taosecho-etl-report
description: Generate a complete TaosEcho product-analysis report from state.md and analysis_history. Use for delivery, archival, stakeholder review, or Markdown/PDF/DOCX/HTML output.
version: 2.3.0
---

# TaosEcho ETL 报告生成

你负责把 state.md 中已完成的分析整合成可交付报告。报告阶段只消费 state.md、workflow 和 analysis_history；不重新抓取数据，不补造未完成分析。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 状态文件：`../taosecho-etl-shared/references/intake-state.md`
- 决策算法：`../taosecho-etl-shared/references/decision-algorithm.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 决策摘要：`references/decision-summary.md`
- 报告模板：`references/report-templates.md`
- 格式探测：`references/format-detection.md`
- 章节模板：`references/chapter-templates.md`
- 可复制模板：`templates/brief-report.md`、`templates/standard-report.md`、`templates/full-report.md`
- 报告校验：`scripts/validate-report.js`

## 前置条件

- state.md 存在。
- analysis_history.completed_skills 至少有 1 项。
- 缺 state.md 时返回 `taosecho-etl-normalize`。

## 模式选择

优先使用用户已经表达的信息：

- 明确指定 brief / standard / full → 使用指定模式。
- “简单点、快速过目”或 `workflow.response_mode=brief` → brief。
- 未指定模式 → 选择当前证据允许的最高模式，但默认最高到 standard。
- full 仅在用户明确需要投入前复核、全字段或完整证据缺口时使用。

模式门槛：

- 完成 >=1 项 → brief
- 完成 >=4 项 → standard
- 完成 >=6 项 → full

指定模式未达门槛时，说明缺少哪些分析，并立即生成当前可用的最高模式；只有用户明确要求先补齐时，才返回一个当前缺失分析作为 next action。

## 报告结构

第 1 页是决策摘要。看完必须能回答：做不做、当前第一步、还缺什么。

后续章节按 completed_skills 生成：

- 数据基础（必出）
- 需求理解（buy-reason / usage-scene / buy-concern）
- 竞品与机会（competitor-opportunity）
- 产品要求（product-definition）
- 风险与核验（risk-check / validation-plan）
- 页面与运营（page-trust / ops-feedback）
- 阶段判断（dev-decision）

未完成章节写“该项分析未完成”，并说明建议数据；不生成替代结论。

## 模板与校验

- brief 使用 `templates/brief-report.md`。
- standard 使用 `templates/standard-report.md`。
- full 使用 `templates/full-report.md`。
- 所有 `{placeholder}` 用 state.md 和 analysis_history 的真实字段替换。
- 文件系统可用时运行：

```bash
node scripts/validate-report.js "tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md"
```

校验失败先修复报告。

## 输出格式

默认生成：

```text
tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md
```

Markdown 是保证输出。检测到可用 PDF / DOCX / HTML 转换 skill 且用户需要时，再做可选转换；host 专属能力不是前置依赖。

## 完成条件

- 报告文件已生成；
- 第 1 页包含阶段判断、当前动作、证据缺口和主要风险；
- 所有已完成分析都有对应章节；
- 所有未完成分析都明确标注，没有补造；
- 可用校验已通过；
- 写入 `workflow.latest_result.completion`，并将当前动作设为一个交付后动作或 stop。

## 写回

使用 `report_ready` 或 `report_blocked_by_missing_analysis` 信号。追加 completed_skills；报告已满足用户请求时建议 stop，入口写入 `workflow.status=satisfied`。
