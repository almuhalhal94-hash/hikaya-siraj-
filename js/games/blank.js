// لعبة «الكلمة الناقصة»: جملة من الحكاية فيها فراغ، والكلمات تطفو تحتها. الإجابات المتتالية تُشعل عدّاد التتابع.
import { fill, html, num, wait } from '../core.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';
import { shuffled } from './order.js';
import { choose as pickFor, mark } from './memory.js';

export default function blank(board, api) {
  const { level, data, t, stories } = api;
  const key = it => `${it.story}|${it.text}`;
  const rounds = pickFor('blank', data.fill_blank, level.count || 4, key);
  let r = 0, mistakes = 0, streak = 0, miss = false, busy = false;

  const root = html(`
    <div class="bl">
      <div class="bl__bar"><span class="bl__round"></span><span class="bl__streak" hidden></span></div>
      <div class="bl__card"><small></small><p></p></div>
      <div class="bl__opts"></div>
    </div>`);
  const card = root.querySelector('.bl__card'), p = card.querySelector('p'), opts = root.querySelector('.bl__opts');
  const streakEl = root.querySelector('.bl__streak');

  function show() {
    const item = rounds[r];
    root.querySelector('.bl__round').textContent = fill(t.round, { i: num(r + 1), n: num(rounds.length) });
    card.querySelector('small').textContent = stories.find(s => s.id === item.story)?.title || '';
    const [before, after = ''] = item.text.split('___');
    p.textContent = '';
    const gap = html('<b class="bl__gap"></b>');
    p.append(before, gap, after);
    card.classList.remove('is-in'); void card.offsetWidth; card.classList.add('is-in');
    opts.textContent = '';
    shuffled([item.answer, ...item.wrong.slice(0, Math.max((level.options || 2) - 1, 1))]).forEach((word, k) => {
      const b = html(`<button class="bl__word" type="button" style="--i:${k}"></button>`);
      b.textContent = word;
      b.addEventListener('click', () => answer(b, word === item.answer, gap));
      opts.append(b);
    });
  }

  async function answer(btn, ok, gap) {
    if (busy || btn.disabled) return;
    if (!ok) {
      mistakes++; miss = true; streak = 0; streakEl.hidden = true;
      btn.disabled = true; btn.classList.add('is-wrong');
      api.oops();
      return;
    }
    busy = true; streak++;
    mark('blank', key(rounds[r]), !miss); miss = false;
    gap.textContent = btn.textContent; gap.classList.add('is-full');
    btn.classList.add('is-right');
    sfx.star(); sparkle(gap, { count: 8 + Math.min(streak, 5) * 4, power: 3 + Math.min(streak, 4) });
    if (streak >= 2) {
      streakEl.textContent = `✦ ${fill(t.streak, { n: num(streak) })}`; streakEl.hidden = false;
      streakEl.classList.remove('is-pop'); void streakEl.offsetWidth; streakEl.classList.add('is-pop');
      api.cheer();
    }
    await wait(1100);
    if (!api.alive()) return;
    if (++r < rounds.length) { busy = false; show(); }
    else api.win(mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
  }

  board.append(root);
  api.say(t.intro);
  show();
}
