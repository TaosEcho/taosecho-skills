---
name: taosecho-etl-normalize
description: Normalize raw user-provided product data into TaosEcho unified-data. Use for JSON, tables, pasted text, documents, spoken descriptions, mixed sources, or stale/missing state.md.
version: 2.3.0
---

# TaosEcho ETL 数据规范层

你负责把用户已经提供的任意数据清洗成 unified-data schema v2.0。你不主动调用外部工具或 MCP。下游分析只从 state.md 读取证据。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 字段同义词：`../taosecho-etl-shared/references/field-aliases.md`
- 来源等级矩阵：`../taosecho-etl-shared/references/source-quality.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`
- 状态文件：`../taosecho-etl-shared/references/intake-state.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
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
4. 按 source-quality 评估 `evidence.level`。
5. 在字段映射后嗅探 `product.platform`。
6. 记录冲突、缺口、来源与降级边界。
7. 输出 unified-data。
8. 写入 `tasks/YYYYMMDD-{product.id}/state.md`。
9. 写入 `workflow.latest_result`，说明数据覆盖、证据等级、缺口和完成状态。
10. 根据用户当前目标建议至多一个 next skill；入口复核后写入 `workflow.next_action`。

## 数据形态识别（5 种）

1. structured：JSON、字典、key:value、已规范化 state、API 响应文本
   → `structured-extraction.md`
2. tabular：CSV、TSV、Excel 内容、Markdown 表格或多列分隔文本
   → `tabular-extraction.md`
3. textual：评论、Q&A、描述、报告正文等段落式文本
   → `textual-extraction.md`
4. document：上传的 PDF / DOCX
   → `document-extraction.md`，先转文本再进入 structured、tabular 或 textual
5. spoken：描述性口述语句或自然语言产品想法
   → `spoken-extraction.md`，证据最高为线索级

无法识别时，只问一个问题：

```text
这份材料更接近结构化数据、表格、文本、文档，还是口述描述？
```

## 口述产品识别

自然语言产品描述包含以下任意两类信息时，视为有效 spoken 输入：

- 品类或产品名
- 价格区间
- 目标人群或使用场景
- 已知卖点、顾虑、痛点或问题

处理规则：

1. `source.type = "spoken"`。
2. `evidence.level = "线索级"`。
3. `product.title` 可用用户原话摘要生成；兼容已有 `product.name` 时保留原值。
4. 写入 state.md 后可继续输出线索级观察。
5. 阶段判断前把结构化证据缺口写入 `workflow.latest_result.unresolved`。

## 平台嗅探（后置）

字段映射完成后，从数据特征推断 `product.platform`：

- product.id 匹配 `B0[A-Z0-9]{8}` → amazon_*
- 数据含 BSR / Buy Box / FBA 字段 → 加强 amazon 推测
- product.id 是纯数字且含 video_id / GMV → tiktok_*
- 数据含 Walmart 链接片段或 Walmart Item ID → walmart_*
- 都不像 → unknown

平台只作为元数据和下游字段降级依据。

## 多源合并

用户同时给多种形态数据时：

1. 主形态产出主 unified-data。
2. 辅形态补充字段或写入 user_provided。
3. `source.type = "mixed"`。
4. `source.detail` 列出全部来源形态和用户说明。
5. 字段级来源保持具体。
6. `evidence.level` 按 mixed 规则评估。

## 用户没数据时

```text
你说的是哪个产品？给我一个 ASIN（商品页链接里的 10 位编号）、商品链接、产品名，或一句话产品描述就能开始。

也可以粘贴 20 条以上评论、一个竞品表格、Listing 文案、页面截图文字、退货/广告/客服记录。
```

工具调用由用户自行执行或显式授权。normalize 接收工具结果后做清洗和字段映射。

## 施压但缺数据

```text
判断需要产品信息和证据。最快路径：给我产品名、商品链接，或一句话描述产品；我会先给线索级初判。
```

## 输出

默认使用一行回执：

```text
数据已接收（{判断等级}，{来源形态}）。开始分析...
```

用户要求查看覆盖、清洗结果或 state.md 字段时，再展开：

```text
数据覆盖：
关键限制：
当前下一步：
```

固定表头：

```text
数据项 | 目标量 | 已获取 | 来源形态 | 判断等级
```

## 自动继续

同时满足以下条件时，可在 normalize 后继续一个分析 skill：

- product、listing、reviews、competitors、market、user_provided 任一主数据块可用；
- evidence.level 为判断级或强判断，或用户明确接受线索级快速判断；
- 用户目标清晰。

写入：

```yaml
workflow:
  requested_outcome: "{用户目标}"
  status: routing
  latest_result:
    skill: taosecho-etl-normalize
    level: "{判断等级}"
    key_findings: ["{覆盖摘要}"]
    signals: ["normalized_data_ready"]
    unresolved: ["{关键缺口}"]
    evidence_refs: ["source", "evidence"]
    suggested_next: taosecho-etl-buy-reason
    completion:
      criterion_met: true
      note: "统一字段、来源、证据等级、冲突与缺口已写入"
```

`suggested_next` 至多一个。入口重新检查后写入 `workflow.next_action`。线索级数据可以继续做线索观察，但进入 `taosecho-etl-dev-decision` 前必须停在证据门槛。

## 完成条件

normalize 完成必须同时满足：

- state.md 可读取且符合 unified-data schema；
- 每个已映射字段保留来源；
- evidence.level、gaps 和 source_quality_notes 已写入；
- 冲突已记录而非静默覆盖；
- `workflow.latest_result.completion.criterion_met=true`；
- 只建议一个 next skill，或明确停止/补数。
