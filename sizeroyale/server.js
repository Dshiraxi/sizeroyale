'use strict';
/* SizeRoyale server – zero dependencies (Node 18+).
 * Static files + JSON API + server-authoritative multiplayer over Server-Sent Events. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { UNITS, toMeters, score } = require('./lib/scoring');
const { QUESTIONS, CATEGORIES } = require('./data/questions');
const { ROUTES, FAQ } = require('./lib/seo');

const PORT = Number(process.env.PORT || 3000);
const SITE = (process.env.SITE_URL || 'https://sizeroyale.fun').replace(/\/$/, '');
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'data', 'db.json');
const PUBLIC = path.join(__dirname, 'public');
const ROUND_SEC = Number(process.env.ROUND_SEC || 20);
const REVEAL_SEC = Number(process.env.REVEAL_SEC || 6);
const ROUNDS = 5;

const QBY = new Map(QUESTIONS.map((q) => [q.id, q]));
const AVATARS = ['🦊', '🐼', '🦁', '🐯', '🐙', '🦄', '🐲', '🦉', '🐬', '🚀', '👑', '🎮'];

/* ------------------------------------------------------------------ DB */
let db = { users: {}, sessions: {}, history: [], daily: {}, contact: [] };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))); } catch (_) { /* fresh db */ }
let saveTimer = null;
function saveDb() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      const tmp = DB_FILE + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(db));
      fs.renameSync(tmp, DB_FILE);
    } catch (e) { console.error('DB save failed', e.message); }
  }, 150);
}
function flushDb() { if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; } try { fs.mkdirSync(path.dirname(DB_FILE), { recursive: true }); fs.writeFileSync(DB_FILE, JSON.stringify(db)); } catch (_) {} }

/* ------------------------------------------------------------------ helpers */
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
function send(res, code, body, headers = {}) { res.writeHead(code, headers); res.end(body); }
function json(res, code, obj, headers = {}) { send(res, code, JSON.stringify(obj), Object.assign({ 'content-type': 'application/json', 'cache-control': 'no-store' }, headers)); }
class HttpError extends Error { constructor(code, msg) { super(msg); this.code = code; } }
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 20000) { reject(new HttpError(413, 'Body too large')); req.destroy(); } });
    req.on('end', () => { if (!data) return resolve({}); try { resolve(JSON.parse(data)); } catch (_) { reject(new HttpError(400, 'Invalid JSON')); } });
    req.on('error', reject);
  });
}
function cookies(req) { const o = {}; (req.headers.cookie || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); }); return o; }
const buckets = new Map();
function rateLimit(req, key, max, windowMs) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
  const k = key + '|' + ip; const now = Date.now();
  let b = buckets.get(k);
  if (!b || b.reset < now) { b = { n: 0, reset: now + windowMs }; buckets.set(k, b); }
  if (++b.n > max) throw new HttpError(429, 'Too many requests – slow down.');
}
setInterval(() => { const now = Date.now(); for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k); }, 60000).unref();

function hashPw(pw, salt) { return crypto.scryptSync(pw, salt, 64).toString('hex'); }
function currentUser(req) { const t = cookies(req).sr_session; if (!t) return null; const s = db.sessions[t]; if (!s || s.exp < Date.now()) return null; return db.users[s.uid] || null; }
function publicUser(u) { return u && { id: u.id, username: u.username, avatar: u.avatar, unitSystem: u.unitSystem || 'metric' }; }
function cleanName(s) { return String(s || '').replace(/[^A-Za-z0-9 _-]/g, '').trim().slice(0, 16); }

/* ------------------------------------------------------------------ questions */
function rangeFor(a) { const e = Math.log10(a); return [Math.pow(10, Math.floor(e) - 2), Math.pow(10, Math.ceil(e) + 2)]; }
function qPublic(q) { return { id: q.id, category: q.category, icon: q.icon, kind: q.kind, title: q.title, description: q.description, difficulty: q.difficulty, range: rangeFor(q.meters) }; }
function evaluate(q, value, unit) {
  const v = Number(value);
  if (!Number.isFinite(v) || v <= 0) throw new HttpError(400, 'Enter a number greater than 0.');
  if (!UNITS[unit]) throw new HttpError(400, 'Unknown unit.');
  let g; try { g = toMeters(v, unit); } catch (e) { throw new HttpError(400, e.message); }
  const s = score(g, q.meters);
  return { qid: q.id, category: q.category, title: q.title, kind: q.kind, description: q.description, icon: q.icon, guessM: g, actualM: q.meters, pctError: ((g - q.meters) / q.meters) * 100, score: s, accuracy: s / 10, fact: q.fact, sourceName: q.sourceName, sourceUrl: q.sourceUrl };
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function seedFrom(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function shuffle(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* Timezone strategy: the daily challenge day is the UTC calendar date. */
const todayKey = (d = new Date()) => d.toISOString().slice(0, 10);
function dailyQuestions(dateKey) {
  const rnd = mulberry32(seedFrom('sizeroyale-daily-' + dateKey));
  const cats = shuffle(CATEGORIES.map((c) => c.slug), rnd).slice(0, 5);
  return cats.map((slug) => { const pool = QUESTIONS.filter((q) => q.category === slug).sort((a, b) => a.id.localeCompare(b.id)); return pool[Math.floor(rnd() * pool.length)]; });
}
function msToNextUtcDay() { const n = new Date(); return Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1) - n.getTime(); }

/* ------------------------------------------------------------------ stats */
function userHistory(uid) { return db.history.filter((h) => h.userId === uid); }
function globalBoard() {
  const m = new Map();
  for (const h of db.history) {
    let e = m.get(h.userId); if (!e) { e = { userId: h.userId, points: 0, games: new Set() }; m.set(h.userId, e); }
    e.points += h.score; e.games.add(h.gameId);
  }
  return [...m.values()].filter((e) => db.users[e.userId]).map((e) => ({ userId: e.userId, username: db.users[e.userId].username, avatar: db.users[e.userId].avatar, points: e.points, games: e.games.size })).sort((a, b) => b.points - a.points || a.username.localeCompare(b.username)).map((e, i) => Object.assign(e, { rank: i + 1 }));
}
function dailyBoard(dateKey) {
  const rows = [];
  for (const [k, rec] of Object.entries(db.daily)) {
    const [d, uid] = k.split('|'); if (d !== dateKey || !rec.done || !db.users[uid]) continue;
    rows.push({ userId: uid, username: db.users[uid].username, avatar: db.users[uid].avatar, points: rec.total, finishedAt: rec.finishedAt });
  }
  rows.sort((a, b) => b.points - a.points || a.finishedAt - b.finishedAt);
  return rows.map((r, i) => Object.assign(r, { rank: i + 1 }));
}
function streakFor(uid) {
  const days = new Set(Object.entries(db.daily).filter(([k, r]) => k.endsWith('|' + uid) && r.done).map(([k]) => k.split('|')[0]));
  let d = new Date(); if (!days.has(todayKey(d))) d = new Date(d.getTime() - 864e5);
  let n = 0; while (days.has(todayKey(d))) { n++; d = new Date(d.getTime() - 864e5); }
  return n;
}
function statsFor(uid) {
  const hist = userHistory(uid);
  const games = new Map(); const cats = {};
  for (const h of hist) {
    games.set(h.gameId, (games.get(h.gameId) || 0) + h.score);
    const c = (cats[h.category] = cats[h.category] || { n: 0, pts: 0 }); c.n++; c.pts += h.score;
  }
  const totalPoints = hist.reduce((s, h) => s + h.score, 0);
  const catPerf = Object.entries(cats).map(([slug, c]) => ({ slug, answered: c.n, accuracy: c.pts / c.n / 10 })).sort((a, b) => b.accuracy - a.accuracy);
  const board = globalBoard(); const me = board.find((r) => r.userId === uid);
  return { gamesPlayed: games.size, questionsAnswered: hist.length, averageAccuracy: hist.length ? totalPoints / hist.length / 10 : 0, totalPoints, personalBest: games.size ? Math.max(...games.values()) : 0, bestCategory: catPerf[0] ? catPerf[0].slug : null, categoryPerformance: catPerf, streak: streakFor(uid), rank: me ? me.rank : null, recent: hist.slice(-20).reverse(), dailyHistory: Object.entries(db.daily).filter(([k, r]) => k.endsWith('|' + uid) && r.done).map(([k, r]) => ({ date: k.split('|')[0], total: r.total })).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30) };
}

/* ------------------------------------------------------------------ API */
const routes = [];
const route = (method, pattern, fn) => routes.push({ method, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), fn });

route('GET', '/api/meta', async () => ({ categories: CATEGORIES.map((c) => Object.assign({}, c, { questions: QUESTIONS.filter((q) => q.category === c.slug).length })), totalQuestions: QUESTIONS.length, players: Object.keys(db.users).length, answers: db.history.length, faq: FAQ }));
const shortName = (t) => { const s = t.replace(/^(How (long|tall|deep|far|large) (is|was|can)|What is the (equatorial )?(diameter|wingspan) of)\s+(a |an |the )?/i, '').replace(/\?$/, '').replace(/ be$/, ''); return s.charAt(0).toUpperCase() + s.slice(1); };
// Explore / comparison content. NOTE: this exposes the answers by design (they are published reference facts).
route('GET', '/api/facts', async () => ({ facts: QUESTIONS.map((q) => ({ id: q.id, category: q.category, icon: q.icon, kind: q.kind, shortName: shortName(q.title), description: q.description, meters: q.meters, fact: q.fact, sourceName: q.sourceName, sourceUrl: q.sourceUrl })) }));

route('POST', '/api/auth/signup', async ({ req, res, body }) => {
  rateLimit(req, 'auth', 20, 600000);
  const username = String(body.username || '').trim(); const pw = String(body.password || '');
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) throw new HttpError(400, 'Username: 3–20 letters, numbers or underscores.');
  if (pw.length < 8 || pw.length > 100) throw new HttpError(400, 'Password must be at least 8 characters.');
  if (Object.values(db.users).some((u) => u.username.toLowerCase() === username.toLowerCase())) throw new HttpError(409, 'That username is taken.');
  const salt = crypto.randomBytes(16).toString('hex');
  const u = { id: crypto.randomUUID(), username, salt, hash: hashPw(pw, salt), avatar: AVATARS.includes(body.avatar) ? body.avatar : AVATARS[Math.floor(Math.random() * AVATARS.length)], unitSystem: 'metric', created: Date.now() };
  db.users[u.id] = u; saveDb();
  return startSession(res, u);
});
route('POST', '/api/auth/login', async ({ req, res, body }) => {
  rateLimit(req, 'auth', 20, 600000);
  const u = Object.values(db.users).find((x) => x.username.toLowerCase() === String(body.username || '').toLowerCase());
  if (!u || hashPw(String(body.password || ''), u.salt) !== u.hash) throw new HttpError(401, 'Wrong username or password.');
  return startSession(res, u);
});
function startSession(res, u) {
  const t = crypto.randomBytes(32).toString('hex');
  db.sessions[t] = { uid: u.id, exp: Date.now() + 30 * 864e5 }; saveDb();
  res.setHeader('Set-Cookie', `sr_session=${t}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${30 * 86400}${SITE.startsWith('https') ? '; Secure' : ''}`);
  return { user: publicUser(u) };
}
route('POST', '/api/auth/logout', async ({ req, res }) => { const t = cookies(req).sr_session; if (t) { delete db.sessions[t]; saveDb(); } res.setHeader('Set-Cookie', 'sr_session=; HttpOnly; Path=/; Max-Age=0'); return { ok: true }; });
route('GET', '/api/me', async ({ user }) => ({ user: publicUser(user) }));
route('POST', '/api/me', async ({ user, body }) => {
  if (!user) throw new HttpError(401, 'Sign in first.');
  if (body.avatar !== undefined) { if (!AVATARS.includes(body.avatar)) throw new HttpError(400, 'Invalid avatar.'); user.avatar = body.avatar; }
  if (body.unitSystem !== undefined) { if (!['metric', 'us'].includes(body.unitSystem)) throw new HttpError(400, 'Invalid unit system.'); user.unitSystem = body.unitSystem; }
  saveDb(); return { user: publicUser(user) };
});
route('GET', '/api/avatars', async () => ({ avatars: AVATARS }));

route('GET', '/api/question', async ({ query }) => {
  const cat = query.get('cat'); const diff = query.get('diff');
  const seen = new Set((query.get('seen') || '').split(',').filter(Boolean));
  let pool = QUESTIONS.filter((q) => (!cat || cat === 'all' || q.category === cat) && (!diff || diff === 'all' || q.difficulty === diff));
  if (!pool.length) throw new HttpError(404, 'No questions for that selection.');
  let fresh = pool.filter((q) => !seen.has(q.id)); let reshuffled = false;
  if (!fresh.length) { fresh = pool; reshuffled = true; }
  const q = fresh[Math.floor(Math.random() * fresh.length)];
  return { question: qPublic(q), reshuffled, poolSize: pool.length };
});

route('POST', '/api/guess', async ({ req, user, body }) => {
  rateLimit(req, 'guess', 90, 60000);
  const q = QBY.get(body.qid); if (!q) throw new HttpError(404, 'Unknown question.');
  const mode = body.mode;
  if (!['unlimited', 'daily-guest'].includes(mode)) throw new HttpError(400, 'Invalid mode.');
  if (mode === 'daily-guest' && !dailyQuestions(todayKey()).some((d) => d.id === q.id)) throw new HttpError(400, 'Not part of today\'s challenge.');
  const result = evaluate(q, body.value, body.unit);
  let saved = false;
  if (user && mode === 'unlimited') {
    const gameId = String(body.gameId || '').slice(0, 40) || ('u-' + Date.now());
    if (db.history.some((h) => h.userId === user.id && h.gameId === gameId && h.qid === q.id)) throw new HttpError(409, 'Already answered.');
    db.history.push({ userId: user.id, ts: Date.now(), mode, gameId, qid: q.id, category: q.category, title: q.title, score: result.score, guessM: result.guessM, actualM: result.actualM, pctError: result.pctError });
    saveDb(); saved = true;
  }
  return { result, saved };
});

route('GET', '/api/daily', async ({ user }) => {
  const date = todayKey(); const qs = dailyQuestions(date);
  const out = { date, endsInMs: msToNextUtcDay(), maxPoints: 5000, questions: qs.map(qPublic), answers: [], done: false, total: 0, streak: 0 };
  if (user) { const rec = db.daily[date + '|' + user.id]; if (rec) { out.answers = rec.answers; out.done = rec.done; out.total = rec.total; } out.streak = streakFor(user.id); }
  return out;
});
route('POST', '/api/daily/guess', async ({ req, user, body }) => {
  rateLimit(req, 'guess', 90, 60000);
  if (!user) throw new HttpError(401, 'Sign in to save your daily result.');
  const date = todayKey(); const qs = dailyQuestions(date); const key = date + '|' + user.id;
  const rec = db.daily[key] || (db.daily[key] = { answers: [], done: false, total: 0 });
  if (rec.done) throw new HttpError(409, 'You have already completed today\'s challenge.');
  const idx = Number(body.index);
  if (idx !== rec.answers.length) throw new HttpError(409, 'Out of order – refresh to continue where you left off.');
  const q = qs[idx]; const result = evaluate(q, body.value, body.unit);
  rec.answers.push(result); rec.total += result.score;
  db.history.push({ userId: user.id, ts: Date.now(), mode: 'daily', gameId: 'daily-' + date, qid: q.id, category: q.category, title: q.title, score: result.score, guessM: result.guessM, actualM: result.actualM, pctError: result.pctError });
  if (rec.answers.length === qs.length) { rec.done = true; rec.finishedAt = Date.now(); }
  saveDb();
  return { result, done: rec.done, total: rec.total, streak: rec.done ? streakFor(user.id) : undefined };
});

route('GET', '/api/leaderboard/global', async ({ user }) => { const b = globalBoard(); return { rows: b.slice(0, 50), me: user ? b.find((r) => r.userId === user.id) || null : null }; });
route('GET', '/api/leaderboard/daily', async ({ query, user }) => {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(query.get('date') || '') ? query.get('date') : todayKey();
  const b = dailyBoard(date); return { date, rows: b.slice(0, 50), me: user ? b.find((r) => r.userId === user.id) || null : null };
});
route('GET', '/api/stats', async ({ user }) => { if (!user) throw new HttpError(401, 'Sign in to see your stats.'); return { user: publicUser(user), stats: statsFor(user.id) }; });
route('POST', '/api/contact', async ({ req, body }) => {
  rateLimit(req, 'contact', 5, 3600000);
  const name = String(body.name || '').slice(0, 80); const email = String(body.email || '').slice(0, 120); const message = String(body.message || '').slice(0, 2000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 5) throw new HttpError(400, 'Please fill in name, a valid email and a message.');
  db.contact.push({ ts: Date.now(), name, email, message }); saveDb(); return { ok: true };
});

/* ------------------------------------------------------------------ multiplayer */
const rooms = new Map(); const expired = new Map();
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCode() { for (;;) { let c = ''; for (let i = 0; i < 5; i++) c += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]; if (!rooms.has(c) && !expired.has(c)) return c; } }
function getRoom(code) {
  code = String(code || '').toUpperCase().replace(/^SR-/, '');
  const r = rooms.get(code);
  if (!r) { if (expired.has(code)) throw new HttpError(410, 'That room has expired.'); throw new HttpError(404, 'Room not found. Check the code.'); }
  return r;
}
function auth(room, body) {
  const p = room.players.find((x) => x.id === body.pid);
  if (!p || p.token !== body.token) throw new HttpError(403, 'Not a member of this room.');
  return p;
}
function activePlayers(r) { return r.players.filter((p) => !p.left); }
function addPlayer(room, name, avatar, user) {
  const p = { id: crypto.randomBytes(6).toString('hex'), token: crypto.randomBytes(16).toString('hex'), name, avatar, userId: user ? user.id : null, ready: false, connected: false, left: false, score: 0, errSum: 0, guesses: [], conns: new Set() };
  room.players.push(p); return p;
}
function viewFor(room, pid) {
  const now = Date.now();
  const v = { code: room.code, state: room.state, phase: room.phase, round: room.round, rounds: ROUNDS, roundSec: ROUND_SEC, maxPlayers: room.maxPlayers, category: room.category, hostId: room.hostId, you: pid, serverNow: now, phaseEndsAt: room.phaseEndsAt,
    players: room.players.filter((p) => !p.left || room.state !== 'lobby').map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, ready: p.ready || p.id === room.hostId, connected: p.connected, left: p.left, isHost: p.id === room.hostId, score: p.score, submitted: room.state === 'playing' && room.phase === 'question' ? !!room.roundGuesses[p.id] : undefined })) };
  if (room.state === 'playing') {
    const q = QBY.get(room.qs[room.round]); v.question = qPublic(q);
    if (room.phase === 'reveal') v.reveal = { actualM: q.meters, fact: q.fact, sourceName: q.sourceName, sourceUrl: q.sourceUrl, results: room.players.map((p) => ({ pid: p.id, guessM: room.roundGuesses[p.id] ? room.roundGuesses[p.id].guessM : null, score: room.roundGuesses[p.id] ? room.roundGuesses[p.id].score : 0, pctError: room.roundGuesses[p.id] ? room.roundGuesses[p.id].pctError : null })) };
  }
  if (room.state === 'results') v.final = room.final;
  return v;
}
function broadcast(room) {
  for (const p of room.players) for (const res of p.conns) { try { res.write(`data: ${JSON.stringify(viewFor(room, p.id))}\n\n`); } catch (_) {} }
}
function clearTimer(room) { if (room.timer) { clearTimeout(room.timer); room.timer = null; } }
function startRound(room) {
  room.phase = 'question'; room.roundGuesses = {}; room.phaseEndsAt = Date.now() + ROUND_SEC * 1000;
  clearTimer(room); room.timer = setTimeout(() => endRound(room), ROUND_SEC * 1000 + 30);
  broadcast(room);
}
function endRound(room) {
  if (room.phase !== 'question') return; // already ended (e.g., all submitted)
  clearTimer(room);
  const q = QBY.get(room.qs[room.round]);
  for (const p of room.players) {
    const g = room.roundGuesses[p.id];
    if (g) { p.score += g.score; p.errSum += Math.abs(Math.log(g.guessM / q.meters)); } else p.errSum += 10; // missed round penalty for tie-break
  }
  room.phase = 'reveal'; room.phaseEndsAt = Date.now() + REVEAL_SEC * 1000;
  room.timer = setTimeout(() => nextRound(room), REVEAL_SEC * 1000);
  broadcast(room);
}
function nextRound(room) {
  clearTimer(room);
  if (room.round + 1 >= ROUNDS) return finish(room);
  room.round++; startRound(room);
}
function finish(room) {
  clearTimer(room);
  const rank = room.players.slice().sort((a, b) => b.score - a.score || a.errSum - b.errSum);
  const top = rank[0]; const tiedTop = rank.filter((p) => p.score === top.score && Math.abs(p.errSum - top.errSum) < 1e-9);
  room.state = 'results'; room.phase = 'results'; room.phaseEndsAt = null;
  room.final = { ranking: rank.map((p, i) => ({ pid: p.id, name: p.name, avatar: p.avatar, score: p.score, rank: i + 1, left: p.left })), winners: tiedTop.map((p) => p.id), tieBreakUsed: rank.filter((p) => p.score === top.score).length > 1, perfectTie: tiedTop.length > 1 };
  room.lastActive = Date.now(); broadcast(room);
}
function checkAllSubmitted(room) {
  const need = activePlayers(room).filter((p) => p.connected);
  if (need.length && need.every((p) => room.roundGuesses[p.id])) { endRound(room); }
}
function leave(room, p) {
  if (room.state === 'lobby') room.players = room.players.filter((x) => x.id !== p.id); else { p.left = true; p.connected = false; }
  for (const c of p.conns) { try { c.end(); } catch (_) {} } p.conns.clear();
  if (room.hostId === p.id) { const next = activePlayers(room)[0]; if (next) room.hostId = next.id; }
  if (!activePlayers(room).length) return closeRoom(room);
  if (room.state === 'playing' && room.phase === 'question') checkAllSubmitted(room);
  broadcast(room);
}
function closeRoom(room) { clearTimer(room); for (const p of room.players) for (const c of p.conns) { try { c.end(); } catch (_) {} } rooms.delete(room.code); expired.set(room.code, Date.now()); }
setInterval(() => {
  const now = Date.now();
  for (const r of rooms.values()) {
    const anyConn = r.players.some((p) => p.connected);
    if (anyConn) r.lastActive = now;
    if (now - r.lastActive > 10 * 60000 || now - r.created > 3 * 3600000) closeRoom(r);
  }
  for (const [c, t] of expired) if (now - t > 3600000) expired.delete(c);
  for (const [t, s] of Object.entries(db.sessions)) if (s.exp < now) delete db.sessions[t];
}, 30000).unref();

function identity(body, user) {
  if (user) return { name: user.username, avatar: user.avatar, user };
  const name = cleanName(body.name); if (name.length < 2) throw new HttpError(400, 'Choose a nickname (2–16 letters or numbers).');
  return { name, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], user: null };
}
route('POST', '/api/rooms', async ({ req, user, body }) => {
  rateLimit(req, 'room', 20, 600000);
  const id = identity(body, user);
  const maxPlayers = [2, 3, 4].includes(Number(body.maxPlayers)) ? Number(body.maxPlayers) : 4;
  const category = CATEGORIES.some((c) => c.slug === body.category) ? body.category : 'all';
  const room = { code: newCode(), state: 'lobby', phase: 'lobby', players: [], hostId: null, maxPlayers, category, round: 0, qs: [], roundGuesses: {}, phaseEndsAt: null, timer: null, created: Date.now(), lastActive: Date.now(), final: null };
  const p = addPlayer(room, id.name, id.avatar, id.user); room.hostId = p.id; rooms.set(room.code, room);
  return { code: room.code, pid: p.id, token: p.token };
});
route('GET', '/api/rooms/:code', async ({ params }) => { const r = getRoom(params.code); return { code: r.code, state: r.state, players: activePlayers(r).length, maxPlayers: r.maxPlayers }; });
route('POST', '/api/rooms/:code/join', async ({ req, user, params, body }) => {
  rateLimit(req, 'room', 60, 600000);
  const r = getRoom(params.code);
  if (body.pid && body.token) { const p = r.players.find((x) => x.id === body.pid && x.token === body.token && !x.left); if (p) return { code: r.code, pid: p.id, token: p.token, rejoined: true }; }
  if (r.state !== 'lobby') throw new HttpError(409, 'That game has already started.');
  if (activePlayers(r).length >= r.maxPlayers) throw new HttpError(409, 'That room is full.');
  const id = identity(body, user);
  if (r.players.some((p) => p.name.toLowerCase() === id.name.toLowerCase())) id.name = (id.name + Math.floor(Math.random() * 90 + 10)).slice(0, 16);
  const p = addPlayer(r, id.name, id.avatar, id.user); r.lastActive = Date.now(); broadcast(r);
  return { code: r.code, pid: p.id, token: p.token };
});
route('POST', '/api/rooms/:code/ready', async ({ params, body }) => { const r = getRoom(params.code); const p = auth(r, body); if (r.state !== 'lobby') throw new HttpError(409, 'Game already started.'); p.ready = !!body.ready; broadcast(r); return { ok: true }; });
route('POST', '/api/rooms/:code/start', async ({ params, body }) => {
  const r = getRoom(params.code); const p = auth(r, body);
  if (r.hostId !== p.id) throw new HttpError(403, 'Only the host can start.');
  if (r.state !== 'lobby') throw new HttpError(409, 'Already started.');
  const act = activePlayers(r);
  if (act.length < 2) throw new HttpError(400, 'Need at least 2 players.');
  if (!act.every((x) => x.id === r.hostId || x.ready)) throw new HttpError(400, 'Everyone must be ready.');
  const pool = QUESTIONS.filter((q) => r.category === 'all' || q.category === r.category);
  r.qs = shuffle(pool, Math.random).slice(0, ROUNDS).map((q) => q.id);
  if (r.qs.length < ROUNDS) throw new HttpError(400, 'Not enough questions in that category.');
  r.state = 'playing'; r.round = 0; for (const x of r.players) { x.score = 0; x.errSum = 0; }
  startRound(r); return { ok: true };
});
route('POST', '/api/rooms/:code/guess', async ({ req, params, body }) => {
  rateLimit(req, 'mpguess', 120, 60000);
  const r = getRoom(params.code); const p = auth(r, body);
  if (r.state !== 'playing' || r.phase !== 'question') throw new HttpError(409, 'No round is accepting guesses.');
  if (Date.now() > r.phaseEndsAt) throw new HttpError(409, 'Time is up.');
  if (p.left) throw new HttpError(403, 'You left this game.');
  if (r.roundGuesses[p.id]) throw new HttpError(409, 'You already guessed this round.');
  const q = QBY.get(r.qs[r.round]); const ev = evaluate(q, body.value, body.unit);
  r.roundGuesses[p.id] = { guessM: ev.guessM, score: ev.score, pctError: ev.pctError };
  p.guesses.push(ev.score);
  broadcast(r); checkAllSubmitted(r);
  return { ok: true };
});
route('POST', '/api/rooms/:code/leave', async ({ params, body }) => { const r = getRoom(params.code); const p = auth(r, body); leave(r, p); return { ok: true }; });
route('POST', '/api/rooms/:code/rematch', async ({ params, body }) => {
  const r = getRoom(params.code); auth(r, body);
  if (r.state !== 'results') throw new HttpError(409, 'Match not finished.');
  r.players = r.players.filter((p) => !p.left); clearTimer(r);
  r.state = 'lobby'; r.phase = 'lobby'; r.round = 0; r.qs = []; r.final = null; r.roundGuesses = {}; r.phaseEndsAt = null;
  for (const p of r.players) { p.ready = false; p.score = 0; p.errSum = 0; p.guesses = []; }
  broadcast(r); return { ok: true };
});
function sse(req, res, params, query) {
  const r = getRoom(params.code); const p = r.players.find((x) => x.id === query.get('pid') && x.token === query.get('token') && !x.left);
  if (!p) throw new HttpError(403, 'Not a member of this room.');
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive', 'x-accel-buffering': 'no' });
  res.write('retry: 1500\n\n'); p.conns.add(res); p.connected = true; r.lastActive = Date.now();
  res.write(`data: ${JSON.stringify(viewFor(r, p.id))}\n\n`); broadcast(r);
  const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch (_) {} }, 15000);
  req.on('close', () => {
    clearInterval(ping); p.conns.delete(res);
    if (p.conns.size === 0) {
      p.connected = false; broadcast(r);
      if (r.state === 'lobby') setTimeout(() => { if (!p.connected && rooms.has(r.code) && r.players.includes(p) && r.state === 'lobby') leave(r, p); }, 20000).unref();
      else if (r.state === 'playing' && r.phase === 'question') checkAllSubmitted(r);
    }
  });
}

async function handleApi(req, res, url) {
  const user = currentUser(req);
  try {
    if (req.method === 'GET' && /^\/api\/rooms\/[^/]+\/events$/.test(url.pathname)) return sse(req, res, { code: url.pathname.split('/')[3] }, url.searchParams);
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = r.re.exec(url.pathname); if (!m) continue;
      const body = req.method === 'POST' ? await readBody(req) : {};
      const out = await r.fn({ req, res, user: req.method === 'POST' && url.pathname.startsWith('/api/auth/') ? null : user, params: m.groups || {}, query: url.searchParams, body });
      return json(res, 200, out);
    }
    json(res, 404, { error: 'Not found' });
  } catch (e) {
    if (e instanceof HttpError) json(res, e.code, { error: e.message }); else { console.error(e); json(res, 500, { error: 'Server error' }); }
  }
}

/* ------------------------------------------------------------------ static + SEO */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let indexTpl = null;
function matchRoute(p) {
  p = p.replace(/\/+$/, '') || '/';
  if (ROUTES[p]) return { path: p, meta: ROUTES[p] };
  if (/^\/room\/[A-Za-z0-9-]+$/.test(p)) return { path: p, meta: { title: 'Friends Battle Room | SizeRoyale', description: 'Join a private SizeRoyale room.', noindex: true } };
  return null;
}
function renderIndex(p) {
  if (!indexTpl || process.env.NODE_ENV !== 'production') indexTpl = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
  const m = matchRoute(p); const meta = m ? m.meta : { title: 'Page not found | SizeRoyale', description: 'This page does not exist.', noindex: true };
  const canon = SITE + (m ? m.path : '/'); const img = SITE + '/icons/og.svg';
  const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'SizeRoyale', url: SITE }];
  if (m && m.path === '/') ld.push({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'SizeRoyale', applicationCategory: 'GameApplication', operatingSystem: 'Any', description: meta.description, url: SITE });
  if (m && m.meta.faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: m.meta.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  if (m && m.path !== '/') ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: meta.h1 || meta.title.split('|')[0].trim(), item: canon }] });
  const head = `<title>${esc(meta.title)}</title><meta name="description" content="${esc(meta.description)}"><link rel="canonical" href="${canon}">${meta.noindex ? '<meta name="robots" content="noindex">' : ''}<meta property="og:type" content="website"><meta property="og:site_name" content="SizeRoyale"><meta property="og:title" content="${esc(meta.title)}"><meta property="og:description" content="${esc(meta.description)}"><meta property="og:url" content="${canon}"><meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('')}`;
  const nos = `<noscript><main><h1>${esc(meta.h1 || meta.title.split('|')[0].trim())}</h1><p>${esc(meta.description)}</p>${(meta.faq || []).map(([q, a]) => `<h2>${esc(q)}</h2><p>${esc(a)}</p>`).join('')}<nav>${Object.entries(ROUTES).filter(([, v]) => !v.noindex).map(([k, v]) => `<a href="${k}">${esc(v.h1 || v.title.split('|')[0].trim())}</a>`).join(' ')}</nav><p>SizeRoyale needs JavaScript to play.</p></main></noscript>`;
  return { html: indexTpl.replace('<!--SEO_HEAD-->', head).replace('<!--SEO_NOSCRIPT-->', nos), status: m ? 200 : 404 };
}
function sitemap() {
  const urls = Object.entries(ROUTES).filter(([, v]) => !v.noindex).map(([p]) => `<url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
function serveStatic(req, res, url) {
  if (url.pathname === '/sitemap.xml') return send(res, 200, sitemap(), { 'content-type': 'application/xml' });
  if (url.pathname === '/robots.txt') return send(res, 200, `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /room/\nSitemap: ${SITE}/sitemap.xml\n`, { 'content-type': 'text/plain' });
  if (url.pathname === '/lib/scoring.js') return send(res, 200, fs.readFileSync(path.join(__dirname, 'lib', 'scoring.js')), { 'content-type': MIME['.js'] });
  const rel = decodeURIComponent(url.pathname);
  const file = path.normalize(path.join(PUBLIC, rel));
  if (file.startsWith(PUBLIC + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile() && path.basename(file) !== 'index.html') {
    const ext = path.extname(file);
    return send(res, 200, fs.readFileSync(file), { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': rel === '/sw.js' ? 'no-cache' : 'public, max-age=3600' });
  }
  const { html, status } = renderIndex(url.pathname);
  send(res, status, html, { 'content-type': MIME['.html'], 'cache-control': 'no-cache' });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'SAMEORIGIN'); res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  try { serveStatic(req, res, url); } catch (e) { console.error(e); send(res, 500, 'Server error'); }
});
if (require.main === module) {
  server.listen(PORT, () => console.log(`SizeRoyale running on ${SITE}  (${QUESTIONS.length} questions)`));
  process.on('SIGINT', () => { flushDb(); process.exit(0); });
  process.on('SIGTERM', () => { flushDb(); process.exit(0); });
}
module.exports = { server, dailyQuestions, todayKey };
