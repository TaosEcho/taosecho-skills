# TaosEcho ETL Skill Pack Changelog

## 2.2.0

- Added the 13th skill: `taosecho-etl-report`.
- Supports brief, standard, and full Markdown reports from state.md and analysis_history.
- Keeps Markdown as the guaranteed output with optional PDF / DOCX / HTML conversion when the host exposes matching skills.
- Adds decision-summary constraints for page 1: basic information, stage decision, six-dimension score, next actions, and key risks.
- Preserves the existing 12 ETL skills, shared contract, decision algorithm, field degradation, and v2.1.1 compliance cleanup.
- Updates the verification script to cover report structure, optional-format boundaries, compliance placeholders, and pack-level version consistency.

## 2.1.1

- Completed compliance cleanup for public sharing.
- Replaced real product identifiers in examples with `SAMPLE_ASIN_A001` and `Sample Product A`.
- Generalized concrete category, device, connection, and structural example wording into abstract product-analysis language.
- Added verification guards for real brand names, real ASIN-like values, sensitive product details, placeholder usage, first-row duplication, and dev-decision field semantics.
- Kept architecture, unified-data contract, routing, decision algorithm, host-neutral behavior, and field degradation unchanged.

## 2.1.0

- 将 normalize 的主流程改为 5 类数据形态：structured、tabular、textual、document、spoken。
- normalize 只清洗用户已经提供的数据，外部数据获取工具作为用户侧可选来源写入 source.detail。
- source.type 从来源品牌枚举调整为形态枚举：structured、tabular、textual、document、spoken、mixed。
- source-quality.md 改为形态质量矩阵，并保留 user_provided 与 mixed 的业务数据规则。
- 新增 5 个形态抽取规则文件：structured、tabular、textual、document、spoken。
- examples 改为 structured-output.md、tabular-output.md、textual-output.md，并替换为 skill-specific 业务样例。
- verify 脚本升级到 392 条检查，覆盖版本一致、形态抽取、example 命名、字段合理性和 Codex/Claude 同步。

## 2.0.0

- 建立 taosecho-etl-* 并行 skill pack。
- 引入 unified-data contract、state.md 持久化、字段降级和 dev-decision 六维评分。
