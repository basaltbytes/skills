---
id: 15
title: "Theming port — Primer dark to tailwind/shadcn tokens"
type: prototype
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

How does the current look translate to the new stack?

Map walkthrough.css (Primer dark palette, UI-kit classes) to tailwind/shadcn design tokens; verify octicons via @primer/octicons-react; pick the shiki theme that matches the current Prism tomorrow look. Produce a small themed sample (a section header, a code block, a file row) to react to.

## Assets

- [Themed sample](../assets/015-theming-sample.html) — section header; code block with line numbers, block highlight, and working collapse; unified and split diff views with word-level marks; file rows; and the full token + wash map. All rendered only through shadcn token names. Code and diff colors are real shiki 4.4.1 output with `github-dark-default`. Octicon paths come from `@primer/octicons` 19.32.0.

## Resolution

The port is lossless. Owner reviewed the sample and approved it, including the wash normalization.

**Token map** (full table lives in the sample):

- Core slots: `--bg`→`--background`, `--panel`→`--card`, `--panel-2`→`--muted`/`--secondary`, `--line`→`--border`/`--input`, `--line-soft`→`--border-soft` (ext), `--txt`→`--foreground`, `--txt-dim`→`--secondary-foreground`, `--txt-mut`→`--muted-foreground`, `--accent`→`--primary`/`--ring`, `--danger`→`--destructive`, `--radius`→`--radius` (6px). shadcn's own `--accent` slot takes `#21262d` (hover wash), not the Primer blue.
- Domain extensions (tailwind `@theme` colors, no shadcn slot): `--color-added` #3fb950, `--color-modified` #d29922, `--color-removed` #f85149, `--color-context` #6e7681, `--color-done` #a371f7, `--color-open` #238636, `--color-accent-muted` #79c0ff.

**Octicons**: `@primer/octicons-react` 19.32.0 exports all 31 icons the current sprite uses (verified programmatically). Plus `unfold` for diff context expansion.

**Shiki theme**: bundled `github-dark-default` — exact match for the hand-coded Prism override in walkthrough.css (same bg #0d1117, fg #e6edf3, and all seven token colors). No custom theme needed.

**Washes (approved decision)**: every translucent tint derives from its token at a fixed alpha instead of the current hand-picked rgba colors — badges `token/12` border `/32`; diff added line `/15` gutter `/30` word `/40`; diff removed line `/12` gutter `/30` word `/40`; hunk row and highlighted code line `bg-primary/10`. Slight visual shift accepted for consistency.

**Mechanisms proven in the sample**: line numbers = CSS counters on shiki `.line` spans; block highlight = shiki transformer adding `.hl` (`bg-primary/10` + 2px inset primary bar); collapse = state class on the block; diff washes map onto `@git-diff-view/react` CSS variables at implementation time.
