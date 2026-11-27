// القسم 1: الصفحة الرئيسية — سِراج يرحّب بالطفل باسمه، وأربعة أبواب متحركة.
import { dayKey, dayPart, fill, html, num, pick, store, wait } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle, setKidStars } from '../sky.js';
import { sfx } from '../audio.js';

// مشهد صغير حيّ خلف كل باب (رسم بالكود).
const SCENES = {
  stories: `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMax slice">
      <rect width="120" height="150" fill="#14285a"/>
      <g fill="#fff4cf"><circle class="tw" cx="22" cy="22" r="1.6"/><circle class="tw tw--b" cx="92" cy="16" r="1.3"/><circle class="tw tw--c" cx="64" cy="34" r="1.1"/><circle class="tw tw--b" cx="38" cy="46" r="1"/></g>
      <path d="M-6 150L34 62l14 16 16-30 62 102z" fill="#0a1736"/>
      <path d="M34 62l14 16 16-30 10 16-12 8-14-6-8 10z" fill="#1d3a78" opacity=".7"/>
      <ellipse class="pulse" cx="60" cy="112" rx="26" ry="20" fill="#ffd77a" opacity=".35"/>
      <path d="M44 124q2-26 16-26t16 26z" fill="#ffd77a"/>
      <path d="M50 124q2-17 10-17t10 17z" fill="#fff4cf"/>
    </svg>`,
  games: `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMid slice">
      <rect width="120" height="150" fill="#0d4a55"/>
      <circle cx="60" cy="74" r="44" fill="#5fd6c8" opacity=".16"/>
      <path class="spin" d="M60 44l8 19 21 2-16 14 5 20-18-11-18 11 5-20-16-14 21-2z" fill="#ffd77a" stroke="#fff4cf" stroke-width="2" stroke-linejoin="round"/>
      <circle class="bob" cx="26" cy="110" r="9" fill="#ff9e7a"/>
      <rect class="bob bob--b" x="86" y="100" width="17" height="17" rx="4" fill="#8fe0d6"/>
      <path class="bob bob--c" d="M92 30l9 16H83z" fill="#fff4cf"/>
      <path class="bob bob--b" d="M30 24a10 10 0 1 0 8 16 8 8 0 0 1-8-16z" fill="#ffd77a"/>
    </svg>`,
  adhkar: `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMax slice">
      <defs><linearGradient id="dr-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16305a"/><stop offset=".62" stop-color="#b9617a"/><stop offset="1" stop-color="#ffb35c"/></linearGradient></defs>
      <rect width="120" height="150" fill="url(#dr-dawn)"/>
      <path d="M88 20a11 11 0 1 0 10 17 9 9 0 0 1-10-17z" fill="#fff4cf" opacity=".9"/>
      <g class="rise">
        <g class="spin spin--slow" stroke="#ffe9a8" stroke-width="4" stroke-linecap="round"><path d="M60 62v-12M60 138v12M22 100H10M98 100h12M33 73l-8-8M87 73l8-8M33 127l-8 8M87 127l8 8"/></g>
        <circle cx="60" cy="100" r="27" fill="#ffd77a"/><circle cx="60" cy="100" r="19" fill="#fff4cf"/>
      </g>
      <path d="M-4 150v-30q30-16 64-6t64-8v44z" fill="#0c1c3d"/>
    </svg>`,
  quran: `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMax slice">
      <rect width="120" height="150" fill="#123a3a"/>
      <g fill="#fff4cf"><circle class="tw" cx="18" cy="24" r="1.4"/><circle class="tw tw--b" cx="100" cy="30" r="1.2"/><circle class="tw tw--c" cx="70" cy="14" r="1"/></g>
      <ellipse class="pulse" cx="60" cy="86" rx="40" ry="30" fill="#ffd77a" opacity=".3"/>
      <path d="M60 70q-18-8-38-4v42q20-4 38 4z" fill="#fbf3df" stroke="#c9a24a" stroke-width="2.500" stroke-linejoin="round"/>
      <path d="M60 70q18-8 38-4v42q-20-4-38 4z" fill="#f1e2bd" stroke="#c9a24a" stroke-width="2.500" stroke-linejoin="round"/>
      <g stroke="#a07a22" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M30 78h22M30 86h22M30 94h22M68 78h22M68 86h22M68 94h22"/></g>
      <path d="M26 122l34-12 34 12M34 132l26-18 26 18" fill="none" stroke="#8a5f38" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  hadith: `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMax slice">
      <rect width="120" height="150" fill="#3a2350"/>
      <g fill="#fff4cf"><circle class="tw" cx="20" cy="20" r="1.4"/><circle class="tw tw--b" cx="98" cy="26" r="1.2"/><circle class="tw tw--c" cx="60" cy="12" r="1"/></g>
      <ellipse class="pulse" cx="60" cy="84" rx="36" ry="34" fill="#ffd77a" opacity=".28"/>
      <path d="M34 50h44l8 8v58H34z" fill="#fbf3df" stroke="#c9a24a" stroke-width="2.500" stroke-linejoin="round"/>
      <path d="M78 50v8h8" fill="#f1e2bd" stroke="#c9a24a" stroke-width="2.500" stroke-linejoin="round"/>
      <g stroke="#a07a22" stroke-width="2.200" stroke-linecap="round" opacity=".75"><path d="M44 68h32M44 78h32M44 88h24M44 98h30"/></g>
      <g class="spin spin--slow"><path d="M88 106l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#ffd77a" stroke="#fff4cf" stroke-width="1.500" stroke-linejoin="round"/></g>
    </svg>`,
  house: `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMax slice">
      <rect width="120" height="150" fill="#2a1f5c"/>
      <g fill="#fff4cf"><circle class="tw" cx="20" cy="28" r="1.4"/><circle class="tw tw--b" cx="100" cy="36" r="1.2"/><circle class="tw tw--c" cx="84" cy="14" r="1"/></g>
      <path d="M60 30a8 8 0 1 0 7 12 6.4 6.4 0 0 1-7-12z" fill="#ffd77a"/>
      <path d="M32 92q0-36 28-42 28 6 28 42z" fill="#5fd6c8"/>
      <path d="M40 92q0-28 20-34" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".3"/>
      <rect x="26" y="90" width="68" height="64" rx="4" fill="#f1e4c3"/>
      <ellipse class="pulse" cx="60" cy="128" rx="24" ry="26" fill="#ffd77a" opacity=".4"/>
      <path d="M47 154v-28q0-13 13-13t13 13v28z" fill="#ffd77a"/>
      <path d="M53 154v-25q0-8 7-8t7 8v25z" fill="#fff4cf"/>
      <rect x="20" y="88" width="80" height="7" rx="3.5" fill="#c9a24a"/>
    </svg>`
};

SCENES.salati = `
    <svg viewBox="0 0 120 150" preserveAspectRatio="xMidYMax slice">
      <rect width="120" height="150" fill="#14284f"/>
      <g fill="#fff4cf"><circle class="tw" cx="16" cy="22" r="1.4"/><circle class="tw tw--b" cx="104" cy="18" r="1.2"/><circle class="tw tw--c" cx="62" cy="10" r="1"/></g>
      <g class="pulse">${[22, 41, 60, 79, 98].map((x, i) => `<circle cx="${x}" cy="${60 - Math.abs(i - 2) * 6}" r="7" fill="${i < 3 ? '#ffd77a' : '#3d5a8a'}" stroke="#fff4cf" stroke-width="1.5"/>`).join('')}</g>
      <path d="M18 150v-42q0-30 42-42 42 12 42 42v42z" fill="#2f9c90"/>
      <path d="M34 150v-36q0-16 26-26 26 10 26 26v36z" fill="#123056"/>
      <path d="M44 150v-30q0-10 16-16 16 6 16 16v30z" fill="#ffd77a" opacity=".85"/>
    </svg>`;

const MEDAL = '<svg viewBox="0 0 48 56" aria-hidden="true"><path d="M14 2h8l4 14h-8zM34 2h-8l-4 14h8z" fill="#5fd6c8"/><circle cx="24" cy="34" r="19" fill="#ffd77a" stroke="#c9a24a" stroke-width="3"/><path d="M24 21l3.800 8 8.800 1-6.500 6 1.800 8.700L24 40.300l-7.900 4.400 1.800-8.700-6.500-6 8.800-1z" fill="#fff4cf"/></svg>';
const GIFT = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="20" width="34" height="23" rx="4" fill="#5fd6c8"/><rect x="4" y="13" width="40" height="10" rx="4" fill="#8fe0d6"/><path d="M21 13h6v30h-6z" fill="#ffd77a"/><path d="M24 13q-12-12-15-4t15 4q12-12 15-4t-15 4z" fill="none" stroke="#ffd77a" stroke-width="3.500" stroke-linejoin="round"/></svg>';

function cleanName(raw) {
  return raw.replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{M}\s]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
}

export default async function home(el, { ui, lines, go, refreshChip }) {
  const t = ui.home;
  const siraj = createSiraj({ label: ui.common.siraj });

  const page = html(`<section class="home"><div class="home__hero"></div></section>`);
  const hero = page.firstElementChild;
  hero.append(siraj.el);

  const doors = html(`<nav class="doors"></nav>`);
  doors.setAttribute('aria-label', t.doors_label);
  t.doors.forEach((d, i) => {
    const a = html(`
      <a class="door door--${d.id}" href="#/${d.id}" style="--i:${i}">
        <span class="door__arch">
          <span class="door__scene">${SCENES[d.id] || ''}</span>
          <span class="door__leaf door__leaf--l"></span>
          <span class="door__leaf door__leaf--r"></span>
          <span class="door__shine"></span>
        </span>
        <span class="door__plaque"><b></b><small></small></span>
      </a>`);
    a.querySelector('b').textContent = d.title;
    a.querySelector('small').textContent = d.sub;
    a.addEventListener('click', e => {
      e.preventDefault();
      sfx.door();
      a.classList.add('is-entering');
      go(`#/${d.id}`, a.querySelector('.door__arch'));
    });
    doors.append(a);
  });
  const mine = html(`<section class="mine"><span class="chip mine__stars"></span><h2></h2><div class="mine__badges"></div><p class="mine__hint" aria-live="polite"></p></section>`);
  const pl = html(`<a class="parents-link" href="#/parents"></a>`);
  pl.textContent = t.parents_link;
  pl.addEventListener('click', e => { e.preventDefault(); sfx.tap(); go('#/parents'); });
  page.append(doors, mine, pl);
  el.append(page);

  // ——— القسم 6: نجومي، أوسمتي، وهدية اليوم ———
  const D = ui.daily;
  const earned = b => {
    const s = store.state, r = b.rule;
    if (r.type === 'story') return s.completed.includes(r.id);
    if (r.type === 'stories') return s.completed.length >= r.n;
    if (r.type === 'adhkar') return (s.adhkarTotal?.[r.kind] || 0) >= r.n;
    if (r.type === 'gameStars') return Object.values(s.games || {}).flat().reduce((a, v) => a + (v || 0), 0) >= r.n;
    if (r.type === 'days') return s.days.length >= r.n;
    if (r.type === 'house') return (s.met || []).length >= r.n;
    if (r.type === 'salati') return Object.values(s.salati?.days || {}).filter(d => d.length >= 5).length >= r.n;
    return false;
  };
  function paintMine() {
    mine.querySelector('.mine__stars').textContent = `★ ${fill(D.stars, { n: num(store.state.stars) })}`;
    mine.querySelector('h2').textContent = D.badges_title;
    const row = mine.querySelector('.mine__badges'); row.textContent = '';
    D.badges.forEach((b, i) => {
      const got = store.state.badges.includes(b.id);
      const btn = html(`<button class="badge${got ? ' is-got' : ''}" type="button" style="--i:${i}"><i>${MEDAL}</i><b></b></button>`);
      btn.querySelector('b').textContent = b.name;
      btn.addEventListener('click', () => { sfx.tap(); mine.querySelector('.mine__hint').textContent = fill(got ? D.badge_got : D.badge_locked, b); if (got) sparkle(btn, { count: 8, power: 3 }); });
      row.append(btn);
    });
  }
  /** يمنح الأوسمة المستحقة ويعلن أولها. */
  function awardBadges() {
    const fresh = D.badges.filter(b => !store.state.badges.includes(b.id) && earned(b));
    if (!fresh.length) return false;
    store.set({ badges: [...store.state.badges, ...fresh.map(b => b.id)] });
    paintMine();
    siraj.say(fill(D.badge_new, { badge: fresh[0].name, name: store.state.name }));
    sfx.success(); siraj.react('joy');
    const node = mine.querySelectorAll('.badge')[D.badges.indexOf(fresh[0])];
    setTimeout(() => sparkle(node, { count: 24, power: 5 }), 600);
    return true;
  }
  function offerGift() {
    if (store.state.gift === dayKey()) return;
    const g = html(`<button class="gift" type="button">${GIFT}<span></span></button>`);
    g.querySelector('span').textContent = D.gift;
    g.setAttribute('aria-label', D.gift_label);
    g.addEventListener('click', () => {
      store.set({ gift: dayKey(), stars: store.state.stars + 1 });
      setKidStars(store.state.stars);
      sfx.success(); siraj.react('joy'); sparkle(g, { count: 30, power: 6 });
      siraj.say(fill(pick(lines.daily_surprise), vars()));
      g.classList.add('is-open'); setTimeout(() => g.remove(), 700);
      paintMine();
    });
    hero.append(g);
  }
  paintMine();

  const vars = () => ({ name: store.state.name });

  async function openDoors() {
    page.classList.remove('is-asking');
    await wait(120);
    doors.classList.add('is-open');
    sfx.wind();
  }

  function askName(prompt) {
    page.classList.add('is-asking');
    doors.classList.remove('is-open');
    const form = html(`
      <form class="namebox" novalidate>
        <input class="namebox__input" name="name" type="text" maxlength="16" autocomplete="given-name" enterkeyhint="go">
        <button class="btn" type="submit"></button>
      </form>`);
    const input = form.querySelector('input');
    input.placeholder = t.name_placeholder;
    input.setAttribute('aria-label', t.name_label);
    input.value = store.state.name;
    form.querySelector('button').textContent = t.name_button;
    hero.append(form);
    siraj.say(prompt);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = cleanName(input.value);
      if (!name) {
        sfx.oops(); siraj.react('shy'); siraj.say(t.name_empty);
        form.classList.remove('is-shake'); void form.offsetWidth; form.classList.add('is-shake');
        input.focus();
        return;
      }
      store.set({ name });
      refreshChip();
      sfx.success(); siraj.react('joy'); sparkle(siraj.lantern, { count: 26, power: 5 });
      form.classList.add('is-done');
      siraj.say(fill(t.welcome_new, vars()));
      await wait(350);
      form.remove();
      openDoors();
    });
  }

  siraj.lantern.addEventListener('click', () => {
    sfx.star(); siraj.react('joy'); sparkle(siraj.lantern, { count: 10, power: 3 });
    if (store.state.name) siraj.say(fill(pick(lines.on_touch), vars()));
  });

  const onRename = () => { if (!page.querySelector('.namebox')) { sfx.tap(); askName(t.name_again); } };
  document.addEventListener('siraj:rename', onRename);

  if (store.state.name) {
    siraj.say(fill(pick(lines.greetings[dayPart()]), vars()));
    openDoors();
    if (!awardBadges()) offerGift(); else setTimeout(offerGift, 4000);
  } else {
    askName(pick(lines.greetings.first_visit));
  }

  return () => document.removeEventListener('siraj:rename', onRename);
}
