---
description: "Use when changing behavior, fixing bugs, or when user asks for test-complete implementation."
---
# Testing Rules

- Every behavior change must include tests.
- Use dependency injection where possible for isolated tests.
- Include database integration tests when data behavior changes.
- Run tests for changed areas on each change.
- Ensure full suite passes before submitting.
- Prefer behavior assertions over implementation details.
- Cover happy paths, edge cases, and failure paths.
- Use mocks only for external dependencies/non-determinism.
- Avoid skipped/placeholder tests without explicit rationale.
- Fix broken tests in the same task.
- Keep tests deterministic and readable.
- Respect CI as a readiness gate.
