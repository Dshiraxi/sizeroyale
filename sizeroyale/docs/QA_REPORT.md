# SizeRoyale – QA report (build 0.1.0)

## Inputs received
| Input | Status |
|---|---|
| Master prompt (txt) | Used |
| Desktop design screenshots (2) + mobile mockup (1) | Used as visual reference |
| Two old project ZIPs | **Not attached – not inspected, nothing reused** |
| SEO CSV exports | **Not attached – not inspected.** `docs/seo-keyword-map.csv` is built from the keyword lists in the prompt; all metrics are `unavailable` except 7 historical figures quoted in the prompt, which are flagged *unverified*. |

## Automated tests (actually run): 22 / 22 passed (`npm test`)
- **Scoring/units (12):** exact=1000, half/double=0, 10% over, 25% under, invalid input rejected, unit conversion, same score across units, question-bank integrity (unique ids/titles, source on every item, every category has easy/medium/hard), daily determinism.
- **API (7):** SEO head tags/canonicals/sitemap/robots/404/path traversal, answers never sent with questions, server-side scoring ignores client score, validation (0, negative, NaN, huge, bad unit), signup/login/logout/session invalidation, duplicate-answer rejection, stats + global leaderboard, daily (same set, ordered, one attempt, 5,000 max, daily leaderboard, streak, guest restriction), contact form.
- **Multiplayer (3):** create/join, full room, invalid code (404), expired room (410), started room (409), non-host start (403), bad token (403), ready gating, simultaneous submissions, duplicate submission (409), same questions for both players, server-provided deadline, early round end when all guessed, timer-expiry auto-advance with no guesses, refresh/reconnect, host departure → host transfer, rematch reset.

## Client-side checks
- `node --check` on all client scripts: pass. Scripts load in a stubbed DOM without runtime errors.
- **NOT tested:** real-browser rendering, visual match to the screenshots, mobile/tablet/desktop layouts, touch controls, slider/input interaction, animations, sound, PWA install, service worker offline. No browser was available in this environment. **Open the site yourself on phone + desktop and report anything that looks off.**

## Acceptance checklist
- [x] Branding/logo (original crown + ruler SVG)
- [~] Homepage follows the design direction – structure and colors follow the references, but art is **emoji + CSS**, not illustrated artwork; not visually verified
- [x] Navigation (all routes registered; tested via server-rendered meta, not clicked in a browser)
- [x] Six categories
- [~] Verified question bank – **52 of 500 target** (Animals 8/100, Dinosaurs 7/60, Space 9/60, Geography 10/100, Vehicles 9/80, Everyday 9/100). Values are commonly published figures entered **without live web access**; every source URL must be re-checked before launch. Several are estimates (dinosaurs, Nile) and are labelled as such.
- [x] Gameplay, scoring (server-authoritative), unit conversion
- [x] Daily Challenge (UTC day), Unlimited Play (no repeats until pool exhausted, then reshuffle)
- [x] Accounts (signup/login/logout, avatar, unit preference) – **password reset not implemented** (needs email)
- [x] Profile, statistics, history – saved for signed-in users only; **guest results are not persisted**
- [x] Leaderboards from real data
- [x] Friends Battle: rooms, codes, invite link, WhatsApp, 1v1 and 2–4 players, ready, 5×20s rounds, live scores, server timer, tie-break, rematch, reconnect
- [~] Mobile – bottom tab bar, drawer, 2-column category grid and 48 px controls implemented per the mobile mockup; **unverified on real devices**
- [~] PWA – manifest, service worker, offline page. **Icons are SVG only; iOS/Android installability may need PNG 192/512 icons.**
- [~] SEO – unique titles/descriptions, canonicals, OG, JSON-LD (WebSite, WebApplication, FAQPage, BreadcrumbList), sitemap, robots. **Page body is rendered client-side**; crawlers see title/meta/`<noscript>` text but not the full body. Pre-rendering (or Next.js) is the next step.
- [x] CSV keyword analysis documented – **but from the prompt list only (no CSVs were attached)**
- [~] Placeholder pages – none for promised features; Privacy/Terms are **drafts needing legal review**
- [ ] Database schema / migrations / seed scripts for Postgres/Supabase – **not delivered** (JSON-file DB instead)
- [ ] Next.js / Tailwind / Supabase stack – **not used** (no package access)
- [ ] Rate limiting is in-memory per process; multiplayer rooms are in-memory (lost on restart, single instance only)
- [ ] Multiplayer results are not saved to profiles/stats
- [ ] Explore/Comparison pages expose the answers by design (public reference data) – a player could look answers up.

## Known spec note
Spec example "≈10% error: 863 points": the exact formula gives 862.496 → **862** with `Math.round`. The formula was left unchanged; the test documents this.


## Branch update – 27 November 2026
- Added four comparison-helper tests and a shared helper at `public/lib/comparison.js`.
- These four new tests were run independently in an isolated Node test harness and passed (4/4).
- The Worker SEO handler and comparison UI were updated on branch `upgrade/route-seo-light-theme`.
- The full repository suite, Wrangler build/dry run and browser/device checks have **not** been run for this branch. The earlier 22/22 result above is historical and does not certify the new branch.
- The dataset remains 52 questions; source verification and expansion to the 500-question target remain outstanding.
