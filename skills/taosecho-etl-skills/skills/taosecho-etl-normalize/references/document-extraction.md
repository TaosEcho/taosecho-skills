# Document Extraction

适用：用户上传 .pdf / .docx 文件。

## 处理流程

1. 调用 `pdf` skill 或 `docx` skill 把文件转为文本。
2. 转文本后按内容特征再判断形态：
   - 含表格结构 → 走 `tabular-extraction.md`
   - 含段落式评论 → 走 `textual-extraction.md`
   - 含 key:value 数据块 → 走 `structured-extraction.md`
3. 大型文档按章节切分，每章节单独走形态识别。

## 章节识别

- Markdown 标题（# / ## / ###）。
- 自然语言“第 X 章”“Section X”。
- 明显空行 + 加粗标题。

## 来源标记

source.type = "document"

source.detail 写明文件名和文件类型，例如“产品调研报告.pdf”“竞品分析.docx”。

## 限制

按 `source-quality.md`，document 最高判断级。
