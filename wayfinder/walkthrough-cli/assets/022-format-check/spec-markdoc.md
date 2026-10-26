# Walkthrough format spec — Markdoc profile (v0-test)

A walkthrough is one `.mdoc` file: YAML frontmatter, then Markdoc content.
Markdoc is CommonMark plus one construct: tags in `{% ... %}`. Standard
markdown (paragraphs, `**bold**`, `` `inline code` ``, headings) works as-is.

## Frontmatter (required)

```yaml
---
title: "Add live planning pool items"
pr: 96
module: acme_planning
---
```

## Tag catalog

### `section` — container for one nav entry

```
{% section id="mental-model" navLabel="Why this PR exists" icon="git-compare" group="Orientation" title="Why this PR exists" %}
...blocks and prose...
{% /section %}
```

Attributes: `id` (string, kebab-case, required), `navLabel` (string, required),
`icon` (one of `list-unordered`, `git-compare`, `git-branch`, `database`,
`beaker`, `shield-lock`; required), `group` (string, required), `title`
(string, required). All other tags live inside a `section`.

### `callout` — colored aside

```
{% callout tone="key" %}
**"Shared pool"** is the team's name for the pile of confirmed-but-unscheduled work.
{% /callout %}
```

`tone` is required: `"key"` (blue, the idea to keep) or `"warn"` (amber, a trap).
The body is rich markdown.

### `flow` — left-to-right arrow strip

```
{% flow steps=["CRM opportunity", "allocation forecast", "quote confirmed", "pool row shows up"] /%}
```

`steps`: array of plain strings, required, 2+ items. Self-closing tag (`/%}`).

### `diff` — thin reference to code in git (no code in the document)

```
{% diff file="addons/acme_planning/models/planning_pool_item.py" from=10 to=40 mark="12-14" /%}
```

`file` (repo-relative path, required), `from` / `to` (integers, required,
`from <= to`), `mark` (optional string like `"12-14"`, lines to highlight).
Self-closing. The CLI pulls the code from git at render time.

### `fields` / `field` — name–type–note table

```
{% fields %}
{% field name="allocation_id" type="Many2one → planning.allocation" %}
The link back to the source allocation.
{% /field %}
{% /fields %}
```

`field`: `name` (required), `type` (required); the body is the note (rich markdown).

### `method` — one method card

```
{% method sig="_planning_placed_hours_by_id(self) -> Dict[int, float]" decorator="@api.depends('slot_ids.state')" %}
Sums the hours of non-cancelled slots per allocation.
{% /method %}
```

`sig` (required), `decorator` (optional). Body = rich markdown.

### `tests` / `test` — test TLDR cards

```
{% tests %}
{% test name="test_remaining_tracks_slots" kind="unit" asserts=["remaining drops when a slot is created", "cancelled slots do not count"] %}
Given a converted allocation of 6 days, when a 2-day slot points at it, then remaining shows 4.
{% /test %}
{% /tests %}
```

`test`: `name` (required), `kind` (required: `"unit"`, `"tour"`, or `"http"`),
`asserts` (array of strings, required, 1+ items). Body = the scenario, rich markdown.

## Authoring pitfalls

- Every non-self-closing tag needs its `{% /name %}` closer, correctly nested.
- Attribute values: strings in double quotes, numbers bare (`from=10`), arrays
  in JSON style (`steps=["a", "b"]`). No JS expressions — values are data.
- Attribute names are exact; `tone`, not `type`. Enum values are exact.
- Prose is plain markdown: braces `{}`, angle brackets, arrows `→` are all safe
  to write directly. Only `{%` starts a tag.
