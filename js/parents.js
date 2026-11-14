/* القسم 7: صفحة الأهالي + إعلان متحرك 15 ثانية بالكود */
(function () {
  'use strict';
  const { $, esc } = HS;
  function promo() {
    const r = HS.rng(77); let st = '';
    for (let i = 0; i < 46; i++) st += '<i class="tw" style="left:' + (r() * 100).toFixed(1) + '%;top:' + (r() * 100).toFixed(1) + '%;animation-delay:-' + (r() * 3).toFixed(1) + 's"></i>';
    return '<div class="promo-in">' + st + '<div class="pr-siraj">' + HS.siraj() + '</div>' +
      '<span class="pr-w w1">' + HS.icon('cave') + '<b>الغار</b></span><span class="pr-w w2">' + HS.icon('trunk') + '<b>الجذع</b></span><span class="pr-w w3">' + HS.icon('whale') + '<b>الحوت</b></span>' +
      '<p class="pr-line">' + esc(HS.c.rewards.parents.tagline) + '</p><span class="pr-bar"></span></div>';
  }
  HS.views.parents = {
    enter(el) {
      const P = HS.c.rewards.parents;
      el.innerHTML = '<div class="wrap parents"><h1 class="page-title">للأهالي</h1>' +
        '<div class="promo" aria-label="إعلان متحرك"></div><div class="center"><button class="btn ghost" id="pr-again">أعد الإعلان</button></div>' +
        '<div class="card pa-text"><p>' + esc(P.intro) + '</p><ul>' + P.points.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>' +
        '<div class="center pa-acts"><button class="btn" id="pa-start">ابدأ الآن</button><button class="btn teal" id="pa-share">شارك الرابط</button></div>' +
        '<p class="pa-credit">إعداد: أ. طلال سعود المهلهل</p></div>';
      const play = () => { $('.promo', el).innerHTML = promo(); setTimeout(() => document.body.contains(el) && HS.sfx.glow(), 3000); };
      play();
      $('#pr-again', el).onclick = () => { HS.sfx.click(); play(); };
      $('#pa-start', el).onclick = () => { HS.sfx.click(); HS.go('home'); };
      $('#pa-share', el).onclick = async () => {
        HS.sfx.click();
        const url = location.href.split('#')[0], data = { title: 'حكايا السِّراج', text: P.share_text, url };
        try { if (navigator.share) return await navigator.share(data); await navigator.clipboard.writeText(url); HS.toast('<span>نُسخ الرابط</span>'); }
        catch (e) { if (e && e.name !== 'AbortError') HS.toast('<span>' + esc(url) + '</span>'); }
      };
    },
  };
})();
