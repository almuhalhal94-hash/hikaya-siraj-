// القسم 7: صفحة الأهالي — إعلان متحرك ١٥ ثانية بالكود، شرح قصير، مشاركة الرابط، و«ابدأ الآن».
import { html, reducedMotion } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

// الشهود الثلاثة في الإعلان (رسم بالكود، بلا أشخاص).
const ART = {
  cave: `<svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M4 112L38 44l14 16 18-36 20 34 10-10 16 64z" fill="#243b72"/>
    <path d="M70 24l20 34 10-10 16 64H86L76 70z" fill="#0c1736" opacity=".6"/>
    <path d="M70 24L58 62 38 44l14 16z" fill="#4a64a6" opacity=".55"/>
    <ellipse class="pulse" cx="60" cy="96" rx="26" ry="20" fill="#ffd77a" opacity=".4"/>
    <path d="M44 112q0-32 16-32t16 32z" fill="#050b1c"/>
    <path d="M51 112q0-20 9-20t9 20z" fill="#ffd77a"/>
  </svg>`,
  trunk: `<svg viewBox="0 0 120 120" aria-hidden="true">
    <ellipse class="pulse" cx="60" cy="62" rx="40" ry="50" fill="#ffd77a" opacity=".3"/>
    <ellipse cx="60" cy="110" rx="30" ry="6" fill="#050b1c" opacity=".5"/>
    <path d="M44 110L47 22h26l3 88z" fill="#9c6b3c"/>
    <path d="M47 22h8l-2 88h-9z" fill="#c08a52" opacity=".6"/>
    <g fill="none" stroke="#4a2e14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M47 40l13 9 13-9M46 60l14 9 14-9M45 80l15 9 15-9"/></g>
    <ellipse cx="60" cy="22" rx="13" ry="5" fill="#e0b377" stroke="#4a2e14" stroke-width="2.5"/>
  </svg>`,
  whale: `<svg viewBox="0 0 120 120" aria-hidden="true">
    <path d="M0 84q15-10 30 0t30 0 30 0 30 0v36H0z" fill="#16305a"/>
    <path d="M14 70c0-22 20-34 42-34 26 0 38 14 42 26l14-14c4 14 0 28-10 32-8 14-26 20-44 20-24 0-44-10-44-30z" fill="#3d7cc9"/>
    <path d="M20 80c12 10 30 13 50 9" fill="none" stroke="#cfe6ff" stroke-width="4" stroke-linecap="round" opacity=".8"/>
    <path class="bob" d="M52 32q-3-12-12-14M56 32q3-12 12-14" fill="none" stroke="#8fe0d6" stroke-width="4" stroke-linecap="round"/>
    <path d="M0 96q15-10 30 0t30 0 30 0 30 0v24H0z" fill="#0c1c3d" opacity=".85"/>
  </svg>`
};

export default async function parents(el, { ui, go }) {
  const t = ui.parents;
  const page = html(`
    <section class="page pa">
      <header class="page__head">
        <a class="backlink" href="#/"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="promo" role="img">
        <i class="promo__bar promo__bar--t"></i><i class="promo__bar promo__bar--b"></i>
        <div class="promo__stars"></div>
        <div class="promo__siraj"></div>
        <div class="promo__cast"></div>
        <p class="promo__line"><b></b><span></span></p>
        <i class="promo__time"></i>
      </div>
      <div class="pa__replay"><button class="btn btn--ghost" type="button"></button></div>
      <article class="pa__card"><p class="pa__intro"></p><ul></ul></article>
      <div class="pa__acts"><a class="btn" href="#/"></a><button class="btn btn--ghost" type="button"></button></div>
      <p class="pa__note" aria-live="polite"></p>
      <p class="pa__credit"></p>
    </section>`);
  const $ = q => page.querySelector(q);
  $('.backlink span').textContent = ui.common.back;
  $('.page__head h1').textContent = t.title;
  $('.page__head p').textContent = t.sub;
  $('.promo').setAttribute('aria-label', t.promo_label);
  $('.promo__line b').textContent = ui.brand.name + '…';
  $('.promo__line span').textContent = ui.brand.tagline;
  $('.pa__replay .btn').textContent = t.replay;
  $('.pa__intro').textContent = t.intro;
  t.points.forEach(p => { const li = document.createElement('li'); li.textContent = p; $('.pa__card ul').append(li); });
  $('.pa__acts a').textContent = t.start;
  $('.pa__acts button').textContent = t.share;
  $('.pa__credit').textContent = t.credit;

  // نجوم الإعلان
  let stars = '';
  for (let i = 0; i < 40; i++) stars += `<i class="tw${i % 3 === 1 ? ' tw--b' : i % 3 === 2 ? ' tw--c' : ''}" style="left:${(i * 37.7) % 100}%;top:${(i * 61.3) % 78}%;--s:${1.5 + (i % 3)}px"></i>`;
  $('.promo__stars').innerHTML = stars;

  const siraj = createSiraj({ label: ui.common.siraj });
  siraj.lantern.tabIndex = -1;
  $('.promo__siraj').append(siraj.el);
  t.cast.forEach((c, i) => {
    const f = html(`<figure style="--i:${i}">${ART[c.art] || ''}<figcaption></figcaption></figure>`);
    f.querySelector('figcaption').textContent = c.name;
    $('.promo__cast').append(f);
  });

  // الإعلان: ٠–٣ سماء ليلية، ٣–٦ سِراج يضيء، ٦–١١ الغار والجذع والحوت، ١١–١٥ العبارة.
  const promo = $('.promo');
  let timers = [];
  function play() {
    timers.forEach(clearTimeout); timers = [];
    promo.classList.remove('is-playing'); void promo.offsetWidth; promo.classList.add('is-playing');
    if (reducedMotion()) return;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    at(600, sfx.wind);
    at(3000, () => { sfx.glow(); siraj.react('joy'); });
    [6000, 7500, 9000].forEach(ms => at(ms, sfx.star));
    at(11200, () => { sfx.success(); sparkle($('.promo__line'), { count: 22, power: 5 }); });
  }
  play();

  $('.pa__replay .btn').addEventListener('click', () => { sfx.tap(); play(); });
  $('.backlink').addEventListener('click', e => { e.preventDefault(); sfx.tap(); go('#/'); });
  $('.pa__acts a').addEventListener('click', e => { e.preventDefault(); sfx.door(); go('#/', e.currentTarget); });
  $('.pa__acts button').addEventListener('click', async () => {
    sfx.tap();
    const url = location.href.split('#')[0], note = $('.pa__note');
    try {
      if (navigator.share) { await navigator.share({ title: ui.brand.name, text: t.share_text, url }); return; }
      await navigator.clipboard.writeText(url);
      note.textContent = t.copied;
    } catch (err) {
      if (err && err.name !== 'AbortError') note.textContent = url;
    }
  });

  el.append(page);
  return () => timers.forEach(clearTimeout);
}
