# SizeRoyale – Cloudflare Workers build

This build fixes the original deployment mismatch: the project is a Node.js HTTP app, so Cloudflare's `cloudflare:node` HTTP adapter now connects its API server to the Workers request lifecycle. The static frontend is served by the Workers Assets binding.

## Deploy with Wrangler (recommended)
1. Install Node.js 20 or newer.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npx wrangler login` and authorize the correct Cloudflare account.
5. Run `npm run deploy`.
6. Open the workers.dev URL shown by Wrangler.

## Important data limitation
The original app stores users, sessions, scores and contact messages in a local JSON file. Cloudflare Workers' filesystem is virtual and temporary, not a persistent disk. This build makes the site and API runtime compatible, but **account data is not production-persistent yet**. Before inviting real players, migrate the JSON database to Cloudflare D1 (or another durable database). Multiplayer rooms are also held in Worker memory and need Durable Objects for reliable cross-isolate real-time play. Do not treat this as a production-ready account/multiplayer database.

## Current included functionality
- Static responsive SizeRoyale UI and PWA files
- Existing game APIs, scoring and question data
- Cloudflare Workers Node HTTP adapter
- Workers Assets static-file delivery and SPA fallback
- robots.txt and sitemap.xml

## Known limitations retained from source project
- 52 question records, not the 500-question target
- Password reset/email flow not implemented
- JSON-file persistence is not durable on Workers
- Multiplayer room state is in memory; Durable Objects migration remains required
- Static HTML has a site-wide SEO title/description; route-specific SEO metadata from the Node server is not yet wired into the asset fallback

## Local tests
`npm test` runs the original Node test suite. `npm run dev` starts a local Wrangler Worker preview once dependencies are installed.
