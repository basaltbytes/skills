/* Code snippets = what the CLI would resolve from git at the pinned SHA.
   `added` = 1-based line ranges the PR change-overlay marks as added.
   `mark`  = author `mark=` ranges (block highlight in every view). */

const R = String.raw;

export const snippets = {
  "pool-model": {
    file: "addons/acme_planning/models/planning_pool_item.py",
    lang: "python",
    added: [[1, 35]],
    mark: [[3, 3]],
    code: R`class PlanningPoolItem(models.Model):
    _name = "planning.pool.item"
    _auto = False                       # SQL view, no managed table
    _order = "project_id, month, product_id, role_id, employee_id, id"
    _rec_name = "name"

    allocation_id = fields.Many2one("planning.allocation", string="Source Allocation", readonly=True)
    total = fields.Float(compute="_compute_quantities", string="Total")
    placed = fields.Float(compute="_compute_quantities", string="Already Planned")
    remaining = fields.Float(compute="_compute_quantities", string="Remaining to Schedule")

    def init(self):
        drop_view_if_exists(self.env.cr, self._table)
        self.env.cr.execute(SQL(
            """
            CREATE OR REPLACE VIEW %s AS (
                SELECT allocation.id AS id, allocation.id AS allocation_id, ...
                FROM planning_allocation allocation
                WHERE allocation.status = 'converted' AND allocation.active IS TRUE
            )
            """,
            SQL.identifier(self._table),
        ))

    @api.depends("allocation_id.quantity", "allocation_id.quantity_hours",
                 "allocation_id.planning_slot_ids.allocated_hours",
                 "allocation_id.planning_slot_ids.state")
    def _compute_quantities(self):
        placed = self.mapped("allocation_id")._planning_placed_hours_by_id()
        for item in self:
            a = item.allocation_id
            placed_hours = placed.get(a.id, 0.0)
            item.total = a.quantity
            item.placed = a._hours_to_quantity(placed_hours, a.quantity_unit)
            item.remaining = a._hours_to_quantity(max(a.quantity_hours - placed_hours, 0.0), a.quantity_unit)`,
  },

  "alloc-aggregator": {
    file: "addons/acme_planning/models/planning_allocation.py",
    lang: "python",
    added: [[1, 11]],
    code: R`def _planning_placed_hours_by_id(self):
    """Shared aggregator — reused by planning.pool.item._compute_quantities."""
    allocation_ids = [a.id for a in self if isinstance(a.id, int)]
    if not allocation_ids:
        return {}
    grouped_hours = self.env["planning.slot"].sudo()._read_group(
        [("allocation_id", "in", allocation_ids), ("state", "!=", "cancelled")],
        ["allocation_id"],
        ["allocated_hours:sum"],
    )
    return {a.id: hours or 0.0 for a, hours in grouped_hours}`,
  },

  "slot-link": {
    file: "addons/acme_planning/models/planning_slot.py",
    lang: "python",
    /* lines 1-3 are pre-existing context; the rest is the PR's addition */
    added: [[5, 18]],
    mark: [[10, 10]],
    code: R`class PlanningSlot(models.Model):
    _inherit = "planning.slot"
    _check_company_auto = True

    allocation_id = fields.Many2one(
        "planning.allocation",
        string="Source Allocation",
        domain=[("status", "=", "converted"), ("active", "=", True)],
        index=True, tracking=True, check_company=True,
        ondelete="set null",            # detach, never cascade-delete shifts
    )

    @api.constrains("allocation_id")
    def _check_source_allocation_is_confirmed(self):
        for slot in self.filtered("allocation_id"):
            if slot.allocation_id.status != "converted" or not slot.allocation_id.active:
                raise ValidationError(_("Source allocations must be active converted allocations."))`,
  },

  "project-action": {
    file: "addons/acme_planning/models/project_project.py",
    lang: "python",
    added: [[1, 6]],
    code: R`def action_open_planning_pool_items(self):
    self.ensure_one()
    action = self.env["ir.actions.actions"]._for_xml_id("acme_planning.action_planning_pool_item")
    action["domain"] = [("project_id", "=", self.id)]
    action["context"] = {"search_default_group_by_month": 1}
    return action`,
  },

  "pool-action-xml": {
    file: "addons/acme_planning/views/planning_pool_item_views.xml",
    lang: "xml",
    added: [[1, 6]],
    code: R`<record id="action_planning_pool_item" model="ir.actions.act_window">
    <field name="name">Remaining to Schedule</field>
    <field name="res_model">planning.pool.item</field>
    <field name="view_mode">list,form</field>
    <field name="search_view_id" ref="view_planning_pool_item_search"/>
</record>`,
  },

  "smart-button-xml": {
    file: "addons/acme_planning/views/project_project_views.xml",
    lang: "xml",
    added: [[1, 7]],
    code: R`<button class="oe_stat_button" type="object"
        name="action_open_planning_pool_items"
        icon="fa-calendar-check-o"
        groups="acme_planning.group_planning_employee"
        invisible="planning_pool_item_count == 0">
    <field name="planning_pool_item_count" widget="statinfo" string="Remaining to Schedule"/>
</button>`,
  },

  "rules-xml": {
    file: "addons/acme_planning/security/planning_rules.xml",
    lang: "xml",
    added: [[1, 11]],
    code: R`<record id="planning_pool_item_rule_employee_company" model="ir.rule">
    <field name="name">Planning Pool Item: employee company items</field>
    <field name="model_id" ref="model_planning_pool_item"/>
    <field name="domain_force">[('company_id', 'in', company_ids + [False])]</field>
    <field name="groups" eval="[(4, ref('group_planning_employee'))]"/>
    <field name="perm_read" eval="True"/>
    <field name="perm_write" eval="False"/>
    <field name="perm_create" eval="False"/>
    <field name="perm_unlink" eval="False"/>
</record>`,
  },
};
