# Brief B — structure-heavy (the new model)

Produce one walkthrough document. Frontmatter: title "Add live planning pool
items", pr 96, module acme_planning.

One section: id `m-pool`, navLabel "planning_pool_item.py", icon `database`,
group "Models", title "planning.pool.item — the derived lens".

Content of the section, in order. Transcribe the given text exactly.

1. Paragraph: "A read-only SQL view (`_auto = False`) over active converted
   allocations. Each pool item keeps allocation grain and exposes **total**,
   **placed**, and **remaining** charge. No new table, no second copy of the
   charge."

2. Diff reference: file
   `addons/acme_planning/models/planning_pool_item.py`, lines 1 to 62,
   no mark.

3. Fields table, 4 rows:
   - name `allocation_id`, type "Many2one → planning.allocation", note "The
     link back to the source allocation. One pool item per allocation."
   - name `total_hours`, type "Float (view column)", note "Read straight from
     the allocation; never stored on the pool item."
   - name `placed_hours`, type "Float (computed)", note "Summed hours of every
     non-cancelled slot pointing at the allocation."
   - name `remaining_hours`, type "Float (computed)", note "Always
     `max(total − placed, 0)`; never negative, never decremented."

4. Method card: decorator "@api.depends('slot_ids.state')", sig
   "_planning_placed_hours_by_id(self) -> Dict[int, float]", body "Sums the
   hours of non-cancelled slots per allocation, one query for the whole
   recordset. Callers read the dict instead of looping per record."

5. Method card: no decorator, sig "init(self)", body "Drops and recreates the
   SQL view with `CREATE OR REPLACE VIEW`. The `WHERE` clause keeps only rows
   with state = 'converted' and an active project."

6. Diff reference: file
   `addons/acme_planning/security/ir.model.access.csv`, lines 1 to 4,
   mark line 3.

7. Callout, tone warn: "The view is read-only but the ACL still matters:
   without the read line in `ir.model.access.csv`, the smart button raises an
   access error for plain planners. Check the group on line 3 is
   `planning.group_planning_user`, not manager."
