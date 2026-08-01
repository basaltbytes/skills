---
id: 22
title: "Empirical check: agent-authored walkthroughs in Markdoc vs MDX"
type: research
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

Which format does an authoring agent produce more reliably: Markdoc or MDX?

The owner chose data before ratification (see [Ratify the input format](019-format-ratification.md)).
Protocol, as approved:

1. Write one provisional format spec per format. Both specs express the same
   constructs: section, callout, flow, thin `diff` reference, fields table,
   methods, tests. Equal length, equal example quality.
2. Derive three format-neutral content briefs from the pr-96 worked example
   (prose-heavy, structure-heavy, list-heavy). The briefs contain the natural
   hazard material: `{}` dict literals in prose, `Dict[str, float]` type hints,
   inline `<field name="x"/>` XML.
3. Six blind, single-shot authoring subagents: 3 briefs × 2 formats. No
   validator access during authoring.
4. Validate each output with the real pipeline for its format: `Markdoc.parse`
   + `Markdoc.validate` with a schema; `@mdx-js/mdx` compile + a best-effort
   mdast prop lint (the "validation assembled from parts" story).
5. Repair rounds: feed errors back, max 3 rounds, count rounds to clean.
6. Count silent deviations: constructs that pass the pipeline but do not match
   the brief.

Deliverable: an error tally per format (crashes, caught errors, silent
deviations, repair rounds) and a verdict sentence. Assets under
`../assets/022-format-check/`.

## Resolution

Resolved 2026-08-01 by eight blind authoring subagents plus a validation
harness. Full tally, protocol, and limits:
[results.md](../assets/022-format-check/results.md); all eight documents and
both validators are in the same directory.

**Authoring reliability ties.** 8/8 documents (3 transcription briefs + 1
raw-source composition, per format) were valid, faithful, first-shot, zero
repair rounds. Primed by a spec with a pitfalls section, the authoring model
escaped MDX's prose braces and inline XML correctly every time.

**The pipelines differ.** On planted-error fixtures, Markdoc surfaced all 6
seeded mistakes in one pass with error ids and line ranges from ~60 lines of
declarative schema. The MDX pipeline crashed on the first prose brace,
masking the other errors (2 rounds to surface all), and its completeness
exists only because the harness includes a ~90-line custom lint — stock MDX
silently accepts misspelled props and unknown components.

**Code Hike's MDX-only sugar never came up:** with thin references the code
lives in git, so inline annotation comments have nothing to annotate.

**Verdict:** the empirical objection to the Markdoc research verdict is
removed; every observed difference favors Markdoc. Feeds
[Ratify the input format](019-format-ratification.md).
