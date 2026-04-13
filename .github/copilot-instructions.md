# General Guidelines

Apply only relevant rules. Prefer short, focused work and minimal output.

## Core Rules

- Use English in code, comments, and docs.
- Keep changes scoped to the request; no unrelated refactors.
- Follow naming consistency: `camelCase`, `PascalCase`, `UPPER_SNAKE_CASE`.
- Prefer native platform features before adding dependencies.
- Never hardcode secrets; validate external input; use least privilege.
- Handle errors explicitly; avoid silent failures; use bounded retries/timeouts.
- Add or update tests for behavior changes.
- Keep docs aligned when behavior/setup changes.

## Workflow

1. Propose concise scope and approach.
2. Wait for approval.
3. Implement minimal changes.
4. Validate relevant checks.
5. Summarize outcomes and blockers.

## Token Efficiency

- Read only files needed for the task.
- Keep plans and summaries brief by default.
- Avoid repeating unchanged context.
- Prefer targeted diffs over broad rewrites.

## Response Budget

- Default to concise-professional style, not telegraphic style.
- Use at most 5 bullets unless the user asks for depth.
- Use short sections only when they add value.
- Do not restate prior context unless it changed.
- Expand only when explicitly requested.
