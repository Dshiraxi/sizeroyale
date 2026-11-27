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
- [ ] Confirm the Cloudflare preview build passes after the preview-variable fix.
- [ ] Run the complete repository `npm test` suite after checking out this branch.
- [ ] Run the project Wrangler build / dry run using the repository's local Wrangler version.
- [ ] Test route metadata for `/`, `/size-comparison`, `/animals`, `/faq`, `/profile`, and an unknown URL.
- [ ] Test comparison selector behavior in a real browser.
- [ ] Check desktop and mobile layouts, touch interactions, PWA and console errors.

## Data and launch items still outstanding
- [ ] Question bank currently contains 52 questions, not the 500-question target.
- [ ] Existing measurement values and source URLs still need a factual audit; do not add unverified measurements.
- [ ] Privacy and Terms copy still needs appropriate review.
- [ ] Confirm live sitemap, canonicals and Google Search Console after the user deploys.
- [ ] Complete browser/device testing before production deployment.

## Deployment
**Not deployed.** The production website remains unchanged until the user chooses to deploy the reviewed branch.
