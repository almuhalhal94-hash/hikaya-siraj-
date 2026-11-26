// القسم 5: بيت سِراج — يلمسه الطفل فيتوهج ويتكلم، يسأله ماذا يفعل اليوم، يتذكر آخر حكاية، ويتغيّر مع الصباح والمساء.
// «خزانة الشهود»: كل حكاية يقرؤها الطفل يسكن شاهدها رفوف البيت، فيلمسه فيزوره ويذكّره بدرسه.
// والتزيين في ثلاث مساحات (الغرفة، الحديقة، السطح) عبر استوديو بالعرض في house-decor.js، ومزاح سِراج: دغدغة ودوخة، ألغاز، غميضة، وأصدقاء البيت.
// كل الردود من content/siraj.json (ومنها house) ونصوص الخزانة والزينة من ui.house؛ الشهود من scenes.json ورسومهم من witness-art.js.
import { store, pick, fill, html, num, dayPart, content } from '../core.js';
import { decorState, paintSpace, openStudio, petLine } from './house-decor.js';
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
      <div class="hs__spaces" role="tablist"></div>
      <div class="hs__room hsr" role="group">
        <div class="sp-base"></div><div class="sp-items"></div>
        <div class="hs__guest"></div>
        <div class="hs__peek" hidden></div><div class="hs__spots" hidden></div>
        <div class="hs__siraj"></div>
        <button class="btn hs__decorate" type="button"></button>
      </div>
      <div class="hs__say"></div>
      <div class="hs__play"><button class="hs__fun hs__fun--riddle" type="button"></button><button class="hs__fun hs__fun--hide" type="button"></button></div>
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
  $('.hs__say').append(siraj.el.querySelector('.bubble')); // الكلام تحت الغرفة ليبقى المكان للزينة
  $('.hs-cab h2').textContent = t.cab_title;
  const L = lines.house;

  // ——— المساحات والزينة ———
  const cat = Object.fromEntries(t.items.map(x => [x.id, x]));
  let space = 'room';
  const paintRoom = () => { paintSpace(room, space, decorState(), cat); guest.hidden = space !== 'room'; };
  function paintSpaces() {
    const bar = $('.hs__spaces'); bar.textContent = '';
    t.spaces.forEach(sp => {
      const open = store.state.stars >= sp.need;
      const b = html(`<button class="hs__space${open ? '' : ' is-locked'}" type="button" role="tab" aria-selected="${sp.id === space}"></button>`);
      b.textContent = open ? sp.name : `🔒 ${sp.name}`;
      b.addEventListener('click', () => {
        if (!open) { sfx.oops(); siraj.react('shy'); siraj.say(fill(t.space_locked, { space: sp.name, n: num(sp.need) })); return; }
        stopHide(); sfx.door(); space = sp.id; paintRoom(); paintSpaces(); siraj.say(sp.say);
      });
      bar.append(b);
    });
  }
  $('.hs__decorate').textContent = `✦ ${t.decorate}`;
  $('.hs__decorate').addEventListener('click', e => {
    e.stopPropagation(); stopHide(); sfx.door();
    openStudio({ ui, lines, space, onClose: sp => { space = sp; paintRoom(); paintSpaces(); siraj.react('joy'); siraj.say(fill(pick(lines.celebrate), vars)); } });
  });
  // أصدقاء البيت يتحركون باللمس
  room.addEventListener('click', e => {
    const el = e.target.closest('.dc'); if (!el || hiding) return;
    const id = [...el.classList].find(c => c.startsWith('dc--')).slice(4);
    el.classList.remove('is-play'); void el.offsetWidth; el.classList.add('is-play');
    setTimeout(() => el.classList.remove('is-play'), 2600);
    if (id === 'fish') sfx.bubble(); else if (id === 'bird' || id === 'butterfly') sfx.flip(); else sfx.tap();
    const line = L.pets[id] ? petLine(lines, id) : cat[id]?.say;
    if (line) { siraj.react('joy'); siraj.say(line); }
  });

  // ——— سِراج: لمس، دغدغة، دوخة ———
  let touches = 0, timer = 0, quick = 0, lastTap = 0, idle = 0;
  siraj.lantern.addEventListener('click', e => {
    e.stopPropagation();
    if (hiding) return;
    touches++; const now = Date.now(); quick = now - lastTap < 1300 ? quick + 1 : 1; lastTap = now;
    siraj.lantern.style.setProperty('--sj-glow', GLOWS[touches % GLOWS.length]);
    sfx.star(); sparkle(siraj.lantern, { count: 12, power: 4 });
    if (quick >= 6) { quick = 0; siraj.lantern.classList.remove('is-dizzy'); void siraj.lantern.offsetWidth; siraj.lantern.classList.add('is-dizzy'); sfx.wind(); siraj.say(fill(pick(L.dizzy), vars)); return; }
    siraj.react('joy');
    siraj.say(fill(pick(quick >= 3 ? L.tickle : lines.on_touch), vars));
  });
  siraj.lantern.addEventListener('animationend', e => { if (e.animationName === 'sj-dizzy') siraj.lantern.classList.remove('is-dizzy'); });
  const nudge = () => { clearTimeout(idle); idle = setTimeout(() => { if (!hiding) { siraj.react('joy'); siraj.say(fill(pick(L.idle), vars)); } nudge(); }, 26000); };
  root.addEventListener('pointerdown', nudge); nudge();

  // ——— لغز من سِراج ———
  let rq = null, order = [];
  const riddle = $('.hs__fun--riddle');
  riddle.textContent = `؟ ${t.play_riddle}`;
  riddle.addEventListener('click', () => {
    stopHide(); sfx.tap();
    if (rq) { siraj.react('joy'); siraj.say(`${rq.a}! ${pick(L.riddle_laugh)}`); sparkle(siraj.lantern, { count: 14, power: 4 }); sfx.success(); rq = null; riddle.textContent = `؟ ${t.play_riddle}`; return; }
    if (!order.length) order = [...L.riddles].sort(() => Math.random() - 0.5);
    rq = order.pop(); siraj.react('shy'); siraj.say(rq.q); riddle.textContent = `💡 ${t.riddle_answer}`;
  });

  // ——— الغميضة ———
  const SPOTS = [[82, 26], [16, 30], [12, 80], [86, 82], [50, 88], [50, 12]];
  let hiding = false, target = -1;
  const spots = $('.hs__spots'), peek = $('.hs__peek'), sjBox = $('.hs__siraj');
  SPOTS.forEach(([x, y], i) => {
    const b = html(`<button class="hs__spot" type="button" style="left:${x}%;top:${y}%"></button>`);
    b.setAttribute('aria-label', String(i + 1));
    b.addEventListener('click', e => {
      e.stopPropagation(); if (!hiding) return;
      if (i === target) {
        stopHide(); sfx.success(); siraj.react('joy'); sparkle(siraj.lantern, { count: 22, power: 5 });
        siraj.say(fill(pick(L.found), vars)); return;
      }
      const [tx, ty] = SPOTS[target], warm = Math.hypot(x - tx, (y - ty) * .75) < 45;
      b.classList.remove('is-miss'); void b.offsetWidth; b.classList.add('is-miss'); sfx.oops();
      siraj.say(pick(warm ? L.warm : L.cold));
    });
    spots.append(b);
  });
  function stopHide() {
    if (!hiding) return;
    hiding = false; spots.hidden = true; peek.hidden = true; sjBox.classList.remove('is-hiding');
  }
  $('.hs__fun--hide').textContent = `🙈 ${t.play_hide}`;
  $('.hs__fun--hide').addEventListener('click', async () => {
    stopHide(); sfx.tap(); siraj.react('shy'); siraj.say(L.hide_start);
    hiding = true; sjBox.classList.add('is-hiding');
    target = Math.floor(Math.random() * SPOTS.length);
    room.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(r => setTimeout(r, 1800));
    if (!hiding) return;
    const [x, y] = SPOTS[target];
    peek.style.left = `${x}%`; peek.style.top = `${y}%`; peek.hidden = false; spots.hidden = false;
    sfx.glow(); siraj.say(L.hide_go);
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
    stopHide(); if (space !== 'room') { space = 'room'; paintRoom(); paintSpaces(); }
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
  paintRoom(); paintSpaces();
  go2.addEventListener('click', e => { e.preventDefault(); sfx.door(); go(go2.getAttribute('href'), go2); });

  el.append(root);
  return () => { clearTimeout(timer); clearTimeout(idle); document.querySelector('.ds .ds__done')?.click(); live.forEach(w => w.destroy()); visitor?.destroy(); };
}
