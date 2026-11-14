/* القسم 4: الألعاب التعليمية — محرك واحد يقرأ من content/games.json */
(function () {
  'use strict';
  const { $, esc } = HS;
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const G = () => HS.c.games, lvl = (k) => HS.s.games[k] || 0;
  const storyTitle = (id) => (HS.c.stories.stories.find((s) => s.id === id) || {}).title || '';
  let cleanup = null;

  /* شاشة الفوز المشتركة */
  function win(el, o) {
    const S = HS.s;
    if (o.level > lvl(o.key)) { S.games[o.key] = o.level; HS.save(); }
    HS.celebrate(); HS.addStars(o.stars || 2, el); if (o.badge) HS.badge('game-' + o.key);
    HS.modal(HS.siraj('joy') + '<h2>' + esc(HS.fmt(HS.pick(HS.c.siraj.celebrate))) + '</h2><p>' + esc(o.text || '') + '</p>' +
      (o.next ? '<button class="btn pulse" data-close data-next>المستوى التالي</button> ' : '') + '<button class="btn ' + (o.next ? 'ghost' : '') + '" data-close data-menu>الألعاب</button>', {
      sticky: true,
      onClose() {},
    }).addEventListener('click', (e) => { if (e.target.closest('[data-next]')) o.next(); else if (e.target.closest('[data-menu]')) HS.go('games'); });
  }
  const head = (t, sub) => '<h1 class="page-title">' + t + '</h1><p class="page-sub">' + sub + '</p>';

  /* ---------- قائمة الألعاب ---------- */
  HS.views.games = {
    enter(el) {
      const list = [
        ['order', 'order', 'رتّب أحداث الحكاية', 'اسحب الأحداث إلى ترتيبها', G().order_events.length],
        ['witness', 'question', 'من الشاهد؟', 'طابق الشاهد بقصته', 2],
        ['maze', 'maze', 'طريق الهجرة', 'قُد الفانوس من مكة إلى المدينة', 5],
      ];
      el.innerHTML = '<div class="wrap">' + head('الألعاب', 'العب وتعلّم مع سِراج') + '<div class="game-list">' +
        list.map((g, i) => '<button class="game-card card" data-g="' + g[0] + '" style="animation-delay:' + i * 0.09 + 's"><span class="gc-ic">' + HS.icon(g[1]) + '</span><span class="gc-t"><b>' + g[2] + '</b><small>' + g[3] + '</small>' +
          '<span class="gc-lv">' + Array.from({ length: g[4] }, (_, k) => '<i class="' + (k < lvl(g[0]) ? 'on' : '') + '"></i>').join('') + '</span></span></button>').join('') + '</div></div>';
      el.onclick = (e) => { const b = e.target.closest('[data-g]'); if (b) { HS.sfx.click(); HS.go('game/' + b.dataset.g); } };
    },
  };

  /* ---------- 1) رتّب أحداث الحكاية (سحب) ---------- */
  function order(el, storyId) {
    const levels = G().order_events.slice().sort((a, b) => a.events.length - b.events.length);
    let L = storyId ? levels.findIndex((x) => x.story === storyId) : Math.min(lvl('order'), levels.length - 1);
    if (L < 0) L = 0;
    const start = () => {
      const lv = levels[L];
      let items; do { items = HS.shuffle(lv.events.map((t, i) => ({ t, i }))); } while (items.every((x, k) => x.i === k));
      el.innerHTML = '<div class="wrap">' + head('رتّب الأحداث', esc(storyTitle(lv.story)) + ' — المستوى ' + AR(L + 1)) +
        '<p class="hint-line">اسحب كل حدث إلى مكانه: الأول في الأعلى</p><ol class="ord">' + items.map((x) => '<li class="card" data-i="' + x.i + '"><span class="grip">' + '<svg viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg></span>' + esc(x.t) + '</li>').join('') +
        '</ol><div class="center"><button class="btn" id="ord-check">تحقّق</button></div></div>';
      const ol = $('.ord', el); let drag = null, y0 = 0;
      ol.onpointerdown = (e) => {
        const li = e.target.closest('li'); if (!li) return;
        drag = li; y0 = e.clientY; li.classList.add('drag'); li.setPointerCapture(e.pointerId); HS.sfx.tap();
        HS.$$('li', ol).forEach((x) => x.classList.remove('bad', 'good'));
      };
      ol.onpointermove = (e) => {
        if (!drag) return; e.preventDefault();
        drag.style.transform = 'translateY(' + (e.clientY - y0) + 'px) scale(1.03)';
        const sibs = HS.$$('li', ol).filter((x) => x !== drag);
        for (const s of sibs) {
          const r = s.getBoundingClientRect(), mid = r.top + r.height / 2, dr = drag.getBoundingClientRect();
          const before = drag.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING;
          if (before && e.clientY > mid) { ol.insertBefore(s, drag); y0 += dr.height + 10; HS.sfx.click(); break; }
          if (!before && e.clientY < mid) { ol.insertBefore(drag, s); y0 -= dr.height + 10; HS.sfx.click(); break; }
        }
        drag.style.transform = 'translateY(' + (e.clientY - y0) + 'px) scale(1.03)';
      };
      ol.onpointerup = ol.onpointercancel = () => { if (!drag) return; drag.classList.remove('drag'); drag.style.transform = ''; drag = null; };
      $('#ord-check', el).onclick = () => {
        const lis = HS.$$('li', ol); let ok = true;
        lis.forEach((li, k) => { const good = +li.dataset.i === k; li.classList.toggle('good', good); li.classList.toggle('bad', !good); if (!good) ok = false; });
        if (!ok) { HS.sfx.soft(); HS.toast('<span>' + esc(HS.pick(HS.c.siraj.encourage)) + '</span>'); return; }
        win(el, { key: 'order', level: L + 1, badge: L + 1 >= levels.length, text: 'رتّبتَ أحداث ' + storyTitle(lv.story) + ' كما وقعت.', next: L + 1 < levels.length ? () => { L++; start(); } : null });
      };
    };
    start();
  }

  /* ---------- 2) من الشاهد؟ (مطابقة) ---------- */
  function witness(el) {
    const data = G().who_is_witness, all = data.map((d) => d.witness).concat((HS.c.stories.coming || []).map((c) => c.witness));
    const iconOf = (w) => (HS.c.stories.stories.find((s) => s.witness === w) || (HS.c.stories.coming || []).find((s) => s.witness === w) || {}).icon || 'question';
    let L = Math.min(lvl('witness'), 1), q = 0, rounds = [];
    const build = () => {
      rounds = HS.shuffle(data).map((d) => L === 0
        ? { ask: 'أنا «' + d.witness + '»… أيَّ حكايةٍ شهدتُ؟', icon: iconOf(d.witness), right: d.answer, opts: HS.shuffle([d.answer].concat(d.wrong)) }
        : { ask: 'من الذي شهد «' + d.answer + '»؟', icon: 'question', right: d.witness, opts: HS.shuffle([d.witness].concat(HS.shuffle(all.filter((w) => w !== d.witness)).slice(0, 3))), icons: true });
      q = 0; show();
    };
    const show = () => {
      const r = rounds[q];
      el.innerHTML = '<div class="wrap">' + head('من الشاهد؟', 'المستوى ' + AR(L + 1) + ' — السؤال ' + AR(q + 1) + ' من ' + AR(rounds.length)) +
        '<div class="wq card"><span class="wq-ic">' + HS.icon(r.icon) + '</span><h2>' + esc(r.ask) + '</h2></div><div class="wopts' + (r.icons ? ' grid' : '') + '">' +
        r.opts.map((o) => '<button class="btn teal" data-o="' + esc(o) + '">' + (r.icons ? HS.icon(iconOf(o)) : '') + esc(o) + '</button>').join('') + '</div></div>';
      $('.wopts', el).onclick = (e) => {
        const b = e.target.closest('[data-o]'); if (!b || b.disabled) return;
        if (b.dataset.o !== r.right) { HS.sfx.soft(); b.classList.add('shake', 'off'); b.disabled = true; HS.toast('<span>' + esc(HS.pick(HS.c.siraj.encourage)) + '</span>'); return; }
        HS.sfx.star(); b.classList.add('right'); HS.$$('.wopts .btn', el).forEach((x) => (x.disabled = true));
        setTimeout(() => {
          if (!document.body.contains(b)) return;
          if (++q < rounds.length) return show();
          win(el, { key: 'witness', level: L + 1, badge: L === 1, text: 'عرفتَ كل شاهدٍ وحكايته.', next: L === 0 ? () => { L = 1; build(); } : null });
        }, 800);
      };
    };
    build();
  }

  /* ---------- 3) طريق الهجرة (متاهة يقودها الفانوس) ---------- */
  function maze(el) {
    const cfg = G().hijra_maze, MAX = 5;
    let L = Math.min(lvl('maze'), MAX - 1), N, walls, pos, stop, goal, gotStop, anim = { x: 0, y: 0 }, moving = false, raf, cv, g, cell, t0 = 0, won = false;
    const key = (x, y) => y * N + x;
    function gen() {
      N = 5 + L; const r = HS.rng(101 + L * 17);
      walls = Array.from({ length: N * N }, () => [1, 1, 1, 1]); // أعلى، يمين، أسفل، يسار
      const seen = new Set([0]), stack = [[0, 0]], D = [[0, -1, 0, 2], [1, 0, 1, 3], [0, 1, 2, 0], [-1, 0, 3, 1]];
      while (stack.length) {
        const [x, y] = stack[stack.length - 1];
        const opts = D.filter(([dx, dy]) => x + dx >= 0 && y + dy >= 0 && x + dx < N && y + dy < N && !seen.has(key(x + dx, y + dy)));
        if (!opts.length) { stack.pop(); continue; }
        const [dx, dy, a, b] = opts[Math.floor(r() * opts.length)];
        walls[key(x, y)][a] = 0; walls[key(x + dx, y + dy)][b] = 0; seen.add(key(x + dx, y + dy)); stack.push([x + dx, y + dy]);
      }
      pos = { x: N - 1, y: N - 1 }; goal = { x: 0, y: 0 }; gotStop = false; won = false;
      stop = { x: Math.floor(r() * (N - 2)) + 1, y: Math.floor(N / 2) - 1 + Math.floor(r() * 2) };
      anim = { x: pos.x, y: pos.y };
    }
    const open = (x, y) => walls[key(x, y)].reduce((n, w) => n + (w ? 0 : 1), 0);
    function move(d) {
      if (moving || won) return;
      const V = [[0, -1], [1, 0], [0, 1], [-1, 0]]; let steps = 0;
      const path = [];
      let { x, y } = pos;
      while (!walls[key(x, y)][d] && steps < N) {
        x += V[d][0]; y += V[d][1]; steps++; path.push({ x, y });
        if (open(x, y) > 2 || (x === stop.x && y === stop.y) || (x === goal.x && y === goal.y)) break;
      }
      if (!path.length) { HS.sfx.soft(); return; }
      moving = true; HS.sfx.tap();
      const walk = () => {
        const n = path.shift(); if (!n) { moving = false; arrive(); return; }
        const sx = anim.x, sy = anim.y, st = performance.now();
        const tick = (t) => { const k = Math.min((t - st) / 110, 1); anim.x = sx + (n.x - sx) * k; anim.y = sy + (n.y - sy) * k; if (k < 1) requestAnimationFrame(tick); else { pos = n; walk(); } };
        requestAnimationFrame(tick);
      };
      walk();
    }
    function arrive() {
      if (!gotStop && pos.x === stop.x && pos.y === stop.y) { gotStop = true; HS.sfx.glow(); HS.toast(HS.icon('cave') + '<span>وصلتَ إلى ' + esc(cfg.stops[0]) + '! الآن إلى ' + esc(cfg.end) + '</span>'); $('.mz-goal', el).textContent = 'الآن: اذهب إلى ' + cfg.end; }
      if (pos.x === goal.x && pos.y === goal.y) {
        if (!gotStop) { HS.sfx.soft(); HS.toast('<span>مرّ على ' + esc(cfg.stops[0]) + ' أولًا</span>'); return; }
        won = true;
        win(el, { key: 'maze', level: L + 1, badge: L + 1 >= 3, text: 'وصل الفانوس من ' + cfg.start + ' إلى ' + cfg.end + ' مرورًا بـ' + cfg.stops[0] + '.', next: L + 1 < MAX ? () => { L++; setup(); } : null });
      }
    }
    function draw(t) {
      raf = requestAnimationFrame(draw);
      const W = cv.width, c = cell, pad = c * 0.5;
      g.clearRect(0, 0, W, W);
      g.fillStyle = '#0c1a3a'; g.beginPath(); g.roundRect(pad * 0.5, pad * 0.5, W - pad, W - pad, c * 0.3); g.fill();
      const cx = (x) => pad + x * c + c / 2;
      /* المعالم */
      const mark = (p, col, label, on) => {
        g.fillStyle = col; g.globalAlpha = on ? 0.9 : 0.35; g.beginPath(); g.arc(cx(p.x), cx(p.y), c * 0.36 + Math.sin(t / 400) * c * 0.03, 0, 6.28); g.fill(); g.globalAlpha = 1;
        g.fillStyle = '#0a1630'; g.font = '800 ' + Math.max(10, c * (label.length > 4 ? 0.19 : 0.24)) + 'px Tajawal'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, cx(p.x), cx(p.y));
      };
      mark({ x: N - 1, y: N - 1 }, '#9aa7c4', cfg.start, true); mark(stop, '#ffb48a', 'الغار', !gotStop); mark(goal, '#8fe0d6', cfg.end, gotStop);
      /* الجدران */
      g.strokeStyle = '#e0b455'; g.lineWidth = Math.max(3, c * 0.1); g.lineCap = 'round'; g.beginPath();
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const w = walls[key(x, y)], X = pad + x * c, Y = pad + y * c;
        if (w[0]) { g.moveTo(X, Y); g.lineTo(X + c, Y); } if (w[3]) { g.moveTo(X, Y); g.lineTo(X, Y + c); }
        if (y === N - 1 && w[2]) { g.moveTo(X, Y + c); g.lineTo(X + c, Y + c); } if (x === N - 1 && w[1]) { g.moveTo(X + c, Y); g.lineTo(X + c, Y + c); }
      }
      g.stroke();
      /* ظلام الليل ونور الفانوس */
      const lx = cx(anim.x), ly = cx(anim.y), R = c * (2.3 + Math.sin(t / 600) * 0.08);
      const fog = g.createRadialGradient(lx, ly, c * 0.3, lx, ly, R); fog.addColorStop(0, 'rgba(5,11,28,0)'); fog.addColorStop(1, 'rgba(5,11,28,' + (0.55 + L * 0.07) + ')');
      g.fillStyle = fog; g.fillRect(0, 0, W, W);
      const gl = g.createRadialGradient(lx, ly, 0, lx, ly, c * 0.9); gl.addColorStop(0, 'rgba(255,230,163,.95)'); gl.addColorStop(0.3, 'rgba(255,215,122,.5)'); gl.addColorStop(1, 'rgba(255,215,122,0)');
      g.fillStyle = gl; g.beginPath(); g.arc(lx, ly, c * 0.9, 0, 6.28); g.fill();
      g.fillStyle = '#fff8dd'; g.beginPath(); g.arc(lx, ly, c * 0.14, 0, 6.28); g.fill();
    }
    function setup() {
      gen();
      el.innerHTML = '<div class="wrap mz">' + head('طريق الهجرة', 'المستوى ' + AR(L + 1) + ' من ' + AR(MAX)) + '<p class="hint-line mz-goal">اذهب إلى ' + esc(cfg.stops[0]) + ' ثم إلى ' + esc(cfg.end) + '</p>' +
        '<canvas class="mz-cv"></canvas><div class="pad">' + [['u', 0, 'M12 5l7 9H5z'], ['l', 3, 'M5 12l9-7v14z'], ['r', 1, 'M19 12l-9-7v14z'], ['d', 2, 'M12 19l7-9H5z']].map((b) => '<button class="pad-' + b[0] + '" data-d="' + b[1] + '" aria-label="تحريك"><svg viewBox="0 0 24 24"><path d="' + b[2] + '" fill="currentColor"/></svg></button>').join('') + '</div></div>';
      cv = $('.mz-cv', el); g = cv.getContext('2d');
      const size = Math.min(el.clientWidth - 36, innerHeight * 0.5, 520), dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.width = cv.style.height = size + 'px'; cv.width = cv.height = size * dpr; cell = (size * dpr) / (N + 1);
      cancelAnimationFrame(raf); raf = requestAnimationFrame(draw);
      $('.pad', el).onclick = (e) => { const b = e.target.closest('[data-d]'); if (b) move(+b.dataset.d); };
      let sx, sy;
      cv.onpointerdown = (e) => { sx = e.clientX; sy = e.clientY; };
      cv.onpointerup = (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0); };
    }
    const onKey = (e) => { const d = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key]; if (d !== undefined) { e.preventDefault(); move(d); } };
    addEventListener('keydown', onKey);
    cleanup = () => { cancelAnimationFrame(raf); removeEventListener('keydown', onKey); };
    setup();
  }

  HS.views.game = {
    back: 'games',
    enter(el, kind, arg) { ({ order, witness, maze }[kind] || (() => HS.go('games')))(el, arg); },
    leave() { cleanup && cleanup(); cleanup = null; },
  };
})();
