---
description: "Use when implementing error handling, retries, external integrations, or reliability hardening."
---
# Error Handling and Reliability Rules

- Do not swallow errors; handle, log, or propagate explicitly.
- Handle expected failures with explicit paths.
- Return safe, actionable error messages.
- Log enough operational context without exposing sensitive data.
- Use bounded retries/timeouts with backoff where relevant.
- Distinguish transient vs permanent failures.
- Design retries to be safe and idempotent when needed.
- Fail fast on invalid/corrupted internal state.
- Fail in a controlled way preserving data integrity.
- Degrade functionality safely when dependencies fail.
- Avoid overly generic catches that hide root causes.
- Prefer explicit failure contracts in APIs/services.
- Test failure, degraded, and recovery paths.
