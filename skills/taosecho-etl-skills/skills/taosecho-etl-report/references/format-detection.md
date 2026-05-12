# 格式探测规则

## 探测方式

报告生成完成后，按以下顺序探测 host 环境：

1. 检查当前会话是否暴露 `make-pdf` skill。
2. 检查当前会话是否暴露 `docx` skill。
3. 检查当前会话是否暴露名称含 `markdown-to-html` 或 `md-to-html` 的 skill。

## 询问方式

探测到任一可选格式时，询问用户：

```text
报告已生成 Markdown 文件：tasks/YYYYMMDD-{id}/{mode}-report-{date}.md

检测到当前环境支持以下格式转换：
- PDF（make-pdf 可用）
- DOCX（docx 可用）
- HTML（baoyu-markdown-to-html 可用）

需要同时生成哪种格式？（可多选，或回复“不需要”）
```

未探测到任何可选格式时：

```text
报告已生成 Markdown 文件：tasks/YYYYMMDD-{id}/{mode}-report-{date}.md

如需 PDF / DOCX / HTML 格式，请在 host 中安装对应的转换 skill。
```

## 调用规则

用户选择某种格式后，调用对应 skill：
- PDF -> 调用 make-pdf，传入 Markdown 文件路径。
- DOCX -> 调用 docx，传入 Markdown 文件路径。
- HTML -> 调用 baoyu-markdown-to-html，传入 Markdown 文件路径。

调用失败时告知用户，Markdown 仍可用。

## 文件命名

- Markdown：`{mode}-report-{YYYYMMDD}.md`
- PDF：`{mode}-report-{YYYYMMDD}.pdf`
- DOCX：`{mode}-report-{YYYYMMDD}.docx`
- HTML：`{mode}-report-{YYYYMMDD}.html`

同目录下保留多份格式。

## 禁止项

- 禁止假定任何 skill 必然存在。
- 禁止在 SKILL.md 主流程里硬引用任何外部 skill 名称。
- 禁止在 verify 脚本中要求外部 skill 必须存在。
