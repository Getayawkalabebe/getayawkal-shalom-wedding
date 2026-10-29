# Maintenance and security review — 29 October 2026

## Deployment diagnosis
The duplicate Vercel project `getayawkal-shalom-wedding2` failed because its build runs database migration without DATABASE_URL. Automatic Git builds are now skipped for this unused project. The canonical production project is `getayawkal-shalom-wedding`, connected to Neon.

## Changes
- Patched Next.js to 16.4.3; npm audit reports zero known production dependency vulnerabilities at review time.
- Pinned Node to 24.x and added Prettier formatting commands.
- Added clickjacking, MIME-sniffing, referrer, browser-permission and limited CSP headers.
- Added atomic database-backed RSVP throttling: 20 valid submissions per trusted Vercel client IP per 15 minutes. Stores SHA-256 hashes, not raw IP addresses. Shared networks share a quota.
- Handle interrupted request bodies with a controlled 400 response.

## Existing protections checked
Parameterized SQL; server-side field validation; streamed 12 KB request limit; same-origin checks; non-cacheable RSVP responses; database credentials remain server-only; environment files ignored by Git. There is no public guest-list API.

## Limits and maintenance
This is a targeted source/dependency/configuration review, not a penetration test or guarantee of complete security. A valid production RSVP write/update was not performed during this review. Throttling requires Vercel's trusted x-vercel-forwarded-for header and is skipped outside Vercel when that header is absent. Keep dependencies patched; restrict database and Vercel account access. Old rate-limit hash rows can be purged through an authorized maintenance process. The CSP limits framing/forms/objects; it is not a strict script nonce policy.

Commands: `npm test`, `npm run format:check`, `node node_modules/typescript/bin/tsc --noEmit`, `npm audit --omit=dev`.
