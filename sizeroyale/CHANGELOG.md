# SizeRoyale – Upgrade changelog

## Prepared on 27 November 2026

### Updated
- Applied a light visual system using white, light blue, navy, royal blue and green accents while retaining the existing HTML/CSS/vanilla JavaScript architecture.
- Updated the browser theme color and cache-busted the stylesheet.
- Added `public/lib/comparison.js` with shared measurement compatibility, comparison and pair-generation helpers.
- Updated the Size Comparison page to use the shared helper.
- The manual comparison selectors now restrict the second item to the same measurement type and a different item. Incompatible measurements are rejected by the comparison helper.
- Added four focused Node tests for measurement compatibility and pair generation.
- Updated the Cloudflare Worker to use the same route metadata as `lib/seo.js`, so HTML routes receive their own title, description, canonical, Open Graph metadata, robots directives and structured data.
- Unknown HTML routes now receive a 404 response and noindex metadata.
- Set the Worker `SITE_URL` variable to `https://sizeroyale.fun`.

### Preserved
- Existing domain and route paths.
- Vanilla JavaScript, Node HTTP server, REST API, SSE multiplayer, JSON storage, Cloudflare Worker adapter, PWA and Wrangler deployment structure.
- Existing scoring formula, question bank, account flows and multiplayer logic.
- No deployment was performed.

### Validation status
- The four new comparison-helper tests were run independently in a local Node test harness: 4/4 passed.
- Cloudflare Worker module syntax was checked independently: passed.
- The full repository test suite, Wrangler build/dry run and browser/device checks were not run in this environment. Do not treat this branch as deployment-ready until those checks are completed.
