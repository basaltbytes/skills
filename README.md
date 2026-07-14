# basaltbytes/skills

A small collection of [Agent Skills](https://agentskills.io/home) focused on Odoo 19 development.

## Installation

### Claude Code (plugin marketplace)

Inside Claude Code, add the marketplace and install the plugin that bundles all the skills:

```
/plugin marketplace add basaltbytes/skills
/plugin install basaltbytes-skills@basaltbytes
```

To pull skill updates later, run `/plugin marketplace update basaltbytes`.

### skills CLI (Claude Code, Cursor, Codex, and other agents)

```bash
pnpx skills add basaltbytes/skills --skill='*'
```

or globally:

```bash
pnpx skills add basaltbytes/skills --skill='*' -g
```

Learn more about the CLI usage at [skills](https://github.com/vercel-labs/skills).

## Coding guidelines

[CODING_GUIDELINES.md](CODING_GUIDELINES.md) is the practices charter these skills
distribute slices of — domain integrity (always-valid), functional-core architecture,
error discipline, and hygiene. To put it in force in a project, copy it into the repo
and `@`-import it from `CLAUDE.md`/`AGENTS.md` — a bare link is not auto-loaded, so
agents may never read it.

## Skills

| Skill                                                           | Description                                                                                                                                                                                                      |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [always-valid-domain](skills/always-valid-domain)               | Always-valid domain modeling — entities and value objects validate their own integrity at construction (parse-don't-validate, newtype/branded types, illegal states unrepresentable), with pydantic v2 strict and Zod mappings. |
| [anti-slop-writing](skills/anti-slop-writing)                   | Produces human-sounding text that avoids detectable AI writing patterns — banned vocabulary, structural variety, punctuation discipline, and voice calibration for any writing task.                            |
| [code-walkthrough](skills/code-walkthrough)                     | Generates an interactive, GitHub-styled single-file HTML walkthrough of a PR or code change — model diagram, fields and methods, views, wizards, security, and a files-changed list.                            |
| [odoo](skills/odoo)                                             | Router skill for broad or cross-cutting Odoo 19 work; points agents to the narrower backend, frontend, JavaScript testing, or Owl skill without duplicating references.                                          |
| [odoo-backend](skills/odoo-backend)                             | Odoo 19 backend and server-side work — Python models, ORM, fields, ACLs and record rules, data files, actions, cron jobs, controllers, JSON-2 and legacy RPC integrations, reports, testing, mixins, and performance. |
| [odoo-frontend](skills/odoo-frontend)                           | Odoo 19 frontend and web-client work — runtime architecture, assets, modules, services, registries, hooks, generic components, views, field/view widgets, arch XML, XPath inheritance, and custom-view patterns. |
| [odoo-javascript-testing](skills/odoo-javascript-testing)       | Writing and debugging Odoo 19 frontend JavaScript tests — Hoot, web test helpers, mock server, DOM assertions, mocked services, and async rendering flows.                                                       |
| [owl](skills/owl)                                               | Writing and debugging OWL 2.x (Odoo Web Library) code for the Odoo 14–19 web client — components, QWeb templates, hooks, reactive state, slots, props, refs, error boundaries, and large-list performance.       |
| [public-facing-copy](skills/public-facing-copy)                 | Editing public-facing project text so README files, PR bodies, changelogs, release notes, and package copy stay user-oriented and free of private discussion or reasoning logs.                                |

## License

[MIT](LICENSE.md)
