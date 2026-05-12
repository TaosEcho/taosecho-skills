# Design Prototype Harness

Reference version: 0.5.3

Use for page design, dashboard prototypes, mobile screens, website drafts, design/prototype tools, and deck-style web presentations.

## Intake

Ask or infer:

- Target user and job-to-be-done
- Surface: design/prototype tool, local app, static HTML, Figma, or existing repo
- Design system or style baseline
- Primary workflow on first screen
- Required assets and media
- Verification viewports

## Default Track

| Phase | Action | Exit gate |
|---|---|---|
| Brief | Define user, use case, first-screen task, constraints | Design target known |
| System | Select design system, layout density, components, assets | Visual rules known |
| Build | Create prototype or modify app | Primary workflow works |
| Inspect | Browser screenshots desktop/mobile, check overlap and text fit | Visual defects listed |
| Iterate | Fix layout, interaction, assets, responsiveness | Screens pass |
| Handoff | Provide URL/path, changed files, screenshots, next action | User can review |

## Prototype Defaults

When a design/prototype tool is available, select the closest project type:

- `web-prototype` for general pages
- `dashboard` for admin/analytics
- `mobile-app` for mobile screens
- `magazine-web-ppt` for deck-style outputs

## Verification Gates

- App or prototype opens locally
- Desktop and mobile screenshots captured
- Text fits containers
- Interactive controls respond
- Visual hierarchy matches domain
- Assets render

## Recovery

Keep design brief, decisions, screenshot paths, and current URL in the harness state file.
