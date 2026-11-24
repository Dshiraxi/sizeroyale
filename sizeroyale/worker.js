/* Cloudflare Workers entry point for SizeRoyale.
 * Static frontend uses Workers Assets. Existing Node HTTP APIs are adapted
 * through Cloudflare's node:http server integration.
 */
import { httpServerHandler } from 'cloudflare:node';
import app from './server.js';

const api = httpServerHandler(app.server);
const SITE = 'https://sizeroyale.fun';
const ROUTE_SEO = {
  '/': { title: 'Free Size Comparison Game Online | SizeRoyale', description: 'Play SizeRoyale, a free size comparison game. Guess the size of animals, dinosaurs, planets and more. Test your knowledge and beat your score.', h1: 'How Big Is It Really? Play the Size Comparison Game' },
  '/animals': { title: 'Animal Size Comparison Game | SizeRoyale', description: 'Compare the sizes of amazing animals, from tiny creatures to giant whales. Play and discover how big animals really are.', h1: 'Animal Size Comparison Game' },
  '/dinosaurs': { title: 'Dinosaur Size Comparison Game | SizeRoyale', description: 'Compare dinosaur sizes and discover how massive prehistoric creatures really were. Test your knowledge with SizeRoyale.', h1: 'Dinosaur Size Comparison Game' },
  '/space': { title: 'Planet Size Comparison | SizeRoyale', description: 'Compare the sizes of planets in our solar system. Discover how Earth, Mars, Jupiter and other worlds measure up.', h1: 'Planet Size Comparison Game' }
};
const DEFAULT_SEO = ROUTE_SEO['/'];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const NOSCRIPT = '<noscript><main><h1>SizeRoyale size comparison game</h1><p>Play free size comparison games for animals, dinosaurs, planets and more. JavaScript is required to play.</p></main></noscript>';
const NOSCRIPT = '<noscript><main><h1>Guess the Size Game</h1><p>Play SizeRoyale to guess real-world sizes, take daily challenges and compete with friends. JavaScript is required to play.</p></main></noscript>';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return api.fetch(request, env, ctx);
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    let html = await response.text();
    const route = ROUTE_SEO[url.pathname.replace(/\\/$/, '') || '/'] || DEFAULT_SEO;
    const canonical = SITE + (url.pathname === '/' ? '/' : url.pathname.replace(/\\/$/, ''));
    const title = escapeHtml(route.title);
    const description = escapeHtml(route.description);
    const HEAD = `<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="SizeRoyale">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}">`;
    html = html.replace('<!--SEO_HEAD-->', HEAD).replace('<!--SEO_NOSCRIPT-->', NOSCRIPT);
    const headers = new Headers(response.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('cache-control', 'no-cache');
    return new Response(html, { status: response.status, headers });
  }
};
