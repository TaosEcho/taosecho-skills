---
name: taosecho-etl-report
description: Use when state.md contains TaosEcho ETL analysis results and the user wants a complete report (Markdown by default, optional PDF/DOCX/HTML) for delivery, archival, or stakeholder review.
version: 2.2.2
---

# TaosEcho ETL 报告生成

你负责把 state.md 里已完成的 TaosEcho 分析整合成完整报告。
只读取 state.md 和 analysis_history；报告生成阶段保持状态驱动。
默认输出 Markdown；其他格式（PDF / DOCX / HTML）按 host 已有 skill 可选转换。

## 共享规则

- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 状态文件：`../taosecho-etl-shared/references/intake-state.md`
- 决策算法：`../taosecho-etl-shared/references/decision-algorithm.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由：`../taosecho-etl-shared/references/routing.md`
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

询问用户（host-neutral 自然语言）：

```text
我可以为你生成产品判断报告。请选择模式：
1. brief：决策摘要 + 关键 3 张表，2-3 页，适合快速过目
2. standard：完整分析 + 阶段判断，8-12 页，适合日常归档
3. full：含证据缺口 + state.md 全字段，15-25 页，适合投入前复核
默认 standard。
```

模式与已完成分析项数的对应关系：
- 完成 >=1 项 -> 可生成 brief
- 完成 >=4 项 -> 可生成 standard
- 完成 >=6 项 -> 可生成 full

未达对应阈值时，告知用户“先跑 X 再生成 Y 模式”，并给出可立即生成的最高模式。

## 报告结构

第 1 页：决策摘要（按 `decision-summary.md` 强约束生成）
- 这是最重要的部分。
- 看完第一页用户必须能直接回答：做不做 / 第一步做什么 / 还缺什么。

后续章节：按已完成 skill 自动生成
- 数据基础（必出）
- 需求理解（buy-reason / usage-scene / buy-concern）
- 竞品与机会（competitor-opportunity）
- 产品要求（product-definition）
- 风险与核验（risk-check / validation-plan）
- 页面与运营（page-trust / ops-feedback）
- 阶段判断（dev-decision）

未完成的章节标“该项分析未完成，建议先跑 X”，保持章节可追踪。

## 模板使用

- brief 模式优先读取 `templates/brief-report.md`。
- standard 模式优先读取 `templates/standard-report.md`。
- full 模式优先读取 `templates/full-report.md`。
- 模板里的 `{placeholder}` 必须用 state.md 和 analysis_history 的真实字段替换。
- 生成 Markdown 后，如文件系统可用，运行：

```bash
node scripts/validate-report.js "tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md"
```

校验失败时先修报告，再交付路径。

## 输出格式

默认产出 Markdown 文件：

```text
tasks/YYYYMMDD-{product.id}/{mode}-report-{date}.md
```

按 `format-detection.md` 探测 host 是否有以下 skill：
- 检测到 `make-pdf` 时，询问是否同时生成 PDF。
- 检测到 `docx` 时，询问是否同时生成 DOCX。
- 检测到 `baoyu-markdown-to-html` 或类似 markdown-to-html skill 时，询问是否同时生成 HTML。

任何外部 skill 都未检测到时，仅产出 Markdown，并在输出里给出 Markdown 文件路径。

## 调用边界

- 报告阶段只消费 state.md。
- 数据获取 MCP、平台工具、问询工具、格式转换 skill 都是可选外部能力。
- 询问用户走 host-neutral 自然语言。
