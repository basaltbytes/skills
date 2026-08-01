# Brief C — list-heavy (tests and views)

Produce one walkthrough document. Frontmatter: title "Add live planning pool
items", pr 96, module acme_planning.

One section: id `quality`, navLabel "Tests & views", icon `beaker`, group
"Quality", title "What the tests prove".

Content of the section, in order. Transcribe the given text exactly.

1. Paragraph: "The view side is one line per surface: the slot tree gains
   <field name=\"allocation_id\" optional=\"show\"/> so a planner can set the
   source allocation without opening the form. The XML above is the entire
   slot-view change." (The `<field .../>` snippet is literal text to render
   in the paragraph, code-formatted.)

2. Tests block, 3 test cards:

   - name `test_remaining_tracks_slots`, kind unit, scenario "Given a
     converted allocation of 6 days, when a 2-day slot points at it, then the
     pool row shows 4 remaining. Resizing the slot to 3 days moves it to 3."
     Asserts: "remaining drops when a slot is created", "resize is reflected
     on the next read", "cancelled slots do not count".

   - name `test_pool_only_converted`, kind unit, scenario "Allocations in
     state 'forecast' never appear; flipping one to 'converted' makes a pool
     row appear on the next read, with no cron and no write." Asserts: "the
     domain matches records where state == 'converted' only", "the returned
     mapping has the shape {allocation_id: hours}".

   - name `test_pool_smart_button_tour`, kind tour, scenario "A planner opens
     a confirmed project, clicks Remaining to Schedule, and lands on the pool
     list filtered to that project." Asserts: "the button is visible to
     planning.group_planning_user", "the list shows exactly the project's
     pool rows".

3. Diff reference: file
   `addons/acme_planning/tests/test_planning_pool_item.py`, lines 15 to 88,
   mark lines 40-46.

4. Callout, tone warn: "The tour only covers the happy path. The access-error
   branch (no ACL read line) is asserted in the unit test, not the tour — do
   not delete it as a duplicate."
