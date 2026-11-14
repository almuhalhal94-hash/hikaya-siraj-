// القسم 5: بيت سِراج — يلمسه الطفل فيتوهج ويتكلم، يسأله ماذا يفعل اليوم، يتذكر آخر حكاية، ويتغيّر مع الصباح والمساء.
// الطفل يزيّن البيت بزينة تُفتح بعدد نجومه (لا تُنفق النجوم). كل الردود من content/siraj.json.
import { store, pick, fill, html, num, dayPart } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LOCK = '<svg class="hs__lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.500" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/></svg>';
const DECOR = {
  star: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l6.200 13.400 14.600 1.700-10.800 10 2.900 14.400L24 35.300 11.100 42.500 14 28.100 3.200 18.100l14.600-1.700z" fill="#ffd77a" stroke="#fff4cf" stroke-width="2" stroke-linejoin="round"/></svg>',
  crescent: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 5a19 19 0 1 0 13 30A16 16 0 0 1 30 5z" fill="#fff4cf" stroke="#ffd77a" stroke-width="2" stroke-linejoin="round"/></svg>',
  palm: '<svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke-linecap="round"><path d="M24 46q3-16-1-28" stroke="#b98a52" stroke-width="5"/><g stroke="#5fd6a0" stroke-width="3.500"><path d="M23 18q-10-9-19-2M23 18q-12-1-16 10M23 18q-4-11-14-13M23 18q10-9 20-3M23 18q12-2 17 9M23 18q5-11 14-12"/></g></g><circle cx="20" cy="21" r="2.500" fill="#ffb35c"/><circle cx="27" cy="22" r="2.500" fill="#ffb35c"/></svg>',
  lamp: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="6" r="3" fill="none" stroke="#c9a24a" stroke-width="2"/><path d="M15 17q9-13 18 0z" fill="#c9a24a"/><path d="M15 17h18q7 11 0 23H15q-7-12 0-23z" fill="#ffcf6b" stroke="#c9a24a" stroke-width="2"/><ellipse cx="24" cy="29" rx="4" ry="7" fill="#fff8dc"/><path d="M16 40h16l-3 5H19z" fill="#c9a24a"/></svg>'
};
const GLOWS = ['#ffd77a', '#ffb86b', '#8fe0d6', '#b9a3ff', '#ff9ec4'];

export default async function house(el, { ui, lines, go }) {
  const t = ui.house, part = dayPart(), vars = { name: store.state.name };
  const siraj = createSiraj({ label: ui.common.siraj });
  const root = html(`
    <section class="page hs hs--${part}">
      <header class="page__head">
        <a class="backlink" href="#/">${CHEVRON}<span></span></a>
        <h1></h1><p></p>
      </header>
      <div class="hs__room" role="group">
        <div class="hs__window" aria-hidden="true"><i class="hs__orb"></i><i class="hs__wstar"></i><i class="hs__wstar"></i><i class="hs__wstar"></i><i class="hs__wstar"></i></div>
        <div class="hs__shelf" aria-hidden="true"></div>
        <div class="hs__rug" aria-hidden="true"></div>
        <div class="hs__decor"></div>
        <div class="hs__siraj"></div>
      </div>
      <div class="hs__ask"><h2></h2><div class="hs__opts"></div></div>
      <section class="hs__tray">
        <header><h2></h2><span class="chip hs__stars"></span></header>
        <div class="hs__items"></div>
        <p class="hs__hint" aria-live="polite"></p>
      </section>
    </section>`);
  const $ = s => root.querySelector(s);
  const room = $('.hs__room'), decor = $('.hs__decor'), hint = $('.hs__hint'), items = $('.hs__items');
  $('.backlink span').textContent = t.back;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = t.title;
  $('.page__head p').textContent = t.sub;
  room.setAttribute('aria-label', t.room_label);
  $('.hs__siraj').append(siraj.el);
  $('.hs__tray h2').textContent = t.decor_title;
  $('.hs__stars').textContent = `★ ${fill(t.stars, { n: num(store.state.stars) })}`;

  // ——— سِراج: لمس، توهج، كلام ———
  let touches = 0, timer = 0;
  siraj.lantern.addEventListener('click', e => {
    e.stopPropagation();
    touches++;
    siraj.lantern.style.setProperty('--sj-glow', GLOWS[touches % GLOWS.length]);
    sfx.star(); siraj.react('joy'); sparkle(siraj.lantern, { count: 12, power: 4 });
    siraj.say(fill(pick(lines.on_touch), vars));
  });
  siraj.say(fill(pick(lines.greetings[part]), vars));
  if (store.state.lastStory) {
    timer = setTimeout(() => { siraj.say(fill(pick(lines.remember_story), { ...vars, story: `«${store.state.lastStory}»` })); siraj.react('joy'); }, 5200);
  }

  // ——— «وش تحب نسوي اليوم؟» ———
  $('.hs__ask h2').textContent = fill(lines.ask_today.question, vars);
  lines.ask_today.options.forEach((o, i) => {
    const b = html(`<button class="hs__opt hs__opt--${o.go}" type="button" style="--i:${i}"></button>`);
    b.textContent = o.text;
    b.addEventListener('click', () => { sfx.door(); go(`#/${o.go}`, b); });
    $('.hs__opts').append(b);
  });

  // ——— الزينة ———
  let chosen = null;
  const placed = () => store.state.house || [];
  const nameOf = id => t.items.find(x => x.id === id)?.name || '';

  function paintDecor(popIndex = -1) {
    decor.textContent = '';
    placed().forEach((d, i) => {
      if (!DECOR[d.t]) return;
      const b = html(`<button class="hs__piece hs__piece--${d.t}" type="button" style="left:${d.x}%;top:${d.y}%;--r:${((i * 37) % 21) - 10}deg;--d:${(i % 5) * -0.7}s">${DECOR[d.t]}</button>`);
      b.setAttribute('aria-label', fill(t.remove_label, { item: nameOf(d.t) }));
      if (i === popIndex) b.classList.add('is-new');
      b.addEventListener('click', e => {
        e.stopPropagation();
        store.set({ house: placed().filter((_, k) => k !== i) });
        sfx.flip(); hint.textContent = t.removed; paintDecor();
      });
      decor.append(b);
    });
  }

  function choose(item, btn) {
    if (store.state.stars < item.need) {
      sfx.oops(); siraj.react('shy');
      hint.textContent = fill(t.locked, { item: item.name, n: num(item.need) });
      btn.classList.remove('is-shake'); void btn.offsetWidth; btn.classList.add('is-shake');
      return;
    }
    chosen = chosen === item.id ? null : item.id;
    sfx.tap();
    items.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === chosen));
    room.classList.toggle('is-placing', !!chosen);
    hint.textContent = chosen ? fill(t.place_hint, { item: item.name }) : t.pick_hint;
  }

  t.items.forEach((item, i) => {
    const open = store.state.stars >= item.need;
    const b = html(`<button class="hs__item${open ? '' : ' is-locked'}" type="button" data-id="${item.id}" aria-pressed="false" style="--i:${i}">${DECOR[item.id] || ''}<b></b>${open ? '' : `<small>${LOCK}<span></span></small>`}</button>`);
    b.querySelector('b').textContent = item.name;
    if (!open) b.querySelector('small span').textContent = `★ ${num(item.need)}`;
    b.addEventListener('click', () => choose(item, b));
    items.append(b);
  });
  hint.textContent = t.pick_hint;

  room.addEventListener('click', e => {
    if (!chosen) return;
    if (placed().length >= t.max) { sfx.oops(); hint.textContent = t.full; return; }
    const b = room.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((e.clientX - b.left) / b.width) * 100));
    const y = Math.min(92, Math.max(6, ((e.clientY - b.top) / b.height) * 100));
    store.set({ house: [...placed(), { t: chosen, x: +x.toFixed(1), y: +y.toFixed(1) }] });
    paintDecor(placed().length - 1);
    sfx.star(); sparkle({ x: e.clientX, y: e.clientY }, { count: 10, power: 3 });
    siraj.react('joy'); hint.textContent = t.placed;
  });

  paintDecor();
  el.append(root);
  return () => clearTimeout(timer);
}
