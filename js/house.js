/* القسم 5: بيت سِراج — رفيق مبرمج مسبقًا، كل ردوده من content/siraj.json */
(function () {
  'use strict';
  const { $, esc } = HS;
  /* أماكن الزينة في البيت (نسب مئوية) */
  const SLOTS = [[14, 20], [86, 20], [30, 9], [70, 9], [9, 62], [91, 62], [24, 84], [76, 84]];

  HS.views.house = {
    enter(el) {
      const S = HS.s, C = HS.c.siraj, R = HS.c.rewards, r = HS.rng(31);
      let st = ''; for (let i = 0; i < 16; i++) st += '<circle class="tw" cx="' + (160 + r() * 80).toFixed(0) + '" cy="' + (60 + r() * 110).toFixed(0) + '" r="' + (1 + r() * 1.6).toFixed(1) + '" fill="#fff" style="animation-delay:-' + (r() * 3).toFixed(1) + 's"/>';
      el.innerHTML = '<div class="wrap house"><h1 class="page-title">بيت سِراج</h1>' +
        '<div class="room"><svg class="room-bg" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<rect width="400" height="420" fill="#3b2a66"/><rect y="300" width="400" height="120" fill="#2a1d4d"/><path d="M0 300h400" stroke="#c9a24a" stroke-width="4"/>' +
        '<path d="M150 200V110a50 50 0 01100 0v90z" fill="#0a1838" stroke="#c9a24a" stroke-width="6"/>' + st + '<path d="M222 82a20 20 0 1016 32 15 15 0 01-16-32z" fill="#ffe6a3"/><path d="M200 60v140M150 150h100" stroke="#c9a24a" stroke-width="3" opacity=".6"/>' +
        '<ellipse cx="200" cy="352" rx="150" ry="36" fill="#b88ae6" opacity=".55"/><ellipse cx="200" cy="352" rx="112" ry="25" fill="none" stroke="#ffe6a3" stroke-width="3" stroke-dasharray="4 9"/>' +
        '<g opacity=".35" stroke="#ffe6a3" stroke-width="2" fill="none"><path d="M30 250q14-22 28 0t28 0M314 250q14-22 28 0t28 0"/></g></svg>' +
        '<div class="slots"></div><div class="room-siraj"><div class="bubble"><span class="bubble-t"></span></div>' + HS.siraj(HS.mood()) + '</div></div>' +
        '<div class="ask"></div>' +
        '<div class="shop card"><div class="shop-h"><b>زيّن البيت بنجومك</b><span class="shop-n">' + HS.icon('star') + '<i></i></span></div><div class="shop-items">' +
        R.decor.map((d) => '<button data-id="' + d.id + '">' + HS.icon(d.id) + '<span>' + esc(d.name) + '</span><small></small></button>').join('') + '</div></div></div>';

      const sir = $('.siraj', el);
      const say = (t) => { const b = $('.bubble', el); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; $('.bubble-t', el).textContent = HS.fmt(t); };
      const paint = () => {
        $('.slots', el).innerHTML = SLOTS.map((p, i) => { const d = S.decor.find((x) => x.slot === i); return '<button class="slot' + (d ? ' full' : '') + '" data-slot="' + i + '" style="left:' + p[0] + '%;top:' + p[1] + '%" aria-label="زينة">' + (d ? HS.icon(d.id) : '') + '</button>'; }).join('');
        $('.shop-n i', el).textContent = HS.spendable();
        HS.$$('.shop-items button', el).forEach((b) => { const d = R.decor.find((x) => x.id === b.dataset.id), fr = S.free.filter((x) => x === d.id).length; $('small', b).textContent = fr ? 'هدية ×' + fr : d.cost + ' نجوم'; b.classList.toggle('gift-on', !!fr); });
      };
      paint();

      /* ترحيب: يتذكر آخر حكاية */
      say(S.lastStory && Math.random() < 0.7 ? HS.pick(C.remember_story) : HS.pick(HS.isMorning() ? C.greetings.morning : C.greetings.evening));
      /* سؤال اليوم بأزرار */
      const q = C.ask_today;
      $('.ask', el).innerHTML = '<p>' + esc(HS.fmt(q.question)) + '</p><div>' + q.options.map((o) => '<button class="btn teal" data-go="' + o.go + '">' + esc(o.text) + '</button>').join('') + '</div>';

      sir.onclick = () => { HS.joy(sir); HS.sfx.glow(); say(HS.pick(C.on_touch)); };
      el.onclick = (e) => {
        const go = e.target.closest('[data-go]'); if (go) { HS.sfx.click(); return HS.go(go.dataset.go); }
        const item = e.target.closest('.shop-items button');
        if (item) {
          const d = R.decor.find((x) => x.id === item.dataset.id), slot = SLOTS.findIndex((_, i) => !S.decor.some((x) => x.slot === i)), fi = S.free.indexOf(d.id);
          if (slot < 0) { HS.sfx.soft(); return say('البيت امتلأ بالزينة! المس واحدة لتعيدها.'); }
          if (fi >= 0) { S.free.splice(fi, 1); S.decor.push({ id: d.id, slot, free: true }); }
          else if (HS.spendable() >= d.cost) { S.spent += d.cost; S.decor.push({ id: d.id, slot, cost: d.cost }); }
          else { HS.sfx.soft(); HS.joy(sir); return say('نحتاج نجومًا أكثر يا {name}! اجمعها من الحكايات والألعاب والأذكار.'); }
          HS.save(); paint(); HS.sfx.star(); HS.joy(sir); say(HS.pick(['ما أجمله! شكرًا يا {name}.', 'بيتي صار أحلى بك!', 'أحب هذه الزينة!']));
          const s = $('[data-slot="' + slot + '"]', el); s && s.classList.add('new');
          return;
        }
        const sl = e.target.closest('.slot.full');
        if (sl) {
          const k = S.decor.findIndex((x) => x.slot === +sl.dataset.slot), d = S.decor[k];
          if (d.free) S.free.push(d.id); else S.spent = Math.max(0, S.spent - (d.cost || 0));
          S.decor.splice(k, 1); HS.save(); paint(); HS.sfx.pop();
        }
      };
    },
  };
})();
