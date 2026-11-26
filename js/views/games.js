// القسم 4: الألعاب التعليمية — صفحة الاختيار + هيكل اللعب المشترك (المستويات، سِراج، النجوم، الاحتفال).
// كل لعبة ملف في js/games/ يرسم لوحته فقط؛ الأسئلة والمستويات من content/games.json.
import { store, content, pick, fill, html, wait, num, reducedMotion } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';
import order from '../games/order.js';
import witness from '../games/witness.js';
import maze from '../games/maze.js';
import blank from '../games/blank.js';
import catchStars from '../games/catch.js';
import map from '../games/map.js';

const GAMES = {
  order: { mount: order, levels: d => d.order_levels },
  witness: { mount: witness, levels: d => d.witness_levels },
  maze: { mount: maze, levels: d => d.hijra_maze.levels },
  blank: { mount: blank, levels: d => d.blank_levels },
  catch: { mount: catchStars, levels: d => d.catch_levels },
  map: { mount: map, levels: d => d.map_levels }
};
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.500" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/></svg>';
const STAR_D = 'M24 3l6.200 13.400 14.600 1.700-10.800 10 2.900 14.400L24 35.300 11.100 42.500 14 28.100 3.200 18.100l14.600-1.700z';
const STAR = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="${STAR_D}" fill="#ffd77a" stroke="#fff4cf" stroke-width="2" stroke-linejoin="round"/></svg>`;

// رسوم بطاقات الألعاب (زخرفة لا محتوى)
const ART = {
  map: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="#d9b77a"/>
    <path d="M90 0l30 60 50 70 40 70h-40l-40-66-50-74L60 0z" fill="#2a6ab0"/><path d="M0 0h110l-20 30L0 26z" fill="#2a6ab0"/>
    <path d="M250 0l70 50v40l-60-50z" fill="#2a6ab0"/>
    <g class="gm-art__float"><path d="M210 70a16 16 0 0 1 32 0c0 14-16 30-16 30s-16-16-16-30z" fill="#e5484d" stroke="#fff4cf" stroke-width="3"/><circle cx="226" cy="70" r="6" fill="#fff4cf"/></g>
    <g fill="#123056" opacity=".55"><circle cx="190" cy="130" r="6"/><circle cx="60" cy="90" r="6"/><circle cx="150" cy="60" r="6"/></g>
    <path d="M190 130Q200 100 226 96" fill="none" stroke="#123056" stroke-width="3" stroke-dasharray="4 6"/>
  </svg>`,
  order: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="#0d3b52"/><circle cx="160" cy="104" r="110" fill="#5fd6c8" opacity=".12"/>
    <g class="gm-art__float"><rect x="62" y="30" width="196" height="40" rx="14" fill="#1e3c6b" stroke="#c9a24a" stroke-width="2.500"/><circle cx="232" cy="50" r="12" fill="#ffd77a"/><path d="M82 50h120" stroke="#8fe0d6" stroke-width="6" stroke-linecap="round" opacity=".7"/></g>
    <g class="gm-art__float gm-art__float--b"><rect x="84" y="82" width="196" height="40" rx="14" fill="#24507d" stroke="#ffd77a" stroke-width="3"/><circle cx="254" cy="102" r="12" fill="#ffd77a"/><path d="M104 102h96" stroke="#fff4cf" stroke-width="6" stroke-linecap="round" opacity=".8"/></g>
    <g class="gm-art__float gm-art__float--c"><rect x="62" y="134" width="196" height="40" rx="14" fill="#1e3c6b" stroke="#c9a24a" stroke-width="2.500"/><circle cx="232" cy="154" r="12" fill="#ffd77a"/><path d="M82 154h108" stroke="#8fe0d6" stroke-width="6" stroke-linecap="round" opacity=".7"/></g>
    <path d="M36 78v48m0-48l-9 11m9-11l9 11m-9 37l-9-11m9 11l9-11" fill="none" stroke="#ffd77a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  witness: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="#1b2a5c"/><circle cx="96" cy="150" r="120" fill="#b9a3ff" opacity=".12"/>
    <path d="M-10 200L70 78q22-30 46 0l44 58 30-26 60 90z" fill="#0c1c3d"/>
    <path d="M70 200q2-52 26-52t26 52z" fill="#050b1c"/><ellipse class="pulse" cx="96" cy="182" rx="16" ry="12" fill="#ffd77a" opacity=".5" style="transform-box:fill-box;transform-origin:center"/>
    <g class="gm-art__float"><rect x="186" y="34" width="96" height="124" rx="16" fill="#24507d" stroke="#ffd77a" stroke-width="3"/><path d="M220 82q0-18 16-18t16 16q0 10-10 14t-8 14" fill="none" stroke="#fff4cf" stroke-width="8" stroke-linecap="round"/><circle cx="233" cy="130" r="5.500" fill="#fff4cf"/></g>
    <path d="M132 96h40m0 0l-10-9m10 9l-10 9" fill="none" stroke="#5fd6c8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 9"/>
  </svg>`,
  maze: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="#10224a"/><circle cx="228" cy="60" r="90" fill="#ffd77a" opacity=".1"/>
    <path d="M40 30h240v140H40zM40 76h56m44 0h60v-46M96 76v48h44m60 0h80M140 124v46M200 124v-10M244 76v48" fill="none" stroke="#6d86c4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M68 150V100h50V54h60v46h44" fill="none" stroke="#ffd77a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 11"/>
    <g class="gm-art__float" transform="translate(222 100)"><circle r="26" fill="#ffd77a" opacity=".3"/><path d="M-7-9q7-11 14 0z" fill="#c9a24a"/><path d="M-8-9H8q6 10 0 20H-8q-6-10 0-20z" fill="#ffd77a" stroke="#c9a24a" stroke-width="2"/><ellipse cy="2" rx="3.500" ry="6" fill="#fff4cf"/></g>
    <path d="M256 60l3.500 7.500 8 1-6 5.500 1.600 8-7.100-4-7.100 4 1.600-8-6-5.500 8-1z" fill="#5fd6c8"/>
  </svg>`,
  blank: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="#3a2356"/><circle cx="160" cy="90" r="120" fill="#ff9ec4" opacity=".1"/>
    <rect x="40" y="26" width="240" height="70" rx="18" fill="#fff4cf" stroke="#ffd77a" stroke-width="3"/>
    <path d="M214 52h44M214 72h30M60 72h40" stroke="#5b4a2a" stroke-width="7" stroke-linecap="round" opacity=".55"/>
    <rect class="pulse" x="118" y="42" width="80" height="24" rx="10" fill="none" stroke="#e08a2e" stroke-width="3.500" stroke-dasharray="7 6" style="transform-box:fill-box;transform-origin:center"/>
    <g class="gm-art__float"><rect x="52" y="112" width="84" height="34" rx="17" fill="#24507d" stroke="#ffd77a" stroke-width="2.500"/><path d="M74 129h40" stroke="#fff4cf" stroke-width="6" stroke-linecap="round"/></g>
    <g class="gm-art__float gm-art__float--b"><rect x="184" y="110" width="84" height="34" rx="17" fill="#ffd77a" stroke="#fff4cf" stroke-width="2.500"/><path d="M206 127h40" stroke="#3a2a05" stroke-width="6" stroke-linecap="round"/></g>
  </svg>`,
  catch: `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="#0b1d45"/><circle cx="160" cy="170" r="110" fill="#ffd77a" opacity=".12"/>
    <g fill="#ffd77a" stroke="#fff4cf" stroke-width="1.500" stroke-linejoin="round"><path class="gm-art__fall" d="M90 26l5 11 12 1.500-9 8 2.500 12L90 52l-10.500 6.500L82 46.500l-9-8 12-1.500z"/><path class="gm-art__fall gm-art__fall--b" d="M222 44l4 9 10 1-7.500 7 2 10-8.500-5-8.500 5 2-10-7.500-7 10-1z"/><path class="gm-art__fall gm-art__fall--c" d="M160 12l3.500 7.500 8 1-6 5.500 1.600 8-7.100-4-7.100 4 1.600-8-6-5.500 8-1z"/></g>
    <g class="gm-art__slide" transform="translate(120 108)"><circle r="34" fill="#ffd77a" opacity=".3"/><circle cy="-27" r="4" fill="none" stroke="#c9a24a" stroke-width="2.500"/><path d="M-11-13q11-18 22 0z" fill="#c9a24a"/><path d="M-12-13H12q9 15 0 30H-12q-9-15 0-30z" fill="#ffd77a" stroke="#c9a24a" stroke-width="2.500"/><ellipse cy="3" rx="5" ry="9" fill="#fff4cf"/></g>
  </svg>`
};

const best = id => store.state.games?.[id] || [];
const unlocked = (id, i, levels) => i === 0 || levels?.[i]?.open || best(id)[i - 1] > 0;

export default async function games(el, ctx) {
  const data = await content('games');
  const [id, n] = ctx.args;
  return GAMES[id] ? play(el, ctx, data, id, n) : hub(el, ctx, data);
}

// ——— صفحة الاختيار ———
function hub(el, { ui, go }, data) {
  const t = ui.games;
  const page = html(`
    <section class="page">
      <header class="page__head">
        <a class="backlink" href="#/">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="cards cards--games"></div>
    </section>`);
  page.querySelector('.backlink span').textContent = t.back;
  page.querySelector('h1').textContent = t.title;
  page.querySelector('.page__head p').textContent = t.sub;
  page.querySelector('.backlink').addEventListener('click', () => sfx.tap());
  t.list.filter(g => GAMES[g.id]).forEach((g, i) => {
    const total = GAMES[g.id].levels(data).length * 3;
    const got = best(g.id).reduce((a, b) => a + (b || 0), 0);
    const card = html(`
      <a class="card gm-pick gm-pick--${g.id}" href="#/games/${g.id}" style="--i:${i}">
        <span class="gm-art">${ART[g.id]}</span>
        <span class="card__tag"></span>
        <span class="card__body"><b></b><small></small></span>
      </a>`);
    card.querySelector('b').textContent = g.title;
    card.querySelector('small').textContent = g.sub;
    const tag = card.querySelector('.card__tag');
    tag.textContent = got ? `★ ${fill(t.stars_of, { n: num(got), m: num(total) })}` : t.new;
    tag.classList.toggle('is-done', got > 0);
    card.addEventListener('click', e => { e.preventDefault(); sfx.door(); go(card.getAttribute('href'), card); });
    page.querySelector('.cards').append(card);
  });
  el.append(page);
}

// ——— هيكل اللعب ———
async function play(el, ctx, data, id, n) {
  const { ui, lines, go } = ctx, t = ui.games, game = GAMES[id];
  const levels = game.levels(data), meta = t.list.find(g => g.id === id);
  const [stories, scenes, library] = await Promise.all([content('stories'), content('scenes'), content('library')]);

  let idx = Number.isInteger(+n) && +n >= 1 && +n <= levels.length ? +n - 1 : levels.findIndex((_, i) => !best(id)[i]);
  if (idx < 0) idx = levels.length - 1;
  while (!unlocked(id, idx, levels)) idx--;

  const siraj = createSiraj({ label: ui.common.siraj });
  const root = html(`
    <section class="page gm gm--${id}">
      <header class="gm__top">
        <a class="backlink" href="#/games">${CHEVRON}<span></span></a>
        <h1></h1>
        <nav class="gm__levels"></nav>
      </header>
      <div class="gm__guide"></div>
      <div class="gm__board"></div>
      <div class="gm__end" hidden></div>
    </section>`);
  const $ = s => root.querySelector(s);
  const board = $('.gm__board'), end = $('.gm__end'), nav = $('.gm__levels');
  $('.backlink span').textContent = t.back_games;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = meta.title;
  $('.gm__guide').append(siraj.el);
  nav.setAttribute('aria-label', t.levels_label);
  siraj.lantern.addEventListener('click', () => { sfx.star(); siraj.react('joy'); sparkle(siraj.lantern, { count: 8, power: 3 }); });

  let alive = true, stop = null;
  const vars = { name: store.state.name };

  function paintLevels() {
    nav.textContent = '';
    levels.forEach((_, i) => {
      const open = unlocked(id, i, levels), s = best(id)[i] || 0;
      const a = html(`<a class="gm__lvl" href="#/games/${id}/${i + 1}"><b></b><i>${'<u></u>'.repeat(3)}</i></a>`);
      if (open) a.querySelector('b').textContent = num(i + 1); else a.querySelector('b').innerHTML = LOCK;
      a.querySelectorAll('u').forEach((u, k) => u.classList.toggle('is-on', k < s));
      a.classList.toggle('is-current', i === idx);
      a.classList.toggle('is-locked', !open);
      a.setAttribute('aria-label', fill(open ? t.level : t.level_locked, { n: num(i + 1) }));
      if (i === idx) a.setAttribute('aria-current', 'true');
      a.addEventListener('click', e => {
        if (!open || i === idx) { e.preventDefault(); if (!open) { sfx.oops(); a.classList.remove('is-shake'); void a.offsetWidth; a.classList.add('is-shake'); } return; }
        sfx.tap();
      });
      nav.append(a);
    });
  }

  const api = {
    level: levels[idx], data, stories: stories.stories, scenes, library, t: t[id], ui, vars,
    alive: () => alive,
    say: (text, extra = {}) => siraj.say(fill(text, { ...vars, ...extra })),
    cheer() { siraj.react('joy'); },
    oops(extra = '') { sfx.oops(); siraj.react('shy'); siraj.say(`${pick(lines.encourage)} ${extra}`.trim()); },
    win
  };

  function start() {
    if (stop) stop();
    board.textContent = ''; end.hidden = true; end.textContent = ''; root.classList.remove('has-end');
    stop = game.mount(board, api) || null;
  }

  async function win(stars) {
    const prev = best(id)[idx] || 0, gain = Math.max(stars - prev, 0);
    if (gain) {
      const list = [...best(id)]; list[idx] = stars;
      for (let i = 0; i < list.length; i++) list[i] ||= 0;
      store.set({ games: { ...store.state.games, [id]: list }, stars: store.state.stars + gain });
    }
    paintLevels();
    sfx.success();
    sparkle(board, { count: 30, power: 7 });
    await wait(reducedMotion() ? 200 : 1100);
    if (!alive) return;

    const last = idx === levels.length - 1;
    const guide = createSiraj({ label: ui.common.siraj });
    const box = html(`
      <div class="fcard fcard--end">
        <div class="fcard__stars">${STAR.repeat(3)}</div>
        <p class="fcard__gain"></p>
        <p class="gm__done"></p>
        <div class="fcard__btns"><button class="btn" type="button"></button><button class="btn btn--ghost" type="button"></button></div>
      </div>`);
    box.prepend(guide.el);
    box.querySelectorAll('.fcard__stars svg').forEach((s, k) => s.classList.toggle('is-off', k >= stars));
    box.querySelector('.fcard__gain').textContent = gain ? t.gain[gain] : '';
    box.querySelector('.gm__done').textContent = last ? t.finished : '';
    const [main, ghost] = box.querySelectorAll('.btn');
    main.textContent = last ? t.again : t.next;
    main.addEventListener('click', () => { sfx.tap(); if (last) start(); else go(`#/games/${id}/${idx + 2}`); });
    ghost.textContent = t.more;
    ghost.addEventListener('click', () => { sfx.tap(); go('#/games'); });
    if (!last) { // إعادة المستوى نفسه لتحسين النجوم
      const again = html('<button class="gm__again" type="button"></button>');
      again.textContent = t.again;
      again.addEventListener('click', () => { sfx.tap(); start(); });
      box.append(again);
    }
    end.textContent = ''; end.append(box); end.hidden = false; root.classList.add('has-end');
    guide.say(fill(pick(lines.celebrate), vars)); guide.react('joy');
    main.focus({ preventScroll: true });
    await wait(450);
    if (alive) { sparkle(box.querySelector('.fcard__stars'), { count: 32, power: 7 }); sfx.star(); }
  }

  paintLevels();
  el.append(root);
  start();

  return () => { alive = false; if (stop) stop(); };
}
