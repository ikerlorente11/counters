---
description: "Use when changes affect build, release, deployment, CI, or production readiness."
---
# Build and Delivery Rules

- Ensure deployment readiness for local, preproduction, and production when applicable.
- Support containerized workflows when project uses Docker/containers.
- Keep non-container workflows reproducible and documented.
- Maintain environment parity across stages as much as possible.
- Ensure reproducible builds via documented commands/pipelines.
- Keep environment-specific configuration separated.
- Validate required checks before release (tests/lint/build/migrations/smoke checks).
- Plan safe rollout with rollback and recovery expectations.
- Promote only after lower-stage validation.
- Ensure application release readiness (assets, signing, platform setup).
- Keep release metadata/versioning/signing requirements coherent.
- Keep store deployment readiness when targeting app stores.
