---
id: 7
title: "Diff-view React components — survey and pick candidates"
type: research
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

Which React diff-view component(s) should the primitive catalog build on?

Candidates to evaluate: @git-diff-view/react, react-diff-view, react-diff-viewer-continued, Code Hike diff annotations, custom shiki rendering (@shikijs/transformers diff notation).

Criteria: split + unified view, word-level highlights, syntax highlighting consistent with shiki, virtualization or lazy rendering for large diffs, collapsible hunks, React 19 compatibility, maintenance status in 2026, themability to Primer dark.

Deliverable: a ranked verdict with the facts and sources that support it.

## Resolution

**Verdict: build on `@git-diff-view/react` + `@git-diff-view/shiki`; keep `react-diff-view` as fallback; custom shiki renderer is the escape hatch.** Resolved by a research subagent on 2026-08-01.

`@git-diff-view/react` (0.1.7, 2026-07-13, ~80k weekly downloads) is the only candidate purpose-built to replicate GitHub's diff view:
- Split + unified toggle (`DiffModeEnum`), GitHub-identical layout; word-level intra-line emphasis built in.
- GitHub-style expand up/down/all context, built-in GitHub light/dark themes (Primer dark is basically its default dark).
- Widget system (`renderWidgetLine`, `onAddWidgetClick`) that maps directly to inline review comments — useful for review-state UX later.
- Explicit React 19 peer support; `@git-diff-view/shiki` plugs shiki in via `registerHighlighter`.

Fallbacks and rejects:
- `react-diff-view` (3.3.3): mature, 23 KB gzip, best expand-context primitives, but prism/refractor-3 highlighting — shiki consistency needs a custom bridge; GitHub chrome is DIY.
- Custom shiki renderer: only path to exact Primer fidelity + virtualization for huge diffs; costs rebuilding hunk layout, intra-line diff, and expand UX. Escape hatch, not the start.
- `react-diff-viewer-continued`: takes two full texts, not git hunks — structural mismatch despite the highest downloads.
- Code Hike: annotation storytelling, not a diff pane — use it for narrated code, never for the diff view.

Risks recorded: `@git-diff-view` is 0.x with one maintainer; open issue #58 — the lowlight/hljs dep eagerly imports ~870 KB even when shiki is used (330 KB gzip total; acceptable for a locally served SPA, real nonetheless); `@git-diff-view/shiki` pins shiki ^3.x while the app will use shiki 4.x — pass a custom highlighter built on the app's shiki instance through `registerHighlighter`, or accept a dual install; no off-the-shelf virtualization anywhere — large-PR mitigation (lazy per-file mount, collapse-by-default) lives in our app layer.

Sources (selection): github.com/MrWangJustToDo/git-diff-view (README, DiffExpand.tsx, issues #21/#44/#58) · github.com/otakustay/react-diff-view · npm registry + bundlephobia data of 2026-08-01 · codehike.org/docs/code/diff.
