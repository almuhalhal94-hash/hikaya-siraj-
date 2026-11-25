// الشاهد الراوي شخصيةً كرتونية: شيء من الحكاية (غار، جذع، حوت…) له عينان وفم يتحرك مع الصوت.
// لا يُرسم إنسان أبدًا: الشاهد دائمًا شيء أو حيوان. الرسم SVG خفيف والحركة كلها هنا وفي css/film.css.

import { ART } from './witness-art.js';

const SVGNS = 'http://www.w3.org/2000/svg';

/** يصنع الشاهد. kind من scenes.json (مثل "cave")، وإن لم يوجد رسم له لا يُعرض شيء. */
export function createWitness(kind) {
  const art = ART[kind];
  if (!art) return null;
  const el = document.createElement('div');
  el.className = 'witness';
  el.dataset.kind = kind;
  if (art.noface) el.classList.add('is-noface');
  el.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.style.setProperty('--wt-skin', art.skin);
  svg.style.setProperty('--wt-ink', art.ink);
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.innerHTML = art.svg;
  el.append(svg);
  const mouth = svg.querySelector('.wt-mouth'), pupils = [...svg.querySelectorAll('.wt-pupil')];

  let level = 0, alive = true, blinkT, lookT;
  const blink = () => {
    if (!alive) return;
    el.classList.remove('is-blink'); void el.offsetWidth; el.classList.add('is-blink');
    blinkT = setTimeout(blink, 2200 + Math.random() * 3200);
  };
  const look = (x, y) => pupils.forEach(p => { p.style.transform = `translate(${x}px, ${y}px)`; });
  const wander = () => {
    if (!alive) return;
    if (!el.classList.contains('is-talking')) look((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6);
    else look(0, 1);
    lookT = setTimeout(wander, 1400 + Math.random() * 2000);
  };
  blinkT = setTimeout(blink, 1200); lookT = setTimeout(wander, 900);

  return {
    el,
    /** calm | curious | worried | wonder | happy */
    setMood(m) { el.dataset.mood = m || 'calm'; },
    /** مستوى الصوت 0..1 يحرك الفم (يُستدعى في كل إطار أثناء الكلام). */
    setLevel(v) {
      level += (v - level) * (v > level ? 0.6 : 0.25);
      if (art.noface) { mouth.style.transform = `scale(${0.8 + level * 0.45})`; mouth.style.opacity = (0.45 + level * 0.55).toFixed(2); }
      else mouth.style.transform = `scale(${1 + level * 0.08}, ${0.32 + level * 0.95})`;
      el.style.setProperty('--wt-talk', level.toFixed(3));
    },
    talking(on) { el.classList.toggle('is-talking', on); if (!on) this.setLevel(0); },
    show(on) { el.classList.toggle('is-on', on); },
    destroy() { alive = false; clearTimeout(blinkT); clearTimeout(lookT); el.remove(); }
  };
}
