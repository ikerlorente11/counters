---
description: "Use when changes affect API contracts, frontend/UI, accessibility, performance, or observability."
---
# Quality and UI Rules

## Accessibility

- Build accessible UI from the start when UI exists.
- Prefer semantic/native controls.
- Support keyboard/focus navigation where applicable.
- Provide accessible labels for interactive elements.
- Keep feedback perceivable and understandable.
- Ensure readable contrast and avoid color-only meaning.

## Performance

- Measure before optimizing.
- Protect startup and critical interaction paths.
- Avoid unnecessary renders, repeated calculations, duplicated requests.
- Load assets/data responsibly (lazy load, paginate, defer, cache).
- Keep performance fixes proportional to proven bottlenecks.

## Observability and Monitoring

- Provide enough logs/metrics/health diagnostics for production behavior.
- Keep logs structured and actionable.
- Track critical signals: failures, latency, degradation, retry storms, saturation.
- Correlate operations across layers (request/trace IDs when relevant).
- Support health/readiness/liveness diagnostics where applicable.

## API Design and Contracts

- Treat APIs as stable contracts.
- Keep payload/error/status semantics consistent.
- Validate inputs and outputs.
- Preserve backward compatibility when required.
- Document external-facing contracts clearly.

## Frontend and UI Guidelines

- Build responsive interfaces for supported device classes.
- Handle loading/empty/error/success/disabled states intentionally.
- Provide clear and immediate user feedback.
- Design forms with labels, validation, defaults, and recovery paths.
- Respect existing design language/design system.
