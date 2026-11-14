/* القسم 3: أذكاري اليومية + حديقة الأيام. النصوص من content/adhkar.json (حصن المسلم) */
(function () {
  'use strict';
  const { $, esc } = HS;
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const TABS = [['morning', 'الصباح', 'sun'], ['evening', 'المساء', 'lamp'], ['garden', 'حديقة الأيام', 'tree']];

  function state() {
    const S = HS.s, d = HS.today();
    if (!S.adhkar || S.adhkar.date !== d) { S.adhkar = { date: d, morning: {}, evening: {}, done: {} }; HS.save(); }
    return S.adhkar;
  }
  const left = (st, kind, z) => Math.max(0, z.count - (st[kind][z.id] || 0));
  const progress = (st, kind, list) => list.filter((z) => left(st, kind, z) === 0).length / list.length;

  /* مشهد الصباح: شمس تطلع مع التقدم. مشهد المساء: فوانيس تضيء في السماء */
  function scene(kind, list, st) {
    if (kind === 'morning') return '<div class="az-scene am"><div class="az-day"></div><div class="az-sun"></div><div class="az-hills"></div></div>';
    return '<div class="az-scene pm">' + list.map((z, i) => '<span class="az-lan" data-i="' + i + '" style="left:' + (5 + (i % 5) * 18 + (Math.floor(i / 5) % 2) * 6) + '%;top:' + (14 + Math.floor(i / 5) * 40 + (i % 2) * 10) + '%">' + HS.icon('lamp') + '</span>').join('') + '</div>';
  }
  function paintScene(el, kind, list, st) {
    const p = progress(st, kind, list);
    if (kind === 'morning') { const sc = $('.az-scene', el); if (sc) sc.style.setProperty('--p', p); }
    else HS.$$('.az-lan', el).forEach((l, i) => l.classList.toggle('lit', left(st, kind, list[i]) === 0));
  }

  function renderDhikr(el, kind) {
    const list = HS.c.adhkar[kind], st = state();
    let i = list.findIndex((z) => left(st, kind, z) > 0);
    const box = $('.az-body', el);
    if (i < 0) return complete(el, kind, false);
    const show = () => {
      const z = list[i], n = left(st, kind, z), quran = z.source.startsWith('القرآن');
      box.innerHTML = '<div class="az-card card"><div class="az-step">' + AR(i + 1) + ' من ' + AR(list.length) + '</div>' +
        '<p class="az-text' + (quran ? ' quran' : '') + '">' + esc(z.text) + '</p><small class="az-src">' + esc(z.source) + '</small></div>' +
        '<div class="az-ctl"><button class="az-nav" data-d="-1" aria-label="السابق"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button class="az-count' + (n === 0 ? ' ok' : '') + '" aria-label="عدّاد"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="rg"/><circle cx="60" cy="60" r="52" class="rp" style="stroke-dashoffset:' + (327 * (n / z.count)) + '"/></svg><b>' + (n === 0 ? '✓' : AR(n)) + '</b><i>' + (n === 0 ? 'تم' : 'المس') + '</i></button>' +
        '<button class="az-nav" data-d="1" aria-label="التالي"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
    };
    show();
    box.onclick = (e) => {
      const nav = e.target.closest('.az-nav');
      if (nav) { HS.sfx.click(); i = (i + +nav.dataset.d + list.length) % list.length; return show(); }
      const c = e.target.closest('.az-count'); if (!c) return;
      const z = list[i]; if (left(st, kind, z) === 0) return;
      st[kind][z.id] = (st[kind][z.id] || 0) + 1; HS.save(); HS.sfx.tap();
      const n = left(st, kind, z);
      $('b', c).textContent = n === 0 ? '✓' : AR(n); $('.rp', c).style.strokeDashoffset = 327 * (n / z.count);
      c.classList.remove('hit'); void c.offsetWidth; c.classList.add('hit');
      if (n > 0) return;
      c.classList.add('ok'); $('i', c).textContent = 'تم'; HS.sfx.star(); paintScene(el, kind, list, st);
      const nx = list.findIndex((q) => left(st, kind, q) > 0);
      setTimeout(() => { if (!document.body.contains(box)) return; if (nx < 0) complete(el, kind, true); else { i = nx; show(); } }, 750);
    };
  }

  function complete(el, kind, fresh) {
    const st = state(), box = $('.az-body', el), morning = kind === 'morning';
    if (fresh && !st.done[kind]) { st.done[kind] = true; HS.save(); HS.celebrate(); HS.addStars(3, box); HS.badge('adhkar-' + kind); (morning ? HS.sfx.glow : HS.sfx.wind)(); }
    const sod = HS.storyOfDay();
    box.onclick = null;
    box.innerHTML = '<div class="az-card card az-done">' + HS.siraj('joy') + '<h2>' + (morning ? 'أشرقت شمسُك!' : 'أضاءت فوانيسُك!') + '</h2><p>' +
      esc(HS.fmt(morning ? 'أتممتَ أذكار الصباح يا {name}. حفظك الله في يومك.' : 'أتممتَ أذكار المساء يا {name}. حفظك الله في ليلتك.')) + '</p>' +
      (morning ? '<button class="btn pulse" data-go="story/' + sod.id + '">افتح حكاية اليوم: ' + esc(sod.title) + '</button>' : '<button class="btn" data-go="house">زُر بيت سِراج</button>') +
      '<button class="btn ghost" data-again>أعد الأذكار</button></div>';
    box.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return; HS.sfx.click();
      if (b.dataset.go) return HS.go(b.dataset.go);
      st[kind] = {}; HS.save(); paintScene(el, kind, HS.c.adhkar[kind], st); renderDhikr(el, kind);
    };
  }

  /* حديقة الأيام: شجرة تكبر مع كل يوم دخول، ولا تذبل أبدًا */
  function garden(el) {
    const n = HS.s.days.length, r = HS.rng(5), H = Math.min(70 + n * 12, 230), top = 330 - H, R = Math.min(46 + n * 7, 130);
    let leaves = '', fruits = '';
    const cnt = Math.min(6 + n * 4, 90);
    for (let i = 0; i < cnt; i++) { const a = r() * 6.28, d = Math.sqrt(r()) * R, x = 200 + Math.cos(a) * d * 1.15, y = top - R * 0.35 + Math.sin(a) * d * 0.8; leaves += '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="' + (13 + r() * 9).toFixed(0) + '" ry="' + (9 + r() * 6).toFixed(0) + '" fill="' + ['#3fbfa9', '#2fa893', '#57d0b8', '#1f8f7c'][i % 4] + '" style="animation-delay:' + (i * 0.02).toFixed(2) + 's"/>'; }
    for (let i = 0; i < Math.min(Math.floor(n / 2), 14); i++) { const a = r() * 6.28, d = Math.sqrt(r()) * R * 0.85; fruits += '<circle cx="' + (200 + Math.cos(a) * d * 1.1).toFixed(0) + '" cy="' + (top - R * 0.35 + Math.sin(a) * d * 0.75).toFixed(0) + '" r="6" fill="#ffd77a" stroke="#c9a24a" stroke-width="1.5" style="animation-delay:' + (1 + i * 0.1) + 's"/>'; }
    $('.az-body', el).innerHTML = '<div class="az-card card garden"><svg viewBox="0 0 400 380" role="img" aria-label="شجرة الأيام">' +
      '<ellipse cx="200" cy="338" rx="170" ry="26" fill="#1f6f52"/><ellipse cx="200" cy="332" rx="150" ry="18" fill="#2a8a66"/>' +
      '<path class="g-trunk" d="M' + (200 - 9 - n * 0.5) + ' 334Q196 ' + (top + H / 2) + ' ' + 194 + ' ' + top + 'h12Q204 ' + (top + H / 2) + ' ' + (209 + n * 0.5) + ' 334z" fill="#9c6b3c" stroke="#5c3b1c" stroke-width="2"/>' +
      '<g class="g-leaves">' + leaves + '</g><g class="g-fruits">' + fruits + '</g></svg>' +
      '<h2>' + (n <= 1 ? 'زرعتَ شجرتك اليوم!' : 'شجرتك عمرها ' + AR(n) + ' ' + (n === 2 ? 'يومان' : n <= 10 ? 'أيام' : 'يومًا')) + '</h2><p>' + esc(HS.fmt('كل يوم تزورني فيه يا {name} تكبر شجرتك. وإذا غبتَ فهي تنتظرك ولا تذبل.')) + '</p></div>';
    HS.sfx.leaves();
  }

  HS.views.adhkar = {
    enter(el, tab) {
      tab = TABS.some((t) => t[0] === tab) ? tab : HS.isMorning() ? 'morning' : 'evening';
      const st = state(), list = HS.c.adhkar[tab] || [];
      el.innerHTML = '<div class="wrap az"><h1 class="page-title">أذكاري</h1><div class="az-tabs">' +
        TABS.map((t) => '<button class="' + (t[0] === tab ? 'on' : '') + '" data-tab="' + t[0] + '">' + HS.icon(t[2]) + t[1] + '</button>').join('') + '</div>' +
        (tab === 'garden' ? '' : scene(tab, list, st)) + '<div class="az-body"></div></div>';
      $('.az-tabs', el).onclick = (e) => { const b = e.target.closest('[data-tab]'); if (b) { HS.sfx.click(); HS.go('adhkar/' + b.dataset.tab); } };
      if (tab === 'garden') return garden(el);
      paintScene(el, tab, list, st); renderDhikr(el, tab);
    },
  };
})();
