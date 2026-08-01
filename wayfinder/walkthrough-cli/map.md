---
title: "Walkthrough CLI — from build.mjs to a React SPA review tool"
label: wayfinder:map
created: 2026-08-01
---

# Walkthrough CLI — wayfinder map

> **MIGRATED 2026-08-01.** The canonical map is now GitHub issue
> [basaltbytes/skills#1](https://github.com/basaltbytes/skills/issues/1);
> tickets are its sub-issues (#2–#23). This file and `tickets/` are frozen —
> do not update them. The `assets/` directory stays live; issues link into it.

## Destination

A handoff spec with every design decision locked for **walkthrough**: a TypeScript CLI (effect-smol) plus React SPA (shadcn, tailwind, shiki, Code Hike or equivalent) that renders a thin, agent-authored, PR-committed input file into an interactive GitHub-Primer-dark review app with review-progress state. The map is done when an implementation session can build v1 without making a design decision.

## Notes

- **Tracker**: local markdown. Tickets live in `tickets/NNN-slug.md`. Frontmatter: `id`, `title`, `type` (research | prototype | grilling | task), `status` (open | closed), `assignee` (`none` = unclaimed), `blocked-by` (list of ids). A ticket is on the **frontier** when `status: open`, `assignee: none`, and every `blocked-by` id is closed. Claim = set `assignee`. Resolve = append `## Resolution`, set `status: closed`, add one line to Decisions so far below.
- **Stack preferences** (fixed by the effort's owner): TypeScript, React, shadcn, tailwind, Code Hike, shiki, effect-smol for the CLI. Octicons via `@primer/octicons-react`.
- **Skills to consult**: `frontend-design` for any UI ticket; `writing-great-skills` for the skill-handoff ticket; the current skill lives at `skills/code-walkthrough/` and its output is the visual reference.
- **Writing**: report to the user in ASD-STE100 Simplified Technical English.
- Code starts in `packages/walkthrough-cli` in this repo (see Decisions so far).

## Decisions so far

- [Code home: start in packages/ here, extract later](tickets/001-code-home.md) — `packages/walkthrough-cli` in this repo; extraction is a later mechanical step.
- [Input model: thin reference file, CLI pulls code from git](tickets/002-input-model.md) — the committed file holds narrative + references; the CLI resolves diffs/code at render time.
- [Serving mode: served SPA primary, static export secondary](tickets/003-serving-mode.md) — `walkthrough open` serves the interactive app; `build` exports shareable static HTML.
- [Primitives: generic core + Odoo preset layer](tickets/004-primitives-architecture.md) — domain-neutral core; Odoo widgets composed on top.
- [Visual identity: keep the GitHub Primer dark look](tickets/005-visual-identity.md) — today's HTML output is the visual reference.
- [MDX vs Markdoc for the walkthrough input format](tickets/006-mdx-vs-markdoc.md) — research verdict **Markdoc** (schema-driven parse-time validation beats MDX's silent failures for agent authors); confirmed by the ratification below.
- [effect-smol CLI stack — current state and fit](tickets/008-effect-smol-cli-stack.md) — fits, as `effect@4.0.0-beta.x` (effect-smol merged into Effect v4): `unstable/cli` + `unstable/http` (`HttpStaticServer` with SPA fallback) + `unstable/process`; pin exact beta versions.
- [Diff-view React components — survey and pick candidates](tickets/007-diff-view-components.md) — build on `@git-diff-view/react` + its shiki adapter (GitHub-identical split/unified, word-level, expand-context, React 19); `react-diff-view` as fallback, custom shiki renderer as escape hatch.
- [Code Hike v1 — capabilities and pipeline constraints](tickets/009-code-hike-capabilities.md) — works in a vite SPA (RSC not required), highlighting bakes in at MDX compile time; **but the full feature set is MDX-only**, and it ships its own highlighter, not shiki — feeds the *Ratify the input format* ticket.
- [CLI architecture — commands, data flow, static export](tickets/014-cli-architecture.md) — prebuilt SPA served by `HttpStaticServer`; the server compiles the document per request; one resolved payload endpoint plus review-state GET/PUT; commands `open`/`build`/`check`; `build` emits one self-contained HTML file; strict `check`, soft `open` with in-app error cards.
- [Theming port — Primer dark to tailwind/shadcn tokens](tickets/015-theming-port.md) — lossless: Primer vars fill the shadcn slots plus seven `@theme` domain colors; shiki `github-dark-default` matches the current code colors exactly; octicons 31/31 in `@primer/octicons-react`; all washes derive from tokens at fixed alpha (approved).
- [Distribution — how a reviewer gets and runs the CLI](tickets/017-distribution.md) — public npm as unscoped **`balade`** (bin `balade`) via `npx`; the file carries a schema version and the CLI stays backward-compatible; the run command goes into the PR text, and a local agent session launches it directly.
- [Empirical check: agent-authored walkthroughs in Markdoc vs MDX](tickets/022-format-empirical-check.md) — 8/8 first-shot valid in both formats (tie); on planted errors Markdoc reports all at once from built-in schema while MDX crash-cascades and needs a custom lint; every observed difference favors Markdoc.
- [Ratify the input format: Markdoc validation vs Code Hike's MDX-only features](tickets/019-format-ratification.md) — **Markdoc ratified**; hybrid rejected, annotations are tag attributes only; no Code Hike dependency, shiki-only rendering; the check's v0 tag catalog seeds *Input schema v1*.
- [Input schema v1 — the thin reference model](tickets/010-input-schema.md) — anchor = `pr` + stamped `commit` SHA; `code` refs resolve blob-at-pin plus a CLI-computed change overlay; line ranges only; author-managed section ids; `check` fails on stale-with-overlap; minimal frontmatter with a `meta` map; one-pass errors with fix hints plus `--json`.

## Not yet specified

- Collaboration on review state — sharing progress, notes, or threads between reviewers (hangs on the review-state model).
- CI integration — building or linking a walkthrough automatically when a PR opens (may also fall out of scope).
- Chrome i18n (en/fr) in the SPA — probably folds into the primitive catalog; too small to ticket until then.
- Diagram authoring ergonomics — whether the model/component diagram keeps manual grid placement or gains auto-layout.

## Out of scope

- Implementing the CLI/SPA to completion — that is the follow-up effort once this spec is locked; prototypes here stay throwaway.
- Extracting to a dedicated repo — ruled a later mechanical step by [Code home](tickets/001-code-home.md).
- IDE extensions, GitHub Apps, or hosted services around the walkthroughs.
- Symbol addressing for code references (`symbol="Class.method"`) — ruled out of v1 by [Input schema v1](tickets/010-input-schema.md); line ranges at the pinned SHA are sufficient.
