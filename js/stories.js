/* القسم 2: الحكايات «الشاهد يحكي» — محرك مشاهد واحد يقرأ من content/stories.json */
(function () {
  'use strict';
  const { $, esc } = HS;

  /* ================= مكتبة المواقع (كل موقع رسمة SVG بطبقات، تتحكم بها flags من JSON) ================= */
  function stars(n, seed, x0, y0, w, h) {
    const r = HS.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += '<circle class="tw" cx="' + (x0 + r() * w).toFixed(1) + '" cy="' + (y0 + r() * h).toFixed(1) + '" r="' + (0.6 + r() * 1.5).toFixed(1) + '" style="animation-delay:-' + (r() * 4).toFixed(1) + 's"/>';
    return s;
  }
  /* جذع نخلة بقشوره */
  function trunk(x, yT, yB, w, cls) {
    let rings = '';
    for (let y = yT + 16; y < yB - 6; y += 21) rings += '<path d="M' + (x - w / 2 + 2) + ' ' + y + 'l' + (w / 2 - 2) + ' 10l' + (w / 2 - 2) + ' -10"/>';
    return '<g class="' + (cls || '') + '"><path d="M' + (x - w / 2) + ' ' + yB + 'L' + (x - w / 2 + 3) + ' ' + yT + 'h' + (w - 6) + 'L' + (x + w / 2) + ' ' + yB + 'z" fill="url(#ms-bark)"/>' +
      '<g fill="none" stroke="#4a2e14" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".8">' + rings + '</g>' +
      '<path d="M' + (x - w / 2 + 5) + ' ' + (yT + 4) + 'v' + (yB - yT - 10) + '" stroke="#e2b377" stroke-width="3" opacity=".25"/>' +
      '<ellipse cx="' + x + '" cy="' + yT + '" rx="' + (w / 2 - 3) + '" ry="7" fill="#d9a86a" stroke="#5c3b1c" stroke-width="2"/><ellipse cx="' + x + '" cy="' + yT + '" rx="' + (w / 4) + '" ry="3" fill="none" stroke="#9c6b3c" stroke-width="1.5"/></g>';
  }

  const SETS = {
    /* جبل ثور من الخارج */
    mountain() {
      const trail = 'M300 596Q430 560 372 512Q318 470 400 440Q452 418 394 376';
      return '<defs>' +
        '<linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040916"/><stop offset=".55" stop-color="#10244c"/><stop offset="1" stop-color="#2b477e"/></linearGradient>' +
        '<linearGradient id="mt-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22397a"/><stop offset=".42" stop-color="#8a5f92"/><stop offset=".7" stop-color="#f09a5c"/><stop offset="1" stop-color="#ffdf94"/></linearGradient>' +
        '<linearGradient id="mt-rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4d7c"/><stop offset="1" stop-color="#131c3a"/></linearGradient>' +
        '<radialGradient id="mt-glow"><stop offset="0" stop-color="#fff3cf"/><stop offset=".35" stop-color="#ffcf70" stop-opacity=".7"/><stop offset="1" stop-color="#ffb14a" stop-opacity="0"/></radialGradient></defs>' +
        '<g class="cam"><rect width="800" height="600" fill="url(#mt-sky)"/><rect class="dawn-on" width="800" height="600" fill="url(#mt-dawn)"/>' +
        '<g class="l-far"><g class="stars" fill="#fff">' + stars(90, 3, 0, 0, 800, 380) + '</g>' +
        '<path class="moon" d="M520 84a40 40 0 1032 64 31 31 0 01-32-64z" fill="#fff3cf"/>' +
        '<g class="sun"><circle cx="400" cy="330" r="150" fill="url(#mt-glow)"/><circle cx="400" cy="330" r="42" fill="#fff0bd"/></g>' +
        '<path d="M0 430L80 365 165 405 255 335 345 392 468 342 562 398 665 348 800 415V600H0z" fill="#16284f"/></g>' +
        '<g class="l-mid"><path d="M90 600L230 400 290 330 335 250 400 150 450 215 500 300 575 390 720 600z" fill="url(#mt-rock)"/>' +
        '<path d="M400 150L450 215 500 300 575 390 720 600H505L442 420 422 280z" fill="#0b1229" opacity=".55"/>' +
        '<path d="M400 150L372 238 335 250z" fill="#5d76ad" opacity=".5"/><path d="M290 330L362 346 312 432 230 400z" fill="#4c629a" opacity=".3"/><path d="M230 400L312 432 250 600H90z" fill="#0b1229" opacity=".25"/>' +
        '<path class="rim" d="M90 600L230 400 290 330 335 250 400 150 450 215 500 300 575 390 720 600" fill="none" stroke="#ffd98a" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M335 250L352 300 330 352M450 215L436 268 462 330M500 300L486 372" fill="none" stroke="#0b1229" stroke-width="2" opacity=".5"/>' +
        '<path d="' + trail + '" fill="none" stroke="#f6e7b8" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round" opacity=".28"/>' +
        '<circle class="cave-halo" cx="392" cy="352" r="62" fill="url(#mt-glow)"/>' +
        '<path d="M364 374Q360 330 392 324 424 330 420 374z" fill="#02040b"/><path class="cave-in" d="M376 374Q374 344 392 340 410 344 408 374z" fill="#ffc86a"/>' +
        '<g class="traveler"><circle r="22" fill="url(#mt-glow)"/><circle r="4.5" fill="#fffbe8"/><animateMotion dur="15s" begin="0.8s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".3 0 .4 1" path="' + trail + '"/></g></g>' +
        '<g class="leaving" fill="#070b18"><ellipse cx="208" cy="560" rx="7" ry="15"/><ellipse cx="190" cy="566" rx="6.5" ry="14"/><ellipse cx="226" cy="568" rx="6.5" ry="14"/></g>' +
        '<g class="l-front" fill="#060a18"><path d="M-40 600V515L55 486 128 528 196 600z"/><path d="M840 600V498L735 468 664 540 618 600z"/></g></g>';
    },
    /* داخل الغار، والنظر إلى فتحته */
    cave() {
      const open = 'M240 456L234 402 258 354 298 322 346 302 400 292 454 299 502 320 542 352 564 400 560 456Q400 470 240 456z';
      let feet = '', sh = '';
      [[292, 1], [352, 0.92], [428, 1.05], [498, 0.95]].forEach(([x, k], i) => {
        const w = 24 * k;
        feet += '<g class="walker" style="animation-delay:-' + i * 0.37 + 's"><path d="M' + (x - w * 0.8) + ' 250L' + (x - w) + ' 398Q' + x + ' 410 ' + (x + w) + ' 398L' + (x + w * 0.8) + ' 250z" fill="#0b1226"/><path d="M' + (x - w * 0.8) + ' 250L' + (x - w) + ' 398" stroke="#4f6cb4" stroke-width="2.5" opacity=".55" fill="none"/>' +
          '<rect x="' + (x - w * 0.6) + '" y="398" width="' + w * 0.36 + '" height="42" rx="4"/><rect x="' + (x + w * 0.24) + '" y="398" width="' + w * 0.36 + '" height="42" rx="4"/>' +
          '<ellipse cx="' + (x - w * 0.56) + '" cy="443" rx="' + w * 0.46 + '" ry="6"/><ellipse cx="' + (x + w * 0.34) + '" cy="443" rx="' + w * 0.46 + '" ry="6"/></g>';
        const dx = (x - 400) * 1.5;
        sh += '<path d="M' + (x - w * 0.8) + ' 452h' + w * 1.6 + 'L' + (x + dx + 46) + ' 610h-92z"/>';
      });
      return '<defs>' +
        '<linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1838"/><stop offset="1" stop-color="#3a5a9a"/></linearGradient>' +
        '<linearGradient id="cv-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d1a"/><stop offset=".6" stop-color="#171b30"/><stop offset="1" stop-color="#0b0e1c"/></linearGradient>' +
        '<radialGradient id="cv-warm"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".95"/><stop offset=".4" stop-color="#ffb85a" stop-opacity=".45"/><stop offset="1" stop-color="#ff9d3a" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="cv-flood"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe6a3" stop-opacity=".8"/><stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient></defs>' +
        '<g class="cam"><rect width="800" height="600" fill="url(#cv-sky)"/>' +
        '<g class="l-far"><g fill="#fff">' + stars(40, 11, 240, 270, 320, 110) + '</g><path d="M200 420L290 372 360 398 450 362 540 400 620 380V470H200z" fill="#182a54"/></g>' +
        '<path d="M200 412Q400 400 600 412V480H200z" fill="#2a447e"/><g fill="#1c3162"><ellipse cx="270" cy="428" rx="16" ry="5"/><ellipse cx="470" cy="436" rx="22" ry="6"/><ellipse cx="380" cy="420" rx="12" ry="4"/></g>' +
        '<g class="feet" fill="#03050b">' + feet + '</g>' +
        '<g class="l-mid"><path fill-rule="evenodd" fill="url(#cv-rock)" d="M-80 -80H880V680H-80zM' + open.slice(1) + '"/>' +
        '<path d="' + open + '" fill="none" stroke="#86a2e6" stroke-width="3" stroke-linejoin="round" opacity=".2"/>' +
        '<g fill="#232844" opacity=".55"><path d="M60 120L170 60 250 170 150 260z"/><path d="M560 90L700 50 760 190 640 240z"/><path d="M90 330L190 300 215 420 120 470z"/><path d="M600 300L720 290 740 430 620 450z"/></g>' +
        '<g fill="#080a15"><path d="M120 -10L150 110 185 -10zM300 -10L322 80 348 -10zM470 -10L500 130 528 -10zM640 -10L662 90 690 -10z"/></g>' +
        '<path d="M-80 470Q400 440 880 470V680H-80z" fill="#0d1124"/>' +
        '<path class="beam" d="M262 458L538 458 690 620H110z" fill="#8fb0ff"/>' +
        '<g class="shadows" fill="#000">' + sh + '</g></g>' +
        '<circle class="warm" cx="400" cy="520" r="430" fill="url(#cv-warm)"/><circle class="flood" cx="400" cy="430" r="560" fill="url(#cv-flood)"/>' +
        '<g class="l-front" fill="#04060d"><path d="M-60 620V430L40 470 120 560 160 620z"/><path d="M860 620V420L760 468 690 566 650 620z"/><path d="M-60 -20H300L180 40 60 30-60 110z"/><path d="M860 -20H520L640 44 760 30 860 120z"/></g></g>';
    },
    /* مسجد النبي ﷺ الأول: جدار طين، سقف جريد، أعمدة من جذوع النخل */
    mosque() {
      const r = HS.rng(21); let fr = '', bricks = '', peb = '', rows = '';
      for (let i = 0; i < 70; i++) { const x = r() * 800, l = 26 + r() * 40, a = (r() - 0.5) * 40; fr += '<path d="M' + x.toFixed(0) + ' ' + (78 + r() * 30).toFixed(0) + 'l' + a.toFixed(0) + ' ' + l.toFixed(0) + '" stroke="' + (r() > 0.5 ? '#5d6a2c' : '#7a6a34') + '"/>'; }
      for (let y = 150; y < 470; y += 28) bricks += '<path d="M0 ' + y + 'H800"/>';
      for (let i = 0; i < 60; i++) peb += '<ellipse cx="' + (r() * 800).toFixed(0) + '" cy="' + (486 + r() * 110).toFixed(0) + '" rx="' + (2 + r() * 4).toFixed(1) + '" ry="' + (1 + r() * 2).toFixed(1) + '"/>';
      for (let i = 0; i < 9; i++) { const x = 40 + i * 92 + (i % 2) * 8, y = 548 + (i % 2) * 10; rows += '<path d="M' + (x - 42) + ' 640Q' + (x - 44) + ' ' + (y + 26) + ' ' + x + ' ' + (y + 18) + 'T' + (x + 42) + ' 640z"/><circle cx="' + x + '" cy="' + y + '" r="19"/>'; }
      const ray = (x) => '<path d="M' + x + ' 96h44l-96 440h-120z"/>';
      return '<defs>' +
        '<linearGradient id="ms-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4d2c"/><stop offset="1" stop-color="#9a7446"/></linearGradient>' +
        '<linearGradient id="ms-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7a468"/><stop offset="1" stop-color="#84643a"/></linearGradient>' +
        '<linearGradient id="ms-bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b07a44"/><stop offset=".5" stop-color="#8e5f33"/><stop offset="1" stop-color="#5f3d1e"/></linearGradient>' +
        '<linearGradient id="ms-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".75"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="ms-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c58a4a"/><stop offset="1" stop-color="#8a5a2a"/></linearGradient>' +
        '<radialGradient id="ms-glow"><stop offset="0" stop-color="#fff6d0" stop-opacity=".95"/><stop offset=".45" stop-color="#ffd77a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient></defs>' +
        '<g class="cam"><g class="l-far"><rect x="-40" width="880" height="600" fill="url(#ms-wall)"/><g stroke="#3d2814" stroke-width="2" opacity=".16">' + bricks + '</g></g>' +
        '<path d="M-40 462H840V640H-40z" fill="url(#ms-floor)"/><g fill="#6e5230" opacity=".5">' + peb + '</g>' +
        '<g class="l-mid">' + trunk(150, 104, 500, 46) + trunk(650, 104, 500, 46) + '</g>' +
        '<g class="roof"><rect x="-40" y="-20" width="880" height="112" fill="#2a1b0e"/><g fill="#ffe9a8"><rect x="236" y="60" width="52" height="34"/><rect x="386" y="52" width="46" height="42"/><rect x="536" y="62" width="50" height="32"/><rect x="92" y="66" width="40" height="28"/></g>' +
        '<g stroke-width="5" stroke-linecap="round" fill="none">' + fr + '</g><path d="M-40 96H840" stroke="#5c3b1c" stroke-width="14"/><path d="M-40 60H840" stroke="#4a2e14" stroke-width="10"/></g>' +
        '<g class="rays" fill="url(#ms-ray)">' + ray(240) + ray(388) + ray(538) + ray(92) + '</g>' +
        '<g transform="translate(-48 0)"><g class="minbar"><ellipse cx="560" cy="494" rx="82" ry="10" fill="#000" opacity=".25"/><circle class="mb-light" cx="560" cy="420" r="120" fill="url(#ms-glow)"/>' +
        '<g fill="url(#ms-wood)" stroke="#5c3b1c" stroke-width="2.5" stroke-linejoin="round"><rect x="500" y="456" width="118" height="36"/><rect x="532" y="420" width="86" height="36"/><rect x="564" y="384" width="54" height="36"/><rect x="612" y="330" width="10" height="162"/><rect x="560" y="344" width="8" height="42"/><path d="M560 344h62"/></g>' +
        '<g stroke="#5c3b1c" stroke-width="1.5" opacity=".5"><path d="M500 474h112M532 438h80M564 402h48"/></g></g></g>' +
        '<circle class="tglow" cx="400" cy="350" r="200" fill="url(#ms-glow)"/><ellipse class="emb" cx="400" cy="352" rx="130" ry="190" fill="url(#ms-glow)"/>' +
        '<ellipse cx="400" cy="494" rx="46" ry="8" fill="#000" opacity=".3"/>' +
        '<g class="rings" fill="none" stroke="#8fe0d6" stroke-width="3"><circle cx="400" cy="340" r="40"/><circle cx="400" cy="340" r="40"/><circle cx="400" cy="340" r="40"/></g>' +
        trunk(400, 214, 494, 52, 'hero') +
        '<g transform="translate(0 -40)"><g class="rows" fill="#1a0f06">' + rows + '</g></g></g>';
    },
  };

  /* ================= جزيئات المشهد (Canvas) ================= */
  function particles(cv, kind) {
    const g = cv.getContext('2d'); let w, h, ps = [], raf, dead = false;
    const size = () => { const r = cv.getBoundingClientRect(); w = cv.width = r.width; h = cv.height = r.height; };
    size();
    const mk = (k, burst) => {
      if (k === 'dust') return { k, x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: -0.05 - Math.random() * 0.15, r: 0.8 + Math.random() * 1.8, a: 0.12 + Math.random() * 0.3, p: Math.random() * 6 };
      if (k === 'motes') return { k, x: Math.random() * w, y: burst ? Math.random() * h : h + 10, vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random() * 0.7, r: 1 + Math.random() * 2.4, a: 0.5 + Math.random() * 0.5, p: Math.random() * 6 };
      if (k === 'leaves') return { k, x: w * (0.25 + Math.random() * 0.5), y: burst ? Math.random() * h * 0.7 : h * 0.12, vx: (Math.random() - 0.5) * 0.8, vy: 0.5 + Math.random() * 0.8, r: 5 + Math.random() * 5, a: 0.9, p: Math.random() * 6, rot: Math.random() * 6 };
      const an = Math.random() * 6.28, v = 2 + Math.random() * 7;
      return { k: 'spark', x: w / 2, y: h * 0.5, vx: Math.cos(an) * v, vy: Math.sin(an) * v, r: 1.5 + Math.random() * 3, a: 1, life: 1 };
    };
    const count = { dust: 45, motes: 55, leaves: 16 }[kind] || 0;
    for (let i = 0; i < count; i++) ps.push(mk(kind, true));
    const step = (t) => {
      if (dead) return; raf = requestAnimationFrame(step);
      g.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy;
        if (p.k === 'spark') { p.vx *= 0.97; p.vy *= 0.97; p.life -= 0.012; if (p.life <= 0) { ps.splice(i, 1); continue; } g.globalAlpha = p.life; g.fillStyle = '#ffe6a3'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.28); g.fill(); continue; }
        if (p.k === 'leaves') {
          p.x += Math.sin(t / 600 + p.p) * 0.9; p.rot += 0.03;
          if (p.y > h * 0.86) Object.assign(p, mk('leaves'));
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.globalAlpha = p.a; g.fillStyle = p.p > 3 ? '#b8894a' : '#8a7a3a';
          g.beginPath(); g.ellipse(0, 0, p.r, p.r * 0.38, 0, 0, 6.28); g.fill(); g.restore(); continue;
        }
        if (p.y < -12 || p.x < -12 || p.x > w + 12) Object.assign(p, mk(p.k));
        g.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(t / 500 + p.p));
        g.fillStyle = p.k === 'motes' ? '#ffe6a3' : '#fff3d6'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.28); g.fill();
      }
    };
    raf = requestAnimationFrame(step);
    return { burst() { for (let i = 0; i < 80; i++) ps.push(mk('spark')); }, stop() { dead = true; cancelAnimationFrame(raf); } };
  }

  /* ================= قائمة الحكايات ================= */
  const dayIndex = (n) => Math.floor(new Date().setHours(0, 0, 0, 0) / 864e5) % n;
  HS.storyOfDay = () => { const l = HS.c.stories.stories; return l[dayIndex(l.length)]; };

  HS.views.stories = {
    enter(el) {
      const d = HS.c.stories, today = HS.storyOfDay().id;
      el.innerHTML = '<div class="wrap"><h1 class="page-title">الشاهد يحكي</h1><p class="page-sub">كل حكاية يرويها من رآها بعينه</p><div class="story-grid">' +
        d.stories.map((s, i) => '<button class="story-card card" data-id="' + s.id + '" style="animation-delay:' + i * 0.08 + 's">' +
          (s.id === today ? '<span class="ribbon">حكاية اليوم</span>' : '') + (HS.s.done[s.id] ? '<span class="done">' + HS.icon('star') + '</span>' : '') +
          '<span class="sc-art">' + HS.icon(s.icon) + '</span><b>' + esc(s.title) + '</b><small>' + esc(s.category) + '</small></button>').join('') +
        (d.coming || []).map((s, i) => '<div class="story-card card soon" style="animation-delay:' + (d.stories.length + i) * 0.08 + 's"><span class="sc-art">' + HS.icon(s.icon) + '</span><b>' + esc(s.title) + '</b><small>قريبًا إن شاء الله</small></div>').join('') +
        '</div></div>';
      el.onclick = (e) => { const b = e.target.closest('[data-id]'); if (b) { HS.sfx.click(); HS.go('story/' + b.dataset.id); } };
    },
  };

  /* ================= مشغّل الحكاية ================= */
  let P = null; // حالة التشغيل الحالية
  function stopAll() { if (!P) return; P.fx && P.fx.stop(); P.amb && P.amb(); clearTimeout(P.tw); P = null; }

  function showScene(i) {
    const st = P.story, sc = st.scenes[i], sg = sc.stage || { set: 'mountain' }, box = $('.stage', P.el);
    P.i = i;
    const old = $('.scene', box);
    const el = document.createElement('div');
    el.className = 'scene set-' + sg.set + ' cam-' + (sg.camera || 'drift') + ' ' + (sg.flags || []).map((f) => 'f-' + f).join(' ') + (P.boost ? ' f-boost' : '');
    el.innerHTML = '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + (SETS[sg.set] || SETS.mountain)() + '</svg><canvas></canvas><div class="flash"></div>';
    box.appendChild(el);
    if (old) { old.classList.add('gone'); setTimeout(() => old.remove(), 1100); }
    P.fx && P.fx.stop(); P.fx = particles($('canvas', el), sg.fx);
    if (P.boost) { setTimeout(() => P.fx && P.fx.burst(), 500); P.boost = false; }
    if (P.ambKind !== (sg.amb || '')) { P.amb && P.amb(); P.ambKind = sg.amb || ''; P.amb = HS.ambient(sg.amb); }
    if (sg.sfx && HS.sfx[sg.sfx]) setTimeout(() => P && HS.sfx[sg.sfx](), 700);
    HS.$$('.dots i', P.el).forEach((d, k) => d.classList.toggle('on', k <= i));
    /* النص يظهر كلمةً كلمة */
    const t = $('.st-text', P.el), words = sc.text.split(' ');
    let ay = false;
    t.innerHTML = words.map((w, k) => { if (w.includes('﴿')) ay = true; const c = ay ? ' class="ay"' : ''; if (w.includes('﴾')) ay = false; return '<span' + c + ' style="animation-delay:' + (0.5 + k * 0.16) + 's">' + esc(w) + '</span>'; }).join(' ');
    t.classList.remove('all'); t.scrollTop = 0;
    const nx = $('.st-next', P.el); nx.classList.remove('pulse'); nx.textContent = i === st.scenes.length - 1 ? 'ما الدرس؟' : 'التالي';
    clearTimeout(P.tw); P.typing = true;
    P.tw = setTimeout(() => { P.typing = false; nx.classList.add('pulse'); }, 700 + words.length * 160);
  }

  function next() {
    if (!P || P.lock) return;
    if (P.typing) { clearTimeout(P.tw); P.typing = false; $('.st-text', P.el).classList.add('all'); $('.st-next', P.el).classList.add('pulse'); return; }
    HS.sfx.click();
    const st = P.story, ch = st.choice;
    if (ch && !P.chosen && P.i + 1 === ch.after_scene) return ask(ch);
    if (P.i + 1 < st.scenes.length) showScene(P.i + 1); else finish();
  }

  /* الاختيار التفاعلي في منتصف الحكاية */
  function ask(ch) {
    P.lock = true;
    const q = document.createElement('div'); q.className = 'st-ask';
    q.innerHTML = '<div class="ask-box card">' + HS.siraj() + '<h2>' + esc(ch.question) + '</h2><div class="ask-opts">' +
      HS.shuffle(ch.options.map((o, i) => i)).map((i) => '<button class="btn teal" data-i="' + i + '">' + esc(ch.options[i].text) + '</button>').join('') + '</div><p class="ask-hint"></p></div>';
    P.el.appendChild(q); HS.sfx.pop();
    q.onclick = (e) => {
      const b = e.target.closest('[data-i]'); if (!b) return;
      const o = ch.options[+b.dataset.i];
      if (!o.correct) { HS.sfx.soft(); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500); $('.ask-hint', q).textContent = o.hint || HS.pick(HS.c.siraj.encourage); return; }
      HS.joy($('.siraj', q)); HS.sfx.glow(); P.chosen = true; P.boost = true;
      $('.ask-opts', q).innerHTML = ''; $('.ask-hint', q).innerHTML = '<b>أحسنت! ' + esc(o.effect || '') + '</b>';
      HS.addStars(1, $('.siraj', q));
      setTimeout(() => { q.classList.add('bye'); setTimeout(() => q.remove(), 400); if (P) { P.lock = false; showScene(P.i + 1); } }, 1500);
    };
  }

  /* نهاية الحكاية: الدرس والمصدر */
  function finish() {
    const st = P.story, S = HS.s, first = !S.done[st.id];
    P.lock = true;
    S.done[st.id] = (S.done[st.id] || 0) + 1; S.lastStory = st.id; HS.save();
    const hasGame = (HS.c.games.order_events || []).some((g) => g.story === st.id);
    const e = document.createElement('div'); e.className = 'st-end';
    e.innerHTML = '<div class="end-box card">' + HS.siraj('joy') + '<small>الدرس</small><h2>' + esc(st.lesson) + '</h2>' +
      '<div class="end-acts">' + (hasGame ? '<button class="btn" data-go="game/order/' + st.id + '">رتّب أحداثها</button>' : '') + '<button class="btn teal" data-go="stories">حكاية أخرى</button><button class="btn ghost" data-again>أعدها</button></div>' +
      '<div class="src"><b>المصادر</b><ul>' + st.sources.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>';
    P.el.appendChild(e);
    HS.celebrate(); HS.addStars(first ? 3 : 1, $('.siraj', e)); HS.badge('story-' + st.id);
    e.onclick = (ev) => {
      const b = ev.target.closest('button'); if (!b) return; HS.sfx.click();
      if (b.dataset.go) HS.go(b.dataset.go); else { e.remove(); P.lock = false; P.chosen = false; showScene(0); }
    };
  }

  HS.views.story = {
    back: 'stories',
    enter(el, id) {
      const st = HS.c.stories.stories.find((s) => s.id === id);
      if (!st) return HS.go('stories');
      document.body.classList.add('in-story');
      el.innerHTML = '<div class="story"><div class="stage"></div>' +
        '<div class="st-top"><button class="hud-btn st-x" aria-label="خروج"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></button>' +
        '<div class="dots">' + st.scenes.map(() => '<i></i>').join('') + '</div>' +
        '<button class="hud-btn st-snd' + (HS.s.sound ? '' : ' muted') + '" aria-label="الصوت">' + $('#hud-sound').innerHTML + '</button></div>' +
        '<div class="st-panel"><span class="st-who">' + HS.icon(st.icon) + esc(st.witness) + ' يحكي</span><p class="st-text"></p><button class="btn st-next">التالي</button></div></div>';
      P = { el, story: st, i: 0, ambKind: null };
      $('.st-x', el).onclick = () => { HS.sfx.click(); HS.go('stories'); };
      $('.st-snd', el).onclick = (e) => { HS.s.sound = !HS.s.sound; HS.save(); e.currentTarget.classList.toggle('muted', !HS.s.sound); if (!HS.s.sound && P.amb) { P.amb(); P.ambKind = null; } };
      $('.st-next', el).onclick = next;
      $('.stage', el).onclick = next;
      showScene(0);
    },
    leave() { stopAll(); },
  };
})();
