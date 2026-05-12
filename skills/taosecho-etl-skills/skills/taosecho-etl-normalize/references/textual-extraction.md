# Textual Data Extraction

适用：段落式评论、Q&A、产品描述、用户反馈正文。

## 识别信号

- 含 `⭐` / `★` / `5 star` / `Verified Purchase` 等评论标志。
- 多段自然语言段落。
- 用户说“这是评论”“这是用户反馈”“我贴一批评论”。

## 切分规则

按以下分隔符切分单条记录：

1. 空行（连续两个换行）。
2. `Verified Purchase` / `已验证购买` 标志。
3. 星级标识（`⭐⭐⭐` / `X out of 5`）。
4. 日期标识（`Reviewed on YYYY-MM-DD`）。
5. 用户名标识。

## 字段提取

每条记录尝试提取：

- 评分：`(\d)\s*(?:out of|/)\s*5` / `⭐{1,5}` / `(\d)\s*star`
- 日期：ISO 8601、`Mon DD, YYYY`、`YYYY-MM-DD`
- 评论正文：剩余文本
- 情感分桶：评分 <= 2 → negative，评分 >= 4 → positive，3 星进入 recent

## 样本量评估

按 `source-quality.md` 的 textual 阈值评估等级：线索级 >= 20 条，判断级 >= 60 条 + 评分分布。

## 来源标记

source.type = "textual"

source.detail 写明来源，例如“用户粘贴评论”“客服记录”“问卷反馈”。
