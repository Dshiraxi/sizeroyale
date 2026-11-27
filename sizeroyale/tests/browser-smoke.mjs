import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:8787';
const out = path.join(process.cwd(), 'test-artifacts');
fs.mkdirSync(out, { recursive: true });

async function checkSeo(route, { title, canonical = true, noindex = false } = {}) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route + ' should return HTTP 200');
  const html = await response.text();
  const titles = [...html.matchAll(/<title>/gi)];
  const descriptions = [...html.matchAll(/<meta\s+name=["']description["']/gi)];
  assert.equal(titles.length, 1, route + ' should have exactly one title');
  assert.equal(descriptions.length, 1, route + ' should have exactly one meta description');
  const lowerHtml = html.toLowerCase();
  const titleStart = lowerHtml.indexOf('<title>');
  const titleEnd = lowerHtml.indexOf('</title>');
  const titleText = titleStart >= 0 && titleEnd > titleStart ? html.slice(titleStart + 7, titleEnd) : '';
  if (title) assert.ok(titleText.toLowerCase().includes(title.toLowerCase()), route + ' title mismatch: ' + titleText);
  if (canonical) assert.ok(html.includes('rel="canonical" href="https://sizeroyale.fun' + (route === '/' ? '/' : route.replace(/\/$/, '')) + '"'), route + ' canonical mismatch');
  assert.equal(/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(html), noindex, route + ' robots noindex mismatch');
  return html;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  const home = await checkSeo('/', { title: 'Free Size Comparison Game Online' });
  assert.match(home, /"@type":"WebApplication"/);
  await checkSeo('/size-comparison', { title: 'Size Comparison Game' });
  await checkSeo('/animals', { title: 'Animal Size Guessing Game' });
  await checkSeo('/faq', { title: 'FAQ | SizeRoyale' });
  await checkSeo('/profile', { title: 'Your Profile | SizeRoyale', noindex: true });

  const missing = await fetch(base + '/this-route-should-not-exist');
  assert.equal(missing.status, 404, 'unknown route must return 404');
  assert.match(missing.headers.get('x-robots-tag') || '', /noindex/i);
  const missingHtml = await missing.text();
  assert.match(missingHtml, /Page not found/);
  assert.match(missingHtml, /noindex,follow/);

  await page.goto(base + '/size-comparison', { waitUntil: 'networkidle' });
  await page.locator('#startCompare').waitFor({ timeout: 15000 });
  await page.locator('.compare-tool-more summary').click();
  const a = page.locator('#cA');
  const b = page.locator('#cB');
  await a.waitFor();
  await b.waitFor();
  const initialA = await a.inputValue();
  await a.selectOption({ index: 1 });
  const selectedLabel = await a.locator('option:checked').textContent();
  const kind = selectedLabel.match(/\(([^)]+)\)/)?.[1];
  assert.ok(kind, 'selected item must expose its measurement kind');
  const compatibleLabels = await b.locator('option').allTextContents();
  assert.ok(compatibleLabels.length > 0, 'compatible selector should not be empty');
  assert.ok(compatibleLabels.every((label) => label.toLowerCase().includes('(' + kind.toLowerCase() + ')')), 'second selector must only contain matching measurement kinds');
  assert.notEqual(await b.inputValue(), await a.inputValue(), 'selectors must not select the same item');
  await b.selectOption({ index: 0 });
  await page.locator('#cOut').waitFor();
  assert.match(await page.locator('#cOut').innerText(), /Sources:/, 'valid comparison should show source links');

  const desktopMetrics = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    background: getComputedStyle(document.body).backgroundColor
  }));
  assert.ok(desktopMetrics.width <= desktopMetrics.viewport + 1, 'desktop layout must not overflow horizontally');
  await page.screenshot({ path: path.join(out, 'desktop-size-comparison.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileMetrics = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    background: getComputedStyle(document.body).backgroundColor
  }));
  assert.ok(mobileMetrics.width <= mobileMetrics.viewport + 1, 'mobile layout must not overflow horizontally');
  await page.screenshot({ path: path.join(out, 'mobile-size-comparison.png'), fullPage: true });

  assert.deepEqual(pageErrors, [], 'browser runtime should not emit uncaught page errors');
  console.log(JSON.stringify({
    status: 'PASS',
    seoRoutes: ['/', '/size-comparison', '/animals', '/faq', '/profile'],
    unknownRoute: '404 + noindex',
    comparisonSelectors: 'matching measurement kinds only; different items',
    desktop: desktopMetrics,
    mobile: mobileMetrics,
    pageErrors
  }, null, 2));
} finally {
  await browser.close();
}
