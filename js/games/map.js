// لعبة «أين حدثت؟»: تظهر لقطة من حكاية، ويلمس الطفل مكانها على خريطة مبسّطة (جزيرة العرب وما حولها).
// الأماكن والأسئلة والمستويات من content/games.json (map_places، map_questions، map_levels)؛ الخريطة رسم تقريبي بلا حدود دول.
import { fill, html, wait } from '../core.js';
import { thumbnail } from '../film/engine.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';
import { shuffled } from './order.js';
import { choose, mark } from './memory.js';

const LAND = '#d9b77a', SEA = '#2a6ab0';
const MAP = `
  <rect width="400" height="440" fill="${LAND}"/>
  <g fill="${SEA}">
    <path d="M0 0h176l-8 70-48 10L0 72z"/>
    <path d="M150 116l22 18 30 72 46 82 40 80 12 40-16 10-16-40-38-80-40-76-30-62z"/>
    <path d="M168 134l14 6 4 26-10-4z"/>
    <path d="M326 146l30 10 40 70v26l-12-6-34-46-26-30z"/>
    <path d="M400 330v110H300l14-22 38-6 30-40z"/>
  </g>
  <path d="M40 440q24-140 52-300t20-70" fill="none" stroke="${SEA}" stroke-width="5" stroke-linecap="round"/>
  <g fill="none" stroke="#c49a58" stroke-width="2" stroke-dasharray="2 7" opacity=".7"><path d="M220 250q60 30 120 20M180 320q40-20 70 10M300 180q30 30 70 10"/></g>
  <g fill="#fff" opacity=".18"><path d="M40 20q20-8 40 0M100 30q16-6 30 0M360 400q14-6 28 0"/></g>`;

export default function map(board, api) {
  const { level, data, t, scenes, stories } = api;
  const byId = Object.fromEntries(stories.map(s => [s.id, s]));
  const qs = data.map_questions.filter(q => byId[q.story]);
  const pool = level.random ? choose('map', qs, level.random, q => q.story) : shuffled(qs.filter(q => level.stories.includes(q.story)));
  const places = level.places === 'all' ? data.map_places : data.map_places.filter(p => level.places.includes(p.id));
  let r = 0, mistakes = 0, miss = false, busy = false;

  const root = html(`
    <div class="mp">
      <div class="wt__dots" aria-hidden="true">${'<i></i>'.repeat(pool.length)}</div>
      <figure class="mp__card"><div class="mp__art"></div><figcaption></figcaption></figure>
      <div class="mp__frame"><svg class="mp__svg" viewBox="0 0 400 440" role="group">${MAP}<g class="mp__pins"></g></svg></div>
      <p class="mp__why" aria-live="polite"></p>
      <button class="btn mp__next" type="button" hidden></button>
    </div>`);
  const $ = q => root.querySelector(q);
  const dots = [...root.querySelectorAll('.wt__dots i')], pins = {};
  $('.mp__svg').setAttribute('aria-label', t.board_label);
  $('.mp__next').textContent = t.next;
  places.forEach(p => {
    const left = p.x > 300;
    const g = html(`<svg><g class="mp__pin" tabindex="0" role="button" transform="translate(${p.x} ${p.y})">
      <circle class="mp__hit" r="22"/><circle class="mp__ring" r="13"/><circle class="mp__dot" r="7"/>
      <text class="mp__name" x="${left ? -16 : 16}" y="5" text-anchor="${left ? 'start' : 'end'}"></text></g></svg>`).firstElementChild;
    g.querySelector('text').textContent = p.name;
    g.setAttribute('aria-label', p.name);
    const tap = () => answer(p, g);
    g.addEventListener('click', tap);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } });
    $('.mp__pins').append(g); pins[p.id] = g;
  });

  function show() {
    const q = pool[r], st = byId[q.story], dir = scenes[q.story], spec = dir?.scenes?.[dir.thumb || 0];
    dots.forEach((d, k) => { d.classList.toggle('is-done', k < r); d.classList.toggle('is-now', k === r); });
    $('.mp__art').innerHTML = spec ? thumbnail(spec) : '';
    $('.mp__card figcaption').textContent = st.title;
    $('.mp__card').classList.remove('is-in'); void $('.mp__card').offsetWidth; $('.mp__card').classList.add('is-in');
    Object.values(pins).forEach(g => g.classList.remove('is-right', 'is-wrong'));
    $('.mp__why').textContent = ''; $('.mp__next').hidden = true; busy = false;
    api.say(t.ask, { title: st.title });
  }

  async function answer(p, g) {
    if (busy) return;
    const q = pool[r];
    if (p.id !== q.place) {
      mistakes++; miss = true;
      g.classList.remove('is-wrong'); void g.getBoundingClientRect(); g.classList.add('is-wrong');
      api.oops(t.wrong); return;
    }
    busy = true; mark('map', q.story, !miss); miss = false;
    g.classList.add('is-right'); sfx.star(); api.cheer();
    const b = g.getBoundingClientRect(); sparkle({ x: b.left + b.width / 2, y: b.top + b.height / 2 }, { count: 14, power: 4 });
    $('.mp__why').textContent = q.why; api.say(q.why);
    if (r === pool.length - 1) {
      dots.forEach(d => d.classList.add('is-done'));
      await wait(1600); if (!api.alive()) return;
      api.win(mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1); return;
    }
    $('.mp__next').hidden = false; $('.mp__next').focus({ preventScroll: true });
  }
  $('.mp__next').addEventListener('click', () => { sfx.tap(); r++; show(); });

  board.append(root);
  show();
}
