# Source Boundary Checklist

Use when normalizing or merging product data.

## Source Handling

- Public platform fields keep their source marker.
- User-provided returns, costs, support, and ad records go under `user_provided`.
- Mixed source data uses `source.type=mixed`.
- Conflicts are preserved and displayed side by side.
- Spoken-only data stays clue-level.

## Field Degradation

- Missing listing fields trigger page-trust degradation.
- Missing review counts cap evidence strength.
- Missing competitor data caps competitor-opportunity confidence.
- Missing cost data keeps financial conclusions out of scope.

## Public Examples

- Use placeholder IDs and product names.
- Avoid real product, brand, and business-sensitive details.
