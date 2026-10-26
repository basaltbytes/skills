---
id: 10
title: "Input schema v1 — the thin reference model"
type: grilling
status: closed
assignee: philippelattention
blocked-by: [19]
---

## Question

What exactly goes in the committed walkthrough file, and how does the CLI resolve it?

To decide: how the file names the PR/branch/commit range; how a section references files, hunks, and line ranges; how stable section ids work (review state hangs on them); what happens when the PR moves on after the file was committed (staleness rules); frontmatter vs body split; validation errors an authoring agent sees.

## Resolution

Decided with the human on 2026-08-01, one question at a time.

- **Git anchor**: frontmatter pins `pr` plus `commit` — the SHA of the code
  state the walkthrough describes, stamped by the agent before it commits the
  file (a commit cannot contain its own SHA). The CLI resolves every reference
  at that SHA, so rendering stays exact after later pushes. Stale = stamp ≠
  current PR head.
- **Code references**: `{% code file=... from=... to=... mark=... /%}`
  resolves to the blob lines at the pinned SHA **plus a CLI-computed change
  overlay** — the PR diff scoped to that range. The SPA can render the same
  payload plain, change-marked, or as a full split diff; the author never
  writes diff data. Overlay base: the PR base from gh, falling back to
  merge-base with the default branch. The v0 `diff` tag is renamed `code`;
  its rendering variants belong to [Primitive catalog v1](011-primitive-catalog.md).
- **Addressing**: line ranges only in v1 (`1 <= from <= to <= line count`,
  verified against the blob at the pin). Regeneration recounts them —
  mechanical agent work. Symbol addressing is ruled out of v1 (map Out of scope).
- **Section ids**: required author-chosen kebab-case `id` per section, unique
  in the document; any block MAY carry an `id`. Regeneration rule for the
  authoring skill: never rename an existing id. Review state keys on section
  ids in v1; [Review-state model](013-review-state-model.md) decides the rest.
- **Staleness**: `check` fails when stale AND a commit in `stamp..head`
  touches a referenced file; plain staleness is a warning, exit 0; an
  unresolvable reference always fails. `open` always renders at the pin — a
  "head moved by N commits" banner covers staleness; error cards stay reserved
  for unresolvable references, per [CLI architecture](014-cli-architecture.md).
- **Frontmatter**: required `walkthrough` (schema version, per
  [Distribution](017-distribution.md)), `title`, `pr`, `commit`. One optional
  `meta` map carries domain keys (the Odoo preset reads `meta.module`; the SPA
  shows meta entries as header chips). Any other top-level key is a validation
  error. The body holds sections only.
- **Validation surface**: all errors in one pass, each with an error code,
  file:line, and a fix hint — schema errors from Markdoc, git errors
  (`file-unresolvable`, `range-unresolvable`, `stale-overlap`) from the
  resolver. `--json` emits the same list structured; Markdoc's errors are
  already structured, so the flag is nearly free.

Boundary with [Primitive catalog v1](011-primitive-catalog.md): this ticket
locks the envelope — frontmatter, the `section` container and id rules, the
`code` reference, staleness, validation. The block-tag list (callout, flow,
fields, method, tests, …) and the nav model are 011's to decide.

Unblocks [Review-state model](013-review-state-model.md),
[Skill handoff](018-skill-handoff.md), and
[Multi-walkthrough index](020-multi-walkthrough-index.md).
