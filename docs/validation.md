# Validation

- Production build passed on 8 October 2026.
- Five contact-handler tests passed with mocked delivery; no actual email sent.
- Desktop and 390px mobile layouts inspected; no page-level horizontal overflow.
- Both local background videos loaded and played; pause/resume controls verified.
- Application keyboard navigation and workflow step switching verified.
- Mobile navigation closes on Escape and link selection.
- Unconfigured contact service returns an honest error and preserves form values.
- Production client bundle contains no recipient address or mail API key.

Email delivery requires RESEND_API_KEY and a verified CONTACT_FROM before public launch.
