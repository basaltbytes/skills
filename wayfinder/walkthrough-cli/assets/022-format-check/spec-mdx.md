# Walkthrough format spec — MDX profile (v0-test)

A walkthrough is one `.mdx` file: YAML frontmatter, then MDX content.
MDX is markdown plus JSX: components in `<Angle>` tags, expressions in `{}`.
Standard markdown (paragraphs, `**bold**`, `` `inline code` ``, headings)
works as-is. The components below are globally provided — no imports needed.

## Frontmatter (required)

```yaml
---
title: "Add live planning pool items"
pr: 96
module: acme_planning
---
```

## Component catalog

### `<Section>` — container for one nav entry

```mdx
<Section id="mental-model" navLabel="Why this PR exists" icon="git-compare" group="Orientation" title="Why this PR exists">

...blocks and prose...

</Section>
```

Props: `id` (string, kebab-case, required), `navLabel` (string, required),
`icon` (one of `"list-unordered"`, `"git-compare"`, `"git-branch"`,
`"database"`, `"beaker"`, `"shield-lock"`; required), `group` (string,
required), `title` (string, required). All other components live inside a
`<Section>`. Keep a blank line after the opening tag and before the closing
tag so inner markdown is parsed.

### `<Callout>` — colored aside

```mdx
<Callout tone="key">
**"Shared pool"** is the team's name for the pile of confirmed-but-unscheduled work.
</Callout>
```

`tone` is required: `"key"` (blue, the idea to keep) or `"warn"` (amber, a trap).
The children are rich markdown.

### `<Flow>` — left-to-right arrow strip

```mdx
<Flow steps={["CRM opportunity", "allocation forecast", "quote confirmed", "pool row shows up"]} />
```

`steps`: array of plain strings, required, 2+ items. Self-closing component.

### `<Diff>` — thin reference to code in git (no code in the document)

```mdx
<Diff file="addons/acme_planning/models/planning_pool_item.py" from={10} to={40} mark="12-14" />
```

`file` (repo-relative path, required), `from` / `to` (numbers in braces,
required, `from <= to`), `mark` (optional string like `"12-14"`, lines to
highlight). Self-closing. The CLI pulls the code from git at render time.

### `<Fields>` / `<Field>` — name–type–note table

```mdx
<Fields>
  <Field name="allocation_id" type="Many2one → planning.allocation">
    The link back to the source allocation.
  </Field>
</Fields>
```

`<Field>`: `name` (required), `type` (required); the children are the note
(rich markdown).

### `<Method>` — one method card

```mdx
<Method sig="_planning_placed_hours_by_id(self) -> Dict[int, float]" decorator="@api.depends('slot_ids.state')">
  Sums the hours of non-cancelled slots per allocation.
</Method>
```

`sig` (required), `decorator` (optional). Children = rich markdown.

### `<Tests>` / `<Test>` — test TLDR cards

```mdx
<Tests>
  <Test name="test_remaining_tracks_slots" kind="unit" asserts={["remaining drops when a slot is created", "cancelled slots do not count"]}>
    Given a converted allocation of 6 days, when a 2-day slot points at it, then remaining shows 4.
  </Test>
</Tests>
```

`<Test>`: `name` (required), `kind` (required: `"unit"`, `"tour"`, or
`"http"`), `asserts` (array of strings in braces, required, 1+ items).
Children = the scenario, rich markdown.

## Authoring pitfalls

- MDX parses `{` and `<` everywhere, including prose. A literal brace in text
  must be escaped (`\{`) or put in backticks; a literal `<field ...>` XML
  snippet in prose must be in backticks or it is parsed as JSX and crashes.
- String props use quotes (`tone="key"`); numbers and arrays use braces
  (`from={10}`, `steps={[...]}`).
- Prop names are exact; `tone`, not `type`. Enum values are exact.
- Component tags must be correctly closed and nested; self-closing components
  end in `/>`.
