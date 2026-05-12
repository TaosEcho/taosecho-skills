---
name: taosecho-etl-normalize
description: Use when product analysis needs raw user-provided data cleaned into TaosEcho unified-data, regardless of data source or platform.
version: 2.2.0
---

# TaosEcho ETL 数据规范层

你负责把用户提供的任意数据清洗成 unified-data schema v2.0。
你只处理用户已经提供的数据，不主动调用任何外部工具或 MCP。
分析 skill 只读 state.md，并从统一字段获取证据。

## 共享规则

- 契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 字段同义词：`../taosecho-etl-shared/references/field-aliases.md`
- 来源等级矩阵：`../taosecho-etl-shared/references/source-quality.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`
- 状态文件：`../taosecho-etl-shared/references/intake-state.md`
- 路由：`../taosecho-etl-shared/references/routing.md`
- 形态抽取规则：
  - `references/structured-extraction.md`
  - `references/tabular-extraction.md`
  - `references/textual-extraction.md`
  - `references/document-extraction.md`
  - `references/spoken-extraction.md`

## 职责

1. 识别用户提供数据的形态。
2. 按对应形态规则抽取原始字段。
3. 按 field-aliases 映射到契约字段。
4. 按 source-quality 评估 evidence.level。
5. 从数据里嗅探 product.platform（后置元数据）。
6. 处理冲突、缺口和来源标记。
7. 输出 unified-data。
8. 写入 `tasks/YYYYMMDD-{product.id}/state.md`。
9. 推荐下一个分析 skill。

## 数据形态识别（5 种）

1. structured：用户提供 JSON、字典、key:value 结构、已规范化 state、API 响应文本
   → structured-extraction.md
2. tabular：CSV、TSV、Excel 内容、Markdown 表格、含 `|...|...|` 或多列分隔符
   → tabular-extraction.md
3. textual：段落式文本，含评论、Q&A、描述、报告正文，可能带星级或评分
   → textual-extraction.md
4. document：上传的 .pdf / .docx 文件
   → document-extraction.md（先转文本再走 tabular、textual 或 structured）
5. spoken：描述性口述语句（“评分大概 4.3”、“主要差评是...”）
   → spoken-extraction.md（永远停在线索级）

无法识别时询问用户：“你的数据是哪种形态？结构化 / 表格 / 文本 / 文档 / 口述？”

## 平台嗅探（后置）

字段映射完成后，从数据特征推断 product.platform：

- product.id 匹配 `B0[A-Z0-9]{8}` → amazon_*
- 数据含 BSR / Buy Box / FBA 字段 → 加强 amazon 推测
- product.id 是纯数字 + 含 video_id / GMV 字段 → tiktok_*
- 数据含 walmart 链接片段 / Walmart Item ID 格式 → walmart_*
- 都不像 → product.platform = unknown

平台是元数据。它只用于下游字段降级判断。

## 多源合并

用户同时给多种形态数据时：

1. 主形态产出主 unified-data。
2. 辅形态填充 user_provided 或补充字段。
3. source.type = "mixed"。
4. source.detail 列出所有形态来源和用户说明。
5. evidence.level 按 source-quality 的 mixed 规则评估。

## 用户没数据时

提示用户提供数据，并列举 5 种形态示例。可选地告知用户：
“如果你有 sorftime / Helium10 / Keepa 等数据获取工具，可以用它们拉取数据后给我清洗。”

工具调用由用户自行执行或显式授权。normalize 接收工具产出的数据并做清洗。

## 输出

```text
数据覆盖：
关键限制：
建议先看：
```

固定表头：

```text
数据项 | 目标量 | 已获取 | 来源形态 | 判断等级
```

`建议先看` 按 routing.md 推荐 1 个分析 skill 和原因。
