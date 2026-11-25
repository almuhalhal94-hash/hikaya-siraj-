// القسم 2: الحكايات «الشاهد يحكي» — قائمة القصص + مشغّل الفيلم التفاعلي.
// يقرأ النص من content/stories.json والإخراج البصري من content/scenes.json.
import { content, fill, html, num, pick, store, wait } from '../core.js';
import { Stage, thumbnail } from '../film/engine.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';
import { Narrator } from '../voice.js';
import { createWitness } from '../film/witness.js';

const FALLBACK = { set: 'mountain', state: { time: 'night', cave: 'dim' }, camera: { from: [600, 430, 760], to: [610, 340, 520], dur: 16 }, fx: ['dust'] };
const WORD_MS = 150;
const STAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l6.2 13.400 14.600 1.700-10.800 10 2.900 14.400L24 35.300 11.100 42.500 14 28.100 3.200 18.100l14.600-1.700z" fill="#ffd77a" stroke="#fff4cf" stroke-width="2" stroke-linejoin="round"/></svg>';

export default async function stories(el, ctx) {
  const [data, scenes, lib, voice] = await Promise.all([content('stories'), content('scenes'), content('library'), content('voice').catch(() => ({}))]);
  const story = data.stories.find(s => s.id === ctx.args[0]);
  return story ? player(el, ctx, story, scenes[story.id] || {}, voice[story.id]) : list(el, ctx, data.stories, scenes, lib);
}

// ——— مكتبة الحكايات: رفوف، وفي كل رف دروس مرتّبة (content/library.json) ———
function list(el, { ui, go }, all, scenes, lib) {
  const t = ui.stories, byId = Object.fromEntries(all.map(s => [s.id, s]));
  const shelves = lib.shelves.map(sh => ({ ...sh, ready: sh.items.filter(it => byId[it.story]) }));
  const page = html(`
    <section class="page lib">
      <header class="page__head">
        <a class="backlink" href="#/"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span></a>
        <h1></h1><p></p>
      </header>
      <nav class="lib__shelves"></nav>
      <div class="lib__head"><h2></h2><p></p></div>
      <ol class="lib__path"></ol>
    </section>`);
  const $ = q => page.querySelector(q);
  $('.backlink span').textContent = t.back;
  $('h1').textContent = t.title;
  $('.page__head p').textContent = t.sub;
  $('.backlink').addEventListener('click', () => sfx.tap());
  const nav = $('.lib__shelves'), path = $('.lib__path');
  nav.setAttribute('aria-label', t.shelves_label);

  function show(id, quiet) {
    const sh = shelves.find(x => x.id === id) || shelves[0];
    store.set({ shelf: sh.id });
    nav.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === sh.id));
    const read = sh.ready.filter(it => store.state.completed.includes(it.story)).length;
    $('.lib__head h2').textContent = sh.title;
    $('.lib__head p').textContent = sh.ready.length ? `${sh.sub} · ${fill(t.shelf_progress, { i: num(read), n: num(sh.ready.length) })}` : sh.sub;
    path.textContent = '';
    const nextUp = sh.ready.find(it => !store.state.completed.includes(it.story));
    sh.items.forEach((it, i) => {
      const s = byId[it.story], li = html(`<li class="lib__step" style="--i:${Math.min(i, 8)}"><b class="lib__num"></b></li>`);
      li.querySelector('b').textContent = num(i + 1);
      if (s) {
        const dir = scenes[s.id] || {}, spec = dir.scenes?.[dir.thumb || 0] || FALLBACK, done = store.state.completed.includes(s.id);
        const a = html(`
          <a class="card" href="#/stories/${encodeURIComponent(s.id)}">
            ${thumbnail(spec)}
            <span class="card__tag"></span>
            <span class="card__body"><small></small><b></b></span>
          </a>`);
        a.querySelector('b').textContent = s.title;
        a.querySelector('small').textContent = it.name;
        const tag = a.querySelector('.card__tag');
        tag.textContent = done ? `★ ${t.done}` : it === nextUp ? t.next_up : t.new;
        tag.classList.toggle('is-done', done);
        li.classList.toggle('is-done', done); li.classList.toggle('is-next', it === nextUp);
        a.addEventListener('click', e => { e.preventDefault(); sfx.door(); go(a.getAttribute('href'), a); });
        li.append(a);
      } else {
        const d = html('<div class="lib__soon"><span></span><small></small></div>');
        d.querySelector('span').textContent = it.name;
        d.querySelector('small').textContent = t.soon;
        li.classList.add('is-soon'); li.append(d);
      }
      path.append(li);
    });
    if (!quiet) sfx.tap();
  }

  shelves.forEach(sh => {
    const b = html('<button class="lib__shelf" type="button" aria-pressed="false"><b></b><small></small></button>');
    b.dataset.id = sh.id;
    b.querySelector('b').textContent = sh.title;
    b.querySelector('small').textContent = sh.ready.length ? num(sh.ready.length) : t.soon;
    b.addEventListener('click', () => { show(sh.id); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); });
    nav.append(b);
  });
  el.append(page);
  show(shelves.some(x => x.id === store.state.shelf) ? store.state.shelf : (shelves.find(x => x.ready.length) || shelves[0]).id, true);
}

// ——— مشغّل الفيلم ———
// times: بداية كل كلمة بالملّي ثانية من التعليق الصوتي (null لكلمات الآيات فتظهر بعد انتهائه)
function renderText(p, text, times, endMs = 0) {
  p.textContent = ''; p.classList.remove('is-all');
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text; p.append(sr);
  let n = 0;
  for (const part of text.split(/(«[^»]*»|﴿[^﴾]*﴾)/)) {
    const cls = part[0] === '«' ? 'q' : part[0] === '﴿' ? 'ayah' : '';
    for (const word of part.split(/\s+/).filter(Boolean)) {
      const s = document.createElement('span');
      s.textContent = word + ' '; s.className = `w ${cls}`; s.setAttribute('aria-hidden', 'true');
      const at = times ? times[n] : n * WORD_MS;
      if (times && at == null) { s.classList.add('is-after'); s.style.animationDelay = `${endMs + 500 + (n - times.indexOf(null)) * 220}ms`; }
      else { s.style.animationDelay = `${Math.max(0, at - 60)}ms`; if (times) s.classList.add('is-voiced'); }
      n++;
      p.append(s);
    }
  }
  if (!times) return n * WORD_MS + 350;
  const ayahs = times.filter(x => x == null).length;
  return Math.max(endMs, 0) + (ayahs ? 900 + ayahs * 220 : 150);
}

function player(el, { ui, lines, go }, story, dir, voice) {
  const t = ui.stories;
  const total = story.scenes.length;
  const specOf = n => dir.scenes?.[n] || FALLBACK;
  document.body.classList.add('in-film');

  const film = html(`
    <section class="film">
      <div class="film__stage"></div>
      <div class="film__top">
        <button class="iconbtn film__close" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></button>
        <div class="film__dots" role="img">${'<i></i>'.repeat(total)}</div>
        <button class="iconbtn film__sound" type="button"></button>
      </div>
      <div class="film__panel">
        <p class="film__text" aria-live="polite"></p>
        <div class="film__nav">
          <button class="iconbtn film__prev" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="btn film__next" type="button"><span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
      <div class="film__overlay" hidden></div>
    </section>`);
  const $ = q => film.querySelector(q);
  const text = $('.film__text'), overlay = $('.film__overlay'), nextBtn = $('.film__next'), prevBtn = $('.film__prev');
  const dots = [...film.querySelectorAll('.film__dots i')];
  $('.film__close').setAttribute('aria-label', t.close);
  prevBtn.setAttribute('aria-label', t.prev);
  nextBtn.querySelector('span').textContent = t.next;
  el.append(film);

  // زر الصوت داخل الفيلم يعكس الزر العام
  const mainSound = document.getElementById('soundBtn'), sound = $('.film__sound');
  const syncSound = () => { sound.innerHTML = mainSound.innerHTML; sound.setAttribute('aria-pressed', mainSound.getAttribute('aria-pressed')); sound.setAttribute('aria-label', mainSound.getAttribute('aria-label')); };
  sound.addEventListener('click', () => { mainSound.click(); syncSound(); if (!store.state.sound) hush(); });
  syncSound();

  const stage = new Stage($('.film__stage'));
  // الراوي والشاهد الكرتوني (إن كان للحكاية تعليق صوتي ورسم للشاهد)
  const narrator = voice ? new Narrator() : null;
  const witness = voice ? createWitness(dir.witness) : null;
  if (witness) { $('.film__panel').prepend(witness.el); witness.setMood('calm'); }
  let lipRaf = 0;
  const lip = () => { if (!witness || !narrator) return; witness.setLevel(narrator.level()); lipRaf = requestAnimationFrame(lip); };
  const speak = (clip, onEnd) => {
    if (!narrator) return Promise.resolve(false);
    cancelAnimationFrame(lipRaf);
    return narrator.play(clip, () => { witness?.talking(false); cancelAnimationFrame(lipRaf); onEnd?.(); }).then(ok => {
      if (ok && alive) { witness?.talking(true); lip(); }
      return ok;
    });
  };
  const hush = () => { narrator?.stop(); witness?.talking(false); cancelAnimationFrame(lipRaf); };
  let i = 0, busy = true, choiceDone = !story.choice, revealTimer, alive = true;

  function setDots() {
    dots.forEach((d, n) => { d.classList.toggle('is-on', n <= i); d.classList.toggle('is-now', n === i); });
    $('.film__dots').setAttribute('aria-label', fill(t.scene_of, { i: i + 1, n: total }));
    prevBtn.disabled = i === 0;
  }

  function reveal(content, clip) {
    clearTimeout(revealTimer);
    nextBtn.classList.remove('is-ready');
    const ms = clip ? renderText(text, content, clip.words, clip.ms) : renderText(text, content);
    revealTimer = setTimeout(() => { text.classList.add('is-all'); nextBtn.classList.add('is-ready'); }, ms);
  }
  const revealed = () => text.classList.contains('is-all');
  function revealAll() { clearTimeout(revealTimer); text.classList.add('is-all'); nextBtn.classList.add('is-ready'); }

  async function goto(n) {
    busy = true; i = n; setDots();
    text.classList.remove('is-echo'); text.textContent = ''; nextBtn.classList.remove('is-ready');
    hush();
    const spec = specOf(n);
    await stage.show(spec);
    if (!alive || i !== n) return;
    sfx[spec.sfx]?.();
    witness?.setMood(spec.mood);
    const clip = voice?.scenes?.[n];
    const voiced = clip && await speak(clip, () => {
      if (clip.words.includes(null)) { sfx.glow(); witness?.setMood('wonder'); }
    });
    if (!alive || i !== n) return;
    reveal(story.scenes[n].text, voiced ? clip : null);
    busy = false;
  }

  function next() {
    if (busy) return;
    sfx.tap();
    if (!revealed()) return revealAll();
    if (!choiceDone && i + 1 === story.choice.after_scene) return openChoice();
    if (i + 1 < total) goto(i + 1); else finish();
  }
  function prev() { if (!busy && i > 0) { sfx.tap(); goto(i - 1); } }

  function openOverlay(card, kind) {
    overlay.textContent = ''; overlay.append(card);
    overlay.dataset.kind = kind; overlay.hidden = false; film.classList.add('has-overlay');
    overlay.querySelector('button, a')?.focus({ preventScroll: true });
  }
  function closeOverlay() { overlay.hidden = true; overlay.textContent = ''; film.classList.remove('has-overlay'); }

  // بطاقة العنوان
  function openTitle() {
    const card = html(`<div class="fcard fcard--title"><small></small><h1></h1><button class="btn" type="button"></button></div>`);
    card.querySelector('small').textContent = story.category;
    card.querySelector('h1').textContent = story.title;
    const b = card.querySelector('button'); b.textContent = t.start;
    b.addEventListener('click', () => { narrator?.unlock(); witness?.show(true); sfx.success(); closeOverlay(); goto(0); });
    openOverlay(card, 'title');
  }

  // الاختيار التفاعلي في منتصف القصة
  function openChoice() {
    busy = true;
    witness?.setMood('curious');
    if (voice?.choice) setTimeout(() => alive && speak(voice.choice), 350);
    const c = story.choice;
    const card = html(`<div class="fcard fcard--choice"><small></small><h2></h2><div class="fcard__opts"></div><p class="fcard__hint" aria-live="polite"></p></div>`);
    card.querySelector('small').textContent = t.choice_label;
    card.querySelector('h2').textContent = c.question;
    const hint = card.querySelector('.fcard__hint');
    [...c.options].sort(() => Math.random() - 0.5).forEach(opt => {
      const b = html(`<button class="opt" type="button"></button>`);
      b.textContent = opt.text;
      b.addEventListener('click', async () => {
        if (!opt.correct) {
          sfx.oops(); b.classList.add('is-wrong'); b.disabled = true;
          hint.textContent = `${pick(lines.encourage)} ${opt.hint || ''}`;
          return;
        }
        choiceDone = true;
        hush(); witness?.setMood('happy');
        sfx.success(); b.classList.add('is-right'); sparkle(b, { count: 30, power: 6 });
        await wait(650);
        if (!alive) return;
        closeOverlay();
        // الاختيار يغيّر اللقطة أمام الطفل
        stage.flash(); stage.setState(dir.choice?.state || {}); sfx.glow();
        clearTimeout(revealTimer);
        text.classList.add('is-echo'); renderText(text, opt.text); text.classList.add('is-all');
        nextBtn.classList.remove('is-ready');
        await wait(3000);
        if (alive) goto(i + 1);
      });
      card.querySelector('.fcard__opts').append(b);
    });
    openOverlay(card, 'choice');
  }

  // النهاية: الدرس والمصدر والنجوم
  function finish() {
    busy = true;
    const first = !store.state.completed.includes(story.id);
    store.set({
      lastStory: story.title,
      completed: first ? [...store.state.completed, story.id] : store.state.completed,
      stars: store.state.stars + (first ? t.stars_n : 0)
    });
    const siraj = createSiraj({ label: ui.common.siraj });
    const card = html(`
      <div class="fcard fcard--end">
        <div class="fcard__stars">${STAR.repeat(3)}</div>
        <p class="fcard__gain"></p>
        <div class="lesson"><small></small><p></p></div>
        <details class="sources"><summary></summary><ul></ul></details>
        <div class="fcard__btns"><button class="btn btn--ghost" type="button" data-act="again"></button><button class="btn" type="button" data-act="more"></button></div>
      </div>`);
    card.prepend(siraj.el);
    card.querySelector('.fcard__gain').textContent = first ? fill(t.stars, { n: t.stars_n }) : '';
    card.querySelector('.lesson small').textContent = t.lesson_label;
    card.querySelector('.lesson p').textContent = story.lesson;
    card.querySelector('summary').textContent = t.sources_label;
    card.querySelector('details').open = true;
    story.sources.forEach(src => { const li = document.createElement('li'); li.textContent = src; card.querySelector('ul').append(li); });
    const again = card.querySelector('[data-act="again"]'), more = card.querySelector('[data-act="more"]');
    again.textContent = t.again; more.textContent = t.more;
    again.addEventListener('click', () => { sfx.tap(); closeOverlay(); witness?.show(true); choiceDone = !story.choice; goto(0); });
    more.addEventListener('click', () => { sfx.tap(); go('#/stories'); });
    siraj.lantern.addEventListener('click', () => { sfx.star(); siraj.react('joy'); sparkle(siraj.lantern, { count: 10, power: 3 }); });
    openOverlay(card, 'end');
    hush(); witness?.show(false);
    if (voice?.lesson) setTimeout(() => alive && speak(voice.lesson), 1100);
    sfx.success(); siraj.react('joy');
    siraj.say(fill(pick(lines.celebrate), { name: store.state.name }));
    setTimeout(() => alive && sparkle(card.querySelector('.fcard__stars'), { count: 36, power: 7 }), 500);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  text.addEventListener('click', () => { if (!busy && !revealed()) revealAll(); });
  $('.film__close').addEventListener('click', () => { sfx.tap(); go('#/stories'); });
  const onKey = e => {
    if (!overlay.hidden) return;
    if (e.key === 'ArrowLeft') next(); else if (e.key === 'ArrowRight') prev(); else if (e.key === 'Escape') go('#/stories');
  };
  document.addEventListener('keydown', onKey);

  setDots();
  stage.show(specOf(0));
  openTitle();

  return () => {
    alive = false; clearTimeout(revealTimer); stage.destroy();
    hush(); witness?.destroy();
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('in-film');
  };
}
