# Conflict Handling

## Multi-Source Merge

- Public platform fields under listing and market keep the primary source.
- Business-side inputs go into user_provided.
- source.type=mixed records every source in source.detail.
- Conflicting values are displayed side by side and not collapsed into a single number.

## Common Conflicts

| 冲突 | 处理 |
| --- | --- |
| Listing promise vs low-star reviews | 页面承诺风险 |
| High rating plus concentrated negatives | 保留评分，负向进入顾虑和风险 |
| public platform data vs user business data | 平台字段保留主来源，业务字段进入 user_provided，冲突并列展示 |
| Empty reviews | evidence.gaps 补评论或竞品样本 |
