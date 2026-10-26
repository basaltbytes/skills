---
id: 2
title: "Input model: thin reference file, CLI pulls code from git"
type: grilling
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

Does the agent-authored input file contain the code excerpts (self-contained, like today's content module), or only narrative plus references (paths, line ranges, PR number) that the CLI resolves from git/gh at render time?

## Resolution

Thin input. The committed file holds narrative and references; the CLI pulls real diffs and code from git/gh when it renders. This keeps the input small enough to commit with the PR and the code always true to the diff. The exact reference schema is ticket [Input schema v1](010-input-schema.md). Decided in the charting session on 2026-08-01.
