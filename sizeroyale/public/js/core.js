/* SizeRoyale client core: state, API, router, shared game UI. */
(function () {
  'use strict';
  const { fmt, toMeters, fromMeters, UNITS, METRIC_UNITS, US_UNITS, bestUnit } = SR;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} },
    del(k) { try { localStorage.removeItem(k); } catch (_) {} },
  };
  const S = { user: null, meta: null, system: store.get('sr_units', 'metric'), sound: store.get('sr_sound', true) };
  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);

  /* ---------- API ---------- */
  async function api(path, body) {
    const opts = { credentials: 'same-origin' };
    if (body !== undefined) { opts.method = 'POST'; opts.headers = { 'content-type': 'application/json' }; opts.body = JSON.stringify(body); }
    let r; try { r = await fetch('/api' + path, opts); } catch (_) { throw Object.assign(new Error('You appear to be offline.'), { status: 0 }); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || 'Something went wrong.'), { status: r.status });
    return j;
  }

  /* ---------- sound (synthesised, no copyrighted audio) ---------- */
  let ac = null;
  function tone(freqs, dur = 0.12, type = 'sine', vol = 0.06) {
    if (!S.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; const t = ac.currentTime + i * dur; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur); });
    } catch (_) {}
  }
  const sfx = { click: () => tone([520], .05, 'triangle'), submit: () => tone([440, 660], .09, 'triangle'), reveal: (s) => tone(s > 600 ? [523, 659, 784] : [330, 294], .11, 'sine'), win: () => tone([523, 659, 784, 1047], .13, 'triangle') };

  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600); }
  function confetti() {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const c = document.createElement('div'); c.className = 'confetti';
    const cols = ['#FFC94A', '#873CFA', '#35B9FF', '#E84AB7', '#37D9A5'];
    for (let i = 0; i < 44; i++) { const p = document.createElement('i'); p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % 5]; p.style.animationDelay = Math.random() * .6 + 's'; p.style.animationDuration = 1.8 + Math.random() * 1.4 + 's'; c.appendChild(p); }
    document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
  }

  /* ---------- units ---------- */
  const unitsList = () => (S.system === 'us' ? US_UNITS : METRIC_UNITS);
  function lenParts(m, unit) { const u = unit || bestUnit(m, S.system); return { v: fromMeters(m, u), u }; }
  function fmtLen(m, unit) { const { v, u } = lenParts(m, unit); return fmt(v) + ' ' + u; }
  function fmtBoth(m) { const a = fmtLen(m, bestUnit(m, 'metric')), b = fmtLen(m, bestUnit(m, 'us')); return S.system === 'us' ? b + ' (' + a + ')' : a + ' (' + b + ')'; }
  const catBy = (slug) => (S.meta ? S.meta.categories.find((c) => c.slug === slug) : null);

  /* ---------- router ---------- */
  const routes = [];
  function register(pattern, fn) { routes.push({ re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), fn }); }
  function view(html) { const el = $('#app'); el.innerHTML = html; return el; }
  function setTitle(t) { document.title = t ? t + ' | SizeRoyale' : 'SizeRoyale'; }
  async function render() {
    cleanups.forEach((f) => { try { f(); } catch (_) {} }); cleanups = [];
    const path = location.pathname.replace(/\/+$/, '') || '/';
    for (const r of routes) {
      const m = r.re.exec(path); if (!m) continue;
      renderChrome(path);
      try { await r.fn(m.groups || {}, new URLSearchParams(location.search)); } catch (e) { view(`<div class="card center"><h2>Something went wrong</h2><p class="muted">${esc(e.message)}</p><p style="margin-top:14px"><a class="btn" href="/" data-link>Back home</a></p></div>`); }
      return;
    }
    renderChrome(path);
    view(`<div class="card center"><h1>404</h1><p class="muted">That page doesn't exist.</p><p style="margin-top:14px"><a class="btn" href="/" data-link>Back home</a></p></div>`);
  }
  function go(path, replace) { if (path === location.pathname + location.search) return render(); history[replace ? 'replaceState' : 'pushState']({}, '', path); window.scrollTo(0, 0); return render(); }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    e.preventDefault(); closeDrawer(); sfx.click(); go(a.getAttribute('href'));
  });
  window.addEventListener('popstate', render);

  /* ---------- chrome: nav, tab bar, drawer, footer ---------- */
  const NAV = [['/', 'Home', '🏠'], ['/play', 'Play', '🎮'], ['/daily-challenge', 'Daily Challenge', '🏆'], ['/multiplayer', 'Multiplayer', '👥'], ['/leaderboard', 'Leaderboard', '📊'], ['/explore', 'Explore', '🧭']];
  const TABS = [['/', 'Home', '🏠'], ['/play', 'Play', '🎮'], ['/leaderboard', 'Leaderboard', '🏅'], ['/profile', 'Profile', '👤']];
  const isActive = (href, p) => (href === '/' ? p === '/' : p === href || p.startsWith(href + '/'));
  function renderChrome(p) {
    $('#navDesktop').innerHTML = NAV.map(([h, l, i]) => `<a href="${h}" data-link class="${isActive(h, p) ? 'active' : ''}"${isActive(h, p) ? ' aria-current="page"' : ''}><span aria-hidden="true">${i}</span>${l}</a>`).join('');
    const tabP = p === '/login' || p === '/signup' || p === '/stats' || p === '/history' ? '/profile' : p;
    $('#tabbar').innerHTML = TABS.map(([h, l, i]) => `<a href="${h}" data-link class="${isActive(h, tabP) ? 'active' : ''}"><span aria-hidden="true">${i}</span>${l}</a>`).join('');
    $('#authSlot').innerHTML = S.user ? `<a class="av" href="/profile" data-link aria-label="Profile" title="${esc(S.user.username)}">${esc(S.user.avatar)}</a>` : `<a class="btn sm" href="/login" data-link>Sign In</a><a class="btn sm signup-top" href="/signup" data-link>Sign Up</a>`;
    $('#unitBtn').textContent = S.system === 'us' ? 'ft' : 'm';
    $('#soundBtn').textContent = S.sound ? '🔊' : '🔇';
    $('#drawer').innerHTML = `<button class="icon-btn close" id="drawerClose" aria-label="Close menu">✕</button>
      <div class="who"><div class="av">${S.user ? esc(S.user.avatar) : '👑'}</div><div><b>${S.user ? esc(S.user.username) : 'Guest player'}</b><div class="note">${S.user ? 'Signed in' : 'Sign in to save progress'}</div></div></div>
      ${[['/', 'Home', '🏠'], ['/play', 'Play', '🎮'], ['/daily-challenge', 'Daily Challenge', '🏆'], ['/multiplayer', 'Friends Battle', '👥'], ['/leaderboard', 'Leaderboard', '📊'], ['/explore', 'Explore', '🧭'], ['/learn', 'Learn', '🎓'], ['/profile', 'Profile', '👤'], ['/faq', 'Help & FAQ', '❓']].map(([h, l, i]) => `<a href="${h}" data-link><span>${i}</span>${l}</a>`).join('')}
      ${S.user ? '<button class="btn ghost block item-logout" id="logoutBtn" style="margin-top:12px">Log out</button>' : '<a class="btn block" href="/login" data-link style="margin-top:12px">Sign In</a><a class="btn ghost block" href="/signup" data-link>Sign Up</a>'}
      <button class="btn blue block install-app" id="installBtn" type="button">＋ Add to Mobile</button>`;
    $('#drawerClose').onclick = closeDrawer;
    const installButton = $('#installBtn');
    if (installButton) installButton.onclick = installApp;
    const lo = $('#logoutBtn'); if (lo) lo.onclick = logout;
    $('#footer').innerHTML = `<div><b style="color:#fff">SizeRoyale</b> – Guess. Compete. Dominate.</div>
      <nav aria-label="Footer"><a href="/guess-the-size" data-link>Guess the Size</a><a href="/size-comparison" data-link>Size Comparison</a><a href="/unlimited" data-link>Unlimited</a><a href="/learn" data-link>Learn</a><a href="/how-to-play" data-link>How to Play</a><a href="/faq" data-link>FAQ</a><a href="/about" data-link>About</a><a href="/contact" data-link>Contact</a><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a></nav>
      <div class="note">SizeRoyale is an independent game and is not affiliated with any other size-guessing game, brand or publisher.</div>`;
  }
  let deferredInstallPrompt = null;
  let installPromptReady = false;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installPromptReady = true;
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installPromptReady = false;
    const b = $('#installBtn'); if (b) b.textContent = 'Added to Home Screen ✓';
  });
  async function installApp() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      toast('SizeRoyale is already installed.');
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installPromptReady = false;
      if (choice && choice.outcome === 'accepted') toast('SizeRoyale is being added to your device.');
      else toast('You can install SizeRoyale whenever you are ready.');
      return;
    }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    toast(isIOS ? 'Tap Share in Safari, then choose Add to Home Screen.' : 'Open your browser menu and choose Install app or Add to Home Screen.');
  }
  function openDrawer() { $('#drawer').classList.add('open'); $('#drawerBg').classList.add('open'); }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#drawerBg').classList.remove('open'); }
  async function logout() { await api('/auth/logout', {}).catch(() => {}); S.user = null; closeDrawer(); toast('Logged out'); go('/'); }

  /* ---------- shared game UI ---------- */
  const TIPS = ['Tip: compare it with something you can picture – a bus is about 12 m long.', 'Tip: a guess within 25% of the real size still earns over 500 points.', 'Tip: check the measurement type – length, height, wingspan or diameter.', 'Tip: half or double the real size scores zero, so get the order of magnitude right first.', 'Tip: a tall door is about 2 m (6.5 ft) – use it as a ruler.'];
  const tip = () => TIPS[Math.floor(Math.random() * TIPS.length)];
  function qArt(q) { const c = catBy(q.category); return `<div class="q-art" style="${c ? 'background:radial-gradient(circle at 50% 40%,rgba(255,255,255,.12),rgba(10,11,34,.92)),' + c.grad : ''}" role="img" aria-label="Illustration: ${esc(q.title)}"><span>${esc(q.icon)}</span></div>`; }
  function guessUI(q, locked) {
    const ul = unitsList();
    return `<div class="guessbox" id="guessbox">
      <label class="note" for="gInput">Your guess <span class="pill kind">${esc(q.kind)}</span></label>
      <div class="guessrow" style="margin-top:6px"><input id="gInput" type="number" inputmode="decimal" min="0" step="any" autocomplete="off" ${locked ? 'disabled' : ''} aria-label="Your guess"><div class="unit-toggle" id="gUnits" role="group" aria-label="Unit">${ul.map((u) => `<button type="button" data-u="${u}" ${locked ? 'disabled' : ''}>${u}</button>`).join('')}</div></div>
      <input id="gSlider" type="range" min="0" max="1000" step="1" ${locked ? 'disabled' : ''} aria-label="Guess slider (logarithmic scale)">
      <div class="range-labels"><span id="gLo"></span><span>drag the slider or type a number</span><span id="gHi"></span></div>
      <p class="err" id="gErr" role="alert"></p>
      <button class="btn block" id="gSubmit" ${locked ? 'disabled' : ''}>${locked ? 'Guess locked in ✓' : 'Submit Guess ➤'}</button></div>`;
  }
  function bindGuess(q, onSubmit) {
    const [lo, hi] = q.range; const slider = $('#gSlider'), input = $('#gInput'), err = $('#gErr'), btn = $('#gSubmit');
    let unit = bestUnit(Math.sqrt(lo * hi), S.system); if (!unitsList().includes(unit)) unit = unitsList()[1];
    let m = Math.sqrt(lo * hi); let busy = false;
    const tToM = (t) => lo * Math.pow(hi / lo, t / 1000);
    const mToT = (x) => Math.max(0, Math.min(1000, (Math.log(x / lo) / Math.log(hi / lo)) * 1000));
    const show = (x) => { const v = fromMeters(x, unit); return String(Number(v >= 100 ? v.toFixed(1) : v.toPrecision(4))); };
    function paint() {
      $$('#gUnits button').forEach((b) => b.classList.toggle('sel', b.dataset.u === unit));
      $('#gLo').textContent = fmtLen(lo, unit); $('#gHi').textContent = fmtLen(hi, unit);
    }
    function sync() { input.value = show(m); slider.value = Math.round(mToT(m)); paint(); }
    slider.oninput = () => { m = tToM(Number(slider.value)); input.value = show(m); err.textContent = ''; };
    input.oninput = () => { const v = parseFloat(input.value); err.textContent = ''; if (v > 0) { try { m = toMeters(v, unit); slider.value = Math.round(mToT(m)); } catch (_) {} } };
    $$('#gUnits button').forEach((b) => { b.onclick = () => { const v = parseFloat(input.value); if (v > 0) { try { m = toMeters(v, unit); } catch (_) {} } unit = b.dataset.u; sync(); sfx.click(); }; });
    input.onkeydown = (e) => { if (e.key === 'Enter') btn.click(); };
    btn.onclick = async () => {
      if (busy) return; const v = parseFloat(input.value);
      if (!(v > 0) || !isFinite(v)) { err.textContent = 'Enter a number greater than 0.'; input.focus(); return; }
      busy = true; btn.disabled = true; sfx.submit();
      try { await onSubmit(v, unit); } catch (e) { busy = false; btn.disabled = false; err.textContent = e.message; }
    };
    sync(); if (!matchMedia('(pointer:coarse)').matches) input.focus();
    return { lock() { busy = true; btn.disabled = true; btn.textContent = 'Guess locked in ✓'; slider.disabled = input.disabled = true; $$('#gUnits button').forEach((b) => (b.disabled = true)); } };
  }
  function verdict(s) { return s >= 900 ? 'Awesome!' : s >= 650 ? 'Great guess!' : s >= 300 ? 'Not bad!' : s > 0 ? 'Keep practising!' : 'Way off!'; }
  function resultCard(r, { nextLabel, nextId = 'nextBtn', showSource = true } = {}) {
    const u = bestUnit(r.actualM, S.system); const diff = r.guessM - r.actualM;
    return `<div class="result card"><div class="trophy" aria-hidden="true">${r.score >= 900 ? '🏆' : r.score >= 300 ? '⭐' : '🎯'}</div>
      <div class="res-title">${verdict(r.score)}</div><div class="muted">${esc(r.title)}</div>
      <div class="cmp"><div><small>Your guess</small><b>${fmtLen(r.guessM, u)}</b></div><div><small>Actual answer</small><b class="gold">${fmtLen(r.actualM, u)}</b></div>
      <div><small>Difference</small><b>${diff >= 0 ? '+' : '−'}${fmtLen(Math.abs(diff), u)}</b></div><div><small>Error</small><b>${r.pctError >= 0 ? '+' : ''}${fmt(r.pctError)}%</b></div></div>
      <div class="pts" id="ptsNum" data-v="${r.score}">0</div><div class="muted" style="margin-top:-6px">points</div>
      <div class="meter" role="img" aria-label="Accuracy ${fmt(r.accuracy)} percent"><i id="meterFill" data-w="${r.accuracy}"></i></div><div><b>${fmt(r.accuracy)}%</b> <span class="muted">accuracy</span></div>
      <div class="fun"><b>💡 Fun fact</b><p style="margin-top:4px">${esc(r.fact)}</p>${showSource ? `<p class="note" style="margin-top:6px">Source: <a href="${esc(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(r.sourceName)}</a> · ${esc(r.kind)}: ${esc(fmtBoth(r.actualM))}</p>` : ''}</div>
      ${nextLabel ? `<button class="btn block" id="${nextId}">${nextLabel}</button>` : ''}</div>`;
  }
  function animateResult(r) {
    const n = $('#ptsNum'), f = $('#meterFill'); if (!n) return;
    requestAnimationFrame(() => { if (f) f.style.width = r.accuracy + '%'; });
    const t0 = performance.now(), dur = 900; (function tick(t) { const k = Math.min(1, (t - t0) / dur); n.textContent = Math.round(r.score * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(tick); })(t0);
    sfx.reveal(r.score); if (r.score >= 800) confetti();
  }

  /* generic multi-question run (used by Daily + Unlimited) */
  async function runQuiz(cfg) {
    const answers = (cfg.answers || []).slice();
    async function step() {
      if (answers.length >= cfg.total) return cfg.summary(answers);
      const i = answers.length; const total = answers.reduce((s, a) => s + a.score, 0);
      view(`<div class="game"><div class="skeleton"></div></div>`);
      const q = await cfg.getQuestion(i);
      view(`<div class="game"><div class="game-top"><a class="icon-btn" href="${cfg.back}" data-link aria-label="Back">←</a><span class="prog">${i + 1} / ${cfg.total}</span><div class="bar"><i style="width:${(i / cfg.total) * 100}%"></i></div><span class="pill">⭐ ${total.toLocaleString('en-US')}</span></div>
        ${qArt(q)}<h1 class="q-title">${esc(q.title)}</h1><p class="q-desc">${esc(q.description)}</p>${guessUI(q)}<p class="tip">${tip()}</p></div>`);
      setTitle(cfg.title);
      bindGuess(q, async (value, unit) => {
        const { result } = await cfg.submit(q, value, unit, i); answers.push(result);
        const last = answers.length >= cfg.total;
        view(`<div class="game">${resultCard(result, { nextLabel: last ? 'See results ➤' : 'Next Question ➤' })}</div>`); animateResult(result);
        $('#nextBtn').onclick = () => { sfx.click(); step(); }; $('#nextBtn').focus();
      });
    }
    return step();
  }
  function summaryCard({ title, answers, extra = '', actions = '', max }) {
    const total = answers.reduce((s, a) => s + a.score, 0); const acc = answers.length ? total / answers.length / 10 : 0;
    return `<div class="result card"><div class="trophy">${total >= max * 0.7 ? '🏆' : '🎖️'}</div><div class="res-title">${esc(title)}</div>
      <div class="pts">${total.toLocaleString('en-US')} <span class="muted" style="font-size:1rem">/ ${max.toLocaleString('en-US')}</span></div><div class="muted">${fmt(acc)}% average accuracy</div>
      <div style="text-align:left;margin:16px 0">${answers.map((a, i) => `<div class="lb-row"><span class="rk">${i + 1}</span><span class="nm">${esc(a.icon || '')} ${esc(a.title)}</span><span class="pt">${a.score}</span></div>`).join('')}</div>${extra}<div class="row" style="justify-content:center">${actions}</div></div>`;
  }

  async function refreshUser() { try { S.user = (await api('/me')).user; } catch (_) { S.user = null; } }
  async function loadMeta() { try { S.meta = await api('/meta'); } catch (_) { S.meta = { categories: [], totalQuestions: 0, players: 0, answers: 0, faq: [] }; } }

  async function boot() {
    $('#burger').onclick = openDrawer; $('#drawerBg').onclick = closeDrawer;
    $('#soundBtn').onclick = () => { S.sound = !S.sound; store.set('sr_sound', S.sound); $('#soundBtn').textContent = S.sound ? '🔊' : '🔇'; sfx.click(); };
    $('#unitBtn').onclick = () => { S.system = S.system === 'us' ? 'metric' : 'us'; store.set('sr_units', S.system); if (S.user) api('/me', { unitSystem: S.system }).catch(() => {}); toast(S.system === 'us' ? 'Units: US customary (ft, mi, in)' : 'Units: Metric (m, km, cm)'); render(); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
    await Promise.all([refreshUser(), loadMeta()]);
    if (S.user && S.user.unitSystem) { S.system = S.user.unitSystem; store.set('sr_units', S.system); }
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('/sw.js').catch(() => {});
    render();
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      const b = $('#installBtn'); if (b) b.textContent = 'Already Installed ✓';
    }
  }

  window.SRApp = { S, api, $, $$, esc, store, view, go, render, register, toast, onLeave, setTitle, boot, refreshUser, sfx, confetti, fmt, fmtLen, fmtBoth, lenParts, catBy, guessUI, bindGuess, resultCard, animateResult, runQuiz, summaryCard, qArt, tip, unitsList };
})();
