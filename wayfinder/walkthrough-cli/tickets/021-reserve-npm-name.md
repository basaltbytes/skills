---
id: 21
title: "Reserve the balade name on npm"
type: task
status: open
assignee: none
blocked-by: [17]
---

## Question

The name `balade` is free on npm as of 2026-08-01, and [Distribution](017-distribution.md) depends on owning it. Publish a placeholder release to reserve the name before someone else takes it.

To do: confirm which npm account (or org) owns the package; publish a minimal `0.0.1` — correct `name`, a `bin` stub that prints "coming soon", `repository` pointing at `basaltbytes/skills`; enable 2FA on the account. The human must supply npm credentials (`npm login`), so this is HITL; the agent drives the rest. The resolution records the owning account.
