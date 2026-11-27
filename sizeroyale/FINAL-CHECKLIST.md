# SizeRoyale – Final checklist

## Branch and scope
- [x] Existing architecture, domain, route paths and scoring formula preserved.
- [x] Light blue / white / navy / green visual direction applied.
- [x] Measurement-safe comparison helpers and compatible selectors added.
- [x] Worker route-specific SEO metadata, canonical site URL and unknown-route 404/noindex added.
- [x] PWA theme/cache/precache updated.
- [x] Changes remain on `upgrade/route-seo-light-theme`; PR #2 is open and draft.
- [x] No merge or production deployment performed.

## Automated checks — latest run passed
- [x] Node test suite: **29/29 passed**.
- [x] Wrangler Worker `deploy --dry-run`: passed; no deployment.
- [x] Chromium browser/route smoke: passed.
- [x] SEO metadata on home, comparison, animals, FAQ and profile routes; unknown route 404 + noindex.
- [x] Comparison selector compatibility, distinct choices and source output.
- [x] Desktop/mobile horizontal-overflow and uncaught-error checks.
- [x] PWA manifest theme, service-worker cache version and comparison helper precache assertions.
- [x] Latest CI run: https://github.com/Dshiraxi/sizeroyale/actions/runs/45992337889

## Remaining before production launch
- [ ] Question bank currently has 120 entries; the target of 500 is not yet reached.
- [ ] Continue source-by-source verification; the 80 additions have agency/institution/manufacturer/space-agency citations, but legacy records still need review and near-duplicates need cleanup.
- [ ] Review privacy and terms copy.
- [ ] Manual physical-device touch, install and offline testing.
- [ ] After deployment, verify live sitemap, canonicals and Google Search Console.

## Deployment
**Not deployed.** Live production remains unchanged until the owner chooses to merge and deploy.
