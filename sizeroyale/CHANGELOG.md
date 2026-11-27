# SizeRoyale – Upgrade changelog

## Prepared on 27 November 2026

### Updated
- Applied a light visual system using white, light blue, navy, royal blue and green accents while retaining the existing HTML/CSS/vanilla JavaScript architecture.
- Updated the browser theme color and cache-busted the stylesheet.
- Added `public/lib/comparison.js` with shared measurement compatibility, comparison and pair-generation helpers.
- Updated the Size Comparison page to use the shared helper.
- The manual comparison selectors now restrict the second item to the same measurement type and a different item. Incompatible measurements are rejected by the comparison helper.
- Added four focused Node tests for measurement compatibility and pair generation.
- Corrected repeated question titles in the existing dataset without changing any measurement values or source URLs.
- Corrected the CH-47 Chinook 30.1 m record: Boeing labels this as operating rotor length, not fuselage length; the question now states that measurement boundary and links to Boeing.
- Added three question-bank integrity tests covering record count, unique IDs/titles, categories, positive meter values, definitions and HTTPS source URLs.
- Updated the PWA manifest and offline fallback to the light theme, bumped the service-worker cache to v10, and added the comparison helper to the precache shell.
- Added PWA manifest/cache assertions to the Chromium browser smoke test.
- Added `docs/FACT-CHECK-REPORT.md` documenting selected authoritative-source checks and the remaining unverified records.
- Updated the Cloudflare Worker to use the same route metadata as `lib/seo.js`, so every known HTML route receives route-specific metadata and structured data.
- Unknown HTML routes now receive a 404 response and noindex metadata.
- Set the production Worker `SITE_URL` variable to `https://sizeroyale.fun`.
- Added preview-scoped Wrangler variables after the Cloudflare PR build reported that `[previews.vars]` was missing. Preview canonicals use the existing workers.dev hostname; production values remain unchanged.

### Preserved
- Existing domain and route paths.
- Vanilla JavaScript, Node HTTP server, REST API, SSE multiplayer, JSON storage, Cloudflare Worker adapter, PWA and Wrangler deployment structure.
- Existing scoring formula, question bank, account flows and multiplayer logic.
- No production deployment was performed.

### Validation status
- The four comparison-helper tests previously passed independently in a local Node test harness: 4/4 passed.
- Latest full suite before the new question-integrity tests: 26/26 passed. CI rerun including the new tests and PWA smoke assertions is queued/pending.
- Cloudflare PR preview build initially failed because preview-scoped variables were missing. The Wrangler configuration was corrected on the branch; the next build result is pending.
- Cloudflare PR preview previously completed successfully after the preview-variable fix (4 modified assets uploaded; preview reported no active URL). Latest CI rerun for the additional dataset/PWA checks is queued. Physical-device install/offline testing remains outstanding.
