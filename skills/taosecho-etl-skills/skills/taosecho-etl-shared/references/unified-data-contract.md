# Unified Data Contract v2.0

This contract is the frozen TaosEcho Product ETL v2 schema. After v2.0, fields may be added, while existing field names and meanings stay stable.

```yaml
schema_version: "2.0"

source:
  type: enum # structured | tabular | textual | document | spoken | mixed
  detail: string
  fetched_at: ISO8601
  origin_files: [string]?

product:
  id: string
  id_type: enum # asin | sku | tiktok_id | walmart_id | manual
  platform: enum # amazon_us | amazon_uk | tiktok_us | walmart_us | unknown | manual
  title: string?
  brand: string?
  category: string?
  variants: [string]?

listing:
  title_full: string?
  bullets: [string]?
  description: string?
  a_plus_content: string?
  qa: [{ question: string, answer: string, votes: int? }]?
  main_image_desc: string?
  scene_images_desc: [string]?
  video_desc: string?

market:
  price: { value: number, currency: string, source: string }?
  rating: { value: number, source: string }?
  review_count: { value: int, source: string }?
  rank: { category: string, position: int, source: string }?
  sales_estimate: { value: number, unit: string, period: string, source: string }?

reviews:
  negative: [{ text: string, rating: number?, date: string?, source: string }]?
  positive: [{ text: string, rating: number?, date: string?, source: string }]?
  recent: [{ text: string, rating: number?, date: string?, source: string }]?
  sample_total: int
  sample_distribution: { 1_star: int, 2_star: int, 3_star: int, 4_star: int, 5_star: int }?

keywords:
  traffic_terms: [{ term: string, volume: int?, position: int?, source: string }]?
  search_results: [{ term: string, top_ids: [string], source: string }]?
  extends: [{ term: string, source: string }]?
  trends: [{ term: string, period: string, signal: string, source: string }]?

competitors:
  pool: [{ id: string, id_type: string, platform: string, key_fields: object }]?
  comparison_notes: string?

user_provided:
  supplier_info: object?
  cost_structure: object?
  advertising: object?
  returns: object?
  customer_service: object?
  inventory: object?
  sample_feedback: object?

evidence:
  level: enum # 不足 | 线索级 | 判断级 | 强判断
  density:
    review_count: int
    keyword_count: int
    competitor_count: int
    user_provided_fields: int
  gaps: [string]
  source_quality_notes: [string]

analysis_history:
  completed_skills: [{ skill: string, level: string, key_findings: [string], timestamp: ISO8601 }]?
  recommended_next: { route: string, reason: string }?
```

## Rules

- Every numeric field under market must include a concrete source.
- source.type=mixed means field-level source names must stay specific.
- Platform is metadata inferred after field mapping; normalize routing uses data form first.
- Platform-specific fields degrade gracefully when absent.
- user_provided is never merged into public platform data.
