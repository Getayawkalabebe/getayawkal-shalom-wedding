# Getayawkal & Shalom — Vercel edition

The reference-inspired wedding experience, running on Next.js with PostgreSQL RSVP storage.

## Development

Use Node.js 22 or later. Run `npm ci`, then `npm run dev`.
Set DATABASE_URL in a local .env file or the deployment environment. Never commit database credentials.
Run `npm run db:migrate` with DATABASE_URL loaded to create the RSVP table. This is an idempotent schema migration; run it before opening RSVPs.

## Vercel deployment

1. Push this folder to a private GitHub repository under Getayawkalabebe.
2. Import the repository in Vercel; use the Next.js preset and default build settings.
3. Connect a PostgreSQL database through Vercel Storage (for example Neon) and expose its connection string as DATABASE_URL. Use a pooled connection URL where supported.
4. Run the schema migration against that database, then deploy/redeploy.
5. Verify accept, decline, update, and error states before sharing the URL.

Existing responses on the Sites/Cloudflare deployment are not included in this repository. If any production responses exist, export and import them securely as a separate migration. Never commit guest records.

No public endpoint exposes the RSVP list. The form retains its same-tab request identifier to update an existing response. Database errors return an honest failure instead of a false success.

The livestream link is still awaiting the couple's broadcast URL. Photos, fonts and song are served locally. See REFERENCE-STUDY.md for design mapping and font licensing notes.
