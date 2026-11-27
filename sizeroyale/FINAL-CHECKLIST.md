# SizeRoyale – Final checklist

## Branch and scope
- [x] Existing architecture, domain, route paths and scoring formula preserved.
- [x] Light blue / white / navy / green visual direction applied.
- [x] Measurement-safe comparison helpers and compatible selectors added.
- [x] Worker route-specific SEO metadata, canonical site URL and unknown-route 404/noindex added.
- [x] PWA theme/cache/precache updated.
- [x] Changes remain on `upgrade/route-seo-light-theme`; PR #2 is open and draft.
- [x] No merge or production deployment performed.

## Automated checks
- [x] Previous successful CI: 29/29 Node tests, Wrangler dry-run, and Chromium route/browser smoke.
- [ ] Re-run checks after the current duplicate-audit documentation commits.
- [x] Automated tests cover SEO routes, comparison compatibility, responsive overflow, PWA assets and runtime errors.
- [x] Previous CI run: https://github.com/Dshiraxi/sizeroyale/actions/runs/45992337889

## Remaining before production launch
- [x] Question bank contains 260 records (100 legacy + 160 expansion records); target of 500 is not yet reached.
- [ ] Complete entity + measurement + definition duplicate audit. The first scan is documented in docs/QUESTION-DUPLICATE-AUDIT.md; it is a candidate list, not a completed deduplication.
- [ ] Verify source pages and measurement values for legacy records; citation URLs alone do not prove the data.
- [ ] Add compatibility-safe stable IDs / historical lookup protection before retiring any question.
- [ ] Review privacy and terms copy.
- [ ] Manual physical-device touch, install and offline testing.
- [ ] After deployment, verify live sitemap, canonicals and Google Search Console.

## Deployment
**Not deployed.** Live production remains unchanged until the owner chooses to merge and deploy.
