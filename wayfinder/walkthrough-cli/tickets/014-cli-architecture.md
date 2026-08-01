---
id: 14
title: "CLI architecture — commands, data flow, static export"
type: grilling
status: closed
assignee: philippelattention
blocked-by: [8]
---

## Question

How is the CLI put together?

To decide: the command set (open, build, check/validate); how the SPA ships inside the CLI package (prebuilt assets vs on-the-fly vite); the server's JSON endpoints (resolved git data, review state read/write); where MDX/Markdoc compilation happens; what the static export contains and which features it drops; error UX when the repo or PR cannot be resolved.

## Resolution

Decided with the human on 2026-08-01, one question at a time.

- **Shipping**: the npm package ships a prebuilt SPA bundle. `open` serves it with `HttpStaticServer` (`spa: true`) from `effect/unstable/http`. No vite at runtime.
- **Compile point**: the CLI server compiles the walkthrough document per request and resolves git data at the same point; a file watcher can push a reload. The path is format-agnostic (Markdoc runtime parse or server-side MDX compile), so it does not pre-empt [Ratify the input format](019-format-ratification.md).
- **Endpoints**: `GET /api/walkthrough` returns one resolved payload — the compiled document with all diffs and code inlined. Review state gets its own small GET/PUT endpoint. The SPA makes one fetch; `build` bakes the same payload.
- **Commands**: `open <file>`, `build <file>`, `check <file>`. `check` validates the schema and confirms every git reference resolves; its exit code is the contract for agents and CI.
- **Static export**: `build` emits one self-contained HTML file — SPA assets inlined, resolved payload baked in. Review state falls back to localStorage; features that need the server drop. Exact fallback semantics stay with [Review-state model](013-review-state-model.md).
- **Error UX**: strict `check` — any unresolved reference fails with file, line, and a fix hint. Soft `open` — it starts when the repo and PR resolve; a stale block renders as an in-app error card with the exact reference; only a dead repo or PR stops the CLI with a clear error.

Narrows [Review-state model](013-review-state-model.md): in served mode, review state persists through the server endpoint (a file the CLI writes). That ticket still decides the file's format, location, committability, and reset semantics.
