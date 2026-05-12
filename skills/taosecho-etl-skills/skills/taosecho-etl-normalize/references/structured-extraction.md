# Structured Data Extraction

适用：用户提供 JSON、字典、key:value 文本、已规范化数据或 API 响应文本。

## 识别信号

- 含 `{...}` JSON 块。
- 含 `key: value` 多行结构。
- 含 XML 或键值对标记。
- 用户明确说“这是 API 返回”“这是 JSON”。

## 抽取规则

1. 优先解析为 JS 对象 / dict 结构。
2. 按 `field-aliases.md` 做键名同义词匹配。
3. 嵌套对象按层级展开后映射。
4. 数组类字段（reviews、keywords、competitors）保留原列表。

## 字段映射示例

| 原 key | 统一字段 |
|---|---|
| asin / sku / product_id / id | product.id |
| title / product_name / 标题 | product.title |
| price / 价格 / sale_price | market.price |
| reviews / review_list / 评论 | reviews.* |

## 来源标记

source.type = "structured"

来源细节由用户说明写入 source.detail，例如“平台 API 响应”“第三方工具导出”“自建爬虫 JSON”。
