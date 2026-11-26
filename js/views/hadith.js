// «حديث الأسبوع»: حديث قصير من الصحيحين لكل أسبوع (يبدأ السبت)، بمعناه للطفل وتحدٍّ يومي، واختبار حفظ، وأحاديث سابقة للمراجعة.
// كل النصوص من content/hadith.json (يولّده tools/hadith_build.py) وui.hadith. التقدم في store.state.hadith.
import { store, content, fill, html, num, dayKey } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const DAY = 864e5;

/** رقم الأسبوع منذ بداية الدورة (السبت). */
function weekNo(start) {
  const [y, m, d] = start.split('-').map(Number), s = new Date(y, m - 1, d), now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor(Math.round((today - s) / DAY) / 7));
}

export default async function hadith(el, { ui, lines, go }) {
  const t = ui.hadith, data = await content('hadith'), N = data.list.length;
  const w = weekNo(data.start), h = data.list[w % N];
  const st0 = store.state.hadith;
  const st = st0?.week === w ? st0 : { week: w, days: [], star: false, hifz: st0?.hifz || [] };
  const save = () => store.set({ hadith: st });

  const root = html(`
    <section class="page hd">
      <header class="page__head">
        <a class="backlink" href="#/">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="hd__siraj"></div>
      <article class="hd-card">
        <span class="hd-card__week"></span>
        <p class="hd-card__isnad"></p>
        <p class="hd-card__text"></p>
        <p class="hd-card__src"></p>
        <button class="hd-card__hide" type="button" aria-pressed="false"></button>
      </article>
      <section class="hd-box hd-box--sharh"><h2></h2><p></p></section>
      <section class="hd-box hd-box--chal">
        <h2></h2><p class="hd-chal"></p>
        <div class="hd-days"></div>
        <button class="btn hd-done" type="button"></button>
        <p class="hd-msg" aria-live="polite"></p>
      </section>
      <section class="hd-past" hidden><h2></h2><ol></ol></section>
    </section>`);
  const $ = q => root.querySelector(q);
  $('.backlink span').textContent = t.back;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = t.title; $('.page__head p').textContent = t.sub;
  const siraj = createSiraj({ label: ui.common.siraj });
  $('.hd__siraj').append(siraj.el);
  siraj.say(store.state.name ? fill(t.greet, { name: store.state.name }) : t.greet_anon);

  $('.hd-card__week').textContent = fill(t.week, { n: num(w + 1) });
  $('.hd-card__isnad').textContent = fill(t.isnad, { rawi: h.rawi, rida: h.rida });
  $('.hd-card__text').textContent = `«${h.text}»`;
  $('.hd-card__src').textContent = h.source;
  $('.hd-box--sharh h2').textContent = t.sharh; $('.hd-box--sharh p').textContent = h.sharh;
  $('.hd-box--chal h2').textContent = t.challenge; $('.hd-chal').textContent = h.challenge;

  // اختبار الحفظ: يُطمس النص ويُكشف باللمس
  const hide = $('.hd-card__hide'), card = $('.hd-card');
  const paintHide = () => { hide.textContent = card.classList.contains('is-hiding') ? t.reveal : t.test; };
  paintHide();
  hide.addEventListener('click', () => {
    const on = !card.classList.contains('is-hiding');
    card.classList.toggle('is-hiding', on); hide.setAttribute('aria-pressed', String(on)); sfx.tap(); paintHide();
    if (!on && !st.hifz.includes(h.source)) { st.hifz = [...st.hifz, h.source]; save(); }
  });

  // أيام الأسبوع السبعة (من السبت)
  const [y, m, d] = data.start.split('-').map(Number);
  const first = new Date(y, m - 1, d + w * 7);
  const keys = Array.from({ length: 7 }, (_, i) => dayKey(new Date(first.getFullYear(), first.getMonth(), first.getDate() + i)));
  const today = dayKey();
  const paintDays = () => {
    $('.hd-days').textContent = '';
    keys.forEach((k, i) => {
      const dot = html(`<span class="hd-day${st.days.includes(k) ? ' is-done' : ''}${k === today ? ' is-today' : ''}"><b></b></span>`);
      dot.querySelector('b').textContent = t.days[i];
      $('.hd-days').append(dot);
    });
    const done = st.days.includes(today);
    $('.hd-done').textContent = done ? t.done_yes : t.done; $('.hd-done').classList.toggle('is-done', done);
  };
  paintDays();
  $('.hd-done').addEventListener('click', () => {
    if (st.days.includes(today)) return;
    st.days = [...st.days, today]; sfx.star(); sparkle($('.hd-done'), { count: 16, power: 4 });
    let msg = fill(t.done_msg, { n: num(st.days.length) });
    if (st.days.length >= t.star_days && !st.star) { st.star = true; store.set({ stars: store.state.stars + 1 }); msg = t.star_msg; siraj.react('joy'); }
    save(); paintDays(); $('.hd-msg').textContent = msg;
  });

  // أحاديث الأسابيع الماضية للمراجعة (من الدورة الحالية)
  const past = Array.from({ length: Math.min(w, N - 1) }, (_, i) => data.list[(w - 1 - i + N) % N]);
  if (past.length) {
    $('.hd-past').hidden = false; $('.hd-past h2').textContent = t.past;
    past.forEach(p => {
      const li = html(`<li><details><summary></summary><p class="hd-past__text"></p><small></small></details></li>`);
      li.querySelector('summary').textContent = p.text.split(/[،,»]/)[0];
      li.querySelector('.hd-past__text').textContent = `«${p.text}»`;
      li.querySelector('small').textContent = p.source;
      $('.hd-past ol').append(li);
    });
  }
  el.append(root);
}
