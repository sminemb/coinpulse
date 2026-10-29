# Security review guidelines

Use these checks when reviewing changes that handle user input, browser state, external data, credentials, or server-side behavior.

## Review priorities

- **Secrets:** Keep API keys, tokens, private keys, and credentials out of source, committed configuration, client bundles, logs, and error messages. Use the deployment platform's secret storage for server-only values.
- **Trust boundaries:** Treat query parameters, form values, cookies, local storage, API responses, and imported content as untrusted. Validate values at the boundary and encode data for its output context.
- **Browser rendering:** Avoid rendering untrusted HTML. If raw HTML is necessary, use a well-maintained sanitizer with a narrow allowlist and verify the exact sink and data flow.
- **Authentication and authorization:** For protected server-side operations, verify identity and permissions on the server for every request. Do not rely on hidden UI controls or client-provided identifiers as authorization.
- **Data access:** Use parameterized database operations and enforce tenant or user ownership in the query. Avoid exposing sensitive records in responses, page props, client-side state, or diagnostics.
- **Network and redirects:** Restrict server-side requests to intended destinations and protocols. Validate redirect targets to prevent open redirects and server-side request forgery.
- **Abuse and resource use:** Consider request size, rate, pagination, and expensive operations for public endpoints. Avoid unbounded work from attacker-controlled input.
- **Dependencies and configuration:** Prefer maintained dependencies and safe defaults. Check security headers, transport security, and production error handling when deployment or framework configuration changes.

## Reporting findings

Describe the affected flow, the attacker-controlled input or missing control, and the likely impact. Provide a concrete reproduction or exploit path where possible, then recommend a specific mitigation. Keep suspected vulnerabilities private and report them to the repository maintainers through a private channel; do not publish exploit details in a public issue or pull request before a fix is available.
