---
description: "Use when planning/executing changes, managing dependencies, environment setup, and git workflow."
---
# Workflow Rules

## Change Workflow

1. Propose: explain what/why and wait for approval.
2. Implement: apply approved scope.
3. Review: verify no dangling code or broken integration.
4. Summary: report outcomes and deviations.

- No scope creep without approval.
- Keep one objective per proposal.
- Ask clarification when ambiguous.

## Dependencies and Libraries

- Native first where possible.
- Add libraries only when justified.
- Prefer widely adopted, maintained libraries.
- Audit outdated dependencies and request approval before upgrades.
- Prioritize security vulnerabilities before unrelated work.
- Report unused dependencies and request approval before removal.

## Development Environment

- Use containerized environment first when available.
- Avoid unnecessary host setup when container tooling exists.

## Git Workflow

- Use dedicated branches per feature/fix.
- Do not work directly on main/master/protected branches.
- Keep consistent branch naming.
- No commits/pushes/history rewrites without explicit approval.
- Keep commits focused with clear messages.
- Sync with target/source branch before publishing.
- Resolve conflicts before requesting review.
- Use PR/MR review before merge.
