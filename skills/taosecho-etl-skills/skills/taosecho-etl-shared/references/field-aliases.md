# Field Aliases

CSV, Excel, tables, and pasted rows map columns to unified-data fields by regex-style aliases.

| 统一字段 | 同义词 |
| --- | --- |
| product.id | asin|ASIN|sku|SKU|product_id|item_id|商品ID|产品ID|tiktok_id|video_id |
| product.title | title|Title|商品名|产品名|标题|product_name |
| product.brand | brand|Brand|品牌 |
| product.category | category|Category|类目|分类 |
| market.price | price|Price|售价|价格|\$|USD|定价 |
| market.rating | rating|Rating|评分|星级|star|stars |
| market.review_count | review[\s_]?count|reviews?|评论数|评价数|Reviews|Rating Count |
| market.rank | bsr|BSR|rank|Rank|排名|类目排名 |
| market.sales_estimate | sales|monthly[\s_]?sales|月销量|estimated[\s_]?sales|Est. Sales |
| reviews.negative | low.star|negative|低星|差评|1[\s-]?star|2[\s-]?star |
| reviews.positive | high.star|positive|好评|5[\s-]?star|4[\s-]?star |
| reviews.recent | recent|latest|最新评论|近期评论 |
| keywords.traffic_terms | traffic[\s_]?term|关键词|流量词|search[\s_]?term|Search Term|Keyword |
| keywords.search_results | top[\s_]?asin|search[\s_]?result|搜索结果|SERP |
| user_provided.cost_structure | cost|成本|COGS|采购价 |
| user_provided.advertising | acos|ACOS|TACoS|CPC|RoAS|ad[\s_]?spend|广告花费|广告|ads |
| user_provided.returns | return.rate|退货率|退货|return reason |
| user_provided.customer_service | customer.service|客服|客诉|售后 |
| user_provided.inventory | inventory|库存|周转 |
| user_provided.sample_feedback | sample|样品|手感|结构反馈 |

Unmatched columns are listed in evidence.gaps and should be clarified with the user.
