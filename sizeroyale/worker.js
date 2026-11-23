/* Cloudflare Workers entry point for SizeRoyale.
 * Static frontend uses Workers Assets. Existing Node HTTP APIs are adapted
 * through Cloudflare's node:http server integration.
 */
import { httpServerHandler } from 'cloudflare:node';
import app from './server.js';

const api = httpServerHandler(app.server);
const SITE = 'https://sizeroyale.fazedanish5.workers.dev';
const HEAD = `<title>SizeRoyale – Guess the Size Game Online</title>
<meta name="description" content="Guess the real size of animals, dinosaurs, planets, countries and everyday objects. Play daily challenges, compete with friends and climb the SizeRoyale leaderboard.">
<link rel="canonical" href="${SITE}/">
<meta property="og:type" content="website"><meta property="og:site_name" content="SizeRoyale">
<meta property="og:title" content="SizeRoyale – Guess. Compete. Dominate.">
<meta property="og:description" content="Test your knowledge with real-world size comparisons. Play free online.">
<meta name="twitter:card" content="summary">`;
const NOSCRIPT = '<noscript><main><h1>Guess the Size Game</h1><p>Play SizeRoyale to guess real-world sizes, take daily challenges and compete with friends. JavaScript is required to play.</p></main></noscript>';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return api(request, env, ctx);
    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    let html = await response.text();
    html = html.replace('<!--SEO_HEAD-->', HEAD).replace('<!--SEO_NOSCRIPT-->', NOSCRIPT);
    const headers = new Headers(response.headers);
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('cache-control', 'no-cache');
    return new Response(html, { status: response.status, headers });
  }
};
