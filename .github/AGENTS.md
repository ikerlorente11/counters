# Agent Usage Guide

Use these agents to keep work separated and concise.

## Agents

- Planner: planning only.
- Implementer: approved code changes + validation.
- Reviewer: findings-first review.
- Orchestrator: routes across agents.

## Standard Flow

1. Planner
2. Explicit user approval
3. Implementer
4. Reviewer

## Quick Prompts

- "Use Planner to plan this change."
- "Use Implementer to apply the approved plan."
- "Use Reviewer to review this diff."
- "Use Orchestrator for full pipeline delivery."

## Done Criteria (Minimal)

- Planner: clear scope, steps, validation, risks, approval needed.
- Implementer: scoped changes, files list, validation commands/results.
- Reviewer: severity-ordered findings with path:line and fixes.
- Orchestrator: correct routing and approval gate before implement.

## Notes

- Follow .github/copilot-instructions.md.
- Keep outputs brief by default.
- Default budget: max 5 bullets or 8 lines per section unless user asks for more.
- Avoid repeating unchanged context between steps.
