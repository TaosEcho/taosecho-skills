# TaosEcho ETL v2.0 to v2.1 Migration

## What Changes

- 使用相同的 `taosecho-etl-*` skill 名称和目录。
- 所有 `SKILL.md` 版本号为 `2.1.0`。
- normalize 按数据形态识别输入：
  - structured：JSON、API 响应、key:value、已有 state.md
  - tabular：CSV、Excel、Markdown 表格
  - textual：粘贴评论、Q&A、客服文本
  - document：PDF、DOCX
  - spoken：口述指标和描述
- state.md 继续使用 unified-data schema_version `"2.0"`，字段契约保持稳定。

## How to Update Existing Data

1. 保留旧 state.md 时，将 `source.type` 改为形态枚举。
2. 把原始来源品牌、工具名或导出方式写入 `source.detail`。
3. 把退货、广告、成本、客服、库存等业务侧数据放入 `user_provided`。
4. 多形态合并时写 `source.type=mixed`，并在 `source.detail` 列出每个来源形态。

## Example Mapping

| v2.0 source.type | v2.1 source.type | v2.1 source.detail |
| --- | --- | --- |
| platform API data | structured | API response or tool output name |
| CSV / Excel export | tabular | export source and filename |
| pasted reviews | textual | pasted review text |
| PDF / DOCX report | document | filename and file type |
| user description | spoken | user-provided description |

## Operator Note

入口可以提醒用户用已有数据获取工具拉取数据；normalize 接收工具产出的数据后做清洗和字段映射。
