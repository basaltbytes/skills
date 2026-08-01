---
id: 19
title: "Ratify the input format: Markdoc validation vs Code Hike's MDX-only features"
type: grilling
status: closed
assignee: philippelattention
blocked-by: [22]
---

## Question

Two research verdicts collide. [MDX vs Markdoc](006-mdx-vs-markdoc.md) picked **Markdoc**: schema-driven parse-time validation gives an authoring agent hard errors; MDX fails silently or crashes on stray braces. [Code Hike v1 capabilities](009-code-hike-capabilities.md) found the **full Code Hike feature set is MDX-only**: annotations, blocks, and the scrollycoding/spotlight layouts ride the MDX remark pipeline; from Markdoc only the lower-level `highlight()` + `<Pre>`/handlers path survives, with the CLI injecting annotations programmatically.

The human decides the trade:
- **Markdoc** — best-in-class agent validation; we reimplement walkthrough layouts as custom tags and drive `codehike/code` (or plain shiki) ourselves. One highlighter (shiki) everywhere.
- **MDX** — full Code Hike sugar for free; validation assembled from parts (Code Hike's zod block schemas cover structure, not arbitrary props), plus its lighter highlighter next to shiki.
- A hybrid is also on the table: Markdoc for the document, with code-level annotation syntax handled by our CLI at resolve time.

Consider a quick empirical check before deciding: have the actual authoring agent produce three walkthroughs in each format and count the errors.

## Resolution

**Markdoc is ratified as the walkthrough input format.** Decided by the owner
on 2026-08-01, after reviewing the data from the
[empirical check](022-format-empirical-check.md) (run first at the owner's
request).

Why:
- The check removed the only argument for MDX that mattered: authoring
  reliability tied 4/4 vs 4/4, first-shot valid, in both formats.
- The remaining differences all favor Markdoc: 6/6 planted errors reported in
  one pass with ids and line ranges from ~60 lines of built-in schema, versus
  a crash-cascade plus a custom lint we would have to build and maintain.
- One highlighter: shiki everywhere, consistent with the diff-view and
  theming decisions. MDX + Code Hike would ship a second highlighter with a
  theme-drift risk.
- Code Hike's MDX-only authoring sugar is moot under the thin-reference input
  model: the code lives in git, so inline annotation comments have nothing to
  annotate. Annotations are tag attributes in either format.

What this locks:
- The document is Markdoc: CommonMark plus `{% tag %}` constructs, no JS
  expressions; validation is `Markdoc.validate` with a schema; walkthrough
  layouts become custom tags rendered by our React components.
- The **hybrid is rejected**: no second, comment-based annotation syntax.
  Annotations live on tag attributes only.
- We do not depend on Code Hike. `codehike/code` stays available as a
  component-level utility if a primitive ever wants it, but the format and
  the pipeline never require it.
- The v0-test tag catalog, spec, and validator from the check
  (`../assets/022-format-check/`) are the seed material for
  [Input schema v1](010-input-schema.md).

Unblocks [Input schema v1](010-input-schema.md) and
[Primitive catalog v1](011-primitive-catalog.md).
