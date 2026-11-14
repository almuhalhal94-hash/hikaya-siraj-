/* القسم 1: الصفحة الرئيسية */
(function () {
  'use strict';
  const { $, esc } = HS;
  const DOORS = [
    { go: 'stories', cls: 'd1', icon: 'book', t: 'الحكايات', s: 'الشاهد يحكي' },
    { go: 'games', cls: 'd2', icon: 'game', t: 'الألعاب', s: 'العب وتعلّم' },
    { go: 'adhkar', cls: 'd3', icon: 'sun', t: 'أذكاري', s: 'صباحي ومسائي' },
    { go: 'house', cls: 'd4', icon: 'house', t: 'بيت سِراج', s: 'زُر صديقك' },
  ];

  function say(el, text) { const b = $('.bubble', el); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; $('.bubble-t', el).textContent = text; }

  function greet(el) {
    const S = HS.s, g = HS.c.siraj.greetings;
    if (!S.name) {
      say(el, g.first_visit[0]);
      const f = document.createElement('form'); f.className = 'name-form';
      f.innerHTML = '<input maxlength="14" placeholder="اكتب اسمك هنا" aria-label="اسمك" autocomplete="off"><button class="btn">هذا أنا</button>';
      $('.bubble', el).appendChild(f);
      f.onsubmit = (e) => {
        e.preventDefault();
        const v = $('input', f).value.trim(); if (!v) { $('input', f).focus(); return; }
        S.name = v; HS.save(); f.remove(); HS.joy($('.siraj', el)); HS.sfx.glow();
        say(el, 'أهلًا بك يا ' + v + '! اختر بابًا وهيا نبدأ.');
        setTimeout(() => surprise(el), 1600);
      };
      return;
    }
    say(el, HS.fmt(HS.pick(HS.isMorning() ? g.morning : g.evening)));
    surprise(el);
  }

  /* القسم 6: مفاجأة يومية يقدمها سِراج عند أول دخول في اليوم */
  function surprise(el) {
    const S = HS.s, d = HS.today();
    if (!S.name || S.surprise === d) return;
    const texts = HS.c.siraj.daily_surprise, gifts = HS.c.rewards.surprise_gifts, i = S.days.length % texts.length, gift = gifts[i] || { stars: 1 };
    setTimeout(() => {
      if (!document.body.contains(el)) return;
      const m = HS.modal(HS.siraj() + '<h2>مفاجأة اليوم!</h2><p>' + esc(HS.fmt('عندي لك هدية يا {name}… المسها لتفتحها!')) + '</p><div class="gift">' + HS.icon('gift') + '</div>', { sticky: true });
      HS.sfx.pop();
      $('.gift', m).onclick = () => {
        S.surprise = d;
        if (gift.decor) S.free.push(gift.decor);
        HS.save(); HS.celebrate(); HS.joy($('.siraj', m));
        $('.modal-box', m).innerHTML = HS.siraj('joy') + '<h2>' + esc(texts[i]) + '</h2><div class="gift" style="animation:none">' + HS.icon(gift.decor || 'star') + '</div><p>' +
          (gift.decor ? 'تجدها في بيت سِراج لتزيّن بها.' : 'أضاءت في سمائك!') + '</p><button class="btn" data-close>شكرًا يا سِراج</button>';
        if (gift.stars) HS.addStars(gift.stars, $('.gift', m));
        if (S.days.length >= 3) HS.badge('days-3');
        if (S.days.length >= 7) HS.badge('days-7');
      };
    }, 900);
  }

  HS.views.home = {
    enter(el) {
      el.innerHTML = '<div class="home wrap">' +
        '<h1 class="home-title">حكايا السِّراج</h1><p class="home-tag">القصة يحكيها من شهدها</p>' +
        '<div class="hero"><div class="bubble"><span class="bubble-t"></span></div>' + HS.siraj(HS.mood()) + '</div>' +
        '<nav class="doors">' + DOORS.map((d) => '<button class="door ' + d.cls + '" data-go="' + d.go + '"><span class="door-light"></span><span class="door-leaf">' + HS.icon(d.icon) + '<b>' + d.t + '</b><small>' + d.s + '</small></span></button>').join('') + '</nav>' +
        '<div class="home-foot"><button class="btn ghost" data-go="parents">للأهالي</button></div></div>';
      const sir = $('.siraj', el);
      sir.onclick = () => { HS.joy(sir); HS.sfx.glow(); say(el, HS.fmt(HS.pick(HS.c.siraj.on_touch))); };
      el.onclick = (e) => {
        const b = e.target.closest('[data-go]'); if (!b) return;
        if (!HS.s.name && b.classList.contains('door')) { HS.joy(sir); HS.sfx.soft(); $('.name-form input', el)?.focus(); return; }
        HS.sfx.click();
        if (b.classList.contains('door')) { b.classList.add('open'); HS.sfx.wind(0.7); setTimeout(() => HS.go(b.dataset.go), 420); } else HS.go(b.dataset.go);
      };
      greet(el);
    },
    leave() {},
  };
})();
