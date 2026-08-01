---
id: 3
title: "Serving mode: served SPA primary, static export secondary"
type: grilling
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

Is the primary consumption mode a locally served SPA, a static single-file HTML build, or both?

## Resolution

`walkthrough open <file>` serves the full interactive SPA locally (live review state, code pulled from git). A `build` command still exports a shareable static HTML for archiving; the static build may degrade features that need a server. Decided in the charting session on 2026-08-01.
