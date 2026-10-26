---
id: 9
title: "Code Hike v1 — capabilities and pipeline constraints"
type: research
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

What can Code Hike v1 give a walkthrough SPA, and what constraints does it put on our pipeline?

Facts a decision needs:
- Compile model: remark plugin at build time? Does it require RSC or a specific framework, or does it work in a vite React SPA?
- Feature inventory relevant to walkthroughs: annotations, focus, callouts, scrollycoding, tooltips, diff notation, line links.
- shiki integration and version coupling.
- License and maintenance status in 2026.

Deliverable: a verdict — what we can use, and which pipeline constraint each feature implies.

## Resolution

**Verdict: Code Hike v1 works fully in a vite + React SPA — but its full feature set is MDX-only.** Resolved by a research subagent on 2026-08-01.

- RSC is "recommended, not required" (docs verbatim); Docusaurus (non-RSC client React) is an officially maintained template. No official vite template — the remark+recma+`jsx: true` path through `@mdx-js/rollup` needs an early smoke test.
- The big pipeline constraint: without RSC, highlighting runs at MDX compile time — the CLI passes `syntaxHighlighting: { theme }` to `remarkCodeHike`/`recmaCodeHike`, baking a `HighlightedCode` token array and a single theme into compiled JS; components render synchronously via `<Pre code={...} handlers={[...]} />`.
- Feature inventory (all MIT, copy-paste recipes on the `AnnotationHandler` API, none RSC-only): mark, callout, diff notation, line numbers, word wrap, link, filename (stateless); copy button, collapse, tooltip, tabs, focus, token transitions, fold (client, fine in a SPA); scrollycoding/spotlight/slideshow via `codehike/utils/selection` + zod block schemas.
- **Not shiki**: Code Hike pins its own highlighter `@code-hike/lighter` (vscode-oniguruma + tm-grammars). We cannot share the app's shiki instance; two highlighters ship if the SPA also uses shiki. Runtime light/dark switching only via the `github-from-css` CSS-variable theme.
- **Format coupling**: annotations/blocks/layouts are extracted by the MDX remark plugin. From Markdoc, only the lower-level `highlight()` + `<Pre>`/handlers path is reusable, with the CLI injecting annotations programmatically — the authoring sugar (`!mark`, `!diff`, `!!` blocks) is lost. This verdict conflicts with the format verdict of [MDX vs Markdoc](006-mdx-vs-markdoc.md); ratification is [ticket 019](019-format-ratification.md).
- Maintenance: MIT, single maintainer (pomber), slow but alive cadence (1.1.0 on 2026-03-17); polished layout components are paid (DocsKit) but the MIT recipes cover the same ground.

Risks recorded: bus factor; token-array payload inflates compiled JS on big walkthroughs; theme drift vs shiki elsewhere; the rich features are recipes we assemble ourselves (Radix + tailwind).

Sources (selection): codehike.org/docs (+ concepts/code, concepts/annotations) · code-hike/codehike repo (`src/mdx/config.ts`, apps/web annotation handlers) · code-hike/lighter · npm registry 2026-08-01 · docskit.codehike.org.
