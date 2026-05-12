# Spoken / Descriptive Extraction

适用：用户描述性语句，没有可解析的结构。

## 识别信号

- “评分大概 4.3”“主要差评是稳定性”。
- “类目里有 100 多个竞品”。
- 自然语言陈述，缺少可结构化的数据块。

## 抽取规则

把用户每句话当作 1 条线索级数据：

- 数值（评分、价格、数量）尽量识别为 number。
- 描述性内容写入对应字段的 source.detail。
- 标记 source.type = "spoken"。

## 限制

按 `source-quality.md`，spoken 永远停在线索级。
dev-decision 看到 spoken-only 数据时输出“先收集结构化数据”。

## 提升路径

提示用户：“如果可以提供结构化数据（CSV、评论文本、API 响应），分析等级可以提升到判断级或更高。”
