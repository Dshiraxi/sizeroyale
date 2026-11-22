const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
process.env.DB_FILE = path.join(os.tmpdir(), 'sr-test-' + process.pid + '.json');
process.env.ROUND_SEC = '3'; process.env.REVEAL_SEC = '1'; process.env.SITE_URL = 'https://example.test';
const { server, dailyQuestions, todayKey } = require('../server');
const { QUESTIONS } = require('../data/questions');
const { score } = require('../lib/scoring');

let base; test.before(async () => { await new Promise((r) => server.listen(0, r)); base = 'http://127.0.0.1:' + server.address().port; });
test.after(() => server.close());

async function call(method, p, body, cookie) {
  const r = await fetch(base + p, { method, headers: Object.assign({ 'content-type': 'application/json' }, cookie ? { cookie } : {}), body: body ? JSON.stringify(body) : undefined, redirect: 'manual' });
  const text = await r.text(); let j; try { j = JSON.parse(text); } catch (_) { j = text; }
  return { status: r.status, body: j, cookie: (r.headers.get('set-cookie') || '').split(';')[0], headers: r.headers };
}
function sse(p) { // minimal SSE client returning latest state + waiters
  const o = { last: null, waiters: [], req: null };
  o.req = http.get(base + p, (res) => { let buf = ''; res.on('data', (c) => { buf += c; let i; while ((i = buf.indexOf('\n\n')) >= 0) { const chunk = buf.slice(0, i); buf = buf.slice(i + 2); const m = /^data: (.*)$/m.exec(chunk); if (m) { o.last = JSON.parse(m[1]); o.waiters = o.waiters.filter((w) => !(w.fn(o.last) && (w.res(o.last), true))); } } }); });
  o.until = (fn, ms = 8000) => new Promise((res, rej) => { if (o.last && fn(o.last)) return res(o.last); const t = setTimeout(() => rej(new Error('timeout waiting for state; last=' + JSON.stringify(o.last && { s: o.last.state, ph: o.last.phase, r: o.last.round }))), ms); o.waiters.push({ fn, res: (v) => { clearTimeout(t); res(v); } }); });
  o.close = () => o.req.destroy(); return o;
}
const stripOk = (q) => assert.ok(!('meters' in q) && !('fact' in q) && !('sourceUrl' in q), 'answer leaked to client');

test('SEO: unique titles/descriptions, canonical, sitemap, robots, 404', async () => {
  const { ROUTES } = require('../lib/seo'); const titles = new Set(), descs = new Set();
  for (const [p, m] of Object.entries(ROUTES)) {
    const r = await call('GET', p); assert.equal(r.status, 200, p);
    assert.ok(r.body.includes(`<title>${m.title.replace(/&/g, '&amp;')}</title>`), 'title ' + p);
    assert.ok(r.body.includes(`rel="canonical" href="https://example.test${p}"`), 'canonical ' + p);
    assert.ok(r.body.includes('property="og:title"'));
    assert.ok(!titles.has(m.title), 'dup title ' + p); titles.add(m.title); assert.ok(!descs.has(m.description), 'dup desc ' + p); descs.add(m.description);
  }
  const sm = await call('GET', '/sitemap.xml'); assert.ok(sm.body.includes('<loc>https://example.test/daily-challenge</loc>')); assert.ok(!sm.body.includes('/profile'));
  const rb = await call('GET', '/robots.txt'); assert.ok(rb.body.includes('Sitemap: https://example.test/sitemap.xml'));
  assert.equal((await call('GET', '/nope')).status, 404);
  assert.equal((await call('GET', '/../server.js')).status, 404);
  const home = await call('GET', '/'); assert.ok(home.body.includes('FAQPage')); assert.ok(home.body.includes('<h1>'));
});

test('static assets served and question endpoint hides answers', async () => {
  for (const f of ['/css/style.css', '/js/core.js', '/js/pages.js', '/js/mp.js', '/lib/scoring.js', '/manifest.webmanifest', '/sw.js', '/offline.html']) assert.equal((await call('GET', f)).status, 200, f);
  const q = await call('GET', '/api/question?cat=animals&diff=easy'); assert.equal(q.status, 200); stripOk(q.body.question); assert.equal(q.body.question.category, 'animals');
  const m = await call('GET', '/api/meta'); assert.equal(m.body.categories.length, 6); assert.equal(m.body.totalQuestions, QUESTIONS.length);
});

test('question exhaustion triggers reshuffle', async () => {
  const pool = QUESTIONS.filter((q) => q.category === 'animals' && q.difficulty === 'easy').map((q) => q.id);
  const r = await call('GET', '/api/question?cat=animals&diff=easy&seen=' + pool.join(',')); assert.equal(r.body.reshuffled, true);
  const r2 = await call('GET', '/api/question?cat=animals&diff=easy&seen=' + pool.slice(1).join(',')); assert.equal(r2.body.reshuffled, false); assert.equal(r2.body.question.id, pool[0]);
});

test('server-side scoring, unit handling and validation', async () => {
  const q = QUESTIONS.find((x) => x.id === 'geography-001'); // Everest 8848.86 m
  const ft = await call('POST', '/api/guess', { qid: q.id, value: 8848.86 / 0.3048, unit: 'ft', mode: 'unlimited' });
  assert.equal(ft.body.result.score, 1000); assert.equal(ft.body.saved, false);
  const r = await call('POST', '/api/guess', { qid: q.id, value: 10000, unit: 'm', mode: 'unlimited', score: 99999 });
  assert.equal(r.body.result.score, score(10000, q.meters)); // client-sent score ignored
  for (const bad of [0, -3, 'abc', null, Infinity, 1e30]) assert.equal((await call('POST', '/api/guess', { qid: q.id, value: bad, unit: 'm', mode: 'unlimited' })).status, 400, String(bad));
  assert.equal((await call('POST', '/api/guess', { qid: q.id, value: 5, unit: 'parsec', mode: 'unlimited' })).status, 400);
  assert.equal((await call('POST', '/api/guess', { qid: 'nope', value: 5, unit: 'm', mode: 'unlimited' })).status, 404);
  assert.equal((await call('POST', '/api/guess', { qid: q.id, value: 5, unit: 'm', mode: 'weird' })).status, 400);
});

test('accounts, history, stats, leaderboard, profile permissions', async () => {
  assert.equal((await call('POST', '/api/auth/signup', { username: 'a!', password: 'password123' })).status, 400);
  assert.equal((await call('POST', '/api/auth/signup', { username: 'alice', password: 'short' })).status, 400);
  const a = await call('POST', '/api/auth/signup', { username: 'alice', password: 'password123' }); assert.equal(a.status, 200); assert.ok(a.cookie.startsWith('sr_session='));
  assert.ok(a.headers.get('set-cookie').includes('HttpOnly'));
  assert.equal((await call('POST', '/api/auth/signup', { username: 'ALICE', password: 'password123' })).status, 409);
  const bad = await call('POST', '/api/auth/login', { username: 'alice', password: 'wrongpass1' }); assert.equal(bad.status, 401);
  const b = await call('POST', '/api/auth/signup', { username: 'bob', password: 'password456' });
  assert.equal((await call('GET', '/api/me', null, a.cookie)).body.user.username, 'alice'); assert.equal((await call('GET', '/api/me')).body.user, null);
  assert.equal((await call('GET', '/api/stats')).status, 401);
  // unlimited saves + duplicate protection
  const g = { qid: 'animals-001', value: 25, unit: 'm', mode: 'unlimited', gameId: 'g1' };
  const r1 = await call('POST', '/api/guess', g, a.cookie); assert.equal(r1.body.saved, true);
  assert.equal((await call('POST', '/api/guess', g, a.cookie)).status, 409);
  const st = (await call('GET', '/api/stats', null, a.cookie)).body.stats; assert.equal(st.questionsAnswered, 1); assert.equal(st.gamesPlayed, 1); assert.equal(st.totalPoints, r1.body.result.score); assert.equal(st.bestCategory, 'animals');
  // a user cannot change another user's data: /api/me only edits the session user
  await call('POST', '/api/me', { avatar: '🐼' }, b.cookie); assert.equal((await call('GET', '/api/me', null, a.cookie)).body.user.avatar === '🐼', a.body.user.avatar === '🐼');
  assert.equal((await call('POST', '/api/me', { avatar: 'evil' }, a.cookie)).status, 400);
  const gl = await call('GET', '/api/leaderboard/global', null, a.cookie); assert.equal(gl.body.rows[0].username, 'alice'); assert.equal(gl.body.me.rank, 1);
  const logout = await call('POST', '/api/auth/logout', {}, a.cookie); assert.equal(logout.status, 200);
  assert.equal((await call('GET', '/api/me', null, a.cookie)).body.user, null, 'session must be invalid after logout');
});

test('daily challenge: deterministic, ordered, one attempt, leaderboard, streak', async () => {
  const u = await call('POST', '/api/auth/signup', { username: 'carol', password: 'password789' }); const c = u.cookie;
  const d1 = await call('GET', '/api/daily', null, c); const d2 = await call('GET', '/api/daily');
  assert.deepEqual(d1.body.questions.map((q) => q.id), d2.body.questions.map((q) => q.id)); assert.equal(d1.body.questions.length, 5); d1.body.questions.forEach(stripOk);
  assert.deepEqual(d1.body.questions.map((q) => q.id), dailyQuestions(todayKey()).map((q) => q.id));
  // out of order rejected
  assert.equal((await call('POST', '/api/daily/guess', { index: 2, value: 5, unit: 'm' }, c)).status, 409);
  assert.equal((await call('POST', '/api/daily/guess', { index: 0, value: 5, unit: 'm' })).status, 401);
  let total = 0; const qs = dailyQuestions(todayKey());
  for (let i = 0; i < 5; i++) { const r = await call('POST', '/api/daily/guess', { index: i, value: qs[i].meters, unit: 'm' }, c); assert.equal(r.status, 200); total += r.body.result.score; assert.equal(r.body.done, i === 4); }
  assert.equal(total, 5000);
  assert.equal((await call('POST', '/api/daily/guess', { index: 0, value: 5, unit: 'm' }, c)).status, 409, 'second attempt must be rejected');
  const d3 = await call('GET', '/api/daily', null, c); assert.equal(d3.body.done, true); assert.equal(d3.body.total, 5000); assert.equal(d3.body.streak, 1);
  const lb = await call('GET', '/api/leaderboard/daily'); assert.equal(lb.body.rows[0].username, 'carol'); assert.equal(lb.body.rows[0].points, 5000);
  // guest guess only for today's questions
  assert.equal((await call('POST', '/api/guess', { qid: qs[0].id, value: 5, unit: 'm', mode: 'daily-guest' })).status, 200);
  const other = QUESTIONS.find((q) => !qs.some((d) => d.id === q.id));
  assert.equal((await call('POST', '/api/guess', { qid: other.id, value: 5, unit: 'm', mode: 'daily-guest' })).status, 400);
});

test('contact form validation', async () => {
  assert.equal((await call('POST', '/api/contact', { name: 'x', email: 'bad', message: 'hello there' })).status, 400);
  assert.equal((await call('POST', '/api/contact', { name: 'x', email: 'a@b.co', message: 'hello there' })).status, 200);
});

test('multiplayer: full 2-player match with synced timer, duplicates, tie-break, rematch', async () => {
  assert.equal((await call('GET', '/api/rooms/ZZZZZ')).status, 404);
  const host = await call('POST', '/api/rooms', { name: 'Host', maxPlayers: 2 }); assert.equal(host.status, 200); const code = host.body.code; assert.match(code, /^[A-Z2-9]{5}$/);
  assert.equal((await call('POST', '/api/rooms', { name: 'x' })).status, 400);
  const g = await call('POST', `/api/rooms/${code}/join`, { name: 'Guest' }); assert.equal(g.status, 200);
  assert.equal((await call('POST', `/api/rooms/${code}/join`, { name: 'Third' })).status, 409, 'full room');
  const hs = sse(`/api/rooms/${code}/events?pid=${host.body.pid}&token=${host.body.token}`); const gs = sse(`/api/rooms/${code}/events?pid=${g.body.pid}&token=${g.body.token}`);
  await hs.until((s) => s.players.length === 2 && s.players.every((p) => p.connected));
  assert.equal(hs.last.hostId, host.body.pid);
  const H = { pid: host.body.pid, token: host.body.token }, G = { pid: g.body.pid, token: g.body.token };
  assert.equal((await call('POST', `/api/rooms/${code}/start`, H)).status, 400, 'guest not ready');
  assert.equal((await call('POST', `/api/rooms/${code}/start`, G)).status, 403, 'non-host cannot start');
  assert.equal((await call('POST', `/api/rooms/${code}/ready`, { pid: G.pid, token: 'wrong', ready: true })).status, 403);
  await call('POST', `/api/rooms/${code}/ready`, Object.assign({ ready: true }, G));
  await hs.until((s) => s.players.find((p) => p.id === G.pid).ready);
  assert.equal((await call('POST', `/api/rooms/${code}/start`, H)).status, 200);
  assert.equal((await call('POST', `/api/rooms/${code}/join`, { name: 'Late' })).status, 409, 'already started');
  const seenQs = [];
  for (let round = 0; round < 5; round++) {
    const st = await hs.until((s) => s.phase === 'question' && s.round === round); stripOk(st.question); seenQs.push(st.question.id);
    const g2 = await gs.until((s) => s.phase === 'question' && s.round === round); assert.equal(g2.question.id, st.question.id, 'same question for all');
    assert.ok(st.phaseEndsAt - st.serverNow > 2000 && st.phaseEndsAt - st.serverNow <= 3000, 'server-provided deadline ≈ ROUND_SEC');
    const real = QUESTIONS.find((q) => q.id === st.question.id);
    // host and guest submit simultaneously
    const [r1, r2] = await Promise.all([call('POST', `/api/rooms/${code}/guess`, Object.assign({ value: real.meters, unit: 'm' }, H)), call('POST', `/api/rooms/${code}/guess`, Object.assign({ value: real.meters * 1.1, unit: 'm' }, G))]);
    assert.equal(r1.status, 200); assert.equal(r2.status, 200);
    assert.equal((await call('POST', `/api/rooms/${code}/guess`, Object.assign({ value: real.meters, unit: 'm' }, H))).status, 409, 'duplicate submission');
    assert.equal((await call('POST', `/api/rooms/${code}/guess`, Object.assign({ value: -1, unit: 'm' }, G))).status, 409);
    const rv = await hs.until((s) => s.phase === 'reveal' && s.round === round); // everyone submitted → early end
    assert.equal(rv.reveal.actualM, real.meters); assert.equal(rv.reveal.results.find((r) => r.pid === H.pid).score, 1000); assert.equal(rv.reveal.results.find((r) => r.pid === G.pid).score, score(real.meters * 1.1, real.meters));
  }
  assert.equal(new Set(seenQs).size, 5, 'five distinct questions');
  const fin = await hs.until((s) => s.state === 'results'); assert.equal(fin.final.ranking[0].pid, H.pid); assert.equal(fin.final.ranking[0].score, 5000); assert.deepEqual(fin.final.winners, [H.pid]);
  assert.equal(fin.players.find((p) => p.id === G.pid).score, fin.final.ranking[1].score);
  // rematch
  assert.equal((await call('POST', `/api/rooms/${code}/rematch`, G)).status, 200);
  const lob = await hs.until((s) => s.state === 'lobby'); assert.ok(lob.players.every((p) => p.score === 0 && (p.id === H.pid || !p.ready)));
  hs.close(); gs.close();
});

test('multiplayer: timer expiry auto-advances without guesses, tie-break, reconnect, host departure', async () => {
  const host = await call('POST', '/api/rooms', { name: 'H2', maxPlayers: 3, category: 'animals' }); const code = host.body.code; const H = { pid: host.body.pid, token: host.body.token };
  const g = await call('POST', `/api/rooms/${code}/join`, { name: 'G2' }); const G = { pid: g.body.pid, token: g.body.token };
  const hs = sse(`/api/rooms/${code}/events?pid=${H.pid}&token=${H.token}`); let gs = sse(`/api/rooms/${code}/events?pid=${G.pid}&token=${G.token}`);
  await hs.until((s) => s.players.length === 2); await call('POST', `/api/rooms/${code}/ready`, Object.assign({ ready: true }, G)); await call('POST', `/api/rooms/${code}/start`, H);
  const t0 = Date.now(); await hs.until((s) => s.phase === 'question' && s.round === 0);
  // guest refreshes mid-round (reconnect keeps identity)
  gs.close(); await hs.until((s) => !s.players.find((p) => p.id === G.pid).connected, 4000);
  gs = sse(`/api/rooms/${code}/events?pid=${G.pid}&token=${G.token}`); const back = await gs.until((s) => s.phase === 'question'); assert.equal(back.you, G.pid);
  // nobody guesses → server timer ends the round
  const rv = await hs.until((s) => s.phase === 'reveal' && s.round === 0, 6000); assert.ok(Date.now() - t0 >= 2500, 'round lasted ~3s, driven by server timer');
  assert.ok(rv.reveal.results.every((r) => r.score === 0));
  await hs.until((s) => s.phase === 'question' && s.round === 1, 4000);
  // host leaves mid-game → host transferred
  await call('POST', `/api/rooms/${code}/leave`, H);
  const after = await gs.until((s) => s.hostId === G.pid); assert.equal(after.hostId, G.pid);
  const fin = await gs.until((s) => s.state === 'results', 20000);
  assert.ok(fin.final.ranking.length === 2); hs.close(); gs.close();
});

test('multiplayer: lobby leave removes player, empty room expires (410)', async () => {
  const host = await call('POST', '/api/rooms', { name: 'Solo' }); const code = host.body.code; const H = { pid: host.body.pid, token: host.body.token };
  assert.equal((await call('POST', `/api/rooms/${code}/start`, H)).status, 400, 'need 2 players');
  assert.equal((await call('POST', `/api/rooms/${code}/leave`, H)).status, 200);
  assert.equal((await call('GET', `/api/rooms/${code}`)).status, 410);
});
