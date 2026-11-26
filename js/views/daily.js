// «أذكار يومي»: أذكار مواقف اليوم من «حصن المسلم» (الاستيقاظ، الخلاء، الوضوء، اللباس، البيت، الطعام، المطر، النوم…).
// النصوص من content/daily.json (يولّده tools/daily_build.py) ولا نص ذكر في الكود. ما قاله الطفل اليوم في store.state.daily.
import { store, content, fill, html, num, dayKey } from '../core.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
const CHECK = '<svg class="dy-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const S = 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  sun: `<circle cx="24" cy="26" r="8" fill="currentColor"/><path ${S} d="M24 8v5M24 39v5M6 26h5M37 26h5M11 13l3.5 3.5M37 13l-3.5 3.5"/>`,
  door: `<path ${S} d="M13 42V9h22v33M8 42h32"/><circle cx="29" cy="26" r="2" fill="currentColor"/>`,
  drop: `<path d="M24 6c8 11 12 17 12 23a12 12 0 0 1-24 0c0-6 4-12 12-23z" fill="currentColor"/><path d="M19 30a5 5 0 0 0 5 5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`,
  shirt: `<path ${S} d="M17 8l-9 6 4 7 4-2v21h16V19l4 2 4-7-9-6q-3 5-7 5t-7-5z"/>`,
  home: `<path ${S} d="M7 22L24 8l17 14M12 19v22h24V19"/><path ${S} d="M20 41V29h8v12"/>`,
  car: `<path ${S} d="M7 31v-6l5-10h24l5 10v6zM7 31v5h6v-5M35 31v5h6v-5M12 25h24"/>`,
  mosque: `<path ${S} d="M12 41V25q0-10 12-14 12 4 12 14v16zM6 41h36M24 11V5M41 41V17M7 41V17"/><path ${S} d="M20 41v-7a4 4 0 0 1 8 0v7"/>`,
  call: `<path ${S} d="M12 20v8M18 15v18M24 10v28M30 15v18M36 20v8"/>`,
  plate: `<ellipse cx="24" cy="30" rx="18" ry="8" ${S}/><path ${S} d="M14 28q10-14 20 0"/><path ${S} d="M24 10v6"/>`,
  sneeze: `<circle cx="24" cy="24" r="15" ${S}/><path ${S} d="M17 20h3M28 20h3M18 30q6 4 12 0"/>`,
  heart: `<path d="M24 40S8 30 8 19a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 21-16 21z" fill="currentColor"/>`,
  flame: `<path d="M24 42c-8 0-13-6-13-13 0-8 7-11 8-19 4 3 6 7 6 11 2-2 3-4 3-7 6 4 9 10 9 15 0 7-5 13-13 13z" fill="currentColor"/>`,
  circle: `<circle cx="24" cy="24" r="6" fill="currentColor"/><circle cx="24" cy="9" r="3.5" fill="currentColor"/><circle cx="24" cy="39" r="3.5" fill="currentColor"/><circle cx="9" cy="24" r="3.5" fill="currentColor"/><circle cx="39" cy="24" r="3.5" fill="currentColor"/>`,
  rain: `<path d="M13 26a8 8 0 0 1 2-15.6A10 10 0 0 1 34 12a7 7 0 0 1 1 14z" fill="currentColor"/><path ${S} d="M16 32l-2 6M24 32l-2 6M32 32l-2 6"/>`,
  bolt: `<path d="M13 22a8 8 0 0 1 2-14A10 10 0 0 1 34 9a7 7 0 0 1 1 13z" fill="currentColor" opacity=".55"/><path d="M26 20l-8 13h7l-3 11 10-15h-7z" fill="currentColor"/>`,
  wind: `<path ${S} d="M6 18h22a5 5 0 1 0-5-5M6 26h30a5 5 0 1 1-5 5M6 34h14"/>`,
  moon: `<path d="M30 8a16 16 0 1 0 11 26A13 13 0 0 1 30 8z" fill="currentColor"/>`,
  stars: `<path d="M27 8a15 15 0 1 0 13 22A12 12 0 0 1 27 8z" fill="currentColor"/><path d="M37 8l1.5 3.5L42 13l-3.5 1.5L37 18l-1.5-3.5L32 13l3.5-1.5z" fill="currentColor"/>`
};
export const icon = k => `<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[k] || ICONS.sun}</svg>`;

function todaySaid() { const d = store.state.daily; return d?.day === dayKey() ? d.said || [] : []; }

export default async function daily(el, { ui, go }) {
  const t = ui.adhkar.daily, data = await content('daily');
  const page = html(`
    <section class="page dy">
      <header class="page__head">
        <a class="backlink" href="#/adhkar">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <span class="chip dy__count"></span>
      <div class="dy__grid"></div>
      <p class="dy__src"></p>
      <div class="dy-sheet" hidden><div class="dy-sheet__card" role="dialog" aria-modal="true">
        <button class="iconbtn dy-sheet__close" type="button">${CLOSE}</button>
        <h2></h2><div class="dy-sheet__body"></div>
        <button class="btn dy-sheet__said" type="button"></button>
      </div></div>
    </section>`);
  const $ = q => page.querySelector(q);
  $('.backlink span').textContent = ui.adhkar.title;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = t.title; $('.page__head p').textContent = t.sub;
  $('.dy__src').textContent = t.source;
  $('.dy-sheet__close').setAttribute('aria-label', t.close);
  const sheet = $('.dy-sheet'), body = $('.dy-sheet__body'), said = $('.dy-sheet__said');
  let open = null;

  const paintCount = () => { $('.dy__count').textContent = fill(t.count, { n: num(todaySaid().length) }); };
  const tiles = data.groups.map((g, i) => {
    const b = html(`<button class="dy-tile dy-tile--${g.icon}" type="button" style="--i:${i}">${icon(g.icon)}<b></b>${CHECK}</button>`);
    b.querySelector('b').textContent = g.title;
    b.classList.toggle('is-said', todaySaid().includes(g.id));
    b.addEventListener('click', () => show(g));
    $('.dy__grid').append(b);
    return b;
  });

  function show(g) {
    open = g; sfx.door();
    $('.dy-sheet h2').textContent = g.title; body.textContent = '';
    g.items.forEach(it => {
      const box = html(`<div class="dy-item"></div>`);
      const add = (cls, txt) => { const p = document.createElement('p'); p.className = cls; p.textContent = txt; box.append(p); return p; };
      if (it.note) add('dy-item__note', it.note);
      if (it.pre) add('dy-item__text', it.pre);
      if (it.quran) { add('dy-item__quran', `﴿${it.quran}﴾`); add('dy-item__ref', it.ref); }
      if (it.text) add('dy-item__text', it.text);
      (it.lines || []).forEach(([label, txt]) => { const p = add('dy-item__line', ''); const l = document.createElement('small'); l.textContent = label; const x = document.createElement('span'); x.textContent = txt; p.append(l, x); });
      if (it.surahs) {
        const row = html(`<div class="dy-item__surahs"></div>`);
        it.surahs.forEach(n => { const a = html(`<a class="chip" href="#/quran/${n}"></a>`); a.textContent = t.surah[n] || num(n); a.addEventListener('click', e => { e.preventDefault(); go(`#/quran/${n}`); }); row.append(a); });
        box.append(row);
      }
      if (it.count > 1) add('dy-item__count', fill(t.times, { n: num(it.count) }));
      add('dy-item__src', it.source);
      body.append(box);
    });
    const done = todaySaid().includes(g.id);
    said.textContent = done ? t.said_yes : t.said; said.classList.toggle('is-done', done);
    sheet.hidden = false; body.scrollTop = 0;
    requestAnimationFrame(() => sheet.classList.add('is-open'));
  }
  function hide() { sheet.classList.remove('is-open'); sheet.hidden = true; open = null; }
  $('.dy-sheet__close').addEventListener('click', () => { sfx.tap(); hide(); });
  sheet.addEventListener('click', e => { if (e.target === sheet) hide(); });
  said.addEventListener('click', () => {
    if (!open) return;
    const list = todaySaid(), g = open;
    if (!list.includes(g.id)) {
      store.set({ daily: { day: dayKey(), said: [...list, g.id] } });
      sfx.star(); sparkle(said, { count: 18, power: 4 });
    }
    tiles[data.groups.indexOf(g)].classList.add('is-said');
    said.textContent = t.said_yes; said.classList.add('is-done'); paintCount();
    setTimeout(() => { if (open === g) hide(); }, 900);
  });
  const onKey = e => { if (e.key === 'Escape' && open) hide(); };
  document.addEventListener('keydown', onKey);
  paintCount();
  el.append(page);
  return () => document.removeEventListener('keydown', onKey);
}
