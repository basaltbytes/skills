/* The resolved payload the CLI would hand the SPA for pr-96:
   Markdoc doc (15-tag catalog, ticket #12) + git resolution (ticket #11),
   flattened to plain data. No HTML anywhere — rich text is inline nodes:
     string                plain text
     { c: "…" }            inline code
     { b: [...] }          bold
     { i: [...] }          italic
     { m: "…" }            mono accent (accent-muted)
     { tag: "…" }          small mono chip
*/

export type Inline =
  | string
  | Inline[]
  | { c: string }
  | { b: Inline[] }
  | { i: Inline[] }
  | { m: string }
  | { tag: string };

const B = (...xs: Inline[]) => ({ b: xs });
const I = (...xs: Inline[]) => ({ i: xs });
const C = (s: string) => ({ c: s });

export const payload = {
  walkthrough: 1,
  title: "Add live planning pool items",
  commit: "9f3c2ad",
  headDistance: 0,
  meta: { module: "acme_planning", lang: "en" },
  pr: {
    number: 96,
    url: "https://github.com/acme-co/planning-suite/pull/96",
    author: "octocat",
    state: "open",
    base: "dev",
    head: "feature/59-shared-pool-remaining-to-schedule",
    commits: 1,
    stats: { files: 21, additions: 1040, deletions: 0 },
  },

  /* CLI-computed from the PR at the pinned commit ({% files /%} + nav statuses) */
  files: [
    { status: "A", path: "addons/acme_planning/models/planning_pool_item.py", ref: "m-pool", add: 166, del: 0 },
    { status: "A", path: "addons/acme_planning/views/planning_pool_item_views.xml", ref: "views", add: 122, del: 0 },
    { status: "A", path: "addons/acme_planning/tests/test_planning_pool_item.py", ref: "tests", add: 281, del: 0 },
    { status: "A", path: "docs/adr/0008-pool-item-derived-lens-consumed-by-slots.md", add: 47, del: 0 },
    { status: "M", path: "addons/acme_planning/models/planning_allocation.py", ref: "m-alloc", add: 78, del: 0 },
    { status: "M", path: "addons/acme_planning/models/planning_slot.py", ref: "m-slot", add: 21, del: 0 },
    { status: "M", path: "addons/acme_planning/models/project_project.py", ref: "m-project", add: 26, del: 0 },
    { status: "M", path: "addons/acme_planning/models/__init__.py", add: 1, del: 0 },
    { status: "M", path: "addons/acme_planning/security/ir.model.access.csv", ref: "security", add: 3, del: 0 },
    { status: "M", path: "addons/acme_planning/security/planning_rules.xml", ref: "security", add: 33, del: 0 },
    { status: "M", path: "addons/acme_planning/views/planning_allocation_views.xml", ref: "views", add: 17, del: 0 },
    { status: "M", path: "addons/acme_planning/views/planning_slot_views.xml", ref: "views", add: 3, del: 0 },
    { status: "M", path: "addons/acme_planning/views/project_project_views.xml", ref: "views", add: 12, del: 0 },
    { status: "M", path: "addons/acme_planning/views/crm_lead_views.xml", ref: "views", add: 4, del: 0 },
    { status: "M", path: "addons/acme_planning/views/acme_planning_views.xml", ref: "views", add: 1, del: 0 },
    { status: "M", path: "addons/acme_planning/__manifest__.py", add: 1, del: 0 },
    { status: "M", path: "addons/acme_planning/tests/__init__.py", add: 1, del: 0 },
    { status: "M", path: "addons/acme_planning/readme/USAGE.md", add: 14, del: 0 },
    { status: "M", path: "addons/acme_planning/i18n/fr.po", ref: "i18n", add: 101, del: 0 },
    { status: "M", path: "addons/acme_planning/i18n/acme_planning.pot", ref: "i18n", add: 100, del: 0 },
    { status: "M", path: "CONTEXT.md", add: 8, del: 0 },
  ],

  /* nav ships as plain data — model B, a nested tree (ticket #12) */
  nav: [
    {
      kind: "group", label: "Orientation",
      children: [
        { kind: "section", label: "Overview", icon: "list-unordered", ref: "overview" },
        { kind: "section", label: "Why this PR exists", icon: "git-compare", ref: "mental-model" },
        { kind: "section", label: "Model map", icon: "git-branch", ref: "map" },
      ],
    },
    {
      kind: "group", label: "Models",
      children: [
        { kind: "file", label: "planning_pool_item.py", ref: "m-pool", status: "A" },
        { kind: "file", label: "planning_allocation.py", ref: "m-alloc", status: "M" },
        { kind: "file", label: "planning_slot.py", ref: "m-slot", status: "M" },
        { kind: "file", label: "project_project.py", ref: "m-project", status: "M" },
      ],
    },
    {
      kind: "group", label: "Surface",
      children: [
        { kind: "section", label: "Views & intent", icon: "table", ref: "views" },
        { kind: "section", label: "Wizards", icon: "gear", ref: "wizards" },
        { kind: "section", label: "Security", icon: "shield-lock", ref: "security" },
      ],
    },
    {
      kind: "group", label: "Quality",
      children: [
        { kind: "section", label: "Tests", icon: "beaker", ref: "tests" },
        { kind: "section", label: "Translations", icon: "globe", ref: "i18n" },
      ],
    },
    {
      kind: "group", label: "Deep dive",
      children: [
        { kind: "section", label: "Patterns", icon: "light-bulb", ref: "patterns" },
        { kind: "section", label: "Files changed", icon: "file-diff", ref: "files" },
      ],
    },
  ],

  sections: [
    /* ---------------- overview ---------------- */
    {
      id: "overview", title: "Overview", icon: "list-unordered",
      blocks: [
        { b: "md", nodes: [{ p: [
          "Adds ", C("planning.pool.item"), ", a read-only SQL-view lens over active ",
          B("Converted"), " allocations. Each pool item keeps allocation grain and exposes ",
          B("total"), ", ", B("already planned"), ", and ", B("remaining"),
          " charge from the source allocation plus its non-cancelled linked ",
          C("planning.slot"), " rows. Closes #59.",
        ] }] },
        { b: "cards", cols: 3, items: [
          { icon: "database", title: "One new model", body: [[
            C("planning.pool.item"), " — an ", C("_auto=False"),
            " SQL view. No new table, no second copy of the charge.",
          ]] },
          { icon: "link", title: "One new link", body: [[
            C("planning.slot.allocation_id"), " lets a shift ", I("consume"),
            " a source allocation. That link is the whole engine.",
          ]] },
          { icon: "graph", title: "Derived readings", body: [[
            "total / placed / remaining are ", B("computed"),
            " on the fly from linked slots — never stored, never decremented.",
          ]] },
        ] },
      ],
    },

    /* ---------------- why this PR exists ---------------- */
    {
      id: "mental-model", title: "Why this PR exists", icon: "git-compare",
      blocks: [
        { b: "md", nodes: [
          { p: ["Reviewing this with a queue behind you? The diff is wider than the idea. Here's the idea."] },
          { p: [
            "When a quote is confirmed, the workload behind it becomes real but unscheduled. A line might read ",
            I("Dana Lopez owes Project Atlas six days of site surveys in March 2027"),
            ": agreed and sold, sitting on zero calendars. Someone, usually the manager, still has to drop those days onto actual dates, and until this PR no screen told them how much of that confirmed work was still waiting for one.",
          ] },
        ] },
        { b: "callout", tone: "key", body: [
          B("“Shared pool”"), " is the team’s name for it: the pile of confirmed-but-unscheduled work. Open a confirmed project, click ",
          B("Remaining to Schedule"), ", and you get one row per chunk of it: ",
          { m: "Dana Lopez · Project Atlas · March 2027 · 6 d total · 4 placed · 2 left" },
          ". The planner works that list down to zero. (PRD: EF-CON-3, EF-PLN-3.)",
        ] },
        { b: "md", nodes: [
          { h: "The one thing to check the rest of the diff against" },
          { p: [
            "The pool stores none of those numbers. “2 left” isn't a column that gets decremented when a shift appears; it's ",
            C("max(total − placed, 0)"),
            ", recomputed the instant you read it, where ", C("placed"),
            " is just the summed hours of every shift pointing back at that same confirmed allocation. So ",
            C("planning.pool.item"),
            " is a SQL view, a saved query over the allocations, not a table of its own. Create a shift and the remaining drops. Resize it, cancel it, delete it, hand it to a different allocation, and the figure tracks it every time.",
          ] },
        ] },
        { b: "flow", steps: [
          { body: ["CRM opportunity"] },
          { body: ["allocation"], tag: "forecast" },
          { body: ["quote confirmed"], tag: "converted" },
          { body: ["🟢 pool row shows up"] },
          { body: ["planner places shifts"] },
          { body: ["2 left → 0"] },
        ] },
        { b: "md", nodes: [
          { h: "What it deliberately doesn't do" },
          { p: [
            "Nothing here generates shifts for you. That’s a deliberate rule, not a missing feature: never bulk-create dated shifts without a human deciding (EF-CON-3). For now a planner sets ",
            B("Source Allocation"),
            " on a shift by hand, and that one link is the whole engine. The generation wizard is later, in #62; when it ships it must push slots through this exact link instead of inventing a second way to drain the pool.",
          ] },
        ] },
      ],
    },

    /* ---------------- model map ---------------- */
    {
      id: "map", title: "Model map", icon: "git-branch",
      blocks: [
        { b: "diagram",
          intro: [
            "An object-diagram view (UML-ish, not strict). ", B("Click a box"),
            " to jump to its detail card. ", B("Hover a box"), " to light up only its relationships.",
          ],
          hint: [
            "↳ The thick green arrow ", B("slot → allocation"),
            " is the engine of this PR. Everything else reads off it.",
          ],
          nodes: [
            { id: "n-crm", model: "crm.lead", nlabel: "Opportunity", change: "ctx", ref: "m-alloc", col: 1, row: 1,
              compartments: [{ label: "context", rows: [[{ m: "type" }, " = opportunity"]] }] },
            { id: "n-project", model: "project.project", change: "mod", badge: "mod", ref: "m-project", col: 3, row: 1,
              compartments: [
                { label: "+ field", rows: [[{ m: "planning_pool_item_count" }]] },
                { label: "+ method", rows: [[{ m: "action_open_planning_pool_items()" }]] },
              ] },
            { id: "n-alloc", model: "planning.allocation", change: "mod", badge: "hub", ref: "m-alloc", col: 2, row: 2,
              compartments: [
                { label: "+ derived fields", rows: [[{ m: "planned_* · remaining_*" }], [{ m: "planning_slot_ids" }, " O2m"]] },
                { label: "+ method", rows: [[{ m: "_planning_placed_hours_by_id()" }]] },
              ] },
            { id: "n-pool", model: "planning.pool.item", change: "new", badge: "new", ref: "m-pool", col: 3, row: 2,
              compartments: [
                { label: "SQL view · _auto = False", rows: [[{ m: "allocation_id" }, " · total"], [{ m: "placed" }, " · remaining"]] },
                { label: "init() → CREATE VIEW", rows: [] },
              ] },
            { id: "n-slot", model: "planning.slot", change: "mod", badge: "mod", ref: "m-slot", col: 2, row: 3,
              compartments: [
                { label: "+ field (the link)", rows: [[{ m: "allocation_id" }, " M2o → allocation"]] },
                { label: "+ constraint", rows: [[{ m: "_check_source_allocation_is_confirmed" }]] },
              ] },
          ],
          edges: [
            { from: "n-crm", to: "n-alloc", kind: "ctx", label: "opportunity_id · M2o" },
            { from: "n-alloc", to: "n-pool", kind: "derived", label: "SQL view · converted+active" },
            { from: "n-slot", to: "n-alloc", kind: "new", label: "allocation_id ↔ planning_slot_ids", thick: true },
            { from: "n-project", to: "n-pool", kind: "new", label: "smart button · _read_group" },
          ],
        },
      ],
    },

    /* ---------------- planning.pool.item ---------------- */
    {
      id: "m-pool", title: "planning.pool.item", icon: "file-added", badge: { label: "new model", tone: "new" },
      file: "addons/acme_planning/models/planning_pool_item.py",
      blocks: [
        { b: "md", nodes: [{ p: [
          "A read-only ", B("SQL view"), " model (", C("_auto = False"), "). Grain: ",
          B("one row per source allocation"),
          ", so prestation, task and allocation identity survive into planning.",
        ] }] },
        { b: "attrs", items: ['_name = "planning.pool.item"', "_auto = False", '_rec_name = "name"'] },
        { b: "md", nodes: [{ h: "Fields" }] },
        { b: "fields", rows: [
          { name: "name", kind: "Char · compute", badges: ["computed"], note: ["Human label: ", I("project – service – role – month – person"), "."] },
          { name: "allocation_id", kind: "Many2one", badges: ["readonly"], note: ["→ ", C("planning.allocation"), ". The source row this lens reflects."] },
          { name: "opportunity_id / demand_id", kind: "Many2one", note: ["→ ", C("crm.lead"), " / ", C("planning.allocation.demand"), ", carried from the allocation."] },
          { name: "product_id / role_id / employee_id", kind: "Many2one", note: ["→ service / ", C("planning.role"), " / ", C("hr.employee"), " (empty = ", I("To assign"), ")."] },
          { name: "person_or_role_name", kind: "Char · compute", note: ["Named person, or “To assign”. Reads ", C("allocation.assignee_name"), "."] },
          { name: "project_id / task_id", kind: "Many2one", note: ["→ ", C("project.project"), " / ", C("project.task"), ", gained at conversion."] },
          { name: "analytic_account_id", kind: "Many2one", note: ["→ ", C("account.analytic.account"), "."] },
          { name: "month", kind: "Date", note: ["Allocation month — the planning bucket."] },
          { name: "quantity_unit", kind: "Selection", note: [C("days"), " / ", C("hours"), " — the unit the totals are expressed in."] },
          { name: "total / total_hours", kind: "Float · compute", note: [B("Charge to schedule"), " = allocation quantity (and in hours)."] },
          { name: "placed / placed_hours", kind: "Float · compute", note: [B("Already planned"), " = Σ ", C("allocated_hours"), " of non-cancelled linked slots."] },
          { name: "remaining / remaining_hours", kind: "Float · compute", note: [B("Reste à planifier"), " = ", C("max(total − placed, 0)"), "."] },
          { name: "company_id", kind: "Many2one", note: ["→ ", C("res.company"), "; drives the record rules."] },
        ] },
        { b: "md", nodes: [{ h: "Methods" }] },
        { b: "method", decorator: "def init(self):", sig: "init()", body: [
          "Drops any existing view, then ", C("CREATE OR REPLACE VIEW"),
          " selecting allocations ", C("WHERE status = 'converted' AND active IS TRUE"),
          ". The allocation ", C("id"), " becomes the pool item ", C("id"), ".",
        ] },
        { b: "method", decorator: "@api.depends(allocation_id.quantity, .planning_slot_ids.allocated_hours, .state)", sig: "_compute_quantities()", body: [
          "Calls the allocation's shared aggregator ", C("_planning_placed_hours_by_id()"),
          ", then fills total / placed / remaining in both unit and hours, flooring remaining at zero.",
        ] },
        { b: "code", snippet: "pool-model" },
        { b: "callout", body: [
          B("Why a SQL view and not a stored model?"),
          " A copied pool table would create a second charge store that issue #60 and #62 would have to reconcile. A view can't drift: it ",
          I("is"), " the allocations.",
        ] },
      ],
    },

    /* ---------------- planning.allocation ---------------- */
    {
      id: "m-alloc", title: "planning.allocation", icon: "file-diff", badge: { label: "modified", tone: "mod" },
      file: "addons/acme_planning/models/planning_allocation.py",
      blocks: [
        { b: "md", nodes: [{ p: [
          "The hub. It gains the same total/placed/remaining readings as the pool item, the inverse link to its slots, and the shared aggregator both models use.",
        ] }, { h: "New fields" }] },
        { b: "fields", rows: [
          { name: "planned_charge_quantity / _hours", kind: "Float · compute", note: ["Total confirmed charge, for the “Planning Consumption” panel."] },
          { name: "planned_quantity / planned_hours", kind: "Float · compute", note: ["Already planned = Σ non-cancelled linked slot hours."] },
          { name: "remaining_quantity / remaining_hours", kind: "Float · compute", note: [C("max(total − placed, 0)"), "."] },
          { name: "planning_slot_ids", kind: "One2many", badges: ["readonly"], note: ["→ ", C("planning.slot"), " inverse of ", C("allocation_id"), ". The depends-trigger for live recompute."] },
        ] },
        { b: "md", nodes: [{ h: "New methods" }] },
        { b: "method", decorator: "@api.depends(... planning_slot_ids.allocated_hours, .state)", sig: "_compute_planning_consumption()", body: [
          "Fills the six new readings per allocation, converting hours back to the native unit via ", C("_hours_to_quantity()"), ".",
        ] },
        { b: "method", sig: "_planning_placed_hours_by_id()", body: [
          B("Shared aggregator"), ", reused by the pool item. One ", C("_read_group"),
          " over ", C("planning.slot"), " (", C(".sudo()"), ") summing ", C("allocated_hours"),
          " where state ≠ cancelled, keyed by allocation id.",
        ] },
        { b: "code", snippet: "alloc-aggregator" },
        { b: "callout", tone: "warn", body: [
          B(["Note the ", C(".sudo()"), " in the aggregator."]),
          " It sums all linked slots regardless of the reader's slot visibility, so “remaining” is consistent for every role.",
        ] },
      ],
    },

    /* ---------------- planning.slot ---------------- */
    {
      id: "m-slot", title: "planning.slot", icon: "file-diff", badge: { label: "modified", tone: "mod" },
      file: "addons/acme_planning/models/planning_slot.py",
      blocks: [
        { b: "md", nodes: [{ p: [
          "The consumer. A single new Many2one lets a shift draw from a pool item, plus a guard that keeps the link pointed only at real confirmed charge.",
        ] }, { h: "New field — the link" }] },
        { b: "fields", rows: [
          { name: "allocation_id", kind: "Many2one",
            note: ["→ ", C("planning.allocation"), ", “Source Allocation”."],
            tags: ["domain: status=converted, active=True", "index=True", "tracking=True", "check_company=True", 'ondelete="set null"'] },
        ] },
        { b: "md", nodes: [{ p: [
          "Plus a model-level switch: ", C("_check_company_auto = True"),
          " — auto-validates company consistency across ", C("check_company"), " relations on write.",
        ] }, { h: "New constraint" }] },
        { b: "method", decorator: '@api.constrains("allocation_id")', sig: "_check_source_allocation_is_confirmed()", body: [
          "Belt-and-braces beyond the field ", C("domain"), ": raises ", C("ValidationError"),
          " if a linked allocation is not ", C("converted"), " & ", C("active"),
          ". The domain filters the dropdown; the constraint defends against non-UI writes.",
        ] },
        { b: "code", snippet: "slot-link" },
        { b: "callout", body: [
          B([C('ondelete="set null"'), " on purpose."]),
          " Deleting a confirmed allocation should not cascade-delete operational shifts. The shift survives, just unlinked — and the pool's “placed” drops on the next read.",
        ] },
      ],
    },

    /* ---------------- project.project ---------------- */
    {
      id: "m-project", title: "project.project", icon: "file-diff", badge: { label: "modified", tone: "mod" },
      file: "addons/acme_planning/models/project_project.py",
      blocks: [
        { b: "md", nodes: [{ p: [
          "The entry point. A smart button on the confirmed project opens its slice of the pool, grouped by month.",
        ] }, { h: "New field" }] },
        { b: "fields", rows: [
          { name: "planning_pool_item_count", kind: "Integer · compute",
            note: ["Count of this project's pool items, for the smart-button badge."],
            tags: ['groups="acme_planning.group_planning_employee"'] },
        ] },
        { b: "md", nodes: [{ h: "New methods" }] },
        { b: "method", sig: "_compute_planning_pool_item_count()", body: [
          "One ", C("_read_group"), " over ", C("planning.pool.item"), " by ", C("project_id"),
          " with ", C("__count"), " — no per-record query.",
        ] },
        { b: "method", sig: "action_open_planning_pool_items()", body: [
          "Returns the ", C("action_planning_pool_item"),
          " window action, narrowed to this project and defaulting to ", I("group by month"), ".",
        ] },
        { b: "code", snippet: "project-action" },
      ],
    },

    /* ---------------- views ---------------- */
    {
      id: "views", title: "Views & their intent", icon: "table",
      relatedFiles: ["views"],
      blocks: [
        { b: "md", nodes: [{ p: [
          "One new view file (the pool item's list/form/search/action) plus surgical inherits that surface the new readings where planners already work.",
        ] }] },
        { b: "cards", cols: 2, items: [
          { icon: "file-added", title: "planning_pool_item_views.xml", body: [[
            "The pool's own surface — deliberately ", B("read-only"), ": a list with ",
            C('create/edit/delete="False"'),
            ", a read-only form, a group-by search, and the window action.",
          ]] },
          { icon: "question", title: "Why read-only everywhere?", body: [[
            "A SQL-view model can't be written anyway, but stamping ", C('create/edit/delete="False"'),
            " makes the intent explicit and stops Odoo from rendering dead “New” buttons.",
          ]] },
        ] },
        { b: "code", snippet: "pool-action-xml" },
        { b: "md", nodes: [{ h: "Inherited views (surfacing the readings)" }] },
        { b: "table", head: [["File"], ["Change"], ["Intent"]], firstColMono: true, rows: [
          [["project_project_views.xml"], ["Smart button in ", C("button_box")], ["“Remaining to Schedule” statinfo button; hidden when count = 0; gated to planning employees."]],
          [["planning_allocation_views.xml"], ["“Planning Consumption” group + 2 list columns"], ["Shows planned charge / already planned / remaining on the allocation."]],
          [["planning_slot_views.xml"], [C("allocation_id"), " in list + form"], ["Exposes Source Allocation in the shift dialog (", C("no_create"), ")."]],
          [["crm_lead_views.xml"], ["2 columns in both allocation sub-lists"], ["Adds already-planned + remaining to the pre-planning lead view."]],
          [["acme_planning_views.xml"], ["invisible ", C("allocation_id")], ["Makes the link available to the gantt-style planning surface."]],
        ] },
        { b: "code", snippet: "smart-button-xml" },
      ],
    },

    /* ---------------- wizards ---------------- */
    {
      id: "wizards", title: "Wizards", icon: "gear",
      blocks: [
        { b: "cards", cols: 1, items: [
          { title: "No new wizards in this PR.", body: [
            ["Deliberate, and worth recording."],
            ["Pool items are consumed ", B("manually"), ": a planner sets ", C("Source Allocation"),
             " in the shift dialog. ADR 0008 defers automatic slot generation to a future wizard (#62), which must create draft slots ",
             B(["through the same ", C("allocation_id"), " link"]),
             " rather than inventing a second consumption path."],
          ] },
        ] },
      ],
    },

    /* ---------------- security ---------------- */
    {
      id: "security", title: "Security linked to the model", icon: "shield-lock",
      relatedFiles: ["security"],
      blocks: [
        { b: "md", nodes: [{ p: [
          "Two layers, both read-only: model-level ACLs and row-level company record rules. A derived lens should never be writable.",
        ] }, { h: "Access rights — ir.model.access.csv" }] },
        { b: "matrix", head: ["ACL · group", "read", "write", "create", "unlink"], rows: [
          { label: "planning.pool.item · group_planning_employee", cells: [true, false, false, false] },
          { label: "planning.pool.item · group_planning_planner", cells: [true, false, false, false] },
          { label: "planning.pool.item · group_planning_manager", cells: [true, false, false, false] },
        ] },
        { b: "md", nodes: [{ h: "Record rules — planning_rules.xml" }, { p: [
          "One company rule per group, all read-only, same domain — visible when the item's company is among the user's allowed companies (or company-less):",
        ] }] },
        { b: "code", snippet: "rules-xml" },
        { b: "callout", tone: "key", body: [
          B("Multi-company integrity, three ways:"), " ", C("check_company=True"),
          " on the slot link + ", C("_check_company_auto"), " on the slot + these ",
          C("company_id in company_ids + [False]"), " rules.",
        ] },
      ],
    },

    /* ---------------- tests ---------------- */
    {
      id: "tests", title: "Tests — what they prove", icon: "beaker",
      file: "addons/acme_planning/tests/test_planning_pool_item.py",
      blocks: [
        { b: "md", nodes: [{ p: [
          "281 lines of tests, summarized: one card per test with the scenario and the key assertions. Open the diff only if a card raises a question.",
        ] }] },
        { b: "tests", items: [
          { name: "test_pool_grain", kind: "unit", ref: "tests/test_planning_pool_item.py",
            scenario: ["Creates allocations in every state (draft, converted, cancelled) plus one archived. Reads the pool view."],
            asserts: [
              ["Only ", B("active + Converted"), " allocations produce a pool item."],
              ["One row per allocation — never per person×month."],
            ] },
          { name: "test_live_consumption", kind: "unit",
            scenario: ["Links slots to a 40 h allocation, then walks the full lifecycle: ", B("create → resize → reassign → cancel → unlink"), "."],
            asserts: [
              ["Each step moves ", C("placed_hours"), " / ", C("remaining_hours"), " immediately — nothing is stored or decremented."],
              ["A cancelled slot stops counting; unlink restores the remaining charge."],
            ] },
          { name: "test_overconsumption_floor", kind: "unit",
            scenario: ["Plans 48 h of slots against a 40 h allocation."],
            asserts: [[C("remaining_hours"), " floors at ", B("0.0"), " — never negative in the pool."]] },
          { name: "test_allocation_link_constraint", kind: "unit",
            scenario: ["Tries to point ", C("planning.slot.allocation_id"), " at a forecast allocation, then at an archived one, via ", C("write()"), " (not the UI)."],
            asserts: [["Both writes raise ", C("ValidationError"), " — the picker domain is defended by ", C("@api.constrains"), "."]] },
        ] },
      ],
    },

    /* ---------------- i18n ---------------- */
    {
      id: "i18n", title: "Translations", icon: "globe",
      relatedFiles: ["i18n"],
      blocks: [
        { b: "md", nodes: [{ p: [
          "201 diff lines collapse to one fact: every new label shipped with its French translation in the same PR. Nothing here needs line-by-line review.",
        ] }] },
        { b: "i18n",
          rows: [
            { path: "i18n/fr.po", status: "M", lang: "fr", add: 101, del: 0, entries: { new: 31, updated: 2 } },
            { path: "i18n/acme_planning.pot", status: "M", add: 100, del: 0, entries: { new: 31 }, note: "regenerated from source — in sync" },
          ],
          note: ["31 new entries = the pool item fields, view labels and the two smart buttons. The 2 updated French strings fix wording on existing allocation labels."],
        },
      ],
    },

    /* ---------------- patterns ---------------- */
    {
      id: "patterns", title: "Patterns worth stealing", icon: "light-bulb",
      blocks: [
        { b: "md", nodes: [{ p: [
          "The transferable techniques in this PR — what to reuse next time, each tied to where it lives in the diff.",
        ] }] },
        { b: "patterns", items: [
          { icon: "database", term: "SQL-view model", ref: "planning_pool_item.py",
            body: [C("_auto = False"), " + ", C("init()"), " with ", C("CREATE OR REPLACE VIEW"), ": a model that's a query, not a table."] },
          { icon: "rows", term: "Derived readings", ref: "@api.depends",
            body: ["Non-stored ", C("compute"), " fields with precise depends on ", C("...slot_ids.allocated_hours"), " & ", C(".state"), " → live, never desynced."] },
          { icon: "columns", term: "Grouped aggregation", ref: "allocated_hours:sum",
            body: ["One ", C("_read_group"), " over slots, keyed by allocation, shared by both models via a single helper."] },
          { icon: "shield-lock", term: "check_company trio", ref: "multi-company",
            body: [C("check_company=True"), " + ", C("_check_company_auto"), " + ", C("company_id in company_ids + [False]"), " rules."] },
          { icon: "eye", term: "Smart button", ref: "project_project.py",
            body: ["Computed count field + a ", C("statinfo"), " button + a window action injecting a domain and a group-by context."] },
          { icon: "law", term: "Domain + constraint", ref: "defense-in-depth",
            body: ["Field ", C("domain"), " filters the picker; ", C("@api.constrains"), " defends the same rule against non-UI writes."] },
          { icon: "book", term: "i18n discipline", ref: "i18n/",
            body: ["Every new label landed in ", C("fr.po"), " and the ", C(".pot"), " in the same diff — French is a deliverable, not a follow-up."] },
          { icon: "git-branch", term: "Grain as a decision", ref: "ADR 0008",
            body: ["One row per ", I("allocation"), " (not person×month), recorded in the ADR as a constraint on the follow-up issues #60/#62."] },
        ] },
      ],
    },

    /* ---------------- files ---------------- */
    {
      id: "files", title: "Files changed", icon: "file-diff",
      blocks: [{ b: "files" }],
    },
  ],
};

export type Payload = typeof payload;
