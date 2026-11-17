// القسم 3: أذكاري اليومية — صفحة الاختيار + «حديقة الأيام» + جلسة الذكر بعدّاد اللمس.
// النصوص من content/adhkar.json (منقولة من «حصن المسلم» والمصحف)، ولا نص ذكر داخل الكود.
import { store, content, pick, fill, html, wait, dayPart, dayKey, num, reducedMotion } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const KINDS = ['morning', 'evening'];
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
const CHECK = '<svg class="dk__check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.500 4.500L19 7.500" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const STAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l6.200 13.400 14.600 1.700-10.800 10 2.900 14.400L24 35.300 11.100 42.500 14 28.100 3.200 18.100l14.600-1.700z" fill="#ffd77a" stroke="#fff4cf" stroke-width="2" stroke-linejoin="round"/></svg>';
const LAMP = `<svg viewBox="0 0 40 60" aria-hidden="true">
  <circle cx="20" cy="5" r="3.500" fill="none" stroke="#c9a24a" stroke-width="2"/>
  <path d="M11 20q9-16 18 0z" fill="#c9a24a"/>
  <path class="lamp__glass" d="M12 20h16c6 8 6 21 1 28H11c-5-7-5-20 1-28z"/>
  <path class="lamp__flame" d="M20 27c4 5 5.500 8 5.500 11a5.500 5.500 0 0 1-11 0c0-3 1.500-6 5.500-11z"/>
  <path d="M12 20h16c6 8 6 21 1 28H11c-5-7-5-20 1-28zM20 20v28" fill="none" stroke="#c9a24a" stroke-width="1.800"/>
  <path d="M10 48h20l-3 6H13z" fill="#c9a24a"/>
</svg>`;
const DUNES = `<svg class="dk-dunes" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 58Q90 16 180 52T400 34V120H0z" fill="#0f2148"/><path class="dk-dunes__lit" d="M0 58Q90 16 180 52T400 34V120H0z" fill="#e2ad6c"/>
  <path d="M0 88Q120 44 230 82T400 70V120H0z" fill="#081530"/><path class="dk-dunes__lit" d="M0 88Q120 44 230 82T400 70V120H0z" fill="#c98f4f"/>
</svg>`;
const MORNING = `<div class="dk-sky dk-sky--dawn"></div><div class="dk-sky dk-sky--day"></div>
  <div class="dk-sun"><i class="dk-sun__rays"></i><i class="dk-sun__disc"></i></div>
  <i class="dk-cloud dk-cloud--a"></i><i class="dk-cloud dk-cloud--b"></i>${DUNES}`;
const LENS = [5, 11, 3.5, 12.5, 8, 4, 11.5, 6, 9.5]; // أطوال خيوط الفوانيس (vh)
const lamps = n => Array.from({ length: n }, (_, k) =>
  `<span class="dk-lamp" style="--k:${k};--x:${(((k + 0.5) / n) * 100).toFixed(1)}%;--len:${LENS[k % LENS.length]}">${LAMP}</span>`).join('');

/** تقدّم اليوم؛ يبدأ من جديد كل يوم. */
function today() {
  const a = store.state.adhkar;
  return a && a.day === dayKey() ? a : { day: dayKey() };
}
function sessionState(a, kind, n) {
  const s = (a[kind] ||= { counts: [], done: false });
  for (let i = 0; i < n; i++) s.counts[i] ||= 0;
  return s;
}

export default async function adhkar(el, ctx) {
  const data = await content('adhkar');
  const kind = KINDS.includes(ctx.args[0]) ? ctx.args[0] : '';
  return kind && data[kind]?.length ? session(el, ctx, kind, data[kind]) : hub(el, ctx, data);
}

// ——— «حديقة الأيام»: شجرة تكبر مع كل يوم زيارة، ولا تذبل ———
function tree(days) {
  const n = Math.max(days, 1), leaves = Math.min(n * 3, 120);
  const cx = 160, baseY = 262, trunkH = 44 + Math.min(n, 30) * 3.2, topY = baseY - trunkH;
  const R = 14 + 7.4 * Math.sqrt(leaves), cy = topY - R * 0.5, w = 5 + Math.min(n, 30) * 0.42;
  const greens = ['#3fae7a', '#5fd6a0', '#2f9468', '#8fe0b0'];
  const pos = i => {
    const r = R * Math.sqrt((i + 0.5) / leaves), t = i * 2.39996;
    return [cx + r * Math.cos(t) * 1.18, cy + r * Math.sin(t) * 0.86, t];
  };
  let branches = '', leaf = '', fruit = '';
  const br = Math.min(1 + Math.floor(n / 2), 7);
  for (let b = 0; b < br; b++) {
    const [x, y] = pos(Math.floor(((b + 0.5) / br) * leaves * 0.8));
    branches += `<path d="M${cx} ${topY + 8}Q${cx} ${(topY + y) / 2} ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="#7a5230" stroke-width="${Math.max(w * 0.3, 2).toFixed(1)}" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < leaves; i++) {
    const [x, y, t] = pos(i);
    leaf += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((t * 57.3) % 360).toFixed(0)})"><ellipse class="lf" style="--i:${i}" rx="10.500" ry="6" fill="${greens[i % 4]}"/></g>`;
  }
  for (let f = 0; f < Math.min(Math.floor(n / 7), 12); f++) {
    const [x, y] = pos((f * 13 + 5) % leaves);
    fruit += `<circle class="lf lf--fruit" style="--i:${leaves + f * 6}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.500" fill="#ffd77a" stroke="#fff4cf" stroke-width="1.500"/>`;
  }
  const top = Math.max(Math.floor(cy - R * 1.05 - 14), 0);
  return `<svg viewBox="0 ${top} 320 ${290 - top}" aria-hidden="true">
    <ellipse cx="160" cy="268" rx="118" ry="16" fill="#132652"/><ellipse cx="160" cy="264" rx="92" ry="11" fill="#1e3c6b"/>
    <ellipse class="tree__glow" cx="${cx}" cy="${cy.toFixed(1)}" rx="${(R * 1.3).toFixed(1)}" ry="${(R * 1.02).toFixed(1)}" fill="#5fd6a0" opacity=".14"/>
    <path d="M${cx - w} ${baseY}Q${cx - w * 0.5} ${(baseY + topY) / 2} ${cx - w * 0.38} ${topY}h${(w * 0.76).toFixed(1)}Q${cx + w * 0.5} ${(baseY + topY) / 2} ${cx + w} ${baseY}z" fill="#8a5f38"/>
    ${branches}${leaf}${fruit}
    <path d="M96 264q4-12 8 0M214 264q4-10 8 0M124 268q3-9 6 0" fill="none" stroke="#3fae7a" stroke-width="2.500" stroke-linecap="round"/>
  </svg>`;
}

// ——— صفحة الاختيار ———
function hub(el, { ui, go }, data) {
  const t = ui.adhkar, now = dayPart(), a = today();
  const page = html(`
    <section class="page dk-hub">
      <header class="page__head">
        <a class="backlink" href="#/">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="cards"></div>
      <section class="garden">
        <h2></h2>
        <div class="garden__tree">${tree(store.state.days.length)}</div>
        <p class="garden__count"></p><p class="garden__note"></p>
      </section>
      <p class="dk-hub__src"></p>
    </section>`);
  const $ = s => page.querySelector(s);
  $('.backlink span').textContent = t.back;
  $('h1').textContent = t.title;
  $('.page__head p').textContent = t.sub;
  $('.garden h2').textContent = t.garden;
  $('.garden__count').textContent = fill(t.garden_count, { n: num(Math.max(store.state.days.length, 1)) });
  $('.garden__note').textContent = t.garden_note;
  $('.dk-hub__src').textContent = t.source_note;
  $('.backlink').addEventListener('click', () => sfx.tap());

  (now === 'morning' ? KINDS : [...KINDS].reverse()).forEach((kind, i) => {
    const list = data[kind] || [], s = a[kind];
    const done = s ? list.filter((d, k) => (s.counts[k] || 0) >= d.count).length : 0;
    const card = html(`
      <a class="card dk-pick" href="#/adhkar/${kind}" style="--i:${i}">
        <span class="dk-art dk-art--${kind}">${kind === 'morning' ? `<i class="dk-art__sun"></i>${DUNES}` : `<span class="dk-lamp is-lit">${LAMP}</span>`.repeat(3)}</span>
        <span class="card__tag" hidden></span>
        <span class="card__body"><b></b><small></small></span>
      </a>`);
    card.querySelector('b').textContent = t[kind];
    card.querySelector('small').textContent = t[`${kind}_sub`];
    const tag = card.querySelector('.card__tag');
    if (s?.done) { tag.textContent = `★ ${t.done_today}`; tag.classList.add('is-done'); tag.hidden = false; }
    else if (done) { tag.textContent = fill(t.progress, { i: num(done), n: num(list.length) }); tag.hidden = false; }
    else if (kind === now) { tag.textContent = t.now; tag.hidden = false; }
    card.classList.toggle('is-now', kind === now);
    card.addEventListener('click', e => { e.preventDefault(); sfx.door(); go(card.getAttribute('href'), card); });
    $('.cards').append(card);
  });
  el.append(page);
}

// ——— جلسة الذكر ———
async function session(el, ctx, kind, list) {
  const { ui, lines, go } = ctx, t = ui.adhkar, n = list.length;
  const a = today(), st = sessionState(a, kind, n);
  const wasDone = st.done;
  const isDone = k => st.counts[k] >= list[k].count;
  const firstOpen = () => list.findIndex((d, k) => !isDone(k));
  let i = Math.max(firstOpen(), 0), busy = false, alive = true;

  const root = html(`
    <section class="dk dk--${kind}">
      <div class="dk__scene" aria-hidden="true">${kind === 'morning' ? MORNING : lamps(n)}</div>
      <header class="dk__top">
        <button class="iconbtn dk__close" type="button">${CLOSE}</button>
        <span class="chip dk__step"></span>
      </header>
      <article class="dk__card" aria-live="polite">
        <h2 class="dk__title"></h2><p class="dk__pre"></p><p class="dk__text"></p><p class="dk__src"></p>
      </article>
      <footer class="dk__foot">
        <button class="iconbtn dk__nav dk__nav--prev" type="button">${CHEVRON}</button>
        <button class="dk__count" type="button">
          <svg class="dk__ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="dk__arc" cx="60" cy="60" r="52" pathLength="100"/></svg>
          <b></b>${CHECK}
        </button>
        <button class="iconbtn dk__nav dk__nav--next" type="button">${CHEVRON}</button>
        <p class="dk__hint"></p>
      </footer>
      <div class="dk__end film__overlay" data-kind="end" hidden></div>
    </section>`);
  const $ = s => root.querySelector(s);
  const card = $('.dk__card'), btn = $('.dk__count'), arc = $('.dk__arc'), end = $('.dk__end');
  const lampEls = [...root.querySelectorAll('.dk-lamp')];
  $('.dk__close').setAttribute('aria-label', t.close);
  $('.dk__nav--prev').setAttribute('aria-label', t.prev);
  $('.dk__nav--next').setAttribute('aria-label', t.next);

  const save = () => store.set({ adhkar: a });

  function paintScene() {
    let p = 0;
    list.forEach((d, k) => { p += Math.min(st.counts[k] / d.count, 1); });
    root.style.setProperty('--p', (p / n).toFixed(3));
    lampEls.forEach((l, k) => l.classList.toggle('is-lit', isDone(k)));
    root.classList.toggle('is-complete', firstOpen() < 0);
  }

  function paintCount() {
    const d = list[i], c = Math.min(st.counts[i], d.count), done = c >= d.count;
    arc.style.strokeDashoffset = 100 - (c / d.count) * 100;
    btn.classList.toggle('is-done', done);
    btn.querySelector('b').textContent = num(d.count - c);
    btn.setAttribute('aria-label', done ? t.tap_done : fill(t.counter, { n: num(d.count - c) }));
    $('.dk__hint').textContent = done ? t.tap_done : d.count > 1 ? t.tap : t.tap_once;
    $('.dk__step').textContent = fill(t.progress, { i: num(i + 1), n: num(n) });
    $('.dk__nav--prev').disabled = i === 0;
    $('.dk__nav--next').disabled = i === n - 1;
  }

  function show(k) {
    i = k;
    const d = list[i];
    $('.dk__title').textContent = d.title || ''; $('.dk__title').hidden = !d.title;
    $('.dk__pre').textContent = d.pre || ''; $('.dk__pre').hidden = !d.pre;
    $('.dk__text').textContent = d.text;
    $('.dk__src').textContent = d.source;
    card.classList.toggle('is-quran', !!d.quran);
    card.classList.toggle('is-long', d.text.length > 220);
    card.scrollTop = 0;
    card.classList.remove('is-in'); void card.offsetWidth; card.classList.add('is-in');
    paintCount();
  }

  async function finish() {
    if (!st.done) {
      st.done = true; save();
      const total = { ...store.state.adhkarTotal }; total[kind] = (total[kind] || 0) + 1;
      store.set({ stars: store.state.stars + t.stars_n, adhkarTotal: total });
    }
    sfx.success();
    await wait(reducedMotion() ? 200 : 1900);
    if (alive) showEnd(!wasDone);
  }

  async function showEnd(gained) {
    const siraj = createSiraj({ label: ui.common.siraj });
    const box = html(`
      <div class="fcard fcard--end">
        <div class="fcard__stars">${STAR.repeat(3)}</div>
        <p class="fcard__gain"></p>
        <div class="fcard__btns"><button class="btn" type="button"></button><button class="btn btn--ghost" type="button"></button></div>
      </div>`);
    box.prepend(siraj.el);
    box.querySelector('.fcard__gain').textContent = gained ? fill(t.stars, { n: num(t.stars_n) }) : '';
    const [main, ghost] = box.querySelectorAll('.btn');
    ghost.textContent = t.to_garden;
    ghost.addEventListener('click', () => { sfx.tap(); go('#/adhkar'); });
    if (kind === 'morning') { // أذكار الصباح تفتح «حكاية اليوم»
      const all = (await content('stories')).stories;
      const story = all.find(s => !store.state.completed.includes(s.id)) || all[new Date().getDate() % all.length];
      main.textContent = `${t.story_today}: ${story.title}`;
      main.addEventListener('click', () => { sfx.door(); go(`#/stories/${encodeURIComponent(story.id)}`, main); });
    } else {
      main.textContent = ui.adhkar.back;
      main.addEventListener('click', () => { sfx.tap(); go('#/'); });
    }
    if (!alive) return;
    end.textContent = ''; end.append(box); end.hidden = false; root.classList.add('has-end');
    siraj.say(fill(pick(lines.adhkar_done[kind]), { name: store.state.name }));
    siraj.react('joy');
    if (gained) { await wait(500); sparkle(box.querySelector('.fcard__stars'), { count: 26, power: 6 }); sfx.star(); }
  }

  async function tap() {
    if (busy) return;
    const d = list[i];
    if (isDone(i)) { // مراجعة ذكر مكتمل: انتقل لما بعده
      sfx.tap();
      const next = firstOpen();
      if (next >= 0) show(next); else if (i < n - 1) show(i + 1); else { busy = true; await finish(); busy = false; }
      return;
    }
    st.counts[i]++; save();
    navigator.vibrate?.(12);
    btn.classList.remove('is-tap'); void btn.offsetWidth; btn.classList.add('is-tap');
    paintCount(); paintScene();
    if (st.counts[i] < d.count) { sfx.tap(); sparkle(btn, { count: 5, power: 2.5 }); return; }
    busy = true;
    sfx.star(); sparkle(btn, { count: 20, power: 5 });
    if (lampEls[i]) { await wait(250); sfx.glow(); sparkle(lampEls[i].querySelector('svg'), { count: 12, power: 3 }); }
    else sfx.glow();
    const next = firstOpen();
    if (next < 0) { await finish(); busy = false; return; }
    await wait(reducedMotion() ? 300 : 1100);
    if (alive) show(next);
    busy = false;
  }

  btn.addEventListener('click', tap);
  $('.dk__nav--prev').addEventListener('click', () => { if (!busy && i > 0) { sfx.tap(); show(i - 1); } });
  $('.dk__nav--next').addEventListener('click', () => { if (!busy && i < n - 1) { sfx.tap(); show(i + 1); } });
  $('.dk__close').addEventListener('click', () => { sfx.tap(); go('#/adhkar'); });
  const onKey = e => { if (e.key === 'Escape') go('#/adhkar'); };
  document.addEventListener('keydown', onKey);

  document.body.classList.add('in-film');
  el.append(root);
  paintScene(); show(i);

  return () => { alive = false; document.removeEventListener('keydown', onKey); document.body.classList.remove('in-film'); };
}
