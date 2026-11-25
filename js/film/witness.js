// الشاهد الراوي شخصيةً كرتونية: شيء من الحكاية (غار، جذع، حوت…) له عينان وفم يتحرك مع الصوت.
// لا يُرسم إنسان أبدًا: الشاهد دائمًا شيء أو حيوان. الرسم SVG خفيف والحركة كلها هنا وفي css/film.css.

const SVGNS = 'http://www.w3.org/2000/svg';

// وجه مشترك: عينان بجفنين وحاجبين، وفم (موضعه وشكله من رسمة كل شاهد).
const eyes = (cx1, cx2, cy, r = 15) => `
  <g class="wt-eyes">
    ${[cx1, cx2].map((cx, i) => `
    <g class="wt-eye wt-eye--${i ? 'b' : 'a'}" style="transform-origin:${cx}px ${cy}px">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.12}" fill="#fffaf0"/>
      <g class="wt-pupil"><circle cx="${cx}" cy="${cy + 2}" r="${r * 0.55}" fill="#2a1a10"/>
        <circle cx="${cx + r * 0.22}" cy="${cy - r * 0.18}" r="${r * 0.2}" fill="#fff"/></g>
      <rect class="wt-lid" x="${cx - r - 2}" y="${cy - r * 1.3}" width="${r * 2 + 4}" height="${r * 2.6}" style="fill:var(--wt-skin)"/>
    </g>
    <path class="wt-happy" d="M${cx - r} ${cy + 4} q${r} -${r * 1.5} ${r * 2} 0" fill="none" style="stroke:var(--wt-ink)" stroke-width="6" stroke-linecap="round"/>
    <path class="wt-brow wt-brow--${i ? 'b' : 'a'}" d="M${cx - r} ${cy - r * 1.55} q${r} -${r * 0.45} ${r * 2} 0" fill="none" style="stroke:var(--wt-ink)" stroke-width="5" stroke-linecap="round"/>`).join('')}
  </g>`;

// رسوم الشهود. كل رسمة: viewBox 200×200، ولون الجلد --wt-skin (يُستعمل للجفون).
const ART = {
  cave: {
    skin: '#a9855f', ink: '#4a3424',
    svg: `
      <defs>
        <linearGradient id="wtRockL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9b58a"/><stop offset="1" stop-color="#a9855f"/></linearGradient>
        <linearGradient id="wtRockR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d6b4b"/><stop offset="1" stop-color="#5e4632"/></linearGradient>
        <radialGradient id="wtCave" cx="50%" cy="70%" r="75%"><stop offset="0" stop-color="#ffcf73"/><stop offset=".3" stop-color="#b8692a"/><stop offset=".75" stop-color="#3a2212"/><stop offset="1" stop-color="#1a0f08"/></radialGradient>
      </defs>
      <g class="wt-body">
        <path d="M8 190 L46 96 L70 104 L102 22 L136 84 L156 74 L194 190 Z" fill="url(#wtRockR)"/>
        <path d="M8 190 L46 96 L70 104 L102 22 L112 70 L96 120 L104 190 Z" fill="url(#wtRockL)"/>
        <path d="M102 22 L90 52 L100 50 L94 70" fill="none" stroke="#f3dcb8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>
        <path d="M30 168 l16 -6 M160 150 l14 8 M140 104 l10 8 M58 132 l-10 6" stroke="#4a3424" stroke-width="3.5" stroke-linecap="round" opacity=".45"/>
        <circle cx="38" cy="182" r="5" fill="#7d5e42"/><circle cx="170" cy="184" r="6" fill="#6b4f37"/>
        <ellipse class="wt-cheek" cx="58" cy="146" rx="13" ry="7" fill="#e98a6a" opacity=".4"/>
        <ellipse class="wt-cheek" cx="146" cy="146" rx="13" ry="7" fill="#e98a6a" opacity=".4"/>
        ${eyes(80, 120, 108, 15)}
        <g class="wt-mouth">
          <path d="M76 178 C76 150 86 140 101 140 C116 140 126 150 126 178 Z" fill="url(#wtCave)" stroke="#3a2618" stroke-width="4" stroke-linejoin="round"/>
          <ellipse class="wt-glow" cx="101" cy="172" rx="13" ry="5" fill="#ffe3a0"/>
        </g>
      </g>`
  }
};

/** يصنع الشاهد. kind من scenes.json (مثل "cave")، وإن لم يوجد رسم له لا يُعرض شيء. */
export function createWitness(kind) {
  const art = ART[kind];
  if (!art) return null;
  const el = document.createElement('div');
  el.className = 'witness';
  el.dataset.kind = kind;
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
      mouth.style.transform = `scale(${1 + level * 0.08}, ${0.32 + level * 0.95})`;
      el.style.setProperty('--wt-talk', level.toFixed(3));
    },
    talking(on) { el.classList.toggle('is-talking', on); if (!on) this.setLevel(0); },
    show(on) { el.classList.toggle('is-on', on); },
    destroy() { alive = false; clearTimeout(blinkT); clearTimeout(lookT); el.remove(); }
  };
}
