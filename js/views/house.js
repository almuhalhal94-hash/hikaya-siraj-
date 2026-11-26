// القسم 5: بيت سِراج — يلمسه الطفل فيتوهج ويتكلم، يسأله ماذا يفعل اليوم، يتذكر آخر حكاية، ويتغيّر مع الصباح والمساء.
// «خزانة الشهود»: كل حكاية يقرؤها الطفل يسكن شاهدها رفوف البيت، فيلمسه فيزوره ويذكّره بدرسه.
// كل الردود من content/siraj.json ونصوص الخزانة من ui.house؛ الشهود من scenes.json ورسومهم من witness-art.js.
import { store, pick, fill, html, num, dayPart, content } from '../core.js';
import { createWitness } from '../film/witness.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
        <div class="hs__guest"></div>
        <div class="hs__siraj"></div>
      </div>
      <div class="hs__ask"><h2></h2><div class="hs__opts"></div></div>
      <section class="hs-cab">
        <header><h2></h2><span class="chip hs-cab__count"></span></header>
        <div class="hs-cab__tabs" role="tablist"></div>
        <div class="hs-cab__grid"></div>
        <div class="hs-cab__info" aria-live="polite"><p></p><a class="btn" hidden></a></div>
      </section>
    </section>`);
  const $ = s => root.querySelector(s);
  const room = $('.hs__room'), guest = $('.hs__guest'), grid = $('.hs-cab__grid'), info = $('.hs-cab__info p'), go2 = $('.hs-cab__info a');
  $('.backlink span').textContent = t.back;
  $('.backlink').addEventListener('click', () => sfx.tap());
  $('h1').textContent = t.title;
  $('.page__head p').textContent = t.sub;
  room.setAttribute('aria-label', t.room_label);
  $('.hs__siraj').append(siraj.el);
  $('.hs-cab h2').textContent = t.cab_title;

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

  // ——— خزانة الشهود ———
  const [scenes, lib, data] = await Promise.all([content('scenes'), content('library'), content('stories')]);
  const byId = Object.fromEntries(data.stories.map(x => [x.id, x]));
  const read = new Set(store.state.completed);
  const shelves = lib.shelves.map(sh => ({ ...sh, items: sh.items.map((it, k) => ({ ...it, n: k + 1 })).filter(it => byId[it.story] && scenes[it.story]?.witness) })).filter(sh => sh.items.length);
  const all = shelves.flatMap(sh => sh.items), got = all.filter(it => read.has(it.story)).length;
  $('.hs-cab__count').textContent = fill(t.cab_count, { i: num(got), n: num(all.length) });
  let live = [], visitor = null;

  function visit(it, cell) { // الشاهد يزور الغرفة ويذكّر بدرسه
    const st = byId[it.story];
    visitor?.destroy();
    visitor = createWitness(scenes[it.story].witness);
    guest.append(visitor.el); visitor.setMood('happy');
    requestAnimationFrame(() => visitor?.show(true));
    room.scrollIntoView({ behavior: 'smooth', block: 'center' });
    sfx.glow(); sparkle(cell, { count: 12, power: 3 }); siraj.react('joy');
    siraj.say(fill(t.cab_says, { witness: st.witness, lesson: st.lesson }));
    info.textContent = st.title;
    go2.textContent = t.cab_again; go2.hidden = false; go2.href = `#/stories/${encodeURIComponent(st.id)}`;
    const met = store.state.met || [];
    if (!met.includes(st.id)) store.set({ met: [...met, st.id] });
  }

  function paintShelf(id) {
    live.forEach(w => w.destroy()); live = []; grid.textContent = '';
    const sh = shelves.find(x => x.id === id) || shelves[0];
    store.set({ shelf: sh.id });
    $('.hs-cab__tabs').querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.id === sh.id)));
    sh.items.forEach((it, k) => {
      const has = read.has(it.story);
      const cell = html(`<button class="hs-cab__cell${has ? '' : ' is-locked'}" type="button" style="--i:${k}"><span class="hs-cab__pic"></span><b></b></button>`);
      cell.querySelector('b').textContent = has ? byId[it.story].witness : num(it.n);
      if (has) {
        const w = createWitness(scenes[it.story].witness);
        cell.querySelector('.hs-cab__pic').append(w.el); w.show(true); live.push(w);
        cell.setAttribute('aria-label', byId[it.story].witness);
        cell.addEventListener('click', () => visit(it, cell));
      } else {
        cell.querySelector('.hs-cab__pic').textContent = '؟';
        cell.setAttribute('aria-label', fill(t.cab_locked, { n: num(it.n), name: it.name }));
        cell.addEventListener('click', () => {
          sfx.oops(); siraj.react('shy');
          siraj.say(fill(t.cab_locked, { n: num(it.n), name: it.name }));
          info.textContent = ''; go2.textContent = t.cab_read; go2.hidden = false; go2.href = `#/stories/${encodeURIComponent(it.story)}`;
        });
      }
      grid.append(cell);
    });
    info.textContent = got ? t.cab_hint : t.cab_empty; go2.hidden = true;
  }

  shelves.forEach(sh => {
    const n = sh.items.filter(it => read.has(it.story)).length;
    const b = html(`<button class="hs-cab__tab" type="button" role="tab" data-id="${sh.id}"><span></span> <small></small></button>`);
    b.querySelector('span').textContent = sh.title.replace(/^قصص /, '');
    b.querySelector('small').textContent = `${num(n)}/${num(sh.items.length)}`;
    b.addEventListener('click', () => { sfx.tap(); paintShelf(sh.id); });
    $('.hs-cab__tabs').append(b);
  });
  paintShelf(store.state.shelf);
  go2.addEventListener('click', e => { e.preventDefault(); sfx.door(); go(go2.getAttribute('href'), go2); });

  el.append(root);
  return () => { clearTimeout(timer); live.forEach(w => w.destroy()); visitor?.destroy(); };
}
