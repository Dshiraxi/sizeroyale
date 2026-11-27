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
- [ ] Re-run checks after the duplicate-policy and audit-documentation commits (current branch head).
- [x] Automated tests cover SEO routes, comparison compatibility, responsive overflow, PWA assets and runtime errors.
- [x] Previous CI run: https://github.com/Dshiraxi/sizeroyale/actions/runs/45992337889

## Remaining before production launch
- [x] Complete bank contains 260 records (100 legacy + 160 expansion); 16 near-duplicates are excluded from fresh rounds without deleting history, leaving 244 active questions. Target of 500 active verified questions is not yet reached.
- [x] Disposition of the 16 first-scan duplicate candidates recorded; regression test protects the 16-ID exclusion policy and historical lookup.
- [ ] Broader cross-bank audit for remaining overlaps and false positives; first scan was not exhaustive.
- [ ] Verify source pages and measurement values for legacy records; citation URLs alone do not prove the data.
- [x] Stable legacy IDs and historical lookup protection added before retirement; no question rows deleted.
- [ ] Review privacy and terms copy.
- [ ] Manual physical-device touch, install and offline testing.
- [ ] After deployment, verify live sitemap, canonicals and Google Search Console.

## Deployment
**Not deployed.** Live production remains unchanged until the owner chooses to merge and deploy.
