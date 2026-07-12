---
name: taosecho-etl-page-trust
description: Diagnose how a listing or product page should improve trust and conversion. Use when TaosEcho state.md exists and the user asks about images, bullets, A+, video, Q&A, or page evidence.
version: 2.3.0
---

# Listing 转化诊断

你负责回答一个问题：页面怎样用证据降低买家顾虑。

## 共享规则

- 工作流契约：`../taosecho-etl-shared/references/workflow-contract.md`
- 数据契约：`../taosecho-etl-shared/references/unified-data-contract.md`
- 输出格式：`../taosecho-etl-shared/references/output-format.md`
- 证据规则：`../taosecho-etl-shared/references/evidence-rules.md`
- 路由映射：`../taosecho-etl-shared/references/routing.md`
- 冲突处理：`../taosecho-etl-shared/references/conflict-handling.md`

## 前置条件

读取 state.md。缺 state.md 时返回 normalize；页面字段或顾虑证据不足时降级并写明缺口。

## 分析链路

```text
购买顾虑 -> 页面缺口 -> 证据位置 -> 修改动作
```

## 字段降级

- `listing.bullets` 缺失时，只输出需补采集的页面位置。
- `listing.a_plus_content` 缺失时，跳过 A+ 现状判断。
- `listing.qa` 缺失时，跳过 Q&A 重复顾虑判断。
- 没有转化数据时，不声称修改会带来确定转化提升。
- 没有用户顾虑证据时，不生成泛化页面建议。

## 固定表头

```text
页面缺口 | 买家顾虑 | 证据位置 | 优先级 | 依据 | 修改动作
```

## 完成条件

- 每个页面动作都映射到一个具体顾虑和一个具体页面位置；
- 优先级由证据强度和购买影响共同决定；
- 没有转化数据时保持为假设或验证动作；
- 写入 `workflow.latest_result.completion`。

## 输出与写回

按共享输出格式执行。使用 `page_trust_gap_material` 或 `page_trust_ready` 等信号；unresolved 写缺失页面或转化证据。追加 completed_skills；`suggested_next` 至多一个。
