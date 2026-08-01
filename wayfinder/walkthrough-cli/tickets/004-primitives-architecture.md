---
id: 4
title: "Primitives: generic core + Odoo preset layer"
type: grilling
status: closed
assignee: philippelattention
blocked-by: []
---

## Question

Do the Odoo-specific widgets (model diagram, fields table, security matrix, i18n counts, test TLDR) live in the core component set, or in a preset layer on top of domain-neutral primitives?

## Resolution

Generic core + Odoo preset. The core ships domain-neutral primitives (sections, nav tree, diff, code, cards, checklists, graphs). The Odoo widgets are a preset composed from them. Any codebase gets full power; Odoo stays first-class. Preset contents are ticket [Odoo preset contents](016-odoo-preset.md). Decided in the charting session on 2026-08-01.
