---
description: "Use when touching auth, data handling, external input, dependencies, or when user asks for security compliance."
---
# Security Rules

- Never hardcode secrets in code, tests, or config.
- Use secure secret management and separate environments safely.
- Validate and sanitize all external input.
- Never trust client-side checks for authorization/business rules.
- Apply least privilege and secure defaults.
- Do not expose sensitive data in logs or responses.
- Do not weaken security controls without explicit approval.
- Encrypt in transit and at rest where applicable.
- Protect services from abuse with rate limiting/throttling/quotas.
- Validate high-frequency flows to avoid flooding services.
- Bound external interactions with explicit timeouts and retries.
- Audit security-relevant events without leaking sensitive data.
- Treat vulnerabilities first and prioritize mitigation.
- Add/update tests for security-sensitive changes.
