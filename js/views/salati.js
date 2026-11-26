// «صلاتي»: يلمس الطفل الصلاة بعد أن يصلّيها فيضيء قمرها؛ الخمس كلها في يوم = نجمة (مرة في اليوم)، وأسبوع من الأقمار، وأيام كاملة متتالية.
// النصوص من ui.salati وردود سِراج من siraj.json (salati). التقدم في store.state.salati = {days: {يوم: [أرقام الصلوات]}, stars: [أيام]}.
import { store, fill, html, num, dayKey, pick } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// سماء كل صلاة: الفجر، الظهر، العصر، المغرب، العشاء
const SKY = [
  ['#16305a', '#b9617a', '#ffb35c', 'dawn'], ['#3c8fd8', '#7ec8ff', '#bfe3f5', 'noon'], ['#4a86c8', '#f2c27a', '#ffd9a0', 'asr'],
  ['#3a2766', '#d9687a', '#ff9a5a', 'sunset'], ['#06102a', '#14284f', '#1d3a6e', 'night']
];
const SUN = {
  dawn: '<path d="M14 54a18 18 0 0 1 36 0z" fill="#ffd77a"/>',
  noon: '<circle cx="32" cy="18" r="10" fill="#fff4cf"/><circle cx="32" cy="18" r="15" fill="#ffd77a" opacity=".35"/>',
  asr: '<circle cx="46" cy="28" r="9" fill="#ffe2a0"/><circle cx="46" cy="28" r="14" fill="#ffd77a" opacity=".3"/>',
  sunset: '<path d="M18 54a14 14 0 0 1 28 0z" fill="#ff8a4a"/>',
  night: '<path d="M38 10a12 12 0 1 0 10 18 10 10 0 0 1-10-18z" fill="#fff4cf"/><circle cx="14" cy="16" r="1.4" fill="#fff"/><circle cx="22" cy="34" r="1" fill="#fff"/><circle cx="52" cy="40" r="1.2" fill="#fff"/>'
};
const MOSQUE = '<path d="M0 64V52h10v-6q8-8 16 0v6h12v-6q8-8 16 0v6h10v12z" fill="rgba(6,16,42,.75)"/>';

const mine = () => store.state.salati || { days: {}, stars: [] };
/** مفتاح يوم بإزاحة عن اليوم. */
const keyAt = off => { const n = new Date(); return dayKey(new Date(n.getFullYear(), n.getMonth(), n.getDate() + off)); };

export default function salati(el, { ui, lines }) {
  const t = ui.salati, today = dayKey();
  const page = html(`
    <section class="page sl">
      <header class="page__head">
        <a class="backlink" href="#/">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="sl__siraj"></div>
      <span class="chip sl__count"></span>
      <div class="sl__grid"></div>
      <p class="sl__msg" aria-live="polite"></p>
      <section class="sl-week"><h2></h2><div class="sl-week__rows"></div><p class="sl-week__streak"></p></section>
      <section class="sl-hd"><h2></h2><p class="sl-hd__text"></p><small class="sl-hd__src"></small><p class="sl-hd__sharh"></p><p class="sl-hd__two"></p></section>
      <p class="sl__note"></p>
    </section>`);
  const $ = q => page.querySelector(q);
  $('.backlink span').textContent = t.back;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = t.title; $('.page__head p').textContent = t.sub;
  const siraj = createSiraj({ label: ui.common.siraj });
  $('.sl__siraj').append(siraj.el);
  siraj.say(store.state.name ? fill(t.greet, { name: store.state.name }) : t.greet_anon);
  $('.sl-week h2').textContent = t.week;
  $('.sl-hd h2').textContent = t.hadith_title; $('.sl-hd__text').textContent = t.hadith; $('.sl-hd__src').textContent = t.hadith_src;
  $('.sl-hd__sharh').textContent = t.hadith_sharh; $('.sl-hd__two').textContent = t.hadith2; $('.sl__note').textContent = t.note;

  const todayList = () => mine().days[today] || [];
  function save(list) {
    const s = mine(), days = { ...s.days, [today]: list };
    const keep = new Set(Array.from({ length: 60 }, (_, i) => keyAt(-i))); // آخر ستين يومًا فقط
    Object.keys(days).forEach(k => { if (!keep.has(k)) delete days[k]; });
    store.set({ salati: { ...s, days } });
  }

  const tiles = t.prayers.map((p, i) => {
    const [a, b, c, kind] = SKY[i];
    const tile = html(`<button class="sl-tile" type="button" aria-pressed="false" style="--a:${a};--b:${b};--c:${c};--i:${i}">
      <svg class="sl-tile__sky" viewBox="0 0 64 64" aria-hidden="true">${SUN[kind]}${MOSQUE}</svg>
      <b></b><span class="sl-tile__moon" aria-hidden="true"></span><small></small></button>`);
    tile.querySelector('b').textContent = p.name;
    tile.addEventListener('click', () => toggle(i, tile));
    $('.sl__grid').append(tile);
    return tile;
  });

  function toggle(i, tile) {
    let list = todayList();
    if (list.includes(i)) { list = list.filter(x => x !== i); save(list); sfx.flip(); $('.sl__msg').textContent = ''; paint(); return; }
    list = [...list, i].sort(); save(list);
    sfx.star(); sparkle(tile, { count: 16, power: 4 }); siraj.react('joy');
    let msg = fill(pick(lines.salati), { name: store.state.name || '' }).replace(/ يا !/, '!');
    if (list.length === 5) {
      const s = mine();
      if (!s.stars.includes(today)) { store.set({ salati: { ...s, stars: [...s.stars.slice(-59), today] }, stars: store.state.stars + 1 }); msg = t.star; sfx.success(); }
      else msg = t.full;
      sparkle($('.sl__grid'), { count: 30, power: 6 });
    }
    siraj.say(msg); $('.sl__msg').textContent = t.undo; paint();
  }

  function paint() {
    const list = todayList();
    tiles.forEach((tile, i) => {
      const on = list.includes(i);
      tile.classList.toggle('is-done', on); tile.setAttribute('aria-pressed', String(on));
      tile.querySelector('small').textContent = on ? `✓ ${t.prayed}` : '';
    });
    $('.sl__count').textContent = fill(t.count, { i: num(list.length) });
    paintWeek();
  }

  function paintWeek() {
    const box = $('.sl-week__rows'); box.textContent = '';
    const now = new Date(), back = (now.getDay() + 1) % 7; // من السبت
    const days = mine().days;
    for (let d = 0; d < 7; d++) {
      const k = keyAt(d - back), got = days[k] || [], future = d > back;
      const row = html(`<div class="sl-day${k === today ? ' is-today' : ''}${got.length === 5 ? ' is-full' : ''}${future ? ' is-future' : ''}"><b></b><span></span></div>`);
      row.querySelector('b').textContent = t.days[d];
      t.prayers.forEach((_, i) => { const m = document.createElement('i'); if (got.includes(i)) m.className = 'is-on'; row.querySelector('span').append(m); });
      box.append(row);
    }
    // أيام كاملة متتالية تنتهي اليوم أو أمس
    let n = 0, off = (days[today] || []).length === 5 ? 0 : -1;
    while ((days[keyAt(off)] || []).length === 5) { n++; off--; }
    $('.sl-week__streak').textContent = fill(t.streak, { n: num(n) });
  }

  paint();
  el.append(page);
}
