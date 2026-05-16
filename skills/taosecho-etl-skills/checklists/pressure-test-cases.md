# TaosEcho ETL Pressure Test Cases

Use after changes to routing, normalize, examples, or output format.

## Cases

| Case | Input Shape | Expected Behavior |
|---|---|---|
| Clear user | Complete data plus explicit goal | Normalize, then auto-run the requested analysis or report. |
| Vague user | Says “this product” | Ask for product name, link, ASIN, pasted data, or short description. |
| Beginner | Does not know ASIN | Explain ASIN once and offer link, product name, or spoken description path. |
| Impatient | Asks for direct conclusion with data | Give a short answer, evidence boundary, and next action. |
| Pressure without data | Demands absolute conclusion with no product | Give the shortest path to provide product info. |
| Multi-turn brief | User asks to simplify | Preserve brief mode in following responses. |

## Pass Criteria

- Clear users are not stopped by unnecessary confirmation after normalize.
- Spoken product descriptions enter normalize as `source.type=spoken`.
- Spoken-only analysis remains `evidence.level=线索级`.
- Pressure without data avoids long data-shape lists.
- Brief mode keeps later outputs short.
