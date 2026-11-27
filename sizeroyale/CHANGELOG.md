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
- The four new comparison-helper tests were run independently in a local Node test harness: 4/4 passed.
- Cloudflare PR preview build initially failed because preview-scoped variables were missing. The Wrangler configuration was corrected on the branch; the next build result is pending.
- The Cloudflare PR preview command `npx wrangler preview` completed successfully after the preview-variable fix (4 modified assets uploaded; preview reports no active URL). The full repository test suite, local Wrangler dry run and browser/device checks are still outstanding. Do not treat this branch as deployment-ready until those checks are completed.
