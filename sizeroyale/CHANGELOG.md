# SizeRoyale – Upgrade changelog

## Prepared on 27 November 2026

### Updated
- Applied a light visual system using white, light blue, navy, royal blue and green accents while retaining the existing HTML/CSS/vanilla JavaScript architecture.
- Updated browser theme colors, cache-busted the stylesheet, refreshed the PWA manifest/offline page, and bumped the service-worker cache to v10.
- Added `public/lib/comparison.js` with shared measurement compatibility, comparison and pair-generation helpers; wired the comparison page to it.
- Comparison selectors now restrict choices to the same measurement type and a different item. Incompatible pairs are rejected.
- Added comparison and question-bank integrity tests; disambiguated repeated question titles without changing their measurement values.
- Expanded the bank from 100 to 260 with eight batches of 20 source-backed records: NASA/NPS/Smithsonian/Airbus in batch 1, and Boeing/Airbus/NASA-JPL in batch 2. Batch files are `data/question-expansion.js` and `data/question-expansion-2.js` and `data/question-expansion-3.js` and `data/question-expansion-4.js` and `data/question-expansion-5.js` and `data/question-expansion-6.js` and `data/question-expansion-7.js` and `data/question-expansion-8.js`; integrity tests check count, stable IDs and source hosts.
- Corrected the CH-47 Chinook 30.1 m entry to describe Boeing's operating rotor length, not aircraft fuselage length, and linked to Boeing.
- Added route-specific Worker SEO metadata/schema from `lib/seo.js`; unknown HTML routes return 404/noindex.
- Set production Worker `SITE_URL` to `https://sizeroyale.fun` and configured preview-scoped variables.
- Added browser smoke coverage for SEO routes, comparison controls, responsive overflow, PWA manifest/service-worker assets and runtime errors.
- Added `docs/FACT-CHECK-REPORT.md` documenting selected source checks and remaining verification gaps.
- Added `docs/QUESTION-DUPLICATE-AUDIT.md` with confirmed duplicate/overlap clusters and a stable-ID-safe cleanup policy.

### Preserved
- Existing domain, route paths, architecture, REST API, SSE multiplayer, JSON storage, account flows, scoring formula, PWA and Wrangler deployment structure.
- No production deployment or PR merge has been performed.

### Validation
- Latest GitHub Actions run: **SUCCESS** — 29/29 Node tests, Wrangler `deploy --dry-run`, and Chromium browser/route smoke tests all passed.
- Run: https://github.com/Dshiraxi/sizeroyale/actions/runs/45992337889
- The automated checks do not replace physical-device PWA/offline testing or complete factual verification of every question.


### Duplicate-selection safety pass — 27 November 2026
- Added `data/question-policy.js` with 16 same-subject/measurement candidate IDs retired from newly generated rounds.
- Server now uses the active pool for random, daily, facts/meta counts and fresh multiplayer rounds; the full question map remains intact for historical result lookup.
- No question data rows were deleted and no stable IDs were changed.
- Added a regression test for retired-ID retention and active-pool count; updated the duplicate audit and release checklist.
- Complete bank: 260 records; active fresh-round pool: 244. The 500 active, verified-question target remains open.
