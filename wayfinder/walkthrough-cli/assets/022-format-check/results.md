# Empirical check results — agent-authored Markdoc vs MDX

Run 2026-08-01. Materials in this directory: two format specs (equal length,
equal example quality, each with a pitfalls section), three transcription
briefs, eight agent outputs in `out/`, and the two validators in `harness/`.

## Protocol as run

- **Round 1 — transcription.** Six blind, single-shot subagents (3 briefs × 2
  formats). Each saw only its spec and its brief. The briefs carry the natural
  hazard material: `{allocation_id: hours}` dict literals in prose,
  `Dict[int, float]` type hints, inline `<field name="..."/>` XML.
- **Stress round — composition.** Two more blind subagents composed a
  two-section walkthrough from the raw pr-96 content model (603 lines of JS
  with HTML strings) instead of a pre-transcribed brief.
- **Validation.** Markdoc: `Markdoc.parse` + `Markdoc.validate` with a schema
  (~60 declarative lines). MDX: `@mdx-js/mdx` compile + a custom mdast prop
  lint (~90 lines we wrote for this test).
- **Fidelity.** Every output was read against its brief/source for silent
  deviations.
- **Planted-error fixtures.** Because the agent rounds saturated, both
  validators were exercised on fixtures seeding 6 mistakes (bad id pattern,
  bad enum, misspelled attribute, missing required attribute, inverted range,
  unknown tag, prose brace).

## Tally

| Measure | Markdoc | MDX |
| --- | --- | --- |
| Valid on first shot (agent docs) | 4/4 | 4/4 |
| Compile crashes (agent docs) | 0 | 0 |
| Silent deviations (agent docs) | 0 | 0 |
| Repair rounds needed (agent docs) | 0 | 0 |
| Fixture: errors surfaced in round 1 | 6/6, ids + line ranges | 1 (acorn crash masks the rest) |
| Fixture: rounds to surface all errors | 1 | 2 |
| Validator source | library built-in | custom lint we must build & maintain |
| Misspelled prop/attr detection | library (`attribute-undefined`) | only via the custom lint; stock MDX is silent |

## Findings

1. **Authoring reliability does not discriminate at this sample size.** With a
   spec that names the pitfalls, the authoring model produced 8/8 valid,
   faithful documents. The MDX authors escaped prose braces (`\{...\}`) and
   backticked inline XML correctly every time; the famous MDX crash classes
   did not materialize in agent output.
2. **The pipelines differ, not the agents.** When errors exist (fixtures),
   Markdoc lists all of them in one pass with machine-readable ids and line
   ranges, from ~60 lines of declarative schema. The MDX pipeline crashes on
   the first prose brace and hides everything behind it; full reporting took a
   second round and exists only because we wrote a custom lint. Stock MDX
   passes misspelled props and unknown components silently.
3. **Code Hike's MDX-only sugar never came up.** With the thin-reference
   input model the code lives in git, not in the document, so inline
   annotation comments have nothing to annotate; annotations are tag/prop
   attributes in both formats.

**Verdict sentence:** the check removes the empirical objection to the
Markdoc research verdict — agents author both formats equally well when
primed, and every remaining difference (error reporting, validator
ownership, one-highlighter consistency) favors Markdoc.

**Limits:** n=4 documents per format, one authoring model (Claude
Fable 5), specs primed with pitfall warnings, ~1–2 KB documents. An unprimed
or long-document run could still discriminate on authoring; nothing observed
here suggests it would favor MDX.
