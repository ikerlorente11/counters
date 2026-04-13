---
description: "Use when changing behavior, setup, architecture, or when user asks to keep documentation updated."
---
# Documentation Rules

- Project run documentation: maintain setup/run instructions in Markdown.
- Stable entry points: prefer `README.md`, `ARCHITECTURE.md`, `FUNCTIONAL_SPEC.md` unless project conventions differ.
- Environment-specific instructions: document differences per environment or execution mode.
- User capability overview: describe user-facing functionality.
- Architecture and scope: keep modules, boundaries, and behavior documented.
- Full stack coverage: include frontend, backend, database, infrastructure, and main libraries/versions.
- Functional spec as source of truth: keep expected behavior documented and current.
- Validate implementation against spec when changing behavior.
- Keep docs updated in the same task as code changes.
