# Guavion website

A customer-facing Vite website for Guavion, grounded in the Guavion Deck PearX PDF and Qengine's official website.

## Local development

Use Node 22+ and npm:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

## Build and production preview

```sh
npm run build
npm start
```

The Node server serves only `dist/` plus the private `/api/contact` handler at http://127.0.0.1:4173. For public deployment, run behind an HTTPS reverse proxy and set `CONTACT_ORIGIN` to the exact public origin. A static-only host cannot deliver the contact form; deploy the Node server or adapt `server/contact.js` to your host's server functions.

## Private enquiry email

Copy `.env.example` to `.env.local` and set these **server-only** values:

- `RESEND_API_KEY`: a Resend sending key.
- `CONTACT_FROM`: a sender on a verified domain in that Resend account.
- `CONTACT_TO`: the private destination mailbox. Already filled in the local ignored file per the user's instruction.
- `CONTACT_ORIGIN`: the exact public HTTPS origin (development defaults to http://127.0.0.1:5173).

Never use a `VITE_` prefix for these values. Do not commit `.env.local` or deploy it into `dist/`. No destination mailbox is present in client code. The mail handler validates fields and origin, restricts message size, uses a honeypot and an in-process rate limiter, and never reports success unless the provider returns a message ID. Configure an edge rate limit when deploying multiple instances; do not trust arbitrary forwarded IP headers.

Delivery is not activated until the mail key and verified sender are configured. The frontend retains the visitor's input and shows an honest error if delivery is unavailable. There is no fake successful submission or local storage of enquiries.

## Validation

```sh
npm test
npm run build
```

Tests mock the mail provider; they do not send real emails. Test cases cover private recipient routing, reply-to, invalid input/origin, missing credentials, provider errors, and rate limiting.

## Interactions and accessibility

Application and workflow tabs support arrow keys, Home, and End. Mobile navigation supports Escape. Motion pauses outside the viewport and when the browser tab is hidden. Reduced-motion and save-data preferences start with still images; visitors can explicitly play or pause all motion. Product videos are illustrative visuals, not validated solver output.

See `docs/content-and-assets.md` for content decisions and asset provenance.
