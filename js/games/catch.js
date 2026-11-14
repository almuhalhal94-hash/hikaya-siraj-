// لعبة «صائد النجوم»: الفانوس يتحرك يمينًا ويسارًا ليلتقط النجوم الساقطة قبل انتهاء الوقت، ويتجنب الغيوم.
import { fill, html, num } from '../core.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const STAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l6.200 13.400 14.600 1.700-10.800 10 2.900 14.400L24 35.300 11.100 42.500 14 28.100 3.200 18.100l14.600-1.700z" fill="#ffd77a" stroke="#fff4cf" stroke-width="2" stroke-linejoin="round"/></svg>';
const CLOUD = '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M16 36a12 12 0 0 1 0-24 16 16 0 0 1 30-3 13 13 0 0 1 4 27z" fill="#7f8fb8" stroke="#aab7d8" stroke-width="2"/></svg>';
const LANTERN = '<svg viewBox="-30 -30 60 60" aria-hidden="true"><circle class="ct__halo" r="27"/><circle cy="-19" r="3" fill="none" stroke="#c9a24a" stroke-width="2"/><path d="M-8-9q8-13 16 0z" fill="#c9a24a"/><path d="M-9-9H9q7 11 0 22H-9q-7-11 0-22z" fill="#ffd77a" stroke="#c9a24a" stroke-width="2"/><ellipse cy="3" rx="4" ry="7" fill="#fff4cf"/><path d="M-7 13H7l-2 5h-10z" fill="#c9a24a"/></svg>';

export default function catchStars(board, api) {
  const { level, t } = api, goals = level.goals, top = goals[goals.length - 1];
  const root = html(`
    <div class="ct">
      <div class="ct__hud"><span class="ct__score"></span><span class="ct__time"><i></i></span></div>
      <div class="ct__field" tabindex="0" role="application">
        <div class="ct__goal" aria-hidden="true">${goals.map(() => '<i></i>').join('')}</div>
        <div class="ct__lantern">${LANTERN}</div>
        <div class="ct__cover"><p></p><button class="btn" type="button"></button></div>
      </div>
    </div>`);
  const field = root.querySelector('.ct__field'), lantern = root.querySelector('.ct__lantern');
  const cover = root.querySelector('.ct__cover'), btn = cover.querySelector('button'), msg = cover.querySelector('p');
  const scoreEl = root.querySelector('.ct__score'), bar = root.querySelector('.ct__time i'), marks = [...root.querySelectorAll('.ct__goal i')];
  field.setAttribute('aria-label', t.board_label);
  btn.textContent = t.start;

  let W = 0, H = 0, lx = 0.5, items = [], score = 0, left = 0, last = 0, spawn = 0, raf = 0, running = false, dim = 0, keys = 0;

  const size = () => { W = field.clientWidth; H = field.clientHeight; };
  function paintScore() {
    scoreEl.textContent = fill(t.score, { n: num(score), m: num(goals[0]) });
    marks.forEach((m, k) => m.classList.toggle('is-on', score >= goals[k]));
  }
  function clear() { items.forEach(i => i.el.remove()); items = []; }

  function begin() {
    size(); clear();
    score = 0; left = level.secs; spawn = 0.3; dim = 0; last = 0; running = true;
    cover.hidden = true; field.classList.remove('is-dim'); paintScore();
    field.focus({ preventScroll: true });
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!running || !api.alive()) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.05); last = now;
    left -= dt; spawn -= dt;
    if (keys) lx = Math.min(0.95, Math.max(0.05, lx + keys * dt * 0.9));
    if (dim > 0 && (dim -= dt) <= 0) field.classList.remove('is-dim');
    const speedUp = 1 + (1 - left / level.secs) * 0.35;
    if (spawn <= 0) {
      spawn = (0.7 + Math.random() * 0.6) / level.rate;
      const cloud = Math.random() < (level.clouds || 0);
      const el = html(`<i class="ct__item ct__item--${cloud ? 'cloud' : 'star'}">${cloud ? CLOUD : STAR}</i>`);
      field.append(el);
      items.push({ el, cloud, x: 0.08 + Math.random() * 0.84, y: -30, v: level.speed * (0.8 + Math.random() * 0.4), rot: Math.random() * 360 });
    }
    const px = lx * W, py = H - 46;
    lantern.style.transform = `translate(${px}px, 0)`;
    items = items.filter(i => {
      i.y += i.v * speedUp * dt; i.rot += 90 * dt;
      i.el.style.transform = `translate(${i.x * W}px, ${i.y}px) rotate(${i.cloud ? 0 : i.rot}deg)`;
      if (Math.abs(i.x * W - px) < 40 && Math.abs(i.y - py) < 36) {
        i.el.remove();
        const b = field.getBoundingClientRect();
        if (i.cloud) { dim = 1.6; field.classList.add('is-dim'); sfx.oops(); }
        else if (dim <= 0) { score++; paintScore(); sfx.step(); sparkle({ x: b.left + px, y: b.top + py - 10 }, { count: 6, power: 3 }); if (goals.includes(score)) { sfx.star(); api.cheer(); } }
        return false;
      }
      if (i.y > H + 30) { i.el.remove(); return false; }
      return true;
    });
    bar.style.transform = `scaleX(${Math.max(left / level.secs, 0)})`;
    if (left <= 0 || score >= top) return end();
    raf = requestAnimationFrame(tick);
  }

  function end() {
    running = false; clear();
    const stars = goals.filter(g => score >= g).length;
    if (stars) return api.win(stars);
    msg.textContent = fill(t.short, { n: num(score), m: num(goals[0]) });
    btn.textContent = t.retry; cover.hidden = false;
    api.oops();
  }

  const move = e => { const b = field.getBoundingClientRect(); lx = Math.min(0.95, Math.max(0.05, (e.clientX - b.left) / b.width)); if (!running) lantern.style.transform = `translate(${lx * b.width}px, 0)`; };
  field.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; field.setPointerCapture(e.pointerId); move(e); });
  field.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons || e.pressure) move(e); });
  field.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') keys = -1; else if (e.key === 'ArrowRight') keys = 1; else return; e.preventDefault(); });
  field.addEventListener('keyup', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keys = 0; });
  btn.addEventListener('click', () => { sfx.tap(); begin(); });
  const ro = new ResizeObserver(size);
  ro.observe(field);

  board.append(root);
  size(); lantern.style.transform = `translate(${lx * W}px, 0)`;
  paintScore();
  api.say(level.clouds ? t.intro_clouds : t.intro, { n: num(goals[0]) });

  return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); };
}
