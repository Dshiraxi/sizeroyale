/* SizeRoyale pages (everything except multiplayer). */
(function () {
  'use strict';
  const A = window.SRApp; const { S, api, $, $$, esc, view, go, register, toast, setTitle, fmt, fmtLen, fmtBoth, catBy } = A;
  const crumbs = (...items) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/" data-link>Home</a>${items.map(([h, l]) => ' › ' + (h ? `<a href="${h}" data-link>${l}</a>` : `<span>${l}</span>`)).join('')}</nav>`;
  const row = (r, meKey) => `<div class="lb-row ${r.userId === meKey ? 'me' : ''}"><span class="rk">${r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</span><span class="av" style="width:32px;height:32px">${esc(r.avatar)}</span><span class="nm">${esc(r.username)}</span><span class="pt">${r.points.toLocaleString('en-US')}${r.games != null ? ` <span class="note">· ${r.games}g</span>` : ''}</span></div>`;
  const facts = (() => { let p; return () => (p = p || api('/facts').then((j) => j.facts)); })();
  const faqItems = [
    ['What is SizeRoyale?', 'SizeRoyale is a free real-world size guessing game. Estimate the size of animals, dinosaurs, planets, landmarks, vehicles and everyday objects, then reveal the real measurements.'],
    ['What is Size Comparison?', 'Size Comparison is a head-to-head challenge. Choose which of two real-world things is longer, taller, wider or larger, then see the measurements and sources.'],
    ['Who created SizeRoyale?', 'SizeRoyale is an independently developed online size-guessing game.'],
    ['Where can I play SizeRoyale?', 'Play directly in your browser at https://sizeroyale.fun/. No download is required.'],
    ['Is there an official SizeRoyale app?', 'There is no separate mobile app at the moment. You can play SizeRoyale on your phone, tablet or computer through the website.'],
    ['Is SizeRoyale free?', 'Yes. SizeRoyale is free to play. You can enjoy the game modes without paying.'],
    ['How does SizeRoyale scoring work?', 'In the guessing game, each question is worth up to 1,000 points. The closer your estimate is to the real measurement, the more points you earn.'],
    ['Can I play previous SizeRoyale daily challenges?', 'The Daily Challenge is a fresh shared challenge each day. You can play more questions anytime in Unlimited Play and explore the other game modes.'],
    ['When are new SizeRoyale daily challenges released?', 'A new Daily Challenge is available every day at 00:00 UTC. Unlimited Play and Size Comparison are available anytime.']
  ];
  const faqMarkup = (items) => items.map(([q, a], i) => `<div class="faq-item"><button class="faq-toggle" type="button" aria-expanded="false" aria-controls="faq-answer-${i}"><span>${esc(q)}</span><span class="faq-plus" aria-hidden="true">+</span></button><div class="faq-answer" id="faq-answer-${i}" hidden><p>${esc(a)}</p></div></div>`).join('');
  const bindFaq = (root) => root.querySelectorAll('.faq-toggle').forEach((btn) => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    const answer = root.querySelector('#' + btn.getAttribute('aria-controls'));
    if (answer) answer.hidden = open;
    const plus = btn.querySelector('.faq-plus');
    if (plus) plus.textContent = open ? '+' : '−';
  }));

  /* ---------------- HOME ---------------- */
  register('/', async () => {
    setTitle('');
    const m = S.meta; const cats = m.categories;
    const app = view(`
    <section class="hero" aria-labelledby="h1">
      <div class="hero-copy"><span class="pill badge">👑 Guess. Compete. Dominate.</span>
        <h1 id="h1">Guess the Size.<br><span class="grad">Challenge Your Knowledge.</span></h1>
        <p>Test your skills with real-world size comparisons, compete with friends, and climb the leaderboard.</p>
        <div class="row"><a class="btn" href="/play" data-link>▶ Play Now</a><a class="btn ghost" href="/multiplayer" data-link>👥 Challenge Friends</a></div></div>
      <div class="hero-art" aria-hidden="true"><div class="earth"></div><span class="art astro float d2">🧑‍🚀</span><span class="art plane float">✈️</span><span class="art whale float d3">🐋</span><span class="art tower float d2">🗼</span><span class="art dino float">🦖</span><span class="bubble">How big is it?</span></div>
    </section>
    <section class="modes" aria-label="Game modes">
      <div class="mode m-daily"><h3>Daily Challenge</h3><small>5 Questions · Daily</small><span class="big">🏆</span><a class="btn sm" href="/daily-challenge" data-link>▶ Play</a></div>
      <div class="mode m-unl"><h3>Unlimited Play</h3><small>Play Anytime</small><span class="big">🎮</span><a class="btn blue sm" href="/unlimited" data-link>▶ Play</a></div>
      <div class="mode m-fr"><h3>Friends Battle</h3><small>1v1 or 2–4 Players</small><span class="big">🛡️</span><a class="btn pink sm" href="/multiplayer" data-link>▶ Play</a></div>
      <div class="mode m-lb"><h3>Global Leaderboard</h3><small>See Who's the Best</small><span class="big">🏆</span><a class="btn green sm" href="/leaderboard" data-link>View Rankings</a></div>
      <div class="mode m-compare"><h3>Size Comparison</h3><small>Which one is bigger?</small><span class="big">⚖️</span><a class="btn sm" href="/size-comparison" data-link>▶ Compare</a></div>
    </section>
    <div class="home-grid"><div>
      <section class="sec" style="margin-top:0"><div class="sec-head"><h2>⭐ Popular Categories</h2><a href="/play" data-link>View All Categories →</a></div>
        <div class="cats">${cats.map((c) => `<a class="cat" href="${c.path}" data-link style="background:${c.grad}"><span class="emo" aria-hidden="true">${c.icon}</span><b>${esc(c.short)}</b><small>${c.questions} verified questions</small><span class="arrow">→</span></a>`).join('')}</div></section>
      <section class="sec how-section"><div class="section-kicker">FOUR SIMPLE STEPS</div><h2>How SizeRoyale works</h2><div class="how-grid">
          <article class="how-card"><span class="how-icon" aria-hidden="true">◎</span><span class="how-number">01</span><h3>Choose</h3><p>Pick a game mode or explore a category you love.</p></article>
          <article class="how-card"><span class="how-icon" aria-hidden="true">↔</span><span class="how-number">02</span><h3>Make your guess</h3><p>Estimate the real-world size using a number or slider.</p></article>
          <article class="how-card"><span class="how-icon" aria-hidden="true">✧</span><span class="how-number">03</span><h3>Reveal</h3><p>See the actual measurement, your error and a fun fact.</p></article>
          <article class="how-card"><span class="how-icon" aria-hidden="true">♜</span><span class="how-number">04</span><h3>Score</h3><p>Earn up to 1,000 points per question and climb the leaderboard.</p></article>
        </div></section>
    </div><aside>
      <section class="card"><h2>📈 Game Stats</h2><div class="stat-row"><div><b>${m.totalQuestions}</b><span>Verified Questions</span></div><div><b>${m.players.toLocaleString('en-US')}</b><span>Registered Players</span></div><div><b>${m.answers.toLocaleString('en-US')}</b><span>Guesses Made</span></div></div><p class="note" style="margin-top:10px">Live numbers from the database – no made-up counts.</p></section>
      <section class="card sec"><div class="sec-head"><h2>👑 Top Players</h2><a href="/leaderboard" data-link>Full Leaderboard →</a></div><div id="homeTop"><p class="muted">Loading rankings…</p></div></section>
    </aside></div>
    <div id="homeComparisons"></div>
    <section class="sec faq-home"><div class="faq-heading"><div><div class="section-kicker">QUESTIONS, ANSWERED</div><h2>Frequently asked questions</h2></div><a href="/faq" data-link>View all FAQs →</a></div><div class="faq-grid">${faqMarkup(faqItems)}</div></section>`);
    bindFaq(app);
    // Non-essential homepage data loads after the main page is already visible.
    const [top, fx] = await Promise.all([
      api('/leaderboard/global').catch(() => ({ rows: [] })),
      facts().catch(() => [])
    ]);
    if (!app.isConnected || location.pathname !== '/') return;
    const topEl = app.querySelector('#homeTop');
    if (topEl) topEl.innerHTML = top.rows.length
      ? top.rows.slice(0, 5).map((r) => row(r)).join('')
      : '<p class="muted">No ranked players yet – be the first on the board!</p><p style="margin-top:10px"><a class="btn sm" href="/signup" data-link>Create account</a></p>';
    const by = (id) => fx.find((f) => f.id === id);
    const pairs = [['animals-001', 'dinosaurs-001'], ['geography-001', 'geography-003'], ['space-003', 'space-001']].map(([a, b]) => [by(a), by(b)]).filter((p) => p[0] && p[1]);
    const comparisons = app.querySelector('#homeComparisons');
    if (comparisons && pairs.length) comparisons.innerHTML = `<section class="sec"><div class="sec-head"><h2>📏 Interesting size comparisons</h2><a href="/size-comparison" data-link>Compare anything →</a></div><div class="compare-strip">${pairs.map(([a, b]) => { const big = a.meters >= b.meters ? [a, b] : [b, a]; return `<div class="card"><div style="font-size:2rem">${big[0].icon} ${big[1].icon}</div><p><b>${esc(big[0].shortName)}</b> (${esc(fmtLen(big[0].meters))}) is about <b class="gold">${fmt(big[0].meters / big[1].meters)}×</b> the ${esc(big[0].kind.toLowerCase())} of <b>${esc(big[1].shortName)}</b> (${esc(fmtLen(big[1].meters))}).</p></div>`; }).join('')}</div></section>`;
  });

  /* ---------------- PLAY / MODES / CATEGORY SELECTION ---------------- */
  register('/play', async () => {
    setTitle('Play'); const cats = S.meta.categories;
    view(`${crumbs(['', 'Play'])}<h1>Choose how to <span class="grad">play</span></h1><p class="muted" style="margin:8px 0 18px">Four ways to test your size sense.</p>
    <div class="pick">
      <a class="opt" href="/daily-challenge" data-link><span class="e">🏆</span><span><b>Daily Challenge</b><br><span class="muted">5 questions, same for everyone, one attempt. Max 5,000 points.</span></span></a>
      <a class="opt" href="/unlimited" data-link><span class="e">🎮</span><span><b>Unlimited Play</b><br><span class="muted">Pick a category and difficulty. Play as long as you like.</span></span></a>
      <a class="opt" href="/multiplayer" data-link><span class="e">👥</span><span><b>Friends Battle</b><br><span class="muted">Private rooms for 2–4 players, 5 live timed rounds.</span></span></a>
      <a class="opt" href="/size-comparison" data-link><span class="e">⚖️</span><span><b>Size Comparison</b><br><span class="muted">Pick which of two real-world things is bigger. Five head-to-head rounds.</span></span></a></div>
    <section class="sec"><h2>Pick a category</h2><div class="cats">${cats.map((c) => `<a class="cat" href="${c.path}" data-link style="background:${c.grad}"><span class="emo" aria-hidden="true">${c.icon}</span><b>${esc(c.name)}</b><small>${c.questions} questions</small><span class="arrow">→</span></a>`).join('')}</div></section>
    <section class="sec card"><h2>Difficulty levels</h2><p class="muted"><b>Easy</b> – familiar things (a basketball, Everest). <b>Medium</b> – well known but harder to picture. <b>Hard</b> – extreme or unusual sizes. Difficulty is set per question in the verified question bank.</p></section>`);
  });

  function diffChips(sel) { return `<div class="chips" id="diffChips" role="group" aria-label="Difficulty">${[['all', 'All'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']].map(([v, l]) => `<button class="chip ${v === sel ? 'sel' : ''}" data-v="${v}">${l}</button>`).join('')}</div>`; }
  function wireChips(sel, cb) { $$(sel + ' .chip').forEach((b) => (b.onclick = () => { $$(sel + ' .chip').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); cb(b.dataset.v); })); }

  function startUnlimitedWrapped(cat, diff, back) {
    let gameId;
    const key = 'sr_seen_' + cat + '_' + diff;
    const cfg = {
      title: 'Unlimited Play', total: 5, back, answers: [],
      async getQuestion() {
        const seen = A.store.get(key, []); const r = await api(`/question?cat=${cat}&diff=${diff}&seen=${seen.join(',')}`);
        if (r.reshuffled) { A.store.set(key, []); toast('You\'ve seen every question in this pool – reshuffled!'); }
        A.store.set(key, (r.reshuffled ? [] : seen).concat(r.question.id)); return r.question;
      },
      submit: (q, value, unit) => api('/guess', { qid: q.id, value, unit, mode: 'unlimited', gameId }),
      summary(answers) {
        const total = answers.reduce((s, a) => s + a.score, 0); A.sfx.win(); if (total >= 3500) A.confetti();
        view(`<div class="game">${A.summaryCard({ title: 'Round complete!', answers, max: 5000, extra: S.user ? '<p class="note">Saved to your profile and the global leaderboard.</p>' : '<p class="note">Playing as guest – <a href="/signup" data-link style="text-decoration:underline">create a free account</a> to save results and join the leaderboard.</p>', actions: (total >= 3500 ? '<button class="btn" id="shareUnlimited">↗ Share score</button>' : '') + '<button class="btn" id="again">Play another 5</button><a class="btn ghost" href="' + back + '" data-link>Change category</a>' })}</div>`);
        const shareBtn = $('#shareUnlimited'); if (shareBtn) shareBtn.onclick = async () => { const msg = 'I scored ' + total.toLocaleString('en-US') + '/5,000 in SizeRoyale Unlimited Play! Can you beat me? ' + location.origin + '/unlimited'; try { if (navigator.share) await navigator.share({ title: 'SizeRoyale', text: msg }); else { await navigator.clipboard.writeText(msg); toast('Score copied — share it anywhere!'); } } catch (e) { if (e && e.name !== 'AbortError') toast('Could not share right now.'); } }; $('#again').onclick = () => begin();
      },
    };
    function begin() { gameId = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); A.runQuiz(Object.assign({}, cfg, { answers: [] })); }
    setTitle('Unlimited Play'); begin();
  }

  register('/unlimited', async (_, q) => {
    setTitle('Unlimited Play'); let cat = q.get('cat') || 'all', diff = q.get('diff') || 'all'; const cats = S.meta.categories;
    view(`${crumbs(['/play', 'Play'], ['', 'Unlimited'])}<h1>Unlimited <span class="grad">Play</span></h1><p class="muted" style="margin:8px 0 18px">Five questions per round, as many rounds as you like. Questions don't repeat until the pool is used up, then reshuffle.</p>
      <div class="card"><h2>Category</h2><div class="chips" id="catChips"><button class="chip ${cat === 'all' ? 'sel' : ''}" data-v="all">🎲 All</button>${cats.map((c) => `<button class="chip ${cat === c.slug ? 'sel' : ''}" data-v="${c.slug}">${c.icon} ${esc(c.short)}</button>`).join('')}</div>
      <h2 style="margin-top:18px">Difficulty</h2>${diffChips(diff)}<p style="margin-top:20px"><button class="btn block" id="go">▶ Start playing</button></p></div>`);
    wireChips('#catChips', (v) => (cat = v)); wireChips('#diffChips', (v) => (diff = v));
    $('#go').onclick = () => startUnlimitedWrapped(cat, diff, '/unlimited');
  });

  /* ---------------- CATEGORY PAGES ---------------- */
  const CAT_EXTRA = {
    animals: 'Animal sizes depend on what you measure: body length, shoulder height or wingspan. Each question names the exact measurement so you can compare like with like.',
    dinosaurs: 'Dinosaur sizes are estimates from fossils – often incomplete – so questions use a commonly cited figure and name the specimen or estimate where relevant.',
    space: 'Planet sizes are given as diameters. Gas giants have equatorial diameters larger than their polar ones, so the question says which is used.',
    geography: 'Heights are measured above sea level; depths below the surface. Contested measurements (like river lengths) are labelled as commonly cited.',
    vehicles: 'Aircraft length is fuselage length and wingspan is tip to tip. Ships use overall length. Rockets use total stacked height.',
    'everyday-objects': 'Everyday objects follow standards (ISO paper and card sizes, sports rules) – the exact rule used is quoted in each question.',
  };
  ['animals', 'dinosaurs', 'space', 'geography', 'vehicles', 'everyday-objects'].forEach((slug) => {
    register('/' + slug, async (_, q) => {
      const c = catBy(slug); let diff = q.get('diff') || 'all'; setTitle(c.name);
      view(`${crumbs(['/play', 'Play'], ['', esc(c.name)])}<section class="card" style="background:${c.grad};padding:0;overflow:hidden"><div style="padding:22px;display:grid;gap:10px;position:relative;background:linear-gradient(90deg,rgba(0,0,0,.55),transparent)"><span style="position:absolute;right:14px;top:6px;font-size:6rem;filter:drop-shadow(0 8px 16px rgba(0,0,0,.5))" aria-hidden="true">${c.icon}</span><h1>${esc(c.name)}</h1><p style="max-width:70%">${esc(c.desc)}</p><div class="row"><span class="pill">${c.questions} verified questions</span><span class="pill">Target: ${c.target}</span></div></div></section>
      <div class="card sec"><h2>Difficulty</h2>${diffChips(diff)}<p style="margin-top:18px"><button class="btn block" id="go">▶ Play ${esc(c.short)}</button></p></div>
      <section class="sec card"><h2>About this category</h2><p class="muted">${esc(CAT_EXTRA[slug])}</p><p style="margin-top:10px"><a href="/explore?cat=${slug}" data-link style="color:var(--blue);text-decoration:underline">Browse every ${esc(c.short)} size with sources →</a></p></section>`);
      wireChips('#diffChips', (v) => (diff = v)); $('#go').onclick = () => startUnlimitedWrapped(slug, diff, '/' + slug);
    });
  });

  /* ---------------- GUESS THE SIZE landing ---------------- */
  register('/guess-the-size', async () => {
    setTitle('Guess the Size Game'); const m = S.meta;
    view(`${crumbs(['', 'Guess the Size'])}<div class="prose"><h1>The <span class="grad">guess the size</span> game</h1>
    <p>SizeRoyale is a free guess-the-size game: you see a real thing – a blue whale, Mount Everest, a basketball – and guess its real measurement. The closer you are, the more points you score, up to 1,000 per question.</p>
    <p class="row"><a class="btn" href="/play" data-link>▶ Play now</a><a class="btn ghost" href="/daily-challenge" data-link>🏆 Daily Challenge</a></p>
    <h2>How it works</h2><ul><li>Pick a category and difficulty (or take today's Daily Challenge).</li><li>Type a number or drag the slider; choose metric or US units.</li><li>See the real answer, your percentage error, a fun fact and the source.</li></ul>
    <h2>What you can guess</h2><p>${m.totalQuestions} questions with sourced measurements across ${m.categories.length} categories: ${m.categories.map((c) => `<a href="${c.path}" data-link style="text-decoration:underline">${esc(c.name)}</a>`).join(', ')}.</p>
    <h2>Fair, logarithmic scoring</h2><p>Scoring compares ratios, not raw differences, so guessing a planet is judged as fairly as guessing a pencil. <a href="/learn#scoring" data-link style="text-decoration:underline">See the formula</a>.</p>
    <h2>Play with friends</h2><p>Create a private room and race up to three friends over five timed rounds in <a href="/multiplayer" data-link style="text-decoration:underline">Friends Battle</a>.</p></div>`);
  });

  /* ---------------- SIZE COMPARISON GAME ---------------- */
  register('/size-comparison', async () => {
    setTitle('Size Comparison Game'); const fx = await facts(); const sorted = fx.slice().sort((a, b) => a.shortName.localeCompare(b.shortName));
    const prompts = { Length: 'Which is longer?', Height: 'Which is taller?', Wingspan: 'Which has a wider wingspan?', Diameter: 'Which has a larger diameter?', Depth: 'Which is deeper?' };
    const candidates = SRComparison.buildPairs(fx);
    const shufflePairs = (items) => { const a = items.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const levels = {
      easy: { label: 'Easy', hint: 'Big size differences', test: (r) => r >= 5 },
      medium: { label: 'Medium', hint: 'Look closely', test: (r) => r >= 2 && r < 5 },
      hard: { label: 'Hard', hint: 'Very close measurements', test: (r) => r < 2 }
    };
    let difficulty = 'hard', rounds = [];
    let index = 0, points = 0, selected = null;
    const opts = (sel, kind, excludeId) => sorted.filter((f) => (!kind || f.kind === kind) && f.id !== excludeId).map((f) => `<option value="${f.id}" ${f.id === sel ? 'selected' : ''}>${f.icon} ${esc(f.shortName)} (${esc(f.kind.toLowerCase())})</option>`).join('');
    const renderCompareTool = () => {
      const a = $('#cA'), b = $('#cB'); if (!a || !b) return;
      const A1 = fx.find((f) => f.id === a.value), B1 = fx.find((f) => f.id === b.value);
      const comparison = SRComparison.compare(A1, B1);
      if (!comparison) {
        $('#cOut').innerHTML = '<p class="note">Choose two different items that use the same measurement type.</p>';
        return;
      }
      const { larger: big, smaller: small, ratio } = comparison;
      const max = Math.max(A1.meters, B1.meters);
      const bar = (f, col) => `<div class="cmpbar"><div class="t"><span>${f.icon} <b>${esc(f.shortName)}</b> <span class="muted">(${esc(f.kind.toLowerCase())})</span></span><span>${esc(fmtBoth(f.meters))}</span></div><div class="tr"><i style="width:${Math.max(0.4, (f.meters / max) * 100)}%;background:${col}"></i></div></div>`;
      $('#cOut').innerHTML = `${bar(A1, 'linear-gradient(90deg,#3B82F6,#2563EB)')}${bar(B1, 'linear-gradient(90deg,#2F9E73,#F2B544)')}<p style="margin-top:14px"><b>${esc(big.shortName)}</b> is about <b class="gold">${fmt(ratio)}×</b> the ${esc(comparison.kind.toLowerCase())} of <b>${esc(small.shortName)}</b>.</p><p class="note">Sources: <a href="${esc(A1.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">${esc(A1.sourceName)}</a> · <a href="${esc(B1.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">${esc(B1.sourceName)}</a></p>`;
    };
        const shell = (content) => view(`${crumbs(['/play', 'Play'], ['', 'Size Comparison'])}<div class="prose"><span class="pill badge">⚖️ HEAD-TO-HEAD CHALLENGE</span><h1>Size <span class="grad">Comparison</span> Game</h1><p>Two real-world things. One question: which is bigger in the measurement shown? Pick the right answer across ten rounds and score up to 10,000 points.</p></div>${content}<details class="card compare-tool-more" style="margin:22px auto;max-width:760px"><summary><b>🔎 Compare any two things</b><span class="note"> · Explore exact measurements and sources</span></summary><div class="row compare-selects" style="margin-top:16px"><div class="field" style="flex:1;margin:0"><label for="cA">Thing A</label><select id="cA">${opts('animals-001')}</select></div><div class="field" style="flex:1;margin:0"><label for="cB">Thing B</label><select id="cB">${opts('vehicles-001')}</select></div></div><div id="cOut" style="margin-top:18px"></div></details>`);
    function draw() {
      if (index >= rounds.length) {
        const grade = points >= 8000 ? 'Size legend!' : points >= 6000 ? 'Size genius!' : points >= 3500 ? 'Great eye!' : 'Keep practicing!';
        shell(`<div class="game result"><div class="trophy">🏆</div><h2 class="res-title">${grade}</h2><p class="muted">You completed all ten comparisons.</p><div class="pts">${points.toLocaleString('en-US')} <span class="note">/ 10,000</span></div><div class="meter"><i style="width:${points / 100}%"></i></div><p class="muted">${points / 1000} out of 10 correct</p><div class="row" style="justify-content:center;margin-top:18px">${points >= 6000 ? '<button class="btn" id="shareCompare">↗ Share score</button>' : ''}<button class="btn" id="again">▶ Play again</button><a class="btn ghost" href="/play" data-link>More game modes</a></div></div>`);
        if (points >= 6000) A.confetti();
        const shareBtn = $('#shareCompare'); if (shareBtn) shareBtn.onclick = async () => { const msg = 'I scored ' + points.toLocaleString('en-US') + '/10,000 in SizeRoyale Size Comparison! Can you beat me? ' + location.origin + '/size-comparison'; try { if (navigator.share) await navigator.share({ title: 'SizeRoyale', text: msg }); else { await navigator.clipboard.writeText(msg); toast('Score copied — share it anywhere!'); } } catch (e) { if (e && e.name !== 'AbortError') toast('Could not share right now.'); } }; $('#again').onclick = start; return;
      }
      const [a, b] = rounds[index], correct = a.meters >= b.meters ? a : b;
      const choice = (f, key) => `<button class="compare-choice ${selected === key ? (f.id === correct.id ? 'correct' : 'wrong') : ''} ${selected && f.id === correct.id ? 'answer' : ''}" data-choice="${key}" ${selected ? 'disabled' : ''}><span class="compare-emoji">${f.icon}</span><b>${esc(f.shortName)}</b><small>${esc(f.category.replace(/-/g, ' '))}</small>${selected ? `<strong class="compare-size">${esc(fmtBoth(f.meters))}</strong>` : '<span class="compare-pick">Choose this</span>'}</button>`;
      let feedback = '';
      if (selected) {
        const picked = selected === 'a' ? a : b, isRight = picked.id === correct.id;
        const ratio = Math.max(a.meters, b.meters) / Math.min(a.meters, b.meters);
        feedback = `<div class="compare-feedback ${isRight ? 'right' : 'miss'}"><b>${isRight ? '✓ Correct! +1,000 points' : 'Not quite! The correct answer is ' + esc(correct.shortName) + '.'}</b><p>${esc(correct.shortName)} is about ${fmt(ratio)}× the ${esc(correct.kind.toLowerCase())} of ${esc(correct.id === a.id ? b.shortName : a.shortName)}.</p><p class="note">${esc(a.fact || '')}</p><p class="note">Sources: <a href="${esc(a.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(a.sourceName)}</a> · <a href="${esc(b.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(b.sourceName)}</a></p><button class="btn block" id="next">${index === 9 ? 'See my score' : 'Next comparison →'}</button></div>`;
      }
      shell(`<div class="game"><div class="game-top"><span class="prog">ROUND ${index + 1}/10</span><div class="bar"><i style="width:${index * 10}%"></i></div><span class="timer">⭐ ${points.toLocaleString('en-US')}</span></div><div class="card compare-question"><span class="pill">${esc(a.kind.toUpperCase())}</span><h2>${esc(prompts[a.kind] || 'Which has the greater measurement?')}</h2><p class="muted">Choose one answer. Each correct pick earns 1,000 points.</p><div class="compare-options">${choice(a, 'a')}${choice(b, 'b')}</div>${feedback}</div></div>`);
      if (!selected) $$('.compare-choice').forEach((btn) => { btn.onclick = () => { selected = btn.dataset.choice; const picked = selected === 'a' ? a : b; if (picked.id === correct.id) { points += 1000; A.sfx.reveal(1000); } else A.sfx.reveal(0); draw(); }; });
      else $('#next').onclick = () => { index++; selected = null; draw(); };
    }
    function start() {
      index = 0; points = 0; selected = null;
      const eligible = shufflePairs(candidates.filter((item) => levels[difficulty].test(item.ratio)));
      const selectedPairs = [];
      const usedThings = new Set();
      const addUniquePairs = (pool) => {
        for (const item of pool) {
          if (selectedPairs.length >= 10) break;
          const [a, b] = item.pair;
          if (usedThings.has(a.id) || usedThings.has(b.id)) continue;
          selectedPairs.push(item);
          usedThings.add(a.id); usedThings.add(b.id);
        }
      };
      addUniquePairs(eligible);
      if (selectedPairs.length < 10) addUniquePairs(shufflePairs(candidates.filter((item) => levels[difficulty].test(item.ratio) === false)));
      if (selectedPairs.length < 10) addUniquePairs(shufflePairs(candidates));
      rounds = selectedPairs.map((item) => item.pair);
      draw();
    }
    shell(`<div class="game"><div class="card center compare-intro"><div class="compare-intro-icon">⚖️</div><h2>Think you know which is bigger?</h2><p class="muted">Compare animals, vehicles, landmarks and more. Every pair uses the same type of measurement, with real facts and sources.</p><div class="row" style="justify-content:center;margin-top:18px"><span class="pill">10 rounds</span><span class="pill">1,000 points each · 10,000 max</span><span class="pill">Free to play</span></div><div class="compare-difficulties" role="group" aria-label="Choose difficulty"><button class="compare-level" data-level="easy"><b>Easy</b><small>Big differences</small></button><button class="compare-level" data-level="medium"><b>Medium</b><small>Look closely</small></button><button class="compare-level active" data-level="hard"><b>Hard</b><small>Very close sizes</small></button></div><p class="note" id="compareLevelHint">Hard mode: compare things with very similar measurements.</p><button class="btn block" id="startCompare" style="margin-top:18px">▶ Start hard challenge</button></div></div>`);
    $$('.compare-level').forEach((btn) => {
      btn.onclick = () => {
        difficulty = btn.dataset.level;
        $$('.compare-level').forEach((b) => b.classList.toggle('active', b === btn));
        $('#compareLevelHint').textContent = levels[difficulty].label + ' mode: ' + levels[difficulty].hint + '.';
        $('#startCompare').textContent = '▶ Start ' + levels[difficulty].label.toLowerCase() + ' challenge';
      };
    });
    $('#startCompare').onclick = start;
    const ca = $('#cA'), cb = $('#cB');
    const syncCompareSelectors = (changed) => {
      if (!ca || !cb) return;
      const A1 = fx.find((f) => f.id === ca.value), B1 = fx.find((f) => f.id === cb.value);
      if (changed === 'a' && A1) {
        const compatible = SRComparison.compatibleItems(sorted, A1);
        const selected = compatible.find((f) => f.id === cb.value) || compatible[0];
        cb.innerHTML = compatible.length ? opts(selected.id, A1.kind, A1.id) : '<option value="">No compatible item</option>';
      } else if (changed === 'b' && B1) {
        const compatible = SRComparison.compatibleItems(sorted, B1);
        const selected = compatible.find((f) => f.id === ca.value) || compatible[0];
        ca.innerHTML = compatible.length ? opts(selected.id, B1.kind, B1.id) : '<option value="">No compatible item</option>';
      }
      renderCompareTool();
    };
    if (ca && cb) { ca.onchange = () => syncCompareSelectors('a'); cb.onchange = () => syncCompareSelectors('b'); syncCompareSelectors('a'); }
  });

  /* ---------------- DAILY CHALLENGE ---------------- */
  function countdown(el, ms) { const end = Date.now() + ms; const t = () => { const s = Math.max(0, Math.floor((end - Date.now()) / 1000)); el.textContent = `${String(Math.floor(s / 3600)).padStart(2, '0')}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m ${String(s % 60).padStart(2, '0')}s`; }; t(); const i = setInterval(t, 1000); A.onLeave(() => clearInterval(i)); }
  register('/daily-challenge', async () => {
    setTitle('Daily Challenge'); const d = await api('/daily'); const gk = 'sr_daily_guest_' + d.date;
    let answers = S.user ? d.answers : A.store.get(gk, []);
    const done = answers.length >= 5; const total = answers.reduce((s, a) => s + a.score, 0);
    const head = `${crumbs(['/play', 'Play'], ['', 'Daily Challenge'])}<div class="card row" style="justify-content:space-between"><div><h1 style="font-size:1.8rem">🏆 Daily Challenge <span class="note">${esc(d.date)} (UTC)</span></h1><p class="muted">5 questions · max 5,000 points · same for everyone</p></div><div class="center"><div class="note">Next challenge in</div><b class="gold" id="cd" style="font-size:1.4rem"></b></div>${S.user ? `<div class="center"><div class="note">Streak</div><b style="font-size:1.4rem">🔥 ${d.streak}</b></div>` : ''}</div>`;
    const shell = (inner) => { view(head + '<div style="margin-top:16px">' + inner + '</div>'); countdown($('#cd'), d.endsInMs); };
    if (done) {
      shell(`<div class="game">${A.summaryCard({ title: 'Challenge complete!', answers, max: 5000, extra: S.user ? '' : '<p class="note">Guest result – <a href="/signup" data-link style="text-decoration:underline">sign up</a> to join the daily leaderboard.</p>', actions: '<a class="btn" href="/leaderboard?tab=daily" data-link>Daily leaderboard</a><button class="btn ghost" id="share">Share result</button>' })}</div>`);
      $('#share').onclick = async () => { const txt = `SizeRoyale Daily ${d.date}: ${total.toLocaleString('en-US')}/5000 – ${location.origin}/daily-challenge`; try { if (navigator.share) await navigator.share({ text: txt }); else { await navigator.clipboard.writeText(txt); toast('Result copied'); } } catch (_) {} };
      return;
    }
    shell(`<div class="card center"><p class="muted">${answers.length ? `You're ${answers.length}/5 through today's challenge.` : 'One attempt per day. Ready?'}</p>${S.user ? '' : '<p class="note" style="margin:8px 0">Playing as guest: results aren\'t saved to the leaderboard. <a href="/login" data-link style="text-decoration:underline">Sign in</a></p>'}<p style="margin-top:14px"><button class="btn" id="start">${answers.length ? 'Continue' : '▶ Start Daily Challenge'}</button></p></div>`);
    $('#start').onclick = () => A.runQuiz({
      title: 'Daily Challenge', total: 5, back: '/daily-challenge', answers,
      getQuestion: async (i) => d.questions[i],
      async submit(q, value, unit, i) {
        if (S.user) { const r = await api('/daily/guess', { index: i, value, unit }); return r; }
        const r = await api('/guess', { qid: q.id, value, unit, mode: 'daily-guest' }); const cur = A.store.get(gk, []); cur.push(r.result); A.store.set(gk, cur); return r;
      },
      summary() { A.sfx.win(); A.confetti(); go('/daily-challenge', true); },
    });
  });

  /* ---------------- LEADERBOARD ---------------- */
  register('/leaderboard', async (_, q) => {
    setTitle('Leaderboard'); let tab = q.get('tab') === 'daily' ? 'daily' : 'global';
    view(`${crumbs(['', 'Leaderboard'])}<h1>🏆 Leaderboard</h1><div class="tabs" style="margin-top:14px" role="tablist"><button role="tab" data-t="global">Global</button><button role="tab" data-t="daily">Daily</button></div><div class="card" id="lb"><div class="skeleton"></div></div>`);
    let loadVersion = 0;
    async function load() {
      const version = ++loadVersion;
      $$('.tabs button').forEach((b) => b.classList.toggle('sel', b.dataset.t === tab));
      const r = await api('/leaderboard/' + tab);
      // Ignore stale responses after a tab switch or navigation to another mode.
      if (version !== loadVersion || location.pathname !== '/leaderboard') return;
      const lb = $('#lb');
      if (!lb) return;
      const meId = S.user && S.user.id;
      const rows = r.rows.map((x) => row(x, meId)).join(''); const meRow = r.me && r.me.rank > r.rows.length ? `<div class="note" style="margin:10px 0 4px">Your position</div>${row(r.me, meId)}` : '';
      lb.innerHTML = `${tab === 'daily' ? `<p class="note" style="margin-bottom:8px">${esc(r.date)} · daily score out of 5,000</p>` : '<p class="note" style="margin-bottom:8px">Total points across Daily and Unlimited play</p>'}${rows || `<p class="muted center" style="padding:24px 0">${tab === 'daily' ? 'No one has finished today\'s challenge yet.' : 'No ranked players yet.'}</p><p class="center"><a class="btn" href="${tab === 'daily' ? '/daily-challenge' : '/play'}" data-link>Be the first</a></p>`}${meRow}${!S.user ? '<p class="note center" style="margin-top:12px"><a href="/signup" data-link style="text-decoration:underline">Create an account</a> to appear here.</p>' : ''}`;
    }
    $$('.tabs button').forEach((b) => (b.onclick = () => { tab = b.dataset.t; history.replaceState({}, '', '/leaderboard' + (tab === 'daily' ? '?tab=daily' : '')); load(); }));
    await load();
  });

  /* ---------------- AUTH ---------------- */
  function authPage(kind) {
    return async (_, q) => {
      setTitle(kind === 'login' ? 'Sign In' : 'Create Account'); if (S.user) return go('/profile', true);
      const isLogin = kind === 'login'; const avs = (await api('/avatars')).avatars; let av = avs[0];
      view(`<div class="card" style="max-width:440px;margin:20px auto"><h1 style="font-size:1.9rem">${isLogin ? 'Welcome back' : 'Create your account'}</h1><p class="muted" style="margin:6px 0 16px">${isLogin ? 'Sign in to save your progress.' : 'Free. Save stats, build a streak and join the leaderboard.'}</p>
      <form id="af" novalidate><div class="field"><label for="u">Username</label><input id="u" autocomplete="username" maxlength="20" required></div><div class="field"><label for="p">Password</label><input id="p" type="password" autocomplete="${isLogin ? 'current-password' : 'new-password'}" minlength="8" required></div>
      ${isLogin ? '' : `<div class="field"><label>Choose an avatar</label><div class="chips" id="avs">${avs.map((a, i) => `<button type="button" class="chip ${i === 0 ? 'sel' : ''}" data-a="${a}" aria-label="Avatar ${a}">${a}</button>`).join('')}</div></div>`}
      <p class="err" id="err" role="alert"></p><button class="btn block" id="sub">${isLogin ? 'Sign In' : 'Create Account'}</button></form>
      <p class="note center" style="margin-top:14px">${isLogin ? 'New here? <a href="/signup" data-link style="text-decoration:underline">Create an account</a>' : 'Already have one? <a href="/login" data-link style="text-decoration:underline">Sign in</a>'}</p>${isLogin ? '<p class="note center" style="margin-top:8px">Forgot your password? Self-service reset isn\'t enabled yet – <a href="/contact" data-link style="text-decoration:underline">contact us</a>.</p>' : ''}</div>`);
      $$('#avs .chip').forEach((b) => (b.onclick = () => { $$('#avs .chip').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); av = b.dataset.a; }));
      $('#af').onsubmit = async (e) => { e.preventDefault(); $('#sub').disabled = true; try { const r = await api('/auth/' + (isLogin ? 'login' : 'signup'), { username: $('#u').value, password: $('#p').value, avatar: av }); S.user = r.user; if (r.user.unitSystem) S.system = r.user.unitSystem; toast('Welcome, ' + r.user.username + '!'); go(q.get('next') || '/profile', true); } catch (er) { $('#err').textContent = er.message; $('#sub').disabled = false; } };
    };
  }
  register('/login', authPage('login')); register('/signup', authPage('signup'));

  /* ---------------- PROFILE / STATS / HISTORY ---------------- */
  async function profile(tabDefault) {
    setTitle('Profile'); if (!S.user) { view(`<div class="card center" style="max-width:480px;margin:20px auto"><div class="podium">👤</div><h1 style="font-size:1.8rem">Your profile</h1><p class="muted" style="margin:8px 0 16px">Sign in to see your stats, history and rank.</p><div class="row" style="justify-content:center"><a class="btn" href="/login?next=/profile" data-link>Sign In</a><a class="btn ghost" href="/signup" data-link>Create Account</a></div></div>`); return; }
    const { stats: st } = await api('/stats'); let tab = tabDefault;
    const cat = (s) => (catBy(s) ? catBy(s).short : s);
    const avs = (await api('/avatars')).avatars;
    function draw() {
      const kpi = (v, l) => `<div class="card center"><b style="font-size:1.6rem" class="gold">${v}</b><div class="note">${l}</div></div>`;
      const perf = st.categoryPerformance.length ? `<div class="bars">${st.categoryPerformance.map((c) => `<div class="b"><span>${esc(cat(c.slug))}</span><div class="track"><i style="width:${c.accuracy}%"></i></div><b>${fmt(c.accuracy)}%</b></div>`).join('')}</div>` : '<p class="muted">Play a few rounds to see category performance.</p>';
      const recent = st.recent.length ? `<div class="scroll-x"><table><thead><tr><th>Question</th><th>Mode</th><th>Score</th><th>Error</th></tr></thead><tbody>${st.recent.map((h) => `<tr><td>${esc(h.title)}</td><td>${esc(h.mode)}</td><td><b>${h.score}</b></td><td>${h.pctError >= 0 ? '+' : ''}${fmt(h.pctError)}%</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No games yet. <a href="/play" data-link style="text-decoration:underline">Play now</a></p>';
      const body = tab === 'history' ? `<div class="card"><h2>Recent answers</h2>${recent}</div><div class="card sec"><h2>Daily challenge history</h2>${st.dailyHistory.length ? st.dailyHistory.map((d) => `<div class="lb-row"><span class="nm">${esc(d.date)}</span><span class="pt">${d.total.toLocaleString('en-US')} / 5,000</span></div>`).join('') : '<p class="muted">You haven\'t completed a Daily Challenge yet.</p>'}</div>`
        : tab === 'stats' ? `<div class="stat-row" style="grid-template-columns:repeat(2,1fr);gap:12px">${kpi(st.gamesPlayed, 'Games played')}${kpi(st.questionsAnswered, 'Questions answered')}${kpi(fmt(st.averageAccuracy) + '%', 'Average accuracy')}${kpi(st.totalPoints.toLocaleString('en-US'), 'Total points')}${kpi(st.personalBest.toLocaleString('en-US'), 'Personal best (game)')}${kpi(st.bestCategory ? esc(cat(st.bestCategory)) : '–', 'Best category')}${kpi('🔥 ' + st.streak, 'Daily streak')}${kpi(st.rank ? '#' + st.rank : '–', 'Global rank')}</div><div class="card sec"><h2>Category performance</h2>${perf}</div>`
        : `<div class="stat-row" style="grid-template-columns:repeat(4,1fr);gap:8px">${kpi(st.gamesPlayed, 'Games')}${kpi(fmt(st.averageAccuracy) + '%', 'Accuracy')}${kpi(st.totalPoints.toLocaleString('en-US'), 'Points')}${kpi('🔥 ' + st.streak, 'Streak')}</div><div class="card sec"><h2>Category performance</h2>${perf}</div><div class="card sec"><h2>Settings</h2><div class="field"><label>Avatar</label><div class="chips" id="avs">${avs.map((a) => `<button class="chip ${a === S.user.avatar ? 'sel' : ''}" data-a="${a}">${a}</button>`).join('')}</div></div><div class="field"><label>Units</label><div class="chips" id="sys"><button class="chip ${S.system === 'metric' ? 'sel' : ''}" data-s="metric">Metric (m, km, cm)</button><button class="chip ${S.system === 'us' ? 'sel' : ''}" data-s="us">US (ft, mi, in)</button></div></div><button class="btn ghost" id="lo">Log out</button></div>`;
      view(`${crumbs(['', 'Profile'])}<div class="card row"><span class="av" style="width:64px;height:64px;font-size:2rem">${esc(S.user.avatar)}</span><div><h1 style="font-size:1.6rem">${esc(S.user.username)}</h1><div class="muted">${st.rank ? 'Global rank #' + st.rank : 'Unranked – finish a game'} · ${st.totalPoints.toLocaleString('en-US')} pts</div></div></div>
        <div class="tabs" style="margin-top:14px"><button data-t="profile" class="${tab === 'profile' ? 'sel' : ''}">Overview</button><button data-t="stats" class="${tab === 'stats' ? 'sel' : ''}">Statistics</button><button data-t="history" class="${tab === 'history' ? 'sel' : ''}">History</button></div>${body}`);
      $$('.tabs button').forEach((b) => (b.onclick = () => { tab = b.dataset.t; history.replaceState({}, '', tab === 'profile' ? '/profile' : '/' + tab); draw(); }));
      $$('#avs .chip').forEach((b) => (b.onclick = async () => { const r = await api('/me', { avatar: b.dataset.a }); S.user = r.user; toast('Avatar updated'); A.render(); }));
      $$('#sys .chip').forEach((b) => (b.onclick = async () => { S.system = b.dataset.s; A.store.set('sr_units', S.system); await api('/me', { unitSystem: S.system }); A.render(); }));
      const lo = $('#lo'); if (lo) lo.onclick = async () => { await api('/auth/logout', {}); S.user = null; go('/'); };
    }
    draw();
  }
  register('/profile', () => profile('profile')); register('/stats', () => profile('stats')); register('/history', () => profile('history'));

  /* ---------------- EXPLORE ---------------- */
  register('/explore', async (_, q) => {
    setTitle('Explore'); const fx = await facts(); const cats = S.meta.categories; let cat = cats.some((c) => c.slug === q.get('cat')) ? q.get('cat') : cats[0].slug;
    view(`${crumbs(['', 'Explore'])}<h1>🧭 Explore <span class="grad">sizes</span></h1><p class="muted" style="margin:8px 0 14px">Every measurement in the question bank, ranked, with its exact definition and source. Bars use a logarithmic scale so tiny and huge things fit together.</p><div class="chips" id="ec" style="margin-bottom:14px">${cats.map((c) => `<button class="chip" data-v="${c.slug}">${c.icon} ${esc(c.short)}</button>`).join('')}</div><div class="card" id="ex"></div>`);
    function draw() {
      $$('#ec .chip').forEach((b) => b.classList.toggle('sel', b.dataset.v === cat));
      const list = fx.filter((f) => f.category === cat).sort((a, b) => b.meters - a.meters); const lmax = Math.log10(list[0].meters), lmin = Math.log10(list[list.length - 1].meters) - 0.3;
      $('#ex').innerHTML = `<p class="muted" style="margin-bottom:6px">${esc(catBy(cat).desc)}</p>${list.map((f) => `<div class="exp-item"><span style="font-size:1.6rem">${f.icon}</span><div><b>${esc(f.shortName)}</b><div class="note">${esc(f.kind)} · ${esc(f.description)}</div></div><div class="center"><b class="gold">${esc(fmtLen(f.meters))}</b></div><div class="bar2"><i style="width:${Math.max(3, ((Math.log10(f.meters) - lmin) / (lmax - lmin)) * 100)}%"></i></div><div></div><div class="note" style="grid-column:2/4">${esc(f.fact)} <a href="${esc(f.sourceUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline">${esc(f.sourceName)}</a></div></div>`).join('')}<p style="margin-top:16px"><a class="btn" href="${catBy(cat).path}" data-link>▶ Play ${esc(catBy(cat).short)}</a></p>`;
    }
    $$('#ec .chip').forEach((b) => (b.onclick = () => { cat = b.dataset.v; history.replaceState({}, '', '/explore?cat=' + cat); draw(); })); draw();
  });

  /* ---------------- LEARN / HOW TO PLAY / FAQ ---------------- */
  register('/learn', async () => {
    setTitle('Learn'); const sc = SR.score; const ex = [[1, 'Exact guess'], [1.1, '10% too high'], [1.25, '25% too high'], [0.75, '25% too low'], [1.5, '50% too high'], [0.5, 'Half the real size'], [2, 'Double the real size']];
    view(`${crumbs(['', 'Learn'])}<div class="prose"><h1>Learn</h1><p class="muted">Everything about scoring, measurements and units.</p>
    <h2 id="how">How to play</h2><p>Pick a mode, make a guess, see the real answer. <a href="/how-to-play" data-link style="text-decoration:underline">Full guide</a>.</p>
    <h2 id="scoring">Scoring</h2><p>Your score for each question is:</p><p><code>S = max(0, 1000 × (1 − |ln(g / a)| / ln 2))</code></p><p>where <code>g</code> is your guess and <code>a</code> the real answer. Because it uses a ratio, being 10% off on a pencil is scored the same as being 10% off on a planet. The server recalculates every score; the browser's number is never trusted. A Daily Challenge is worth up to 5,000 points.</p>
    <div class="card scroll-x"><table><thead><tr><th>Your guess vs. real</th><th>Ratio</th><th>Score</th></tr></thead><tbody>${ex.map(([r, l]) => `<tr><td>${l}</td><td>${r}×</td><td><b>${sc(r * 100, 100)}</b></td></tr>`).join('')}</tbody></table></div>
    <h2 id="measurement">Measurement basics</h2><ul><li><b>Length</b> – the longest dimension, end to end.</li><li><b>Height</b> – vertical distance; for mountains, above sea level.</li><li><b>Wingspan</b> – tip of one wing to tip of the other.</li><li><b>Diameter</b> – straight line across a circle or sphere through its centre.</li><li><b>Depth</b> – distance below a surface, such as sea level.</li></ul>
    <h2 id="units">Unit conversion</h2><div class="card scroll-x"><table><tbody>${[['1 inch', '2.54 cm'], ['1 foot', '0.3048 m'], ['1 yard', '0.9144 m'], ['1 mile', '1.609344 km'], ['1 km', '0.621371 mi'], ['1 m', '3.28084 ft']].map(([a, b]) => `<tr><td>${a}</td><td>=</td><td>${b}</td></tr>`).join('')}</tbody></table></div><p class="note">SizeRoyale stores every measurement in meters and converts for display, so your unit choice never changes your score. Toggle units with the <b>m / ft</b> button at the top.</p>
    <div class="card"><b>Quick converter</b><div class="row" style="margin-top:8px;flex-wrap:nowrap"><input id="cv" type="number" value="100" style="flex:1;min-width:0;background:#0c0d26;border:2px solid var(--line);border-radius:12px;padding:10px"><select id="cu" style="background:#0c0d26;border:2px solid var(--line);border-radius:12px;padding:10px">${Object.keys(SR.UNITS).map((u) => `<option ${u === 'm' ? 'selected' : ''}>${u}</option>`).join('')}</select></div><p id="co" class="muted" style="margin-top:8px"></p></div>
    <h2 id="tips">Guessing tips</h2><ul><li>Anchor on something familiar: a door is ~2 m, a bus ~12 m, a football field ~100 m.</li><li>Get the order of magnitude right first, then refine.</li><li>Check what is measured – a giraffe's height is not a whale's length.</li><li>When unsure, guess the geometric middle of your range; the scoring is symmetric in ratio.</li></ul></div>`);
    const upd = () => { const v = parseFloat($('#cv').value); if (!(v > 0)) { $('#co').textContent = 'Enter a positive number.'; return; } const m = SR.toMeters(v, $('#cu').value); $('#co').textContent = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'].filter((u) => u !== $('#cu').value).map((u) => fmt(SR.fromMeters(m, u)) + ' ' + u).join('  ·  '); };
    $('#cv').oninput = $('#cu').onchange = upd; upd();
  });
  register('/how-to-play', async () => {
    setTitle('How to Play');
    view(`${crumbs(['', 'How to play'])}<div class="prose"><h1>How to play</h1><div class="steps" style="margin:16px 0">${[['Choose a category', 'Animals, dinosaurs, space, geography, vehicles or everyday objects.'], ['Make your guess', 'Type a number or drag the slider. Choose metric or US units.'], ['See the result', 'The real answer appears with your error and a fun fact.'], ['Earn points', 'Up to 1,000 per question. Climb the leaderboard.']].map(([t, d], i) => `<div class="card"><div class="step"><i>${i + 1}</i>${t}</div><p class="note" style="margin-top:6px">${d}</p></div>`).join('')}</div>
    <h2>Game modes</h2><ul><li><b><a href="/daily-challenge" data-link style="text-decoration:underline">Daily Challenge</a></b> – 5 shared questions, one attempt per day, resets at 00:00 UTC.</li><li><b><a href="/unlimited" data-link style="text-decoration:underline">Unlimited Play</a></b> – endless rounds of 5; no repeats until you've seen every question in the pool.</li><li><b><a href="/multiplayer" data-link style="text-decoration:underline">Friends Battle</a></b> – 2–4 players, 5 rounds of 20 seconds, live scores, rematch.</li></ul>
    <h2>Accounts</h2><p>Guests can play everything, but results are only saved (and ranked) with a free account.</p><p class="row"><a class="btn" href="/play" data-link>▶ Play now</a></p></div>`);
  });
  register('/faq', async () => {
    setTitle('FAQ'); const app = view(`${crumbs(['', 'FAQ'])}<section class="faq-page"><div class="section-kicker">QUESTIONS, ANSWERED</div><h1>Frequently asked questions</h1><p class="faq-intro">Quick answers about playing, scoring and SizeRoyale.</p><div class="faq-grid">${faqMarkup(faqItems)}</div></section>`);
    bindFaq(app);
  });

  /* ---------------- ABOUT / CONTACT / LEGAL ---------------- */
  register('/about', async () => { setTitle('About'); view(`${crumbs(['', 'About'])}<div class="prose"><h1>About SizeRoyale</h1><p>SizeRoyale is an independent size-guessing game. We believe a good guess teaches you something: how big a blue whale really is, how tall Everest stands, or how small a bee hummingbird can be.</p><h2>Where the numbers come from</h2><p>Each question stores one measurement in meters, the exact definition of what is measured, a fun fact and a source link. Questions where scientists disagree (such as river lengths or dinosaur sizes) say so. If you spot a wrong value, <a href="/contact" data-link style="text-decoration:underline">tell us</a>.</p><h2>Currently</h2><p>The question bank currently holds <b>${S.meta.totalQuestions}</b> verified-source questions across ${S.meta.categories.length} categories and is growing.</p><p class="note">SizeRoyale is not affiliated with other size-guessing games or any of the brands they mention.</p></div>`); });
  register('/contact', async () => {
    setTitle('Contact'); view(`${crumbs(['', 'Contact'])}<div class="card" style="max-width:560px;margin:0 auto"><h1 style="font-size:1.8rem">Contact</h1><p class="muted" style="margin:6px 0 14px">Feedback, a wrong measurement, or a bug? Tell us.</p><form id="cf" novalidate><div class="field"><label for="n">Name</label><input id="n" maxlength="80"></div><div class="field"><label for="e">Email</label><input id="e" type="email" maxlength="120"></div><div class="field"><label for="m">Message</label><textarea id="m" rows="5" maxlength="2000"></textarea></div><p class="err" id="err" role="alert"></p><button class="btn block">Send</button></form></div>`);
    $('#cf').onsubmit = async (e) => { e.preventDefault(); try { await api('/contact', { name: $('#n').value, email: $('#e').value, message: $('#m').value }); $('#cf').innerHTML = '<p class="center"><b>Thanks!</b> Your message has been received.</p>'; } catch (er) { $('#err').textContent = er.message; } };
  });
  register('/privacy', async () => { setTitle('Privacy Policy'); view(`${crumbs(['', 'Privacy'])}<div class="prose"><h1>Privacy policy</h1><p class="note">Draft – have this reviewed by a lawyer before launch.</p><h2>What we store</h2><ul><li><b>Account:</b> username, avatar, unit preference and a salted password hash (never your plain password).</li><li><b>Gameplay:</b> your guesses, scores and Daily Challenge results, to build stats and leaderboards.</li><li><b>Contact messages:</b> name, email and message you send us.</li></ul><h2>Cookies and local storage</h2><p>One essential session cookie keeps you signed in. Your browser's local storage keeps preferences (units, sound) and which questions you've already seen. We do not run advertising or third-party tracking.</p><h2>Multiplayer</h2><p>Guest nicknames in rooms are temporary and deleted when the room expires.</p><h2>Your choices</h2><p>Contact us to delete your account and data.</p></div>`); });
  register('/terms', async () => { setTitle('Terms of Service'); view(`${crumbs(['', 'Terms'])}<div class="prose"><h1>Terms of service</h1><p class="note">Draft – have this reviewed by a lawyer before launch.</p><ul><li>SizeRoyale is provided as-is for entertainment and education.</li><li>Don't cheat, automate gameplay, attack the service or impersonate others. Offensive usernames may be removed.</li><li>Measurements are sourced from public references and may be approximate; they are not for engineering or navigation.</li><li>We may change or end features, and remove accounts that break these terms.</li><li>You're responsible for keeping your password safe.</li></ul></div>`); });
})();
