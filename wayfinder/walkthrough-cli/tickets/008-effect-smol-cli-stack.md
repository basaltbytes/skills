---
id: 8
title: "effect-smol CLI stack — current state and fit"
type: research
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

What does a CLI built on effect-smol look like in 2026, and does it fit this tool?

Facts a decision needs:
- Current status of effect-smol (npm name, version, relation to Effect v4 — was it merged?).
- CLI layer: does @effect/cli (or an equivalent) run on effect-smol?
- HTTP server: what serves the SPA and its JSON endpoints (git data, review state) on effect-smol?
- File watching and process spawning (vite dev server vs serving prebuilt assets).
- A recommended minimal project setup (packages + versions).

Deliverable: a verdict with the facts and sources that support it.

## Resolution

**Verdict: it fits — but "effect-smol" now means `effect@4.0.0-beta.x`.** Resolved by a research subagent on 2026-08-01.

The effect-smol repo was the staging ground for Effect v4. In mid-July 2026 its history merged into the canonical `Effect-TS/effect` repo (main = v4; v3 lives on the `v3` branch). The code ships on npm as `effect@4.0.0-beta.x` (dist-tag `beta`); an "effect-smol" npm package never existed. Everything this CLI needs is in that one package:

- **CLI**: `effect/unstable/cli` — `Command.make`, `Flag`, `Argument`, `Command.withSubcommands`, `Command.run`. Note: `@effect/cli` (0.77.x) is v3-only — do not mix.
- **HTTP**: `effect/unstable/http` — `HttpRouter` for the JSON endpoints, plus `HttpStaticServer` (new in 4.0) purpose-built for serving a prebuilt SPA: `{ root, index, spa: true }` with SPA fallback, MIME, ETag/304.
- **Spawning git/gh**: `effect/unstable/process` — `ChildProcess` builder with stdout/stderr as Streams.
- **Watching**: top-level `effect/FileSystem` — `watch(path, { recursive })` returns a Stream of tagged events.
- **Node glue**: `@effect/platform-node@4.0.0-beta.x` — `NodeServices.layer` bundles FileSystem/Path/Stdio/Terminal/ChildProcessSpawner; `NodeHttpServer.layer`; `NodeRuntime.runMain`. Bun equivalent exists (`@effect/platform-bun`).

Minimal dependency set: `effect@4.0.0-beta.102` + `@effect/platform-node@4.0.0-beta.102`, both pinned exact.

Risks recorded: everything sits under `unstable/` in a beta that releases every 2–5 days with real API reworks — pin exact, bump deliberately; npm `latest` still resolves to v3 (3.22.x), and most docs/LLM guidance describe v3 APIs — the likeliest setup mistake is mixing v3 packages with v4; `@effect/platform-node` drags an `ioredis` peer dep (dead weight, not a blocker).

Sources (selection): github.com/Effect-TS/effect-smol README ("Effect V4 Has Moved") · effect.website This-Week-in-Effect 2026-07-17 · npm dist-tags checked 2026-08-01 · `packages/effect/src/unstable/{cli,http,process}` and `FileSystem.ts` on Effect-TS/effect main.
