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
- The dataset contains 100 questions after counting the current `add()` entries; source verification and expansion to the 500-question target remain outstanding.
- Repeated question titles that failed the integrity test were disambiguated without changing measurement values or source URLs.
- Latest full test suite: 26/26 passed; Wrangler Worker `deploy --dry-run` passed.
- Chromium browser smoke tests passed: route-specific title/description/canonical/robots checks for five routes, unknown-route 404 + noindex, measurement-compatible comparison selectors, desktop/mobile no-horizontal-overflow and no uncaught page errors.
- Desktop and mobile screenshots were captured; contrast and mobile selector layout were refined from the visual review.
- No production deployment was performed.
