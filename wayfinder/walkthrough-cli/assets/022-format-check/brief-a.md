# Brief A — prose-heavy (mental model)

Produce one walkthrough document. Frontmatter: title "Add live planning pool
items", pr 96, module acme_planning.

One section: id `mental-model`, navLabel "Why this PR exists", icon
`git-compare`, group "Orientation", title "Why this PR exists".

Content of the section, in order. Transcribe the given text exactly (fix
nothing, reword nothing); apply the emphasis shown.

1. Paragraph: "When a quote is confirmed, the workload behind it becomes real
   but unscheduled. A line might read *Dana Lopez owes Project Atlas six days
   of site surveys in March 2027*: agreed and sold, sitting on zero calendars.
   Someone still has to drop those days onto actual dates, and until this PR
   no screen told them how much confirmed work was still waiting for one."

2. Callout, tone key: "**\"Shared pool\"** is the team's name for the pile of
   confirmed-but-unscheduled work. Open a confirmed project, click **Remaining
   to Schedule**, and you get one row per chunk of it. The planner works that
   list down to zero. (PRD: EF-CON-3, EF-PLN-3.)"

3. Paragraph: "The pool stores none of those numbers. \"2 left\" is
   `max(total − placed, 0)`, recomputed the instant you read it. `placed` is
   read from `_planning_placed_hours_by_id()`, which returns a plain dict of
   the shape {allocation_id: hours} — one entry per allocation, cancelled
   slots excluded. So `planning.pool.item` is a SQL view, a saved query over
   the allocations, not a table of its own."

4. Flow, 6 steps: "CRM opportunity", "allocation forecast", "quote confirmed",
   "pool row shows up", "planner places shifts", "2 left → 0".

5. Paragraph: "Nothing here generates shifts for you. That is a deliberate
   rule: never bulk-create dated shifts without a human deciding (EF-CON-3).
   For now a planner sets **Source Allocation** on a shift by hand, and that
   one link is the whole engine. The generation wizard is later, in #62; when
   it ships it must push slots through this exact link instead of inventing a
   second way to drain the pool."

6. Diff reference: file
   `addons/acme_planning/models/planning_pool_item.py`, lines 10 to 40,
   mark lines 12-14.
