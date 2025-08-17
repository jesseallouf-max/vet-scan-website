# Vet Scan NYC — MVP Site

Single-page Next.js site for a mobile veterinary ultrasound service in Manhattan.

## Quick Start

```bash
# 1) Install deps
npm i

# 2) Run dev
npm run dev
# Visit http://localhost:3000
```

## Deploy (Vercel)

- Create a new Vercel project, link this repo, and set env vars.
- Push to `main` to deploy.

## Environment Variables

| Name | Required | Purpose |
|------|----------|---------|
| `CONTACT_TO` | optional | Fallback email recipient. Defaults to `vetscannyc@gmail.com`. |
| `SMTP_HOST` | optional | SMTP host (e.g., from Resend or other provider). |
| `SMTP_PORT` | optional | SMTP port (default 587). |
| `SMTP_USER` | optional | SMTP username. |
| `SMTP_PASS` | optional | SMTP password. |
| `HUBSPOT_TOKEN` | optional | HubSpot Private App token for logging contacts/notes. |

- If SMTP is not set, the API route will log submissions to the server console (visible in Vercel logs).
- If `HUBSPOT_TOKEN` is set, the app will upsert a contact and create a note for each submission.

## Editing Content

- Text and sections live in React components under `/components` and the homepage at `/pages/index.tsx`.
- Colors are set in `tailwind.config.js` (`brand.primary` / `brand.secondary`).

## Images

- The provided headshot is saved at `/public/images/headshot.jpg`.
- Replace `/public/images/placeholder-*.jpg` with your real photos when ready.

## SEO

- Basic `ProfessionalService` JSON-LD is embedded in `pages/index.tsx`.
- Update the `"url"` field once the production domain is known.

## Legal/Privacy

- The form is clinic-facing only. A small privacy notice can be added in the footer.
- No consumer health data is collected.

## Roadmap

- Add service-area map graphic.
- Split into multi-page if/when desired.
- Add rate-limiting & spam protection (e.g., hCaptcha) if spam appears.
