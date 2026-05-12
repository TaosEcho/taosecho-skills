# Research Harness

Reference version: 0.5.2

Use for reports, market analysis, technical comparisons, source-backed claims, and synthesis.

## Intake

Ask or infer:

- Research question
- Decision the research should support
- Required source quality
- Geographic/time boundary
- Output format
- Evidence threshold

## Default Track

| Phase | Action | Exit gate |
|---|---|---|
| Scope | Convert question into decision, criteria, and exclusions | Research boundary known |
| Source Map | Identify official, primary, recent, or authoritative sources | Source tiers known |
| Evidence | Gather facts with URLs, dates, and confidence | Claims have sources |
| Synthesis | Group evidence into findings, tradeoffs, and implications | Findings trace to evidence |
| Review | Check contradictions, date drift, and unsupported claims | Gaps marked |
| Handoff | Write report, citations, assumptions, next validation | User can act |

## Source Tiers

| Tier | Examples | Use |
|---|---|---|
| Primary | Official docs, papers, company engineering posts, regulatory pages | Core facts |
| Secondary | Trusted explainers, expert analysis | Interpretation |
| Market signal | Reviews, forums, social, search trends | Demand and sentiment |

## Output

Use:

```markdown
# Research Harness: {topic}

## Decision

## Evidence Table
| Claim | Source | Date | Confidence |
|---|---|---|---|

## Findings

## Implications

## Open Gaps

## Next Validation
```

## Recovery

Save source URLs and notes before synthesis. For long research, maintain `sources.md` and `findings.md` separately.
