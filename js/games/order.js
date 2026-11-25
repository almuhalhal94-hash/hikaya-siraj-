// لعبة «رتّب أحداث الحكاية»: بطاقات تُسحب (أو تُحرَّك بالسهمين) إلى ترتيبها الصحيح.
import { fill, html, num, wait } from '../core.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const GRIP = '<svg class="od__grip" viewBox="0 0 16 24" aria-hidden="true"><path d="M5 5h.01M11 5h.01M5 12h.01M11 12h.01M5 19h.01M11 19h.01" stroke="currentColor" stroke-width="3.400" stroke-linecap="round"/></svg>';

export function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function order(board, api) {
  const { level, data, t, stories } = api;
  const set = data.order_events.find(e => e.story === level.story) || data.order_events[0];
  const events = (level.pick || set.events.map((_, i) => i)).map(i => set.events[i]);
  const n = events.length;
  let arr; // arr[الموضع] = رقم الحدث الصحيح
  do arr = shuffled(events.map((_, i) => i)); while (arr.every((v, i) => v === i));

  const root = html(`<div class="od is-intro"><p class="od__story"></p><div class="od__list" role="list"></div><button class="btn od__check" type="button"></button></div>`);
  const list = root.querySelector('.od__list'), check = root.querySelector('.od__check');
  root.querySelector('.od__story').textContent = stories.find(s => s.id === set.story)?.title || '';
  check.textContent = t.check;

  const cards = events.map((text, k) => {
    const c = html(`<div class="od__card" role="listitem" tabindex="0" style="--i:${k}"><b class="od__num"></b><span></span>${GRIP}</div>`);
    c.querySelector('span').textContent = text;
    list.append(c);
    return c;
  });

  let H = 0, tries = 0, done = false, drag = null;

  function measure() {
    cards.forEach(c => { c.style.minHeight = ''; });
    const h = Math.max(...cards.map(c => c.offsetHeight));
    cards.forEach(c => { c.style.minHeight = `${h}px`; });
    H = h + 10;
    list.style.height = `${n * H - 10}px`;
    place();
  }
  function place() {
    arr.forEach((k, p) => {
      const c = cards[k];
      if (!drag || drag.k !== k) c.style.setProperty('--y', `${p * H}px`);
      c.querySelector('.od__num').textContent = num(p + 1);
      c.setAttribute('aria-label', fill(t.card_label, { i: num(p + 1), text: events[k] }));
    });
  }
  function clearMarks() { cards.forEach(c => c.classList.remove('is-right', 'is-wrong')); }
  function move(k, to) {
    const from = arr.indexOf(k);
    to = Math.max(0, Math.min(n - 1, to));
    if (to === from) return false;
    arr.splice(from, 1); arr.splice(to, 0, k);
    place(); sfx.step();
    return true;
  }

  cards.forEach((c, k) => {
    c.addEventListener('pointerdown', e => {
      if (done || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
      drag = { k, id: e.pointerId, y0: e.clientY, base: arr.indexOf(k) * H };
      c.setPointerCapture(e.pointerId);
      c.classList.add('is-drag'); clearMarks(); sfx.tap();
    });
    c.addEventListener('pointermove', e => {
      if (!drag || drag.k !== k || e.pointerId !== drag.id) return;
      const y = Math.max(-H * 0.35, Math.min((n - 1) * H + H * 0.35, drag.base + e.clientY - drag.y0));
      c.style.setProperty('--y', `${y}px`);
      move(k, Math.round(y / H));
    });
    const drop = e => {
      if (!drag || drag.k !== k || e.pointerId !== drag.id) return;
      drag = null; c.classList.remove('is-drag'); place();
    };
    c.addEventListener('pointerup', drop);
    c.addEventListener('pointercancel', drop);
    c.addEventListener('keydown', e => {
      if (done || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
      e.preventDefault(); clearMarks();
      move(k, arr.indexOf(k) + (e.key === 'ArrowUp' ? -1 : 1));
    });
  });

  check.addEventListener('click', async () => {
    if (done) return;
    tries++;
    const right = arr.filter((k, p) => k === p).length;
    clearMarks();
    if (right === n) {
      done = true; check.disabled = true; root.classList.add('is-done');
      for (let p = 0; p < n; p++) {
        if (!api.alive()) return;
        cards[arr[p]].classList.add('is-right'); sfx.star();
        sparkle(cards[arr[p]].querySelector('.od__num'), { count: 6, power: 3 });
        await wait(170);
      }
      api.win(tries === 1 ? 3 : tries === 2 ? 2 : 1);
    } else {
      arr.forEach((k, p) => cards[k].classList.add(k === p ? 'is-right' : 'is-wrong'));
      api.oops(right ? fill(t.some_right, { n: num(right) }) : '');
    }
  });

  board.append(root);
  setTimeout(() => root.classList.remove('is-intro'), 1400);
  api.say(t.intro);
  measure();
  const ro = new ResizeObserver(() => { if (!drag) measure(); });
  ro.observe(list);
  document.fonts?.ready.then(() => api.alive() && measure());

  return () => ro.disconnect();
}
