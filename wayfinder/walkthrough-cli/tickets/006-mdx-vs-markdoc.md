---
id: 6
title: "MDX vs Markdoc for the walkthrough input format"
type: research
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

Which format should agents author: MDX or Markdoc?

Facts a decision needs:
- Code Hike v1: is it MDX-only? What does its pipeline require (remark plugin, RSC, framework constraints)?
- Markdoc: schema validation quality, React renderer maturity, custom tag ergonomics. Can it host Code-Hike-like code walkthrough components?
- Validation story for MDX: can we give an authoring agent hard errors instead of silent garbage (remark-lint, mdx-analyzer, zod on frontmatter, custom compile checks)?
- Agent authorability: which format do LLMs produce more reliably?

Deliverable: a verdict with the facts and sources that support it.

## Resolution

**Verdict: Markdoc.** Resolved by a research subagent on 2026-08-01.

The decisive reason: Markdoc has built-in, schema-driven validation that turns agent mistakes into precise, machine-readable errors (`tag-undefined`, `attribute-type-invalid`, `attribute-missing-required`, each with line ranges) **before anything renders**. MDX's failure modes are compile crashes on stray `{`/`<` in prose and *silent* pass-through of misspelled component props. Code Hike v1's pipeline is MDX-only, but we only need Code-Hike-*style* UI: the lower-level `codehike/code` API (`highlight()`, `<Pre>`, annotation handlers) is not tied to MDX and can render inside components mapped to validated Markdoc tags via `Markdoc.renderers.react` in a plain Vite SPA.

Key facts:
- `@markdoc/markdoc` 0.5.8 (2026-07-15), ~456k weekly downloads, Stripe-built and dogfooded; React renderer is runtime, client-side, no build-step compilation of content — content stays data, no eval.
- `Markdoc.validate(ast, config)` returns structured errors with ids, line ranges, severity; custom per-tag validators allowed — so "lines 10–40 must exist in file X at ref Y" can be a first-class CLI validation error.
- Authoring surface: `{% diff file="src/foo.ts" from=10 to=40 %}` — declarative key=value, no JS expressions; every mistake is a parse-time validation error. MDX equivalent needs JSX + brace expressions, wrong prop = silent.
- `codehike` 1.1.0 (2026-03-17) is MDX-only as a pipeline (remark plugin); RSC recommended but not required; Vite supported — irrelevant to us at the pipeline level, relevant at the component level.
- No rigorous LLM head-to-head, but the acorn/curly-brace crash class dominates generated-MDX complaints; Markdoc is a CommonMark superset with one extra construct — a strictly smaller syntax surface for a generator.

Risks recorded: Markdoc is pre-1.0 (0.5.x); scrollycoding/spotlight layouts must be reimplemented as custom tags (the `codehike/code` reuse path is exposed API but not a documented standalone use case); rich content as "props" must be modeled as tag body/slots; the LLM-reliability argument is directional — worth a quick eval with the actual authoring agent before v1 locks.

Sources (selection): codehike.org/docs · markdoc.dev/docs/validation · github.com/markdoc/markdoc `src/validator.ts` · redocly.com/learn/markdoc/evaluating-markdoc · stripe.dev/blog/markdoc · npm registry data week ending 2026-07-31.
