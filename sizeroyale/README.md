# SizeRoyale – Guess. Compete. Dominate.

Premium size-guessing game: Daily Challenge, Unlimited Play, Friends Battle (realtime multiplayer), accounts, leaderboards, stats, Explore/Learn content, PWA and SEO foundations.

> **Stack note.** This build is **zero-dependency Node.js (≥18) + vanilla JS** – not Next.js/Supabase. It was built in an environment with no package-registry access, so a framework could not be installed. Accounts, history and rooms are fully real (server-side), but the database is a JSON file and multiplayer rooms live in server memory. See "Production notes" for the migration path to Supabase/Postgres.

## Run locally
```bash
node -v            # 18+
cp .env.example .env   # optional
npm start          # http://localhost:3000
npm test           # 22 automated tests (scoring, API, daily, multiplayer)
```
No `npm install` is needed.

## Test multiplayer
Open `http://localhost:3000/multiplayer` in two different browsers (or one normal + one private window). Create a room in the first, copy the code/link, join in the second, press Ready, then Start in the first. Refresh either tab mid-round to test reconnect.

## Structure
- `server.js` – static server, JSON API, SSE multiplayer, per-route SEO injection, sitemap/robots
- `lib/scoring.js` – scoring + unit conversion (shared by server and browser)
- `lib/seo.js` – titles/descriptions/FAQ per route
- `data/questions.js` – question bank (canonical meters, definition, source)
- `public/` – HTML shell, CSS design system, JS (`core.js`, `pages.js`, `mp.js`), PWA files
- `tests/` – `node --test`
- `docs/` – QA report, SEO keyword map

## Deploy
Any Node host with a persistent disk and long-lived connections (Render, Railway, Fly.io, a VPS). Set `PORT`, `SITE_URL` (your real https URL) and `DB_FILE` (on the persistent disk). Run `node server.js`. Serverless platforms are **not** suitable (in-memory rooms + SSE).
**Connect a domain:** add the domain in the host's dashboard, create the DNS record it shows (CNAME/A), wait for HTTPS, then set `SITE_URL` to `https://yourdomain` and restart so canonicals/sitemap update. No domain is assumed.

## Production notes / migration to Supabase
- Replace the JSON `db` with Postgres tables: `users, sessions, history, daily_attempts, contact_messages` (shapes are visible in `server.js`), enable RLS so a user can only read/write their own rows.
- Multiplayer authority is the Node process; for multiple instances move room state to Redis/Postgres + Realtime.
- Password reset needs an email provider (not implemented).

## Cloudflare Workers deployment
This ZIP now includes `worker.js`, `wrangler.toml`, `CLOUDFLARE-DEPLOY.md`, and a Workers Assets setup. Follow `CLOUDFLARE-DEPLOY.md` and deploy with Wrangler (`npm install`, `npx wrangler login`, `npm run deploy`). The app's Node HTTP API is connected through Cloudflare's `cloudflare:node` adapter; the static frontend is served through Workers Assets.

**Production warning:** the source JSON database and in-memory multiplayer rooms are not durable on Workers. Use D1 for accounts/scores/history and Durable Objects for reliable multiplayer before opening the game to real users. The current build is a Cloudflare runtime/deployment adaptation, not a completed D1/Durable Objects migration.
