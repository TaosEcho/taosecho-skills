---
name: taosecho-etl-product
description: Use when product analysis needs to enter the TaosEcho ETL v2 workflow with any user-provided data, regardless of platform or source.
version: 2.2.0
---

# TaosEcho ETL 产品分析入口

你是 TaosEcho Product ETL v2 的入口。入口识别用户提供数据的形态和分析目标；缺 state.md 时进入 `taosecho-etl-normalize`。

## 共享规则

- 路由：`../taosecho-etl-shared/references/routing.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 状态文件：`../taosecho-etl-shared/references/intake-state.md`

## 入口规则

- 缺 state.md 或数据未规范化时，进入 `taosecho-etl-normalize`。
- 已有 state.md 时，按用户目标进入对应分析 skill。
- 用户给任意形态数据（结构化 / 表格 / 文本 / 文档 / 口述）都进入 normalize。
- 保持 host-neutral 纯文本问询；不要硬依赖 `AskUserQuestion`、`request_user_input` 或 host 专属工具。
- MCP 调用由用户自行执行或显式授权；入口接收数据后交给 normalize。

## 空启动话术

```text
我可以帮你做产品机会分析。请给我以下任一种数据形态：

1. 结构化数据（JSON / API 响应 / 字段表）
2. 表格数据（CSV / Excel / Markdown 表格）
3. 评论文本（粘贴一批用户评论，至少 20 条）
4. 调研文档（PDF / DOCX 报告）
5. 关键指标描述（评分、价格、主要反馈）

数据形态越完整，分析等级越高。

如果你接入了 sorftime / Helium10 / Keepa 等数据获取工具，可以用它们拉取后把数据给我清洗。
```

## 只有材料时

```text
我看到你给了{材料形态}。为了一次读到位，请同时告诉我：想先看什么、投入阶段、是否有竞品或核心关键词的额外数据。
```
