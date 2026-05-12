---
name: taosecho-etl-normalize
description: Use when product analysis needs raw user-provided data cleaned into TaosEcho unified-data, regardless of data source or platform.
version: 2.2.2
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
10. 用户已给完整数据且目标明确时，写入 `recommended_next.auto_run=true` 和目标 skill 队列。

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

## 口述产品识别

用户用自然语言描述一个产品想法时，只要包含以下任意两类信息，就视为 spoken 有效输入：

- 品类或产品名
- 价格区间
- 目标人群或使用场景
- 已知卖点、顾虑、痛点或问题

处理规则：

1. 进入 spoken-extraction.md。
2. source.type = "spoken"。
3. evidence.level = "线索级"。
4. product.name 可用用户原话摘要生成。
5. 写入 state.md 后继续输出线索级观察；进入阶段判断前提示关键证据缺口。

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

先追问具体对象，再给最快路径：

```text
你说的是哪个产品？给我一个 ASIN（商品页链接里的 10 位编号）、商品链接、产品名，或一句话产品描述就能开始。

也可以粘贴 20 条以上评论、一个竞品表格、Listing 文案、页面截图文字、退货/广告/客服记录。
```

工具调用由用户自行执行或显式授权。normalize 接收工具产出的数据并做清洗。

## 施压但缺数据

用户要求确定结论、催促判断，且没有具体产品或证据时，输出最短路径：

```text
判断需要产品信息和证据。最快路径：给我产品名、商品链接，或一句话描述产品；我会先给线索级初判。
```

不要输出数据形态列表。

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

默认不要展开完整数据覆盖表。用户给了有效数据时，优先使用一行摘要：

```text
数据已接收（{判断等级}，{来源形态}）。开始分析...
```

用户主动要求“看数据覆盖 / 展开清洗结果 / state.md 字段”时，再输出固定表头。

## 自动推进

当同时满足以下条件时，normalize 输出后继续进入推荐 skill：

- product.id、product.name、listing、reviews、competitors、market、user_provided 任一主数据块可用
- evidence.level 为 判断级 或 强判断，或用户明确接受线索级快速判断
- 用户已经提出明确目标，例如“完整分析”“是否值得做”“给开发建议”“购买原因”“竞品机会”“输出报告”

自动推进时在 state.md 写入：

```yaml
recommended_next:
  auto_run: true
  response_mode: brief | standard
  queue:
    - taosecho-etl-buy-reason
    - taosecho-etl-usage-scene
```

数据只够线索级时，仍可自动输出线索级观察；进入 `taosecho-etl-dev-decision` 前先提示关键证据缺口。
