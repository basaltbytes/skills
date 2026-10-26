---
id: 18
title: "Skill handoff — rewrite code-walkthrough to author for the CLI"
type: grilling
status: open
assignee: none
blocked-by: [10, 14]
---

## Question

How does the code-walkthrough skill change once the CLI exists?

To decide: the new authoring workflow (agent writes the thin input file, validates with the CLI, runs it for the reviewer); what happens to the current build.mjs pipeline and assets (deprecate, keep as fallback?); migration of the pr-96/pr-93 examples; how the skill's writing-quality rules carry over.
