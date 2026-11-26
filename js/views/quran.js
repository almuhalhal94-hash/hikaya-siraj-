// قسم «قرآني»: الفاتحة وجزء عمّ بتلاوة الشيخ مشاري العفاسي الحقيقية، مع تظليل الكلمة المتلوّة ومتابعة الحفظ.
// النص والتوقيت من content/quran.json (يولّده tools/quran_build.py) والتلاوة من assets/quran. لا مؤثرات فوق القرآن.
import { store, content, fill, html, num, wait } from '../core.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
const PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>';
const EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.200"/><circle cx="12" cy="12" r="3.200" fill="currentColor"/></svg>';
const STAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l6.200 13.400 14.600 1.700-10.800 10 2.900 14.400L24 35.300 11.100 42.500 14 28.100 3.200 18.100l14.600-1.700z" fill="currentColor"/></svg>';
const EAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round"/></svg>';

const ORDER = s => (s.n === 1 ? -1 : 200 - s.n); // الفاتحة أولًا ثم من الناس صعودًا
const short = name => name.replace(/^سُورَةُ\s*/, '');
const plain = name => short(name).replace(/\u06E1/g, '\u0652'); // اسم السورة بخط الواجهة
const mine = () => store.state.quran || {};
function mark(n, patch) { store.set({ quran: { ...mine(), [n]: { ...mine()[n], ...patch } } }); }

export default async function quran(el, ctx) {
  const data = await content('quran');
  const s = data.surahs.find(x => String(x.n) === ctx.args[0]);
  return s ? surah(el, ctx, data, s) : hub(el, ctx, data);
}

function hub(el, { ui, go }, data) {
  const t = ui.quran, m = mine();
  const list = [...data.surahs].sort((a, b) => ORDER(a) - ORDER(b));
  const hifz = list.filter(s => m[s.n]?.hifz).length;
  const page = html(`
    <section class="page qr-hub">
      <header class="page__head">
        <a class="backlink" href="#/">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="qr-hub__stats"><span class="chip"></span><span class="chip"></span></div>
      <ol class="qr-list"></ol>
      <p class="qr-hub__src"></p>
    </section>`);
  const $ = q => page.querySelector(q);
  $('.backlink span').textContent = t.back;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = t.title; $('.page__head p').textContent = t.sub;
  const [c1, c2] = page.querySelectorAll('.qr-hub__stats .chip');
  c1.innerHTML = STAR; c1.append(fill(t.hifz_count, { i: num(hifz), n: num(list.length) }));
  c2.innerHTML = EAR; c2.append(fill(t.heard_count, { i: num(list.filter(s => m[s.n]?.heard).length) }));
  $('.qr-hub__src').textContent = t.source;
  const next = list.find(s => !m[s.n]?.hifz);
  list.forEach((s, i) => {
    const st = m[s.n] || {};
    const li = html(`<li class="qr-item${st.hifz ? ' is-hifz' : st.heard ? ' is-heard' : ''}${s === next ? ' is-next' : ''}" style="--i:${Math.min(i, 14)}">
      <a href="#/quran/${s.n}"><span class="qr-item__no"></span><span class="qr-item__body"><b></b><small></small></span><span class="qr-item__mark">${st.hifz ? STAR : st.heard ? EAR : ''}</span></a></li>`);
    li.querySelector('.qr-item__no').textContent = num(s.n);
    li.querySelector('b').textContent = short(s.name);
    li.querySelector('small').textContent = s === next ? t.next : fill(s.ayahs.length > 10 ? t.ayahs_many : t.ayahs, { n: num(s.ayahs.length) });
    li.querySelector('a').addEventListener('click', e => { e.preventDefault(); sfx.door(); go(`#/quran/${s.n}`, li); });
    $('.qr-list').append(li);
  });
  el.append(page);
}

function surah(el, { ui, go }, data, s) {
  const t = ui.quran, bism = s.n !== 1 && s.n !== 9;
  const root = html(`
    <section class="page qr">
      <header class="page__head qr__top">
        <a class="backlink" href="#/quran">${CHEVRON}<span></span></a>
        <h1></h1>
      </header>
      <article class="qr__mushaf" dir="rtl"><p class="qr__bism" hidden></p><p class="qr__text"></p></article>
      <p class="qr__msg" aria-live="polite"></p>
      <footer class="qr__bar">
        <button class="qr__opt qr__rep" type="button"></button>
        <button class="qr__play" type="button">${PLAY}</button>
        <button class="qr__opt qr__hide" type="button" aria-pressed="false">${EYE}<span></span></button>
        <button class="btn qr__done" type="button"></button>
      </footer>
    </section>`);
  const $ = q => root.querySelector(q);
  $('.backlink span').textContent = t.title;
  $('.backlink').addEventListener('click', () => { stop(); sfx.tap(); });
  $('h1').textContent = short(s.name);
  const textEl = $('.qr__text'), play = $('.qr__play'), msg = $('.qr__msg');
  if (bism) { $('.qr__bism').textContent = data.bismillah.text; $('.qr__bism').hidden = false; }
  play.setAttribute('aria-label', t.play);

  // الآيات: كل كلمة span، وفي آخر كل آية رقمها في زخرفة.
  const ayahEls = s.ayahs.map((a, k) => {
    const span = html(`<span class="qr-ayah" data-k="${k}"></span>`);
    a.w.forEach(w => { const x = document.createElement('span'); x.className = 'qr-w'; x.textContent = w; span.append(x, ' '); });
    const end = document.createElement('span'); end.className = 'qr-end'; end.textContent = `۝${num(a.n)}`;
    span.append(end, ' ');
    span.addEventListener('click', () => { if (hidden && !span.classList.contains('is-shown')) { span.classList.add('is-shown'); return; } start(k); });
    textEl.append(span);
    return span;
  });

  const audio = new Audio(); audio.preload = 'auto';
  let k = 0, rep = 1, repLeft = 1, playing = false, raf = 0, bismNow = false, alive = true, hidden = false;
  const REPS = [1, 3, 5];
  const paintRep = () => { $('.qr__rep').textContent = rep === 1 ? t.rep_once : fill(t.rep, { n: num(rep) }); };
  paintRep();
  $('.qr__hide span').textContent = t.hide;

  function clearMarks() { root.querySelectorAll('.qr-w.is-now, .qr-ayah.is-now').forEach(x => x.classList.remove('is-now')); }
  function tick() {
    if (!playing || bismNow) return;
    const a = s.ayahs[k], ms = audio.currentTime * 1000, words = ayahEls[k].querySelectorAll('.qr-w');
    if (a.t) a.t.forEach(([b, e], j) => words[j]?.classList.toggle('is-now', ms >= b && ms < e + 120));
    raf = requestAnimationFrame(tick);
  }
  function load(src) { audio.src = `assets/quran/${src}`; return audio.play().catch(() => { pause(); msg.textContent = t.no_audio; }); }
  function playAyah() {
    clearMarks();
    const el = ayahEls[k];
    el.classList.add('is-now'); if (!s.ayahs[k].t) el.querySelectorAll('.qr-w').forEach(w => w.classList.add('is-now'));
    if (hidden) el.classList.add('is-shown');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    load(s.ayahs[k].a); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function start(from) {
    k = from; repLeft = rep; playing = true; play.innerHTML = PAUSE; play.setAttribute('aria-label', t.pause); msg.textContent = '';
    if (bism && from === 0) { bismNow = true; $('.qr__bism').classList.add('is-now'); load(data.bismillah.a); }
    else playAyah();
  }
  function pause() { playing = false; audio.pause(); cancelAnimationFrame(raf); play.innerHTML = PLAY; play.setAttribute('aria-label', t.play); }
  function stop() { pause(); audio.removeAttribute('src'); }
  audio.addEventListener('ended', async () => {
    if (!alive || !playing) return;
    if (bismNow) { bismNow = false; $('.qr__bism').classList.remove('is-now'); playAyah(); return; }
    if (--repLeft > 0) { await wait(500); if (playing) playAyah(); return; }
    if (k < s.ayahs.length - 1) { k++; repLeft = rep; await wait(250); if (playing) playAyah(); return; }
    pause(); clearMarks();
    const first = !mine()[s.n]?.heard;
    mark(s.n, { heard: true });
    msg.textContent = first ? t.heard_done : t.heard_again;
  });

  play.addEventListener('click', () => {
    if (playing) { pause(); return; }
    if (audio.src && !audio.ended && audio.currentTime > 0) { playing = true; play.innerHTML = PAUSE; audio.play(); raf = requestAnimationFrame(tick); return; }
    start(0);
  });
  $('.qr__rep').addEventListener('click', () => { rep = REPS[(REPS.indexOf(rep) + 1) % REPS.length]; repLeft = rep; paintRep(); msg.textContent = rep === 1 ? '' : t.rep_hint; });
  $('.qr__hide').addEventListener('click', () => {
    hidden = !hidden; root.classList.toggle('is-hiding', hidden);
    $('.qr__hide').setAttribute('aria-pressed', String(hidden));
    ayahEls.forEach(x => x.classList.remove('is-shown'));
    msg.textContent = hidden ? t.hide_hint : '';
  });

  const done = $('.qr__done');
  const paintDone = () => { const h = mine()[s.n]?.hifz; done.textContent = h ? t.hifz_yes : t.hifz_btn; done.classList.toggle('is-done', !!h); };
  paintDone();
  done.addEventListener('click', () => {
    const h = mine()[s.n]?.hifz;
    if (h) { mark(s.n, { hifz: false }); paintDone(); msg.textContent = ''; return; }
    const reward = !mine()[s.n]?.rewarded;
    mark(s.n, { hifz: true, rewarded: true });
    if (reward) store.set({ stars: store.state.stars + 1 });
    paintDone(); sparkle(done, { count: 22, power: 5 });
    msg.textContent = reward ? fill(t.hifz_star, { name: plain(s.name) }) : fill(t.hifz_ok, { name: plain(s.name) });
  });

  el.append(root);
  return () => { alive = false; stop(); };
}
