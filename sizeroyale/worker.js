/* Cloudflare Workers entry point for SizeRoyale.
 * Static frontend uses Workers Assets. Existing Node HTTP APIs are adapted
 * through Cloudflare's node:http server integration.
 * Route metadata is shared with the Node server so every page gets unique SEO.
 */
import { httpServerHandler } from 'cloudflare:node';
import app from './server.js';
import seo from './lib/seo.js';

const api = httpServerHandler(app.server);
const ROUTES = seo.ROUTES || {};
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function routeFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (ROUTES[path]) return { path, meta: ROUTES[path] };
  if (/^\/room\/[A-Za-z0-9-]+$/.test(path)) {
    return { path, meta: { title: 'Friends Battle Room | SizeRoyale', h1: 'Friends Battle Room', description: 'Join a private SizeRoyale room.', noindex: true } };
  }
  return null;
}

function renderSeo(pathname, site) {
  const match = routeFor(pathname);
  const meta = match ? match.meta : { title: 'Page not found | SizeRoyale', h1: 'Page not found', description: 'This page does not exist.', noindex: true };
  const canonical = match ? site + match.path : '';
  const image = site + '/icons/og.svg';
  const structured = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'SizeRoyale', url: site }];
  if (match && match.path === '/') {
    structured.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'SizeRoyale', applicationCategory: 'GameApplication', operatingSystem: 'Any', description: meta.description, url: site });
  }
  if (match && meta.faq) {
    structured.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: meta.faq.map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a }
    })) });
  }
  if (match && match.path !== '/') {
    structured.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: meta.h1 || meta.title.split('|')[0].trim(), item: canonical }
    ] });
  }
  let head = '<title>' + esc(meta.title) + '</title>' +
    '<meta name="description" content="' + esc(meta.description) + '">' +
    (canonical ? '<link rel="canonical" href="' + esc(canonical) + '">' : '') +
    (meta.noindex ? '<meta name="robots" content="noindex,follow">' : '') +
    '<meta property="og:type" content="website"><meta property="og:site_name" content="SizeRoyale">' +
    '<meta property="og:title" content="' + esc(meta.title) + '">' +
    '<meta property="og:description" content="' + esc(meta.description) + '">' +
    (canonical ? '<meta property="og:url" content="' + esc(canonical) + '">' : '') +
    '<meta property="og:image" content="' + esc(image) + '">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    structured.map((item) => '<script type="application/ld+json">' + JSON.stringify(item).replace(/</g, '\\u003c') + '</script>').join('');
  const links = Object.entries(ROUTES).filter(([, item]) => !item.noindex)
    .map(([path, item]) => '<a href="' + esc(path) + '">' + esc(item.h1 || item.title.split('|')[0].trim()) + '</a>').join(' ');
  const faq = (meta.faq || []).map(([q, a]) => '<h2>' + esc(q) + '</h2><p>' + esc(a) + '</p>').join('');
  const noscript = '<noscript><main><h1>' + esc(meta.h1 || meta.title.split('|')[0].trim()) +
    '</h1><p>' + esc(meta.description) + '</p>' + faq +
    '<nav aria-label="Site pages">' + links + '</nav><p>SizeRoyale needs JavaScript to play.</p></main></noscript>';
  return { head, noscript, status: match ? 200 : 404, noindex: !!meta.noindex };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return api.fetch(request, env, ctx);
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    const site = (env.SITE_URL || 'https://sizeroyale.fun').replace(/\/$/, '');
    const seoData = renderSeo(url.pathname, site);
    let html = await response.text();
    html = html.replace('<!--SEO_HEAD-->', seoData.head).replace('<!--SEO_NOSCRIPT-->', seoData.noscript);
    const headers = new Headers(response.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('cache-control', 'no-cache');
    if (seoData.noindex) headers.set('x-robots-tag', 'noindex, follow');
    return new Response(html, { status: seoData.status, headers });
  }
};
