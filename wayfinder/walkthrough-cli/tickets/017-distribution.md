---
id: 17
title: "Distribution — how a reviewer gets and runs the CLI"
type: grilling
status: closed
assignee: philippelattention
blocked-by: [14]
---

## Question

How is the CLI distributed and invoked?

To decide: npm package under which scope (npx/bunx), or a bundled binary; version pinning between a committed walkthrough file and the CLI that renders it; how the agent runs it for the reviewer.

## Resolution

Decided with the human on 2026-08-01, one question at a time.

- **Channel**: public npm registry. The package ships the prebuilt SPA bundle in its tarball; reviewers and agents run it with `npx`/`bunx`. No GitHub-install path, no compiled binaries.
- **Name**: `balade` — unscoped, free on npm as of 2026-08-01, bin `balade`. Chosen for *balade commentée* (a narrated walk), with the *ballade* (narrative poem) wordplay on top. Runners-up, all free: `flaneur`, `parcours`, `survol`, `ronde`. The bare `walkthrough` name is taken. An unscoped free name can be squatted, so reserving it is urgent — see [Reserve the balade name on npm](021-reserve-npm-name.md).
- **Version pinning**: the committed file carries a **schema version** (for example `schema: 1`), never a CLI version. Reviewers run `npx balade@latest`; the CLI renders old schema versions, or it stops with a clear upgrade message. The exact frontmatter shape belongs to [Input schema v1](010-input-schema.md).
- **Handoff**: two paths ship in v1. (1) The authoring skill writes the exact command — `npx balade open <file>` — into the PR description or a PR comment. (2) In a local agent session, the agent runs `balade open` itself and gives the reviewer the localhost URL. Zero-argument discovery stays with [Multi-walkthrough index](020-multi-walkthrough-index.md).

Narrows [Skill handoff](018-skill-handoff.md): authoring must end with the run command posted in the PR text. Naming ripple: `packages/walkthrough-cli` may rename to `packages/balade` at implementation time; that is mechanical, not a new decision.
