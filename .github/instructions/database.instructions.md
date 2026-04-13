---
description: "Use when changing schema, persistence logic, data integrity, or database-facing behavior."
---
# Database and Data Rules

- Use the right database technology for project needs.
- Provide migrations for schema creation/evolution.
- Provide seeders for representative development/test data.
- Keep migrations and seeders updated with model changes.
- Plan schema changes safely for production compatibility.
- Use meaningful seed data.
- Use transactions when consistency matters.
- Review query/index performance for growth-sensitive reads.
- Define ownership/deletion/retention rules explicitly.
- Avoid hidden data coupling (seed order, hardcoded IDs).
- No manual schema drift outside migration system.
- Test data integrity: constraints, relationships, cascades, defaults.
