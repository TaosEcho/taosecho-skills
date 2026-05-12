# Tabular Data Extraction

适用：CSV、TSV、Excel 粘贴内容、Markdown 表格、任何带表头的多列数据。

## 识别信号

- 含 `,` 多列且行数 > 3。
- 含 `\t` 分隔符。
- 含 `|...|...|` Markdown 表格。
- 用户上传 .csv / .xlsx / .xls 文件。
- 用户说“这是 Excel 导出”“这是 CSV”。

## 抽取规则

1. 识别第一行为表头，用户说明无表头时询问列含义。
2. 按 `field-aliases.md` 的正则匹配表头列。
3. 命中列映射到统一字段。
4. 未命中列写入 evidence.gaps，并询问用户列含义。
5. 每行作为一条数据记录。
6. 数值列做基本清洗：去单位符号、千分位逗号和空白字符。

## 多 sheet 处理

Excel 多 sheet 时询问用户：“想分析哪个 sheet？”或“是否所有 sheet 合并？”

## 来源标记

source.type = "tabular"

source.detail 写明数据来源，例如“第三方导出”“卖家业务表”“用户自建 CSV”。
