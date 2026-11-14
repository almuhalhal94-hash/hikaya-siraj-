// لعبة «من الشاهد؟»: وضع الاختيار (الشاهد يسأل عن قصته) ووضع البطاقات المقلوبة (طابق الشاهد بقصته).
import { fill, html, num, wait } from '../core.js';
import { thumbnail } from '../film/engine.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';
import { shuffled } from './order.js';

export default function witness(board, api) {
  return api.level.mode === 'pairs' ? pairs(board, api) : choose(board, api);
}

/** صورة الشاهد: لقطة من فيلم قصته (بلا أشخاص). */
function art(item, scenes) {
  const dir = scenes[item.story];
  const spec = dir?.scenes?.[dir.thumb || 0];
  return spec ? thumbnail(spec) : '<div class="wt__noart"></div>';
}

// ——— وضع الاختيار ———
function choose(board, api) {
  const { level, data, t, scenes } = api;
  const rounds = shuffled(data.who_is_witness);
  let r = 0, mistakes = 0, busy = false;

  const root = html(`
    <div class="wt">
      <div class="wt__dots" aria-hidden="true">${'<i></i>'.repeat(rounds.length)}</div>
      <figure class="wt__who"><div class="wt__art"></div><figcaption></figcaption></figure>
      <div class="wt__opts"></div>
    </div>`);
  const who = root.querySelector('.wt__who'), opts = root.querySelector('.wt__opts'), dots = [...root.querySelectorAll('.wt__dots i')];

  function show() {
    const item = rounds[r];
    dots.forEach((d, k) => { d.classList.toggle('is-done', k < r); d.classList.toggle('is-now', k === r); });
    who.querySelector('.wt__art').innerHTML = art(item, scenes);
    who.querySelector('figcaption').textContent = item.witness;
    who.classList.remove('is-in'); void who.offsetWidth; who.classList.add('is-in');
    opts.textContent = '';
    shuffled([item.answer, ...item.wrong.slice(0, Math.max((level.options || 2) - 1, 1))]).forEach((text, k) => {
      const b = html(`<button class="wt__opt" type="button" style="--i:${k}"></button>`);
      b.textContent = text;
      b.addEventListener('click', () => answer(b, text === item.answer));
      opts.append(b);
    });
    api.say(t.ask, { witness: item.witness });
  }

  async function answer(btn, ok) {
    if (busy || btn.disabled) return;
    if (!ok) {
      mistakes++; btn.disabled = true; btn.classList.add('is-wrong');
      api.oops();
      return;
    }
    busy = true;
    btn.classList.add('is-right'); who.classList.add('is-glow');
    sfx.star(); api.cheer(); sparkle(btn, { count: 14, power: 4 });
    await wait(1000);
    if (!api.alive()) return;
    who.classList.remove('is-glow');
    if (++r < rounds.length) { busy = false; show(); }
    else { dots.forEach(d => { d.classList.add('is-done'); d.classList.remove('is-now'); }); api.win(mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1); }
  }

  board.append(root);
  show();
}

// ——— وضع البطاقات المقلوبة ———
function pairs(board, api) {
  const { data, t, scenes } = api;
  const deck = shuffled(data.who_is_witness.flatMap((item, k) => [{ k, item, side: 'w' }, { k, item, side: 's' }]));
  let open = [], matched = 0, misses = 0, busy = false;

  const root = html(`<div class="wt wt--pairs"><div class="wt__grid${deck.length > 8 ? ' wt__grid--many' : ''}"></div></div>`);
  const grid = root.querySelector('.wt__grid');
  deck.forEach((c, i) => {
    const b = html(`
      <button class="wt__flip" type="button" style="--i:${i}">
        <span class="wt__face wt__face--back"></span>
        <span class="wt__face wt__face--front wt__face--${c.side}">${c.side === 'w' ? `<span class="wt__art">${art(c.item, scenes)}</span>` : ''}<b></b></span>
      </button>`);
    b.querySelector('b').textContent = c.side === 'w' ? c.item.witness : c.item.answer;
    const label = () => b.setAttribute('aria-label', b.classList.contains('is-open') ? b.querySelector('b').textContent : `${t.card_back} ${num(i + 1)}`);
    label();
    b.addEventListener('click', async () => {
      if (busy || b.classList.contains('is-open')) return;
      b.classList.add('is-open'); label(); sfx.flip();
      open.push({ c, b, label });
      if (open.length < 2) return;
      const [x, y] = open; open = [];
      if (x.c.k === y.c.k) {
        matched++;
        await wait(380);
        if (!api.alive()) return;
        [x, y].forEach(o => { o.b.classList.add('is-match'); o.b.disabled = true; sparkle(o.b, { count: 9, power: 3 }); });
        sfx.star(); api.cheer();
        if (matched === data.who_is_witness.length) api.win(misses <= data.who_is_witness.length ? 3 : misses <= data.who_is_witness.length * 2 ? 2 : 1);
      } else {
        busy = true; misses++;
        await wait(1100);
        if (!api.alive()) return;
        [x, y].forEach(o => { o.b.classList.remove('is-open'); o.label(); });
        sfx.oops(); busy = false;
      }
    });
    grid.append(b);
  });

  board.append(root);
  api.say(t.intro_pairs);
}
