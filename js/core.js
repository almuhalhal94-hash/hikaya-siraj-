/* حكايا السِّراج — المحرك الأساسي: التخزين، المحتوى، الصوت، السماء، سِراج، المكافآت، التنقل */
(function () {
  'use strict';
  const HS = (window.HS = { views: {}, c: {} });
  const $ = (HS.$ = (q, el) => (el || document).querySelector(q));
  HS.$$ = (q, el) => [...(el || document).querySelectorAll(q)];
  HS.wait = (ms) => new Promise((r) => setTimeout(r, ms));
  HS.pick = (a) => a[Math.floor(Math.random() * a.length)];
  HS.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  HS.esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  /* مولّد عشوائي ثابت البذرة (لنجوم المشاهد والمتاهة) */
  HS.rng = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

  /* ---------- التخزين (localStorage فقط) ---------- */
  const KEY = 'hikaya-siraj-v1';
  const DEF = { name: '', stars: 0, spent: 0, badges: [], days: [], lastStory: null, done: {}, adhkar: {}, decor: [], free: [], games: {}, surprise: '', sound: true };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  const S = (HS.s = Object.assign({}, DEF, saved));
  HS.save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  HS.today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  HS.isMorning = () => { const h = new Date().getHours(); return h >= 4 && h < 16; };
  HS.fmt = (t) => String(t).replace(/\{name\}/g, S.name || 'صديقي').replace(/\{story\}/g, HS.lastStoryTitle() || 'الحكاية');
  HS.lastStoryTitle = () => { const st = (HS.c.stories?.stories || []).find((x) => x.id === S.lastStory); return st ? '«' + st.title + '»' : ''; };

  /* ---------- المحتوى ---------- */
  HS.load = async () => {
    const names = ['stories', 'siraj', 'games', 'adhkar', 'rewards'];
    const data = await Promise.all(names.map((n) => fetch('content/' + n + '.json').then((r) => r.json())));
    names.forEach((n, i) => (HS.c[n] = data[i]));
  };

  /* ---------- الصوت: مؤثرات Web Audio خفيفة، بلا موسيقى ولا إيقاع ---------- */
  let ac = null, master = null;
  const ctx = () => {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC(); master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  function tone(f, at, dur, o) {
    const a = ctx(); if (!a || !S.sound) return;
    o = o || {};
    const t = a.currentTime + (at || 0), osc = a.createOscillator(), g = a.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.v || 0.12, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(master); osc.start(t); osc.stop(t + dur + 0.05);
  }
  let noiseBuf = null;
  function noise(dur, o) {
    const a = ctx(); if (!a || !S.sound) return null;
    o = o || {};
    if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const t = a.currentTime + (o.at || 0), src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noiseBuf; src.loop = true; f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 600, t); f.Q.value = o.q || 0.8;
    if (o.fTo) f.frequency.exponentialRampToValueAtTime(o.fTo, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.v || 0.1, t + (o.attack || dur * 0.3));
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master); src.start(t); src.stop(t + dur + 0.1);
    return { src, g, f };
  }
  HS.sfx = {
    click: () => tone(520, 0, 0.08, { to: 760, v: 0.09, type: 'triangle' }),
    pop: () => tone(300, 0, 0.12, { to: 900, v: 0.1 }),
    tap: () => tone(880, 0, 0.09, { to: 1180, v: 0.07 }),
    star: () => { tone(1568, 0, 0.35, { v: 0.08 }); tone(2349, 0.05, 0.4, { v: 0.05 }); },
    soft: () => tone(260, 0, 0.22, { to: 200, v: 0.08, type: 'triangle' }),
    /* لمعة نجاح: ومضات عالية متفرقة غير منتظمة (ليست لحنًا) */
    success: () => { for (let i = 0; i < 7; i++) tone(1400 + Math.random() * 1600, Math.random() * 0.5, 0.3 + Math.random() * 0.3, { v: 0.045 }); noise(0.7, { f: 5000, q: 0.5, v: 0.03, type: 'highpass' }); },
    glow: () => { tone(392, 0, 1.4, { to: 523, v: 0.06 }); noise(1.2, { f: 1800, fTo: 4200, q: 0.6, v: 0.025 }); },
    wind: (d) => noise(d || 2.4, { f: 380, fTo: 720, q: 1.2, v: 0.07 }),
    water: () => { for (let i = 0; i < 5; i++) tone(700 + Math.random() * 900, i * 0.07 + Math.random() * 0.05, 0.09, { to: 1500 + Math.random() * 600, v: 0.05 }); },
    steps: () => { for (let i = 0; i < 5; i++) noise(0.14, { at: 0.2 + i * 0.33 + Math.random() * 0.14, f: 130, q: 1.5, v: 0.16, type: 'lowpass', attack: 0.01 }); },
    moan: () => { tone(196, 0, 1.3, { to: 147, v: 0.07, type: 'triangle' }); tone(220, 1.2, 1.5, { to: 150, v: 0.06, type: 'triangle' }); },
    leaves: () => noise(1.2, { f: 3200, q: 0.7, v: 0.03, type: 'highpass' }),
  };
  /* صوت محيط متواصل للمشاهد (ريح هادئة). يرجع دالة إيقاف */
  HS.ambient = (kind) => {
    const a = ctx(); if (!a || !S.sound || !kind) return () => {};
    const n = noise(600, { f: kind === 'wind' ? 420 : 260, q: 0.9, v: kind === 'wind' ? 0.05 : 0.028, attack: 1.5 });
    if (!n) return () => {};
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 140; lfo.connect(lg).connect(n.f.frequency); lfo.start();
    return () => { try { n.g.gain.cancelScheduledValues(a.currentTime); n.g.gain.setValueAtTime(n.g.gain.value, a.currentTime); n.g.gain.linearRampToValueAtTime(0.0001, a.currentTime + 0.8); n.src.stop(a.currentTime + 0.9); lfo.stop(a.currentTime + 0.9); } catch (e) {} };
  };

  /* ---------- الأيقونات ---------- */
  const I = {
    star: '<path d="M32 5l8 17.5 19 2.3-14 13 3.8 18.9L32 47.2 15.2 56.7 19 37.8 5 24.8l19-2.3z" fill="#ffd77a" stroke="#c9a24a" stroke-width="2" stroke-linejoin="round"/>',
    crescent: '<path d="M44 8a26 26 0 100 48A21 21 0 0144 8z" fill="#ffe6a3" stroke="#c9a24a" stroke-width="2"/>',
    palm: '<path d="M30 60c1-12 1-20 0-30h5c1 10 1 18 0 30z" fill="#9c6b3c"/><path d="M33 30C22 18 12 20 5 26c9-2 16 0 28 4zM33 30c11-12 21-10 28-4-9-2-16 0-28 4zM33 30C26 14 30 6 36 2c-1 9 0 16-3 28zM33 30C20 26 12 32 8 42c7-7 14-9 25-12zM33 30c13-4 21 2 25 12-7-7-14-9-25-12z" fill="#3fbfa9" stroke="#12665b" stroke-width="1.5" stroke-linejoin="round"/>',
    lamp: '<path d="M32 4v8" stroke="#c9a24a" stroke-width="3" stroke-linecap="round"/><path d="M22 20q10-12 20 0z" fill="#e0b455"/><path d="M21 22h22l4 26H17z" fill="#2b5a94" stroke="#e0b455" stroke-width="2.5"/><path d="M32 28c5 6 7 9 7 13a7 7 0 01-14 0c0-4 2-7 7-13z" fill="#ffd77a"/><path d="M16 48h32l-4 8H20z" fill="#e0b455"/>',
    book: '<path d="M6 14c9-4 17-3 26 3v38c-9-6-17-7-26-3z" fill="#fff8e6" stroke="#c9a24a" stroke-width="2.5" stroke-linejoin="round"/><path d="M58 14c-9-4-17-3-26 3v38c9-6 17-7 26-3z" fill="#ffe6a3" stroke="#c9a24a" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 24c5-1 9 0 14 2M12 32c5-1 9 0 14 2M52 24c-5-1-9 0-14 2M52 32c-5-1-9 0-14 2" stroke="#c9a24a" stroke-width="2" stroke-linecap="round" fill="none"/>',
    game: '<path d="M10 22h44a6 6 0 016 6l-2 20a6 6 0 01-11 2l-5-8H22l-5 8a6 6 0 01-11-2L4 28a6 6 0 016-6z" fill="#fff8e6" stroke="#c9a24a" stroke-width="2.5" stroke-linejoin="round"/><path d="M20 28v10M15 33h10" stroke="#e79a4b" stroke-width="4" stroke-linecap="round"/><circle cx="42" cy="30" r="3.5" fill="#3fbfa9"/><circle cx="48" cy="37" r="3.5" fill="#e79a4b"/>',
    sun: '<circle cx="32" cy="34" r="13" fill="#ffd77a" stroke="#c9a24a" stroke-width="2"/><path d="M32 6v9M32 53v6M6 34h9M49 34h9M13 15l6 6M45 21l6-6M13 53l6-6M45 47l6 6" stroke="#ffe6a3" stroke-width="4" stroke-linecap="round"/>',
    house: '<path d="M8 30L32 8l24 22" fill="none" stroke="#ffe6a3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 30v24h36V30L32 14z" fill="#fff8e6" stroke="#c9a24a" stroke-width="2.5" stroke-linejoin="round"/><path d="M26 54V40a6 6 0 0112 0v14z" fill="#b88ae6" stroke="#55308c" stroke-width="2"/>',
    cave: '<path d="M2 58L20 26l8 8 10-22 10 18 6-6 8 34z" fill="#3a4a72" stroke="#1b2f5e" stroke-width="2" stroke-linejoin="round"/><path d="M26 58q0-18 8-18t8 18z" fill="#050b1c"/><path d="M30 58q0-11 4-11t4 11z" fill="#ffd77a" opacity=".7"/>',
    trunk: '<path d="M24 60V14q8-6 16 0v46z" fill="#9c6b3c" stroke="#5c3b1c" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 22l8 6 8-6M24 34l8 6 8-6M24 46l8 6 8-6" fill="none" stroke="#5c3b1c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="32" cy="12" rx="8" ry="3.5" fill="#d9a86a" stroke="#5c3b1c" stroke-width="2"/>',
    whale: '<path d="M6 36c0-12 12-18 24-18 14 0 20 8 22 14l8-8c2 8 0 16-6 18-4 8-14 12-24 12C16 54 6 48 6 36z" fill="#3d7cc9" stroke="#1b3f7a" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 42c6 6 16 8 26 6" fill="none" stroke="#bfe3ff" stroke-width="2.5" stroke-linecap="round"/><path d="M28 16c-2-6-6-8-8-8M30 16c2-6 6-8 8-8" fill="none" stroke="#8fe0d6" stroke-width="2.5" stroke-linecap="round"/>',
    well: '<path d="M12 34h40v20a4 4 0 01-4 4H16a4 4 0 01-4-4z" fill="#9aa7c4" stroke="#4a5a80" stroke-width="2.5"/><path d="M12 44h40M24 34v10M40 34v10M32 44v14" stroke="#4a5a80" stroke-width="2"/><ellipse cx="32" cy="34" rx="20" ry="6" fill="#3fbfa9" stroke="#4a5a80" stroke-width="2.5"/><path d="M14 30V10M50 30V10M10 10h44" stroke="#9c6b3c" stroke-width="4" stroke-linecap="round"/><path d="M32 10v14" stroke="#ffe6a3" stroke-width="2"/>',
    camel: '<path d="M8 54V38c0-8 6-10 10-10 2-8 10-10 14-2 6-4 12 0 12 6l6-14c1-4 8-4 8 2l-2 8c-1 3-4 4-6 4v22h-5V40c-4 4-12 4-17 2v12h-5V42l-6 0v12z" fill="#d9a86a" stroke="#8a5a2a" stroke-width="2.5" stroke-linejoin="round"/>',
    gift: '<rect x="8" y="26" width="48" height="32" rx="5" fill="#e79a4b" stroke="#9c4a1c" stroke-width="2.5"/><rect x="5" y="16" width="54" height="13" rx="5" fill="#ffd77a" stroke="#9c4a1c" stroke-width="2.5"/><path d="M32 16v42" stroke="#fff8e6" stroke-width="7"/><path d="M32 16c-8-14-20-8-12-2 4 3 8 2 12 2zM32 16c8-14 20-8 12-2-4 3-8 2-12 2z" fill="#fff8e6" stroke="#9c4a1c" stroke-width="2.5" stroke-linejoin="round"/>',
    medal: '<path d="M20 4l8 22M44 4l-8 22" stroke="#3fbfa9" stroke-width="8"/><circle cx="32" cy="40" r="19" fill="#ffd77a" stroke="#c9a24a" stroke-width="3"/><path d="M32 28l3.6 7.8 8.4 1-6.2 5.8 1.7 8.4L32 46.8 24.5 51l1.7-8.4L20 36.8l8.4-1z" fill="#fff8e6"/>',
    tree: '<path d="M29 60V34h6v26z" fill="#9c6b3c"/><circle cx="32" cy="24" r="18" fill="#3fbfa9" stroke="#12665b" stroke-width="2.5"/><circle cx="25" cy="20" r="3" fill="#ffd77a"/><circle cx="38" cy="28" r="3" fill="#ffd77a"/>',
    maze: '<path d="M8 8h48v48H8zM8 24h24v16M44 8v16M24 40v16M40 32h16M40 32v12" fill="none" stroke="#ffe6a3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    order: '<rect x="10" y="8" width="44" height="13" rx="5" fill="#ffd77a"/><rect x="10" y="26" width="44" height="13" rx="5" fill="#8fe0d6"/><rect x="10" y="44" width="44" height="13" rx="5" fill="#ff9d8a"/>',
    question: '<circle cx="32" cy="32" r="26" fill="#b88ae6" stroke="#55308c" stroke-width="3"/><path d="M24 26c0-10 16-10 16-1 0 6-8 6-8 13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="47" r="3.2" fill="#fff"/>',
  };
  HS.icon = (n, cls) => '<svg class="' + (cls || 'ic') + '" viewBox="0 0 64 64" aria-hidden="true">' + (I[n] || I.star) + '</svg>';

  /* ---------- سِراج ---------- */
  HS.siraj = (cls) => {
    let sparks = '';
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; sparks += '<circle class="s-spark" cx="60" cy="92" r="4" style="--dx:' + Math.round(Math.cos(a) * 70) + 'px;--dy:' + Math.round(Math.sin(a) * 70) + 'px"/>'; }
    return '<svg class="siraj ' + (cls || '') + '" viewBox="0 0 120 170" role="img" aria-label="سِراج">' +
      '<circle class="s-halo" cx="60" cy="92" r="64"/>' + sparks +
      '<circle cx="60" cy="13" r="8" fill="none" stroke="url(#sg-gold)" stroke-width="3.5"/>' +
      '<path d="M60 21v9" stroke="url(#sg-gold)" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M36 46Q60 16 84 46z" fill="url(#sg-gold)"/><rect x="32" y="45" width="56" height="8" rx="4" fill="url(#sg-gold)"/>' +
      '<path d="M37 53h46l8 62H29z" fill="url(#sg-glass)" stroke="url(#sg-gold)" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M37 53h46l8 62H29z" fill="var(--glow)" opacity=".16"/>' +
      '<path class="s-flame" d="M60 64c11 13 15 21 15 29a15 15 0 01-30 0c0-8 4-16 15-29z"/>' +
      '<path class="s-core" d="M60 82c5.5 6.5 7.5 10.500 7.500 14.500a7.500 7.500 0 01-15 0c0-4 2-8 7.500-14.500z"/>' +
      '<path d="M47 53l-7 62M73 53l7 62" stroke="url(#sg-gold)" stroke-width="2" opacity=".7"/>' +
      '<path d="M43 60q-4 22-3 44" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".28" fill="none"/>' +
      '<rect x="25" y="114" width="70" height="9" rx="4.500" fill="url(#sg-gold)"/><path d="M40 123h40l-6 15H46z" fill="url(#sg-gold)"/><rect x="42" y="137" width="36" height="7" rx="3.500" fill="url(#sg-gold)"/></svg>';
  };
  HS.joy = (el) => { if (!el) return; el.classList.remove('joy'); void el.getBoundingClientRect(); el.classList.add('joy'); };
  HS.mood = () => { const h = new Date().getHours(); return h >= 4 && h < 11 ? 'rosy' : h < 17 && h >= 11 ? '' : h < 21 && h >= 17 ? 'calm' : 'calm sleepy'; };

  /* ---------- السماء ---------- */
  const sky = { stars: [], gold: [], shoot: null, w: 0, h: 0 };
  function skyInit() {
    const cv = $('#sky'), g = cv.getContext('2d');
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sky.w = innerWidth; sky.h = innerHeight; cv.width = sky.w * dpr; cv.height = sky.h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = HS.rng(7), n = Math.round((sky.w * sky.h) / 6500);
      sky.stars = Array.from({ length: Math.min(n, 220) }, () => ({ x: r() * sky.w, y: r() * sky.h * 0.92, s: 0.4 + r() * 1.3, p: r() * 6.28, v: 0.4 + r() * 1.4 }));
      skyGold();
    };
    addEventListener('resize', resize); resize();
    let last = 0;
    const draw = (t) => {
      requestAnimationFrame(draw);
      if (document.hidden || t - last < 40) return; last = t;
      g.clearRect(0, 0, sky.w, sky.h);
      for (const s of sky.stars) { g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p + (t / 1000) * s.v)); g.fillStyle = '#fff'; g.beginPath(); g.arc(s.x, s.y, s.s, 0, 6.28); g.fill(); }
      for (const s of sky.gold) {
        const a = 0.6 + 0.4 * Math.sin(s.p + t / 700), R = s.s * (0.9 + 0.15 * Math.sin(s.p + t / 500));
        g.globalAlpha = a * 0.35; g.fillStyle = '#ffd77a'; g.beginPath(); g.arc(s.x, s.y, R * 2.6, 0, 6.28); g.fill();
        g.globalAlpha = a; g.beginPath();
        for (let i = 0; i < 8; i++) { const ang = (i / 8) * 6.28 - 1.57, rr = i % 2 ? R * 0.42 : R; g.lineTo(s.x + Math.cos(ang) * rr, s.y + Math.sin(ang) * rr); }
        g.closePath(); g.fill();
      }
      if (!sky.shoot && Math.random() < 0.004) sky.shoot = { x: Math.random() * sky.w, y: Math.random() * sky.h * 0.4, l: 0 };
      if (sky.shoot) {
        const s = sky.shoot; s.l += 0.045; s.x -= 9; s.y += 4.500;
        const gr = g.createLinearGradient(s.x, s.y, s.x + 90, s.y - 45); gr.addColorStop(0, 'rgba(255,255,255,' + (1 - s.l) + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.globalAlpha = 1; g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(s.x + 90, s.y - 45); g.stroke();
        if (s.l >= 1) sky.shoot = null;
      }
      g.globalAlpha = 1;
    };
    requestAnimationFrame(draw);
  }
  /* نجوم الطفل الذهبية تضيء سماءه */
  function skyGold() {
    const r = HS.rng(99), n = Math.min(S.stars, 70);
    sky.gold = Array.from({ length: n }, () => ({ x: (0.04 + r() * 0.92) * sky.w, y: (0.1 + r() * 0.5) * sky.h, s: 3.5 + r() * 3, p: r() * 6.28 }));
  }

  /* ---------- الطبقة العليا: نوافذ، تنبيهات، احتفال ---------- */
  const layer = () => $('#layer');
  HS.modal = (html, opt) => {
    opt = opt || {};
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="modal-box card">' + html + '</div>';
    const close = () => { m.remove(); opt.onClose && opt.onClose(); };
    m.addEventListener('click', (e) => { if (e.target === m && !opt.sticky) close(); if (e.target.closest('[data-close]')) { HS.sfx.click(); close(); } });
    layer().appendChild(m); m.close = close; return m;
  };
  HS.toast = (html) => { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; layer().appendChild(t); setTimeout(() => t.remove(), 3300); };
  HS.hud = () => { $('#hud-count').textContent = S.stars; $('#hud-sound').classList.toggle('muted', !S.sound); };
  HS.spendable = () => S.stars - S.spent;
  HS.addStars = (n, from) => {
    S.stars += n; HS.save(); skyGold();
    const pill = $('#hud-stars'), tr = pill.getBoundingClientRect(), fr = from ? from.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const vis = tr.width > 0;
    for (let i = 0; i < Math.min(n, 6); i++) {
      const el = document.createElement('div'); el.className = 'fly-star'; el.innerHTML = HS.icon('star');
      const x0 = fr.left + fr.width / 2 - 15 + (Math.random() * 60 - 30), y0 = fr.top + fr.height / 2 - 15 + (Math.random() * 40 - 20);
      el.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px) scale(1.4)'; layer().appendChild(el);
      setTimeout(() => { el.style.transform = 'translate(' + (vis ? tr.left + 8 : innerWidth / 2) + 'px,' + (vis ? tr.top + 8 : -40) + 'px) scale(.5)'; el.style.opacity = '.2'; HS.sfx.star(); }, 60 + i * 130);
      setTimeout(() => { el.remove(); HS.hud(); pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }, 1000 + i * 130);
    }
  };
  HS.badge = (id) => {
    if (S.badges.includes(id)) return false;
    const b = (HS.c.rewards.badges || []).find((x) => x.id === id); if (!b) return false;
    S.badges.push(id); HS.save();
    setTimeout(() => { HS.toast(HS.icon('medal') + '<span>وسام جديد: ' + HS.esc(b.title) + '</span>'); HS.sfx.success(); }, 900);
    return true;
  };
  /* احتفال: نجوم تتطاير */
  HS.celebrate = () => {
    HS.sfx.success();
    let cv = $('#fx'); if (cv) cv.remove();
    cv = document.createElement('canvas'); cv.id = 'fx'; layer().appendChild(cv);
    const w = (cv.width = innerWidth), h = (cv.height = innerHeight), g = cv.getContext('2d');
    const cols = ['#ffd77a', '#fff8dd', '#8fe0d6', '#ffb48a'];
    const ps = Array.from({ length: 70 }, () => { const a = Math.random() * 6.28, v = 4 + Math.random() * 10; return { x: w / 2, y: h * 0.45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: 4 + Math.random() * 8, c: HS.pick(cols), rot: Math.random() * 6.28, vr: Math.random() * 0.3 - 0.15 }; });
    const t0 = performance.now();
    const step = (t) => {
      const k = (t - t0) / 2200; if (k >= 1) { cv.remove(); return; }
      g.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.vx *= 0.985; p.rot += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = 1 - k * k; g.fillStyle = p.c; g.beginPath();
        for (let i = 0; i < 10; i++) { const ang = (i / 10) * 6.28, rr = i % 2 ? p.r * 0.45 : p.r; g.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); }
        g.closePath(); g.fill(); g.restore();
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  /* نافذة «سمائي»: النجوم والأوسمة */
  HS.showBadges = () => {
    const list = (HS.c.rewards.badges || []).map((b) => '<div class="badge ' + (S.badges.includes(b.id) ? '' : 'locked') + '">' + HS.icon(b.icon || 'medal') + HS.esc(b.title) + '</div>').join('');
    HS.modal('<h2>سماء ' + HS.esc(S.name || 'صديقي') + '</h2><p>عندك <b style="color:var(--gold)">' + S.stars + '</b> نجمة تضيء سماءك، و<b style="color:var(--gold)">' + S.badges.length + '</b> وسام.</p><div class="badges">' + list + '</div><button class="btn" data-close>تمام</button>');
  };

  /* ---------- التنقل ---------- */
  let cur = null, busy = false;
  HS.go = (h) => { if (location.hash === '#' + h) route(); else location.hash = h; };
  async function route() {
    if (busy) return; busy = true;
    const view = $('#view'), parts = (location.hash.slice(1) || 'home').split('/');
    const v = HS.views[parts[0]] || HS.views.home;
    view.classList.add('out'); await HS.wait(240);
    if (cur && cur.leave) cur.leave();
    HS.$$('.modal').forEach((m) => m.remove());
    view.innerHTML = ''; view.className = 'view out v-' + (HS.views[parts[0]] ? parts[0] : 'home'); view.scrollTop = 0;
    document.body.classList.remove('in-story');
    cur = v; $('#hud-back').hidden = v === HS.views.home; HS.backTo = v.back || 'home';
    try { v.enter(view, parts[1]); } catch (e) { console.error(e); }
    HS.hud();
    requestAnimationFrame(() => requestAnimationFrame(() => view.classList.remove('out')));
    busy = false;
  }

  /* ---------- الإقلاع ---------- */
  HS.boot = async () => {
    document.body.classList.toggle('morning', HS.isMorning() && new Date().getHours() < 9);
    skyInit(); HS.hud();
    $('#hud-back').onclick = () => { HS.sfx.click(); HS.go(typeof HS.backTo === 'function' ? HS.backTo() : HS.backTo); };
    $('#hud-sound').onclick = () => { S.sound = !S.sound; HS.save(); HS.hud(); HS.sfx.click(); };
    $('#hud-stars').onclick = () => { HS.sfx.pop(); HS.showBadges(); };
    try { await HS.load(); } catch (e) { $('#view').innerHTML = '<p style="text-align:center;margin-top:30vh">تعذّر تحميل المحتوى. حدّث الصفحة.</p>'; $('#view').classList.remove('out'); return; }
    /* تسجيل يوم الدخول (حديقة الأيام) */
    const d = HS.today();
    if (!S.days.includes(d)) { S.days.push(d); HS.save(); HS.newDay = true; }
    addEventListener('hashchange', route);
    route();
  };
})();
