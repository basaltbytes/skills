# basaltbytes/skills

Agent Skills published as the `basaltbytes-skills` Claude Code plugin and through the skills CLI. Each directory in `skills/` is one skill. Follow the [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## Skill kinds

- **Generated:** `odoo-backend` and `odoo-frontend`, written from the Odoo documentation in the `sources/` submodules. Each has a `GENERATION.md` that records the source paths and git SHA.
- **Hand-written:** every other skill. Change these only when asked.

`.agents/skills/` contains third-party skills for working on this repo. They are not published. The skills CLI installs them and pins their versions in `skills-lock.json`, so update them with the CLI rather than by hand.

## Generated skills

To write one:

1. Read the docs in `sources/{project}/`. Skip install guides, introductions, and anything an agent already knows from training.
2. Rewrite for an agent: practical patterns, working code, and the reason behind each rule. Keep the skill short and add a reference file only when a topic is too large for `SKILL.md`.
3. Put one concept per file in `references/`, with the category as a file name prefix: `core-`, `features-`, `best-practices-`, `advanced-`, or a new category when none fits.
4. In `SKILL.md`, link each reference from a table and use this frontmatter metadata:

   ```yaml
   metadata:
     author: Philippe L'ATTENTION
     version: "2026.4.22" # date of the last generation
     source: Generated from {source-url}, scripts located at https://github.com/basaltbytes/skills
   ```

   The first line under the frontmatter states the upstream version and the generation date.

5. Record the source paths, git SHA, and date in `GENERATION.md`.

To update one, run `pnpm sources update`. It prints the `git diff` command for each generated skill whose docs changed since the recorded SHA. Change only the affected references, then update the version, the date line, and `GENERATION.md`.

Add a new documentation source with `pnpm sources add <url> --branch <branch>`. Use the branch that matches the version the skill targets, for example `19.0` for Odoo.

## After changing a skill

- Run `pnpm eval:static`.
- When a `name` or `description` changes, update the trigger cases in `evals/skill-trigger-cases.json` (see `evals/README.md`).
- When a skill is added or removed, update the Skills table in `README.md`.
