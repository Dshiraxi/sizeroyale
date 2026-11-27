# SizeRoyale – QA report (build 0.1.0)

## Inputs received
| Input | Status |
|---|---|
| Master prompt (txt) | Used |
| Desktop design screenshots (2) + mobile mockup (1) | Used as visual reference |
| Two old project ZIPs | **Not attached – not inspected, nothing reused** |
| SEO CSV exports | **Not attached – not inspected.** `docs/seo-keyword-map.csv` is built from the keyword lists in the prompt; all metrics are `unavailable` except 7 historical figures quoted in the prompt, which are flagged *unverified*. |

## Automated tests (historical, before this branch): 22 / 22 passed (`npm test`)
- Scoring/units (12): scoring, conversion, validation and question-bank integrity.
- API (7): SEO, answers/scoring, accounts, daily challenge, contact.
- Multiplayer (3): room lifecycle, readiness, timers and reconnect.
- **Important:** this historical 22/22 result does not certify the current PR branch.

## Client-side checks
- Historical client script syntax checks passed in the earlier build.
- Real-browser rendering, visual match, mobile/tablet/desktop layouts, touch controls, slider/input interaction, animations, sound, PWA install and service-worker offline behavior have not been verified for this branch.

## Acceptance checklist
- [x] Existing architecture, domain and route paths retained.
- [x] Shared measurement-safe comparison helper added.
- [x] Four focused comparison tests added.
- [x] Worker route-specific SEO handler added.
- [x] Preview-scoped Wrangler variables added after the Cloudflare build error described below.
- [ ] Full test suite and Wrangler dry run for this branch.
- [ ] Real-browser and device QA.
- [ ] Expand and fact-check the question bank before launch.

## Branch update – 27 November 2026
- The four new comparison-helper tests passed independently (4/4).
- The Cloudflare PR preview build failed because Wrangler required a `[previews.vars]` block for `SITE_URL`, `ROUND_SEC` and `REVEAL_SEC`.
- Added preview-scoped values to `wrangler.toml`; the follow-up Cloudflare preview build completed successfully, uploaded the four changed frontend assets, and reported no active preview URL.
- The dataset now contains 260 question records: the original 100 plus 160 sourced additions in `data/question-expansion.js` and `data/question-expansion-2.js` and `data/question-expansion-3.js` and `data/question-expansion-4.js` and `data/question-expansion-5.js` and `data/question-expansion-6.js` and `data/question-expansion-7.js` and `data/question-expansion-8.js`. Integrity tests check the minimum count, IDs/titles, categories, positive meter values, definitions, difficulty and HTTPS source URLs; focused tests check the 160 curated records' IDs and source-host provenance. This does not independently prove each measurement.
- A selected-source fact check was added in `docs/FACT-CHECK-REPORT.md`. The 30.1 m CH-47 figure was corrected to identify Boeing's operating rotor length rather than overall helicopter length. The curated batches add NASA planetary moon diameters, NPS landmark dimensions, Smithsonian giant-squid measurements, and manufacturer aircraft dimensions from Airbus and Boeing, plus NASA/JPL satellite physical parameters.
- Many legacy records still cite Wikipedia, and some records repeat the same subject/measurement with different wording. Full source-by-source review and distinct-fact cleanup remain outstanding; do not claim all 100 are independently verified.
- PWA manifest/offline shell now matches the light theme; service worker cache is v10 and precaches `public/lib/comparison.js`. Chromium assertions for the manifest/cache passed in the last successful CI run; the new data/test commits trigger a fresh run.
- Repeated question titles that failed the integrity test were disambiguated without changing measurement values or source URLs.
- Latest full test suite: 26/26 passed; Wrangler Worker `deploy --dry-run` passed.
- Chromium browser smoke tests passed: route-specific title/description/canonical/robots checks for five routes, unknown-route 404 + noindex, measurement-compatible comparison selectors, desktop/mobile no-horizontal-overflow and no uncaught page errors.
- Desktop and mobile screenshots were captured; contrast and mobile selector layout were refined from the visual review.
- No production deployment was performed.
