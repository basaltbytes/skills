---
id: 13
title: "Review-state model — what is tracked and where it lives"
type: grilling
status: open
assignee: none
blocked-by: [10]
---

## Question

What does "reviewed" mean in the UI, and where does the state persist?

To decide: the unit of review (section, file, hunk?); the UI affordances (checkmarks, progress bar, filter to unreviewed); persistence — [CLI architecture](014-cli-architecture.md) decided the CLI server writes the state through a GET/PUT endpoint, and the static export falls back to localStorage; still open: the state file's format and location, gitignored or committable, shareable with teammates; identity and reset semantics when the PR gains new commits.
