# SizeRoyale – Final checklist

## Changes prepared on branch `upgrade/route-seo-light-theme`
- [x] Preserve the existing project architecture and domain.
- [x] Preserve existing routes and scoring formula.
- [x] Apply the requested light blue / white / navy / green theme direction.
- [x] Add shared measurement-safe comparison helpers.
- [x] Restrict manual comparison to matching measurement types.
- [x] Add four comparison-helper tests.
- [x] Make Cloudflare Worker SEO route-specific using `lib/seo.js`.
- [x] Set the production Worker site URL to `https://sizeroyale.fun`.
- [x] Add preview-scoped Wrangler variables to satisfy Cloudflare's PR preview build.
- [x] Keep changes on a separate branch; do not change `main` or deploy.

## Checks completed
- [x] New comparison helper tests: 4/4 passed in an isolated Node test harness.
- [x] Worker module syntax check: passed.
- [x] Cloudflare preview command completed successfully after the preview-variable fix (the preview has no active URL).
- [x] Complete repository `npm test` suite: 26/26 passed.
- [x] Wrangler Worker bundle `deploy --dry-run` passed; no deployment.
- [x] Browser-tested SEO metadata for `/`, `/size-comparison`, `/animals`, `/faq`, `/profile`, and an unknown URL (404 + noindex).
- [x] Chromium-tested comparison selectors: same measurement kind only, distinct items, source links rendered.
- [x] Chromium-tested desktop/mobile layouts for horizontal overflow and uncaught browser errors; screenshots captured.
- [ ] Full PWA install/offline and physical-device touch testing remain outstanding.

## Data and launch items still outstanding
- [ ] Question bank currently contains 100 questions (Animals 16, Dinosaurs 14, Space 17, Geography 18, Vehicles 18, Everyday Objects 17), not the 500-question target.
- [ ] Existing measurement values and source URLs still need a factual audit; do not add unverified measurements.
- [ ] Privacy and Terms copy still needs appropriate review.
- [ ] Confirm live sitemap, canonicals and Google Search Console after the user deploys.
- [ ] Complete browser/device testing before production deployment.

## Deployment
**Not deployed.** The production website remains unchanged until the user chooses to deploy the reviewed branch.
