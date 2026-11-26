// بيت سِراج: مساحات التزيين (الغرفة، الحديقة، السطح) ورسوم القطع واستوديو التزيين بالعرض.
// الأسماء والنجوم المطلوبة وكلام سِراج من ui.house (items، themes، spaces)؛ هنا الرسم والتفاعل فقط.
// الحالة: store.state.decor = { room:{wall,rug,items}, garden:{ground,items}, roof:{floor,items} }، والقطعة {t,x,y,s,f} (x,y مركزها بالنسبة المئوية).
import { store, fill, html, num, pick } from '../core.js';
import { createSiraj } from '../siraj.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const G = '#c9a24a', GD = '#8f6b22';
const HUES = ['#ff8a7a', '#ffd77a', '#5fd6c8', '#b9a3ff', '#ff9ec4', '#7ec8ff'];

/** نقاط على منحنى تربيعي من (0,y0) إلى (W,y0) ينزل إلى العمق d. */
function swag(n, W = 400, y0 = 8, d = 42) {
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n, x = W * t, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + d * 2) + t * t * y0;
    return [x, y];
  });
}
const rope = (W = 400, y0 = 8, d = 42) => `<path d="M0 ${y0}Q${W / 2} ${y0 + d * 2} ${W} ${y0}" fill="none" stroke="#e8d3a2" stroke-width="2.5"/>`;
const STAR = (cx, cy, r, fill) => { let p = ''; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`; } return `<path d="${p}z" fill="${fill}"/>`; };

export const ART = {
  flags: `<svg viewBox="0 0 400 100">${rope()}${swag(11).map(([x, y], i) => `<path d="M${x - 13} ${y - 2}h26l-13 30z" fill="${HUES[i % 6]}" stroke="rgba(0,0,0,.15)"/>`).join('')}</svg>`,
  moons: `<svg viewBox="0 0 400 120">${rope()}${swag(7).map(([x, y], i) => `<path d="M${x} ${y}v${18 + (i % 2) * 16}" stroke="#e8d3a2" stroke-width="1.5"/>` + (i % 2 ? STAR(x, y + 44, 12, '#ffd77a') : `<path d="M${x + 6} ${y + 18}a15 15 0 1 0 9 26a12 12 0 0 1-9-26z" fill="#fff4cf" stroke="${G}" stroke-width="1.5"/>`)).join('')}</svg>`,
  lanterns: `<svg viewBox="0 0 400 120">${rope()}${swag(7).map(([x, y], i) => `<g class="dc-glow" style="--d:${i * -0.4}s"><path d="M${x} ${y}v12" stroke="#e8d3a2" stroke-width="1.5"/><path d="M${x - 9} ${y + 18}q9-9 18 0z" fill="${G}"/><path d="M${x - 10} ${y + 18}h20q5 14 0 28h-20q-5-14 0-28z" fill="${HUES[i % 6]}" stroke="${G}" stroke-width="2"/><ellipse cx="${x}" cy="${y + 32}" rx="4" ry="7" fill="#fff8dc"/><path d="M${x - 7} ${y + 46}h14l-3 5h-8z" fill="${G}"/></g>`).join('')}</svg>`,
  lights: `<svg viewBox="0 0 400 100">${rope()}${swag(16).map(([x, y], i) => `<circle class="dc-blink" style="--d:${(i % 4) * -0.35}s" cx="${x}" cy="${y + 7}" r="6" fill="${HUES[i % 6]}"/>`).join('')}</svg>`,
  star: `<svg viewBox="0 0 48 48" class="dc-glow">${STAR(24, 25, 21, '#ffd77a')}</svg>`,
  crescent: `<svg viewBox="0 0 48 48"><path d="M30 5a19 19 0 1 0 13 30A16 16 0 0 1 30 5z" fill="#fff4cf" stroke="#ffd77a" stroke-width="2"/></svg>`,
  hlantern: `<svg viewBox="0 0 48 90"><path d="M24 0v22" stroke="#e8d3a2" stroke-width="2"/><circle cx="24" cy="26" r="4" fill="none" stroke="${G}" stroke-width="2.5"/><path d="M12 38q12-14 24 0z" fill="${G}"/><g class="dc-glow"><path d="M12 38h24q8 16 0 32H12q-8-16 0-32z" fill="#ffcf6b" stroke="${G}" stroke-width="2.5"/><ellipse cx="24" cy="54" rx="5" ry="9" fill="#fff8dc"/></g><path d="M14 70h20l-4 7H18z" fill="${G}"/></svg>`,
  frame: `<svg viewBox="0 0 120 80"><rect x="3" y="3" width="114" height="74" rx="6" fill="#123056" stroke="${G}" stroke-width="5"/><rect x="11" y="11" width="98" height="58" rx="3" fill="none" stroke="#e8d3a2" stroke-width="1" stroke-dasharray="3 3"/><text x="60" y="49" text-anchor="middle" font-family="Tajawal, sans-serif" font-weight="800" font-size="20" fill="#ffd77a">ما شاء الله</text></svg>`,
  clock: `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#fff4cf" stroke="${G}" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<circle cx="${30 + 19 * Math.cos(i * Math.PI / 2)}" cy="${30 + 19 * Math.sin(i * Math.PI / 2)}" r="2.2" fill="${GD}"/>`).join('')}<path d="M30 30V15" stroke="#3a2a05" stroke-width="3" stroke-linecap="round"/><path class="dc-hand" d="M30 30h13" stroke="#b9617a" stroke-width="2.5" stroke-linecap="round"/><circle cx="30" cy="30" r="3" fill="#3a2a05"/></svg>`,
  cushions: `<svg viewBox="0 0 140 60"><rect x="6" y="14" width="62" height="42" rx="16" fill="#b9617a"/><rect x="14" y="22" width="46" height="26" rx="10" fill="none" stroke="#ffd77a" stroke-width="2" stroke-dasharray="4 3"/><rect x="72" y="10" width="62" height="46" rx="16" fill="#2f9c90"/><path d="M84 33h38M103 18v30" stroke="#ffd77a" stroke-width="2.5"/>${[6, 68, 72, 134].map(x => `<circle cx="${x}" cy="56" r="3.5" fill="#ffd77a"/>`).join('')}</svg>`,
  majlis: `<svg viewBox="0 0 240 80"><rect x="4" y="8" width="232" height="34" rx="10" fill="#7a3d55"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${22 + i * 39} 14l10 12-10 12-10-12z" fill="#ffd77a" opacity=".85"/>`).join('')}<rect x="2" y="40" width="236" height="32" rx="10" fill="#b9617a"/><rect x="2" y="66" width="236" height="10" rx="4" fill="#5a2a3d"/><path d="M10 56h220" stroke="#ffd77a" stroke-width="2" stroke-dasharray="8 6"/></svg>`,
  stack: `<svg viewBox="0 0 80 100">${[['#2f9c90', 70], ['#b9a3ff', 46], ['#ff8a7a', 22]].map(([c, y], i) => `<rect x="${6 + i * 4}" y="${y}" width="${68 - i * 8}" height="26" rx="12" fill="${c}"/><path d="M${18 + i * 4} ${y + 13}h${44 - i * 8}" stroke="#fff4cf" stroke-width="2" stroke-dasharray="4 4"/>`).join('')}</svg>`,
  table: `<svg viewBox="0 0 100 60"><ellipse cx="50" cy="14" rx="46" ry="10" fill="#d9b36a"/><ellipse cx="50" cy="12" rx="46" ry="9" fill="#e8c582"/><path d="M14 20l-4 36M86 20l4 36M50 22v32" stroke="#8f6b22" stroke-width="5" stroke-linecap="round"/><ellipse cx="50" cy="8" rx="16" ry="5" fill="#fff4cf"/>${[40, 47, 54, 60].map(x => `<ellipse cx="${x}" cy="6" rx="3.5" ry="2.4" fill="#7a3d1c"/>`).join('')}</svg>`,
  books: `<svg viewBox="0 0 80 110"><rect x="2" y="2" width="76" height="106" rx="4" fill="#6b4422"/><rect x="7" y="7" width="66" height="96" fill="#3d2a1c"/>${[30, 62, 94].map(y => `<rect x="5" y="${y}" width="70" height="5" fill="#8f6b22"/>`).join('')}${[7, 39, 71].map((y, r) => [0, 1, 2, 3, 4, 5].map(i => `<rect x="${9 + i * 10.5}" y="${y + 3 + (i + r) % 3 * 2}" width="8" height="${20 - (i + r) % 3 * 2}" rx="1.5" fill="${HUES[(i + r * 2) % 6]}"/>`).join('')).join('')}</svg>`,
  lamp: `<svg viewBox="0 0 50 130"><path class="dc-glow" d="M8 34L16 4h18l8 30z" fill="#ffcf6b" stroke="${G}" stroke-width="2"/><path d="M25 34v84" stroke="${G}" stroke-width="4"/><ellipse cx="25" cy="122" rx="16" ry="6" fill="${GD}"/></svg>`,
  scope: `<svg viewBox="0 0 100 100"><path d="M50 52L30 96M50 52l20 44M50 52v44" stroke="#8f6b22" stroke-width="4" stroke-linecap="round"/><g transform="rotate(-32 50 48)"><rect x="14" y="40" width="72" height="16" rx="6" fill="#2a4f8a" stroke="${G}" stroke-width="2.5"/><rect x="80" y="36" width="12" height="24" rx="4" fill="${G}"/><rect x="8" y="43" width="10" height="10" rx="3" fill="${G}"/></g><circle cx="50" cy="52" r="5" fill="${G}"/></svg>`,
  chest: `<svg viewBox="0 0 80 64"><rect x="4" y="22" width="72" height="40" rx="5" fill="#b07a3c" stroke="#6b4422" stroke-width="3"/><path d="M4 24q36-28 72 0" fill="#c98f4a" stroke="#6b4422" stroke-width="3"/><path d="M4 34h72" stroke="${G}" stroke-width="4"/><rect x="34" y="30" width="12" height="12" rx="2" fill="${G}"/>${STAR(18, 50, 5, '#ffd77a')}${STAR(62, 50, 5, '#ffd77a')}</svg>`,
  bench: `<svg viewBox="0 0 140 70"><rect x="6" y="6" width="128" height="10" rx="4" fill="#a8743a"/><rect x="6" y="20" width="128" height="10" rx="4" fill="#a8743a"/><rect x="2" y="38" width="136" height="12" rx="4" fill="#c98f4a"/><path d="M14 30v36M126 30v36M14 4v36M126 4v36" stroke="#4a3a2a" stroke-width="6" stroke-linecap="round"/></svg>`,
  swing: `<svg viewBox="0 0 110 120"><path d="M8 116L22 6h66l14 110" fill="none" stroke="#8f6b22" stroke-width="6" stroke-linecap="round"/><path d="M14 6h82" stroke="#6b4422" stroke-width="8" stroke-linecap="round"/><g class="dc-swing"><path d="M40 8v76M70 8v76" stroke="#e8d3a2" stroke-width="2.5"/><rect x="34" y="82" width="42" height="9" rx="4" fill="#ff8a7a"/></g></svg>`,
  tent: `<svg viewBox="0 0 180 110"><path d="M90 6L6 104h168z" fill="#e5b65a"/><path d="M90 6L48 104h84z" fill="#b9617a"/><path d="M90 6l-18 98h36z" fill="#3d2a1c"/><path d="M6 104h168" stroke="#8f6b22" stroke-width="5"/><path d="M90 6V0" stroke="#8f6b22" stroke-width="4"/>${STAR(90, 0, 7, '#ffd77a')}${[30, 60, 120, 150].map(x => `<circle cx="${x}" cy="88" r="3" fill="#fff4cf"/>`).join('')}</svg>`,
  fountain: `<svg viewBox="0 0 120 100"><ellipse cx="60" cy="84" rx="56" ry="14" fill="#8fa1c4"/><ellipse cx="60" cy="80" rx="50" ry="10" fill="#4fa3d1"/><rect x="54" y="36" width="12" height="46" fill="#c9d6ea"/><ellipse cx="60" cy="38" rx="26" ry="7" fill="#c9d6ea"/><ellipse cx="60" cy="36" rx="22" ry="5" fill="#4fa3d1"/><g class="dc-spray" fill="#bfe8ff">${[-1, 0, 1].map(k => `<path d="M60 34q${k * 14} -30 ${k * 26} -4" fill="none" stroke="#bfe8ff" stroke-width="3" stroke-linecap="round"/>`).join('')}</g></svg>`,
  flowers: `<svg viewBox="0 0 100 70">${[[16, 30], [38, 18], [60, 26], [82, 16], [28, 44], [70, 42]].map(([x, y], i) => `<path d="M${x} ${y}V68" stroke="#3f9a5a" stroke-width="3"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${x + 7 * Math.cos(k * 1.256)}" cy="${y + 7 * Math.sin(k * 1.256)}" r="5" fill="${HUES[i % 6]}"/>`).join('')}<circle cx="${x}" cy="${y}" r="4" fill="#fff4cf"/>`).join('')}</svg>`,
  vase: `<svg viewBox="0 0 50 90"><path d="M25 50V14" stroke="#3f9a5a" stroke-width="3"/><path d="M25 34q-12-4-14-14q12 2 14 14" fill="#5fd6a0"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${25 + 6 * Math.cos(k * 1.256)}" cy="${12 + 6 * Math.sin(k * 1.256)}" r="5" fill="#ff8a7a"/>`).join('')}<circle cx="25" cy="12" r="3.5" fill="#ffd77a"/><path d="M14 50h22q6 18-2 38H16q-8-20-2-38z" fill="#2a4f8a" stroke="${G}" stroke-width="2"/></svg>`,
  palm: `<svg viewBox="0 0 70 100"><g fill="none" stroke-linecap="round"><path d="M34 76q3-26-1-46" stroke="#b98a52" stroke-width="5"/><g stroke="#5fd6a0" stroke-width="4"><path d="M33 30q-14-12-28-3M33 30q-18-1-23 15M33 30q-6-16-20-19M33 30q14-12 30-4M33 30q18-2 25 14M33 30q8-16 21-17"/></g></g><circle cx="29" cy="34" r="3" fill="#ffb35c"/><circle cx="37" cy="35" r="3" fill="#ffb35c"/><path d="M18 74h32l-4 24H22z" fill="#c4683a"/><rect x="16" y="70" width="36" height="7" rx="2" fill="#a4542c"/></svg>`,
  bush: `<svg viewBox="0 0 100 60"><path d="M6 58q-6-22 14-26q2-20 24-18q10-14 28-2q22-2 22 22q10 8 0 24z" fill="#3f9a5a"/><path d="M20 50q-4-14 10-16M50 40q4-14 18-10" fill="none" stroke="#5fd6a0" stroke-width="3" stroke-linecap="round"/>${[[30, 30], [62, 22], [80, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#ff9ec4"/>`).join('')}</svg>`,
  bigpalm: `<svg viewBox="0 0 120 200"><path d="M62 198q8-80-6-140" fill="none" stroke="#a87a44" stroke-width="10" stroke-linecap="round"/>${[80, 100, 120, 140, 160, 180].map(y => `<path d="M${52 + (y - 60) / 18} ${y}h16" stroke="#7a5530" stroke-width="2"/>`).join('')}<g fill="none" stroke="#3f9a5a" stroke-width="7" stroke-linecap="round"><path d="M56 58q-26-20-52-6M56 58q-34 2-44 30M56 58q-10-30-36-36M56 58q26-22 58-8M56 58q34-2 46 28M56 58q14-30 40-34M56 58q-2-30 6-52"/></g><g fill="#c4683a">${[[48, 66], [56, 70], [64, 66], [52, 74], [60, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join('')}</g></svg>`,
  olive: `<svg viewBox="0 0 120 130"><path d="M58 128q-6-30 4-52q-14-10-20-26M62 76q14-8 22-24" fill="none" stroke="#7a5530" stroke-width="8" stroke-linecap="round"/><g fill="#7fa86a"><ellipse cx="60" cy="40" rx="50" ry="32"/><ellipse cx="30" cy="54" rx="26" ry="18"/><ellipse cx="90" cy="54" rx="26" ry="18"/></g><g fill="#a8c98f" opacity=".7"><ellipse cx="44" cy="30" rx="14" ry="6"/><ellipse cx="78" cy="38" rx="14" ry="6"/></g>${[[36, 44], [58, 30], [80, 46], [66, 58], [24, 58], [96, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="4" fill="#3a4a2a"/>`).join('')}</svg>`,
  butterfly: `<svg viewBox="0 0 60 50" class="dc-flap"><g class="dc-wing"><path d="M30 25Q8 0 4 16q-2 12 26 9zM30 25Q10 46 8 36q0-8 22-11z" fill="#b9a3ff"/><path d="M30 25Q52 0 56 16q2 12-26 9zM30 25Q50 46 52 36q0-8-22-11z" fill="#ff9ec4"/></g><ellipse cx="30" cy="25" rx="2.5" ry="12" fill="#3a2a5a"/></svg>`,
  fish: `<svg viewBox="0 0 90 90"><ellipse cx="45" cy="84" rx="28" ry="5" fill="rgba(0,0,0,.25)"/><circle cx="45" cy="46" r="38" fill="rgba(143,224,214,.25)" stroke="#bfe8ff" stroke-width="3"/><path d="M10 52a35 35 0 0 0 70 0z" fill="rgba(79,163,209,.5)"/><g class="dc-swim"><path d="M34 58q12-12 24 0q-12 10-24 0z" fill="#ff8a3d"/><path d="M34 58l-8-7v14z" fill="#ff8a3d"/><circle cx="52" cy="56" r="1.8" fill="#fff"/></g><g class="dc-bub" fill="none" stroke="#e8fbff" stroke-width="1.5"><circle cx="58" cy="40" r="3"/><circle cx="62" cy="30" r="2"/></g><path d="M18 22q27-10 54 0" fill="none" stroke="#fff" stroke-width="3" opacity=".4" stroke-linecap="round"/></svg>`,
  sheep: `<svg viewBox="0 0 100 80"><path d="M28 64v14M42 66v12M62 66v12M76 64v14" stroke="#3a2a2a" stroke-width="5" stroke-linecap="round"/><g fill="#f4efe6">${[[30, 40], [46, 30], [62, 30], [76, 40], [52, 50], [36, 54], [70, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15"/>`).join('')}</g><g class="dc-nod"><ellipse cx="14" cy="40" rx="11" ry="13" fill="#3a2a2a"/><ellipse cx="6" cy="34" rx="7" ry="3.5" fill="#3a2a2a" transform="rotate(-30 6 34)"/><circle cx="12" cy="38" r="2" fill="#fff"/></g></svg>`,
  cat: `<svg viewBox="0 0 120 70"><ellipse cx="60" cy="64" rx="50" ry="6" fill="rgba(0,0,0,.22)"/><path d="M98 54q22 4 12-16" fill="none" stroke="#f0a24a" stroke-width="7" stroke-linecap="round" class="dc-tail"/><g class="dc-breathe"><ellipse cx="64" cy="46" rx="38" ry="18" fill="#f0a24a"/><path d="M44 36q8 6 0 14M60 32q8 8 0 18M76 34q8 6 0 14" fill="none" stroke="#c97a2a" stroke-width="3"/></g><g class="dc-head"><circle cx="28" cy="44" r="16" fill="#f0a24a"/><path d="M16 34l-2-14 12 8zM34 30l8-12 2 14z" fill="#f0a24a"/><path d="M18 32l-1-7 5 4zM35 28l4-6 1 7z" fill="#ff9ec4"/><g class="dc-shut" stroke="#3a2a05" stroke-width="2" fill="none" stroke-linecap="round"><path d="M20 44q3 3 6 0M30 44q3 3 6 0"/></g><g class="dc-open" fill="#2a6a3a"><circle cx="23" cy="43" r="2.6"/><circle cx="33" cy="43" r="2.6"/></g><path d="M27 49l1.5 2 1.5-2z" fill="#ff7a9a"/></g><text class="dc-z" x="40" y="22" font-family="Tajawal,sans-serif" font-weight="800" font-size="12" fill="#fff4cf">z z</text></svg>`,
  camel: `<svg viewBox="0 0 160 130"><path d="M50 84l-4 44M64 86v42M108 86v42M122 84l4 44" stroke="#a8743a" stroke-width="8" stroke-linecap="round"/><path d="M40 86q-6-30 20-36q10-26 28-6q14-22 32 4q20 6 18 38z" fill="#c98f4a"/><path d="M44 66q-14-8-16-30q-2-20-14-20" fill="none" stroke="#c98f4a" stroke-width="12" stroke-linecap="round"/><g class="dc-nod"><ellipse cx="12" cy="16" rx="12" ry="8" fill="#c98f4a"/><circle cx="10" cy="13" r="2" fill="#3a2a05"/><path d="M14 4l2-4" stroke="#a8743a" stroke-width="4" stroke-linecap="round"/></g><path d="M60 60q20-6 40 4" fill="none" stroke="#b9617a" stroke-width="6"/><path d="M66 62v14M82 60v14M96 64v12" stroke="#ffd77a" stroke-width="3"/><path d="M138 70q12 6 8 22" fill="none" stroke="#a8743a" stroke-width="4" stroke-linecap="round"/></svg>`,
  bird: `<svg viewBox="0 0 60 50"><g class="dc-hop"><ellipse cx="30" cy="30" rx="16" ry="12" fill="#7ec8ff"/><circle cx="16" cy="20" r="10" fill="#7ec8ff"/><circle cx="13" cy="18" r="2" fill="#123056"/><path d="M6 20l-6 3 6 2z" fill="#ffb35c"/><path class="dc-wing2" d="M30 26q12-12 22 2q-10 8-22-2z" fill="#4fa3d1"/><path d="M44 32l12 4-12 2z" fill="#4fa3d1"/><ellipse cx="26" cy="34" rx="8" ry="5" fill="#fff4cf" opacity=".8"/></g><path d="M26 42v6M34 42v6" stroke="#ffb35c" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  ball: `<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="22" fill="#ff8a7a"/><path d="M25 3a22 22 0 0 1 0 44M3 25h44" fill="none" stroke="#fff4cf" stroke-width="5"/><path d="M12 12q8 13 0 26" fill="none" stroke="#ffd77a" stroke-width="5"/><circle cx="17" cy="15" r="4" fill="#fff" opacity=".5"/></svg>`,
  blocks: `<svg viewBox="0 0 100 80">${[['أ', 6, 46, '#ff8a7a'], ['ب', 40, 46, '#5fd6c8'], ['ت', 23, 12, '#ffd77a']].map(([c, x, y, f]) => `<rect x="${x}" y="${y}" width="32" height="32" rx="5" fill="${f}" stroke="rgba(0,0,0,.2)" stroke-width="2"/><text x="${x + 16}" y="${y + 24}" text-anchor="middle" font-family="Tajawal,sans-serif" font-weight="800" font-size="22" fill="#123056">${c}</text>`).join('')}<rect x="74" y="54" width="22" height="22" rx="4" fill="#b9a3ff"/></svg>`,
  boat: `<svg viewBox="0 0 80 80"><path d="M40 6v52" stroke="#6b4422" stroke-width="3"/><path d="M42 8l28 42H42z" fill="#fff4cf"/><path d="M38 16L16 50h22z" fill="#ff8a7a"/><path d="M6 58h68l-10 16H16z" fill="#2a6ab0"/><path d="M12 64h56" stroke="#ffd77a" stroke-width="2"/></svg>`,
  kite: `<svg viewBox="0 0 70 110" class="dc-float"><path d="M35 2L64 36 35 70 6 36z" fill="#ffd77a"/><path d="M35 2v68M6 36h58" stroke="#b9617a" stroke-width="2"/><path d="M35 2L64 36H35zM35 70L6 36h29z" fill="#ff8a7a"/><path d="M35 70q-10 10 0 18t0 20" fill="none" stroke="#e8d3a2" stroke-width="2"/>${[80, 92, 104].map((y, i) => `<path d="M${30 + i % 2 * 6} ${y}l5 -4 5 4-5 4z" fill="${HUES[i + 2]}"/>`).join('')}</svg>`
};

/** خلفية كل مساحة (الحالة البصرية: لون الجدار/الأرض). */
export function spaceBase(space) {
  if (space === 'garden') return `
    <i class="sp-sun"></i><i class="sp-cloud"></i><i class="sp-cloud sp-cloud--2"></i>
    <svg class="sp-hills" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0 80V44q60-40 130-16t140-6 130 12v46z" fill="var(--hill)"/></svg>
    <svg class="sp-house" viewBox="0 0 120 140"><path d="M8 140V44h104v96z" fill="#e8d3a2"/><path d="M0 46h120v-8H0z" fill="#c9a24a"/><path d="M44 140V90a16 16 0 0 1 32 0v50z" fill="#6b4422"/><circle cx="70" cy="114" r="2.5" fill="#ffd77a"/><path d="M20 60h24v22H20zM76 60h24v22H76z" fill="#ffcf6b" class="sp-win"/></svg>
    <svg class="sp-fence" viewBox="0 0 400 40" preserveAspectRatio="none">${Array.from({ length: 21 }, (_, i) => `<path d="M${i * 20 + 4} 40V10l6-8 6 8v30z" fill="#e8d3a2" opacity=".9"/>`).join('')}<path d="M0 18h400M0 32h400" stroke="#c9a24a" stroke-width="4"/></svg>
    <i class="sp-ground"></i>`;
  if (space === 'roof') return `
    ${Array.from({ length: 26 }, (_, i) => `<i class="sp-st" style="left:${(i * 37 + 7) % 97}%;top:${(i * 23 + 5) % 42}%;--d:${(i % 7) * -0.5}s"></i>`).join('')}
    <i class="sp-moon"></i>
    <svg class="sp-city" viewBox="0 0 400 70" preserveAspectRatio="none"><path d="M0 70V50h30v-8h20v8h24V36q14-18 28 0v34h18V20h6v-8h4v8h6v50h30V44h40v-6q12-14 24 0v32h26V30h6v-6h4v6h6v40h40V48h30v-8h20v30z" fill="#0a1a38"/>${[[40, 56], [96, 54], [170, 56], [250, 52], [330, 56], [370, 56]].map(([x, y]) => `<rect x="${x}" y="${y}" width="5" height="6" fill="#ffcf6b" opacity=".8"/>`).join('')}</svg>
    <svg class="sp-parapet" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 40V14${Array.from({ length: 20 }, (_, i) => `h10v-8h10v8`).join('')}V40z" fill="#c9b48a"/><path d="M0 22h400" stroke="#a8946a" stroke-width="2"/></svg>
    <i class="sp-ground"></i>`;
  return `
    <div class="hs__window" aria-hidden="true"><i class="hs__orb"></i><i class="hs__wstar"></i><i class="hs__wstar"></i><i class="hs__wstar"></i><i class="hs__wstar"></i></div>
    <div class="hs__shelf" aria-hidden="true"></div>
    <div class="hs__rug" aria-hidden="true"></div>`;
}

const DEFAULTS = {
  room: { wall: 'night', rug: 'teal', items: [{ t: 'cushions', x: 82, y: 84 }, { t: 'palm', x: 12, y: 74 }, { t: 'star', x: 34, y: 12 }] },
  garden: { ground: 'grass', items: [{ t: 'flowers', x: 30, y: 86 }, { t: 'bigpalm', x: 84, y: 58 }] },
  roof: { floor: 'tiles', items: [{ t: 'hlantern', x: 20, y: 14 }] }
};
const OLD = { star: 'star', crescent: 'crescent', palm: 'palm', lamp: 'hlantern' };

/** حالة التزيين، مع نقل زينة الإصدار القديم (store.state.house) إلى الغرفة. */
export function decorState() {
  const d = store.state.decor || {};
  const out = {};
  for (const k of Object.keys(DEFAULTS)) out[k] = { ...DEFAULTS[k], ...(d[k] || {}), items: [...(d[k]?.items || DEFAULTS[k].items)] };
  if (!d.room && (store.state.house || []).length) out.room.items = [...out.room.items, ...store.state.house.filter(x => OLD[x.t]).map(x => ({ t: OLD[x.t], x: x.x, y: x.y }))];
  return out;
}
export const saveDecor = d => store.set({ decor: d });

/** يرسم مساحة كاملة (الخلفية + القطع) داخل عنصر الغرفة. */
export function paintSpace(room, space, d, cat) {
  const s = d[space];
  room.dataset.space = space;
  ['wall', 'rug', 'ground', 'floor'].forEach(k => { if (s[k]) room.dataset[k] = s[k]; else delete room.dataset[k]; });
  room.querySelector('.sp-base').innerHTML = spaceBase(space);
  const layer = room.querySelector('.sp-items'); layer.textContent = '';
  s.items.forEach((it, i) => {
    const w = cat[it.t]?.w; if (!w || !ART[it.t]) return;
    const el = html(`<div class="dc dc--${it.t}" data-i="${i}" style="left:${it.x}%;top:${it.y}%;width:${(w * (it.s || 1)).toFixed(2)}%;--f:${it.f ? -1 : 1}">${ART[it.t]}</div>`);
    layer.append(el);
  });
}

/** استوديو التزيين: ملء الشاشة، بالعرض إن أمكن. */
export function openStudio({ ui, lines, space: space0, onClose }) {
  const t = ui.house, stars = store.state.stars;
  const cat = Object.fromEntries(t.items.map(x => [x.id, x]));
  const d = decorState();
  let space = space0, tab = 'wall', sel = -1, clearArm = 0;
  const box = html(`
    <div class="ds" role="dialog" aria-modal="true">
      <div class="ds__bar">
        <button class="btn ds__done" type="button"></button>
        <div class="ds__spaces" role="tablist"></div>
        <div class="ds__talk"><span class="ds__sj"></span><p aria-live="polite"></p></div>
        <span class="chip ds__stars"></span>
      </div>
      <div class="ds__stage"><div class="hsr ds__room"><div class="sp-base"></div><div class="sp-items"></div></div>
        <div class="ds__tools" hidden></div></div>
      <aside class="ds__tray"><div class="ds__tabs" role="tablist"></div><div class="ds__grid"></div><button class="ds__clear" type="button"></button></aside>
      <div class="ds__rotate"><svg viewBox="0 0 80 80" aria-hidden="true"><rect class="ds__phone" x="28" y="12" width="24" height="56" rx="5" fill="none" stroke="currentColor" stroke-width="4"/><path d="M14 22a30 30 0 0 1 14-10M66 58a30 30 0 0 1-14 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><p></p><button class="btn" type="button"></button></div>
    </div>`);
  const $ = q => box.querySelector(q);
  const room = $('.ds__room'), grid = $('.ds__grid'), tools = $('.ds__tools'), talk = $('.ds__talk p');
  const mini = createSiraj({ label: ui.common.siraj }); $('.ds__sj').append(mini.el);
  $('.ds__done').textContent = `✓ ${t.studio_done}`;
  $('.ds__stars').textContent = `★ ${num(stars)}`;
  $('.ds__clear').textContent = t.studio_clear;
  $('.ds__rotate p').textContent = t.rotate; $('.ds__rotate .btn').textContent = t.rotate_skip;
  $('.ds__rotate .btn').addEventListener('click', () => { sfx.tap(); box.classList.add('is-portrait-ok'); });
  const say = (s, mood = 'joy') => { talk.textContent = s; mini.react(mood); };
  say(t.studio_hint);

  const save = () => saveDecor(d);
  const paint = () => { paintSpace(room, space, d, cat); markSel(); };
  const markSel = () => {
    room.querySelectorAll('.dc').forEach(el => el.classList.toggle('is-sel', +el.dataset.i === sel));
    tools.hidden = sel < 0;
  };

  // ——— المساحات ———
  function paintSpaces() {
    const bar = $('.ds__spaces'); bar.textContent = '';
    t.spaces.forEach(sp => {
      const open = stars >= sp.need;
      const b = html(`<button class="ds__space${open ? '' : ' is-locked'}" type="button" role="tab" aria-selected="${sp.id === space}"></button>`);
      b.textContent = open ? sp.name : `🔒 ${sp.name}`;
      b.addEventListener('click', () => {
        if (!open) { sfx.oops(); say(fill(t.space_locked, { space: sp.name, n: num(sp.need) }), 'shy'); return; }
        sfx.door(); space = sp.id; sel = -1; paint(); paintSpaces(); paintTray(); say(sp.say);
      });
      bar.append(b);
    });
  }

  // ——— الصندوق ———
  const seen = new Set(store.state.decorSeen || []);
  function paintTray() {
    const tabs = $('.ds__tabs'); tabs.textContent = '';
    t.cats.forEach(c => {
      const b = html(`<button class="ds__tab" type="button" role="tab" aria-selected="${c.id === tab}"></button>`);
      b.textContent = c.name;
      if (c.id !== 'theme' && t.items.some(x => x.cat === c.id && stars >= x.need && !seen.has(x.id))) b.classList.add('has-new');
      b.addEventListener('click', () => { sfx.tap(); tab = c.id; paintTray(); });
      tabs.append(b);
    });
    grid.textContent = ''; grid.scrollTop = 0;
    if (tab === 'theme') return paintThemes();
    t.items.filter(x => x.cat === tab).sort((a, b) => a.need - b.need).forEach(x => {
      const open = stars >= x.need;
      const b = html(`<button class="ds__card${open ? '' : ' is-locked'}${open && !seen.has(x.id) ? ' is-new' : ''}" type="button"><span class="ds__pic">${ART[x.id]}</span><b></b>${open ? '' : `<small>★ ${num(x.need)}</small>`}</button>`);
      b.querySelector('b').textContent = x.name;
      b.setAttribute('aria-label', x.name);
      if (open) { seen.add(x.id); dragFromTray(b, x); }
      else b.addEventListener('click', () => { sfx.oops(); say(fill(t.locked, { item: x.name, n: num(x.need) }), 'shy'); });
      grid.append(b);
    });
    store.set({ decorSeen: [...seen] });
  }
  function paintThemes() {
    (t.themes[space] || []).forEach(g => {
      const h = html(`<p class="ds__group"></p>`); h.textContent = g.name; grid.append(h);
      g.options.forEach(o => {
        const open = stars >= o.need, on = d[space][g.key] === o.id;
        const b = html(`<button class="ds__swatch ds__swatch--${g.key}-${o.id}${open ? '' : ' is-locked'}" type="button" aria-pressed="${on}"><i></i><b></b>${open ? '' : `<small>★ ${num(o.need)}</small>`}</button>`);
        b.querySelector('b').textContent = o.name;
        b.addEventListener('click', () => {
          if (!open) { sfx.oops(); say(fill(t.locked, { item: o.name, n: num(o.need) }), 'shy'); return; }
          d[space][g.key] = o.id; save(); paint(); paintTray(); sfx.star(); sparkle(b, { count: 10, power: 3 }); say(o.say);
        });
        grid.append(b);
      });
    });
  }

  // ——— إضافة قطعة (لمسًا أو سحبًا) ———
  function add(x, px, py) {
    const list = d[space].items;
    if (list.length >= 40) { sfx.oops(); say(t.full, 'shy'); return; }
    list.push({ t: x.id, x: +px.toFixed(1), y: +py.toFixed(1) });
    sel = list.length - 1; save(); paint();
    const el = room.querySelector(`.dc[data-i="${sel}"]`); el?.classList.add('is-new');
    sfx.star(); if (el) sparkle(el, { count: 12, power: 3 }); say(x.say);
  }
  const pct = (cx, cy) => { const r = room.getBoundingClientRect(); return [((cx - r.left) / r.width) * 100, ((cy - r.top) / r.height) * 100, r]; };
  function dragFromTray(card, x) {
    card.addEventListener('pointerdown', e => {
      const sx = e.clientX, sy = e.clientY; let ghost = null, moved = false;
      const mv = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!ghost) {
          if (Math.hypot(dx, dy) < 8) return;
          const portrait = innerHeight > innerWidth;
          if (portrait ? Math.abs(dy) < Math.abs(dx) : Math.abs(dx) < Math.abs(dy)) { if (ev.pointerType !== 'mouse') return end(); }
          moved = true; ghost = html(`<div class="ds__ghost">${ART[x.id]}</div>`); box.append(ghost);
        }
        ghost.style.left = `${ev.clientX}px`; ghost.style.top = `${ev.clientY}px`;
      };
      const up = ev => {
        end();
        if (ghost) { ghost.remove(); const [px, py] = pct(ev.clientX, ev.clientY); if (px >= 0 && px <= 100 && py >= 0 && py <= 100) add(x, px, py); return; }
        if (!moved) add(x, 38 + Math.random() * 24, 40 + Math.random() * 20);
      };
      const end = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); card.removeEventListener('pointercancel', end); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up); card.addEventListener('pointercancel', end);
    });
  }

  // ——— تحريك القطع داخل المكان ———
  room.addEventListener('pointerdown', e => {
    const el = e.target.closest('.dc');
    if (!el) { sel = -1; markSel(); return; }
    e.preventDefault();
    sel = +el.dataset.i; markSel(); sfx.tap();
    const it = d[space].items[sel], [px0, py0] = pct(e.clientX, e.clientY), ox = it.x - px0, oy = it.y - py0;
    el.setPointerCapture(e.pointerId); el.classList.add('is-drag');
    const mv = ev => { const [px, py] = pct(ev.clientX, ev.clientY); it.x = +Math.min(100, Math.max(0, px + ox)).toFixed(1); it.y = +Math.min(100, Math.max(0, py + oy)).toFixed(1); el.style.left = `${it.x}%`; el.style.top = `${it.y}%`; };
    const up = () => { el.classList.remove('is-drag'); save(); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
  const TOOLS = {
    bigger: ['＋', it => { it.s = Math.min(2.6, +((it.s || 1) * 1.2).toFixed(2)); }],
    smaller: ['－', it => { it.s = Math.max(0.4, +((it.s || 1) / 1.2).toFixed(2)); }],
    flip: ['⇋', it => { it.f = !it.f; }],
    front: ['⬆', (it, list) => { list.splice(sel, 1); list.push(it); sel = list.length - 1; }],
    remove: ['✕', (it, list) => { list.splice(sel, 1); sel = -1; say(t.removed); }]
  };
  Object.entries(TOOLS).forEach(([k, [ic, fn]]) => {
    const b = html(`<button class="ds__tool ds__tool--${k}" type="button"><span></span><small></small></button>`);
    b.querySelector('span').textContent = ic; b.querySelector('small').textContent = t.tools[k];
    b.addEventListener('click', () => { const list = d[space].items, it = list[sel]; if (!it) return; fn(it, list); k === 'remove' ? sfx.flip() : sfx.tap(); save(); paint(); });
    tools.append(b);
  });
  $('.ds__clear').addEventListener('click', () => {
    if (Date.now() - clearArm > 2500) { clearArm = Date.now(); sfx.oops(); say(t.studio_clear_ok, 'shy'); return; }
    d[space].items = []; sel = -1; save(); paint(); sfx.flip(); clearArm = 0;
  });

  // ——— فتح وإغلاق بالعرض ———
  function close() {
    document.removeEventListener('keydown', onKey);
    try { screen.orientation?.unlock?.(); } catch {}
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    box.remove(); document.body.classList.remove('is-studio'); onClose?.(space);
  }
  const onKey = e => { if (e.key === 'Escape') close(); };
  $('.ds__done').addEventListener('click', () => { sfx.door(); close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(box); document.body.classList.add('is-studio');
  const fs = document.documentElement.requestFullscreen?.({ navigationUI: 'hide' });
  fs?.then(() => screen.orientation?.lock?.('landscape')).catch(() => {});
  paint(); paintSpaces(); paintTray();
  return close;
}

export const petLine = (lines, id) => pick(lines.house.pets[id] || ['']);
