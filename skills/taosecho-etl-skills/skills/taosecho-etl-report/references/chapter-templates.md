# 各章节模板

## 通用章节结构

```text
## {章节标题}

{该 skill 的简要说明，1 句话}

### 结论

（最多 3 条，每条带数据点，来自 state.md analysis_history）

### 数据表

| {该 skill 的固定表头} |
| --- |
| {数据行，来自 state.md analysis_history.key_findings} |

### 关键依据

- {最多 5 条，标注来源类型和样本量}

### 与下一步的关系

（这块怎么影响阶段判断 / 接下来做什么）
```

## skill 与章节对应

| skill | 章节 | 章节标题 |
|---|---|---|
| normalize | 数据基础 | 第 2 章 数据基础 |
| buy-reason | 需求理解 | 3.1 购买原因 |
| usage-scene | 需求理解 | 3.2 使用场景 |
| buy-concern | 需求理解 | 3.3 购买顾虑 |
| competitor-opportunity | 竞品与机会 | 第 4 章 竞品机会 |
| product-definition | 产品要求 | 第 5 章 产品要求 |
| risk-check | 风险与核验 | 6.1 产品风险 |
| validation-plan | 风险与核验 | 6.2 核验清单 |
| page-trust | 页面与运营 | 7.1 Listing 转化 |
| ops-feedback | 页面与运营 | 7.2 运营反馈 |
| dev-decision | 阶段判断详情 | 第 8 章 阶段判断 |

## 未完成 skill 的占位

如果某个 skill 未跑过，对应章节按下面格式生成：

```text
## 3.1 购买原因

该项分析未完成。

如需此章节，请先运行 taosecho-etl-buy-reason 分析。
建议数据：至少 40 条评论字段（structured）或 20 条粘贴文本（textual）。
```

保持章节可追踪。
