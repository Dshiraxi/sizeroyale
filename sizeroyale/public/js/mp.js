/* Friends Battle – realtime client. All state comes from the server over SSE. */
(function () {
  'use strict';
  const A = window.SRApp; const { S, api, $, $$, esc, view, go, register, toast, setTitle, fmt, fmtLen } = A;
  const credKey = (c) => 'sr_room_' + c;
  const medal = ['🥇', '🥈', '🥉', '4️⃣'];

  /* ---------- create / join page ---------- */
  register('/multiplayer', async (_, q) => {
    setTitle('Friends Battle'); const cats = S.meta.categories; const prefill = (q.get('code') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    const nick = A.store.get('sr_nick', '');
    const nickField = S.user ? `<p class="note" style="margin-bottom:12px">Playing as <b>${esc(S.user.avatar)} ${esc(S.user.username)}</b></p>` : `<div class="field"><label for="nick">Your nickname</label><input id="nick" maxlength="16" value="${esc(nick)}" placeholder="e.g. SizeMaster" autocomplete="nickname"></div>`;
    view(`<nav class="crumbs"><a href="/" data-link>Home</a> › <a href="/play" data-link>Play</a> › Friends Battle</nav>
    <h1>👥 Friends <span class="grad">Battle</span></h1><p class="muted" style="margin:8px 0 18px">Create a room, share the code, and race 1–3 friends over 5 live rounds (20 seconds each). Same questions for everyone; the server runs the clock.</p>
    <div class="lobby" style="grid-template-columns:repeat(auto-fit,minmax(290px,1fr));max-width:none">
      <div class="card"><h2>Create a room</h2>${nickField}
        <div class="field"><label for="mx">Players</label><select id="mx"><option value="2">1v1 (2 players)</option><option value="3">3 players</option><option value="4" selected>Up to 4 players</option></select></div>
        <div class="field"><label for="rc">Category</label><select id="rc"><option value="all">All categories</option>${cats.map((c) => `<option value="${c.slug}">${c.icon} ${esc(c.short)}</option>`).join('')}</select></div>
        <p class="err" id="e1" role="alert"></p><button class="btn block pink" id="create">Create room</button></div>
      <div class="card"><h2>Join with a code</h2>${S.user ? '' : '<p class="note" style="margin-bottom:12px">Uses the nickname you enter on the left.</p>'}
        <div class="field"><label for="jc">Room code</label><input id="jc" value="${esc(prefill)}" maxlength="8" placeholder="e.g. 7FQK2" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase;letter-spacing:.2em;font-weight:800;font-size:1.3rem;text-align:center"></div>
        <p class="err" id="e2" role="alert"></p><button class="btn block" id="join">Join room</button></div></div>`);
    const getNick = () => { if (S.user) return {}; const n = ($('#nick').value || '').trim(); A.store.set('sr_nick', n); return { name: n }; };
    $('#create').onclick = async () => { $('#e1').textContent = ''; try { const r = await api('/rooms', Object.assign(getNick(), { maxPlayers: Number($('#mx').value), category: $('#rc').value })); A.store.set(credKey(r.code), { pid: r.pid, token: r.token }); go('/room/' + r.code); } catch (e) { $('#e1').textContent = e.message; } };
    $('#join').onclick = async () => { $('#e2').textContent = ''; const code = $('#jc').value.toUpperCase().replace(/^SR-/, '').replace(/[^A-Z0-9]/g, ''); if (code.length < 5) { $('#e2').textContent = 'Enter the 5-character room code.'; return; } try { const old = A.store.get(credKey(code), {}); const r = await api('/rooms/' + code + '/join', Object.assign(getNick(), old)); A.store.set(credKey(r.code), { pid: r.pid, token: r.token }); go('/room/' + r.code); } catch (e) { $('#e2').textContent = e.message; } };
  });

  /* ---------- room page ---------- */
  register('/room/:code', async ({ code }) => {
    code = code.toUpperCase().replace(/^SR-/, ''); setTitle('Friends Battle ' + code);
    const creds = A.store.get(credKey(code), null);
    if (!creds) return joinGate(code);
    connect(code, creds);
  });
  async function joinGate(code) {
    let info; try { info = await api('/rooms/' + code); } catch (e) { return view(`<div class="card center" style="max-width:460px;margin:20px auto"><div class="podium">🚫</div><h2>${esc(e.message)}</h2><p class="muted" style="margin:8px 0 16px">${e.status === 410 ? 'Rooms close after a while. Ask your friend for a new code.' : 'Double-check the code and try again.'}</p><a class="btn" href="/multiplayer" data-link>Back to Friends Battle</a></div>`); }
    if (info.state !== 'lobby') return view(`<div class="card center" style="max-width:460px;margin:20px auto"><div class="podium">⏳</div><h2>That game has already started</h2><p class="muted" style="margin:8px 0 16px">You can join a room only while it's in the lobby.</p><a class="btn" href="/multiplayer" data-link>Create your own room</a></div>`);
    if (info.players >= info.maxPlayers) return view(`<div class="card center" style="max-width:460px;margin:20px auto"><div class="podium">🔒</div><h2>That room is full</h2><a class="btn" href="/multiplayer" data-link style="margin-top:14px">Back</a></div>`);
    view(`<div class="card" style="max-width:460px;margin:20px auto"><h2>Join room <span class="gold">${esc(code)}</span></h2><p class="muted" style="margin-bottom:12px">${info.players}/${info.maxPlayers} players in the lobby.</p>${S.user ? `<p>Joining as <b>${esc(S.user.avatar)} ${esc(S.user.username)}</b></p>` : `<div class="field"><label for="nick">Your nickname</label><input id="nick" maxlength="16" value="${esc(A.store.get('sr_nick', ''))}" placeholder="e.g. SizeMaster"></div>`}<p class="err" id="err" role="alert"></p><button class="btn block" id="jb" style="margin-top:12px">Join</button></div>`);
    $('#jb').onclick = async () => { try { const body = S.user ? {} : { name: ($('#nick').value || '').trim() }; if (body.name) A.store.set('sr_nick', body.name); const r = await api('/rooms/' + code + '/join', body); A.store.set(credKey(code), { pid: r.pid, token: r.token }); go('/room/' + code, true); } catch (e) { $('#err').textContent = e.message; } };
  }

  function connect(code, creds) {
    let R = null, offset = 0, uiKey = '', es = null, tick = null, gameBtnBusy = false, gotFirst = false;
    view(`<div class="game"><div class="skeleton"></div><p class="center muted" style="margin-top:12px">Connecting to room ${esc(code)}…</p></div>`);
    function open() {
      es = new EventSource(`/api/rooms/${code}/events?pid=${creds.pid}&token=${creds.token}`);
      es.onmessage = (ev) => { gotFirst = true; R = JSON.parse(ev.data); offset = R.serverNow - Date.now(); draw(); };
      es.onerror = async () => {
        if (es.readyState === 2 || !gotFirst) { // server refused or room gone
          es.close();
          try { await api('/rooms/' + code); const r = await api('/rooms/' + code + '/join', creds); creds = { pid: r.pid, token: r.token }; A.store.set(credKey(code), creds); open(); }
          catch (e) { A.store.del(credKey(code)); clearInterval(tick); view(`<div class="card center" style="max-width:460px;margin:20px auto"><div class="podium">🔌</div><h2>${esc(e.status === 403 || e.status === 409 ? 'You are no longer in this room' : e.message)}</h2><p style="margin-top:14px"><a class="btn" href="/multiplayer" data-link>Back to Friends Battle</a></p></div>`); }
        } else { const b = $('#conn'); if (b) b.textContent = '⚠️ Reconnecting…'; }
      };
    }
    open();
    A.onLeave(() => { if (es) es.close(); clearInterval(tick); });
    const post = (p, extra) => api('/rooms/' + code + '/' + p, Object.assign({ pid: creds.pid, token: creds.token }, extra || {}));
    const me = () => R.players.find((p) => p.id === R.you);
    const remaining = () => Math.max(0, (R.phaseEndsAt - (Date.now() + offset)) / 1000);

    tick = setInterval(() => {
      if (!R || !R.phaseEndsAt) return; const t = $('#mpTimer'); if (!t) return; const s = remaining(); t.textContent = Math.ceil(s) + 's'; t.classList.toggle('low', s <= 5 && R.phase === 'question');
      const bar = $('#mpBar'); if (bar && R.phase === 'question') bar.style.width = (s / R.roundSec) * 100 + '%';
    }, 150);

    const playersStrip = () => `<div class="live" id="live">${R.players.filter((p) => !p.left).map((p) => `<div class="p ${p.submitted ? 'done' : ''}"><span>${esc(p.avatar)}</span><b>${esc(p.name)}${p.id === R.you ? ' (you)' : ''}</b><span class="gold">${p.score.toLocaleString('en-US')}</span>${R.phase === 'question' ? (p.submitted ? '<span title="Locked in">✅</span>' : '<span title="Thinking">⏳</span>') : ''}${p.connected ? '' : '<span title="Disconnected">📴</span>'}</div>`).join('')}</div>`;

    function draw() {
      const key = R.state === 'playing' ? R.phase + '-' + R.round : R.state; const m = me();
      if (!m) return;
      if (key === uiKey && R.state === 'playing' && R.phase === 'question') { const l = $('#live'); if (l) l.outerHTML = playersStrip(); if (m.submitted) lockedNote(); return; }
      uiKey = key;
      if (R.state === 'lobby') return lobby();
      if (R.state === 'playing' && R.phase === 'question') return question();
      if (R.state === 'playing' && R.phase === 'reveal') return reveal();
      if (R.state === 'results') return results();
    }
    function lockedNote() { const b = $('#gSubmit'); if (b) { b.disabled = true; b.textContent = 'Guess locked in ✓ – waiting for others'; } }

    function lobby() {
      const host = R.hostId === R.you; const active = R.players.filter((p) => !p.left); const slots = [];
      for (let i = 0; i < R.maxPlayers; i++) { const p = active[i]; slots.push(p ? `<div class="slot"><span class="av">${esc(p.avatar)}</span><span class="nm">${esc(p.name)}${p.id === R.you ? ' (You)' : ''}</span>${p.isHost ? '<span class="tag host">👑 Host</span>' : p.ready ? '<span class="tag ok">Ready</span>' : '<span class="tag">Not ready</span>'}${p.connected ? '' : '<span class="tag off">offline</span>'}</div>` : `<div class="slot empty"><span class="av">?</span><span class="nm muted">Waiting for player…</span></div>`); }
      const link = location.origin + '/multiplayer?code=' + R.code; const catName = R.category === 'all' ? 'All categories' : (A.catBy(R.category) || {}).name;
      const everyoneReady = active.length >= 2 && active.every((p) => p.isHost || p.ready);
      view(`<div class="lobby"><div class="row" style="justify-content:space-between"><h1 style="font-size:1.8rem">Multiplayer Lobby</h1><span class="pill" id="conn">${R.maxPlayers === 2 ? '1v1' : '2–' + R.maxPlayers + ' players'}</span></div>
        <div class="card"><div class="note center">Room code</div><div class="code" aria-label="Room code ${esc(R.code.split('').join(' '))}">SR-${esc(R.code)}</div>
          <div class="row" style="justify-content:center;margin-top:12px"><button class="btn ghost sm" id="cc">📋 Copy code</button><button class="btn ghost sm" id="cl">🔗 Copy link</button><a class="btn green sm" id="wa" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent('Join my SizeRoyale battle! Room ' + R.code + ' → ' + link)}">WhatsApp</a></div></div>
        <div class="card"><h2>Players (${active.length}/${R.maxPlayers})</h2>${slots.join('')}</div>
        <div class="card"><h2>Room settings</h2><div class="row"><span class="pill">🎯 5 rounds</span><span class="pill">⏱ ${R.roundSec}s per round</span><span class="pill">📚 ${esc(catName)}</span></div></div>
        <p class="err center" id="lerr" role="alert"></p>
        ${host ? `<button class="btn gold block" id="start" ${everyoneReady ? '' : 'disabled'}>Start Game 🎮</button><p class="note center">${active.length < 2 ? 'Waiting for at least one more player.' : everyoneReady ? 'Everyone is ready!' : 'Waiting for everyone to press Ready.'}</p>` : `<button class="btn ${m().ready ? 'ghost' : 'green'} block" id="ready">${m().ready ? 'Not ready' : "I'm ready ✓"}</button><p class="note center">Waiting for the host to start.</p>`}
        <button class="btn ghost block" id="leave">Leave room</button></div>`);
      function m() { return me(); }
      $('#cc').onclick = async () => { try { await navigator.clipboard.writeText(R.code); toast('Code copied: ' + R.code); } catch (_) { toast('Code: ' + R.code); } };
      $('#cl').onclick = async () => { try { await navigator.clipboard.writeText(link); toast('Invite link copied'); } catch (_) { toast(link); } };
      const st = $('#start'); if (st) st.onclick = async () => { try { A.sfx.click(); await post('start'); } catch (e) { $('#lerr').textContent = e.message; } };
      const rd = $('#ready'); if (rd) rd.onclick = async () => { try { await post('ready', { ready: !me().ready }); } catch (e) { $('#lerr').textContent = e.message; } };
      $('#leave').onclick = leaveRoom;
    }
    async function leaveRoom() { try { await post('leave'); } catch (_) {} A.store.del(credKey(code)); if (es) es.close(); go('/multiplayer'); }

    function question() {
      const q = R.question; const m = me(); const locked = !!m.submitted;
      view(`<div class="game"><div class="game-top"><button class="icon-btn" id="lv" aria-label="Leave match">←</button><span class="prog">Round ${R.round + 1} / ${R.rounds}</span><div class="bar"><i id="mpBar" style="width:${(remaining() / R.roundSec) * 100}%"></i></div><span class="timer" id="mpTimer">${Math.ceil(remaining())}s</span></div>
        ${A.qArt(q)}<h1 class="q-title">${esc(q.title)}</h1><p class="q-desc">${esc(q.description)}</p>${A.guessUI(q, locked)}${playersStrip()}<p class="note center" id="conn" style="margin-top:8px"></p></div>`);
      $('#lv').onclick = () => { if (confirm('Leave this match?')) leaveRoom(); };
      if (locked) lockedNote();
      else { const ctl = A.bindGuess(q, async (value, unit) => { await post('guess', { value, unit }); ctl.lock(); lockedNote(); }); }
    }
    function reveal() {
      const q = R.question, rv = R.reveal; const by = Object.fromEntries(R.players.map((p) => [p.id, p])); const rs = rv.results.slice().sort((a, b) => b.score - a.score); const mine = rv.results.find((r) => r.pid === R.you);
      A.sfx.reveal(mine ? mine.score : 0);
      view(`<div class="game"><div class="game-top"><span class="prog">Round ${R.round + 1} / ${R.rounds}</span><div class="bar"><i style="width:${((R.round + 1) / R.rounds) * 100}%"></i></div><span class="timer" id="mpTimer">${Math.ceil(remaining())}s</span></div>
        <div class="card center"><div style="font-size:3rem">${esc(q.icon)}</div><h2 style="margin:4px 0">${esc(q.title)}</h2><div class="muted">Actual answer</div><div class="pts">${esc(fmtLen(rv.actualM))}</div>
        <div style="text-align:left;margin-top:10px">${rs.map((r, i) => `<div class="lb-row ${r.pid === R.you ? 'me' : ''}"><span class="rk">${i + 1}</span><span class="av" style="width:30px;height:30px;font-size:1rem">${esc(by[r.pid].avatar)}</span><span class="nm">${esc(by[r.pid].name)}<span class="note"> · ${r.guessM ? esc(fmtLen(r.guessM, SR.bestUnit(rv.actualM, S.system))) + ' (' + (r.pctError >= 0 ? '+' : '') + fmt(r.pctError) + '%)' : 'no guess'}</span></span><span class="pt">+${r.score}</span></div>`).join('')}</div>
        <div class="fun"><b>💡</b> ${esc(rv.fact)} <span class="note">– <a href="${esc(rv.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(rv.sourceName)}</a></span></div>${playersStrip()}<p class="note" style="margin-top:8px">${R.round + 1 >= R.rounds ? 'Final results next…' : 'Next round starting…'}</p></div></div>`);
    }
    function results() {
      const f = R.final; const iWon = f.winners.includes(R.you); A.sfx.win(); if (iWon) A.confetti();
      const winners = f.ranking.filter((r) => f.winners.includes(r.pid)).map((r) => r.name);
      view(`<div class="game"><div class="result card"><div class="trophy">${iWon ? '🏆' : '🎖️'}</div><div class="res-title">${f.perfectTie ? 'It\'s a tie!' : esc(winners[0]) + ' wins!'}</div><p class="muted">${iWon ? 'Great guessing!' : 'Good battle – ask for a rematch!'}</p>${f.tieBreakUsed ? '<p class="note">Equal points were split by the smallest total guessing error.</p>' : ''}
        <div style="text-align:left;margin:16px 0">${f.ranking.map((r) => `<div class="lb-row ${r.pid === R.you ? 'me' : ''}"><span class="rk">${medal[r.rank - 1] || r.rank}</span><span class="nm">${esc(r.name)}${r.left ? ' (left)' : ''}</span><span class="pt">${r.score.toLocaleString('en-US')}</span></div>`).join('')}</div>
        <p class="err" id="rerr"></p><div class="row" style="justify-content:center"><button class="btn gold" id="rm">⚔️ Rematch</button><button class="btn ghost" id="lv2">Leave</button></div></div></div>`);
      $('#rm').onclick = async () => { try { await post('rematch'); } catch (e) { $('#rerr').textContent = e.message; } };
      $('#lv2').onclick = leaveRoom;
    }
  }

  A.boot();
})();
