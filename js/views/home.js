// القسم 1: الصفحة الرئيسية — سِراج يرحّب بالطفل باسمه، وأربعة أبواب متحركة.
import { store, pick, fill, dayPart, html, wait } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
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
  page.append(doors);
  el.append(page);

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
  } else {
    askName(pick(lines.greetings.first_visit));
  }

  return () => document.removeEventListener('siraj:rename', onRename);
}
