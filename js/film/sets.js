// مكتبة الديكورات: كل ديكور دالة ترجع طبقات SVG (data-d = عمق الطبقة للكاميرا).
// الحالات (ليل/فجر، نور الغار، حال الجذع…) تُضبط بسمات data على المسرح وتحرّكها css/film.css.
// ضابط ثابت: لا أشخاص ولا وجوه. النبي ﷺ والصحابة لا يُرسمون أبدًا؛ يُعبَّر بالنور فقط.

function rng(seed) { // أرقام عشوائية ثابتة حتى لا يتغير الرسم بين مرة وأخرى
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function stars(n, seed, [x0, x1], [y0, y1]) {
  const r = rng(seed); let out = '';
  for (let i = 0; i < n; i++) {
    const size = 0.8 + r() * r() * 2.6;
    out += `<circle class="st st--${i % 4}" cx="${(x0 + r() * (x1 - x0)).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${size.toFixed(1)}"/>`;
  }
  return `<g class="stars" fill="#fff4cf">${out}</g>`;
}

const DEFS = `
<defs>
  <radialGradient id="g-warm"><stop offset="0" stop-color="#fff4cf" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd77a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-white"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".5" stop-color="#fff4cf" stop-opacity=".5"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040918"/><stop offset=".6" stop-color="#0d1f48"/><stop offset="1" stop-color="#1b3668"/></linearGradient>
  <linearGradient id="g-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a66"/><stop offset=".42" stop-color="#8a4f86"/><stop offset=".62" stop-color="#f08e5e"/><stop offset=".8" stop-color="#ffd77a"/></linearGradient>
  <linearGradient id="g-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4cf" stop-opacity=".75"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-moonfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa3e6" stop-opacity=".4"/><stop offset="1" stop-color="#7fa3e6" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1020"/><stop offset="1" stop-color="#04060d"/></linearGradient>
  <linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d4b30"/><stop offset="1" stop-color="#9c7548"/></linearGradient>
  <linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b79060"/><stop offset="1" stop-color="#5a4126"/></linearGradient>
  <linearGradient id="g-bark" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2f17"/><stop offset=".4" stop-color="#8d6238"/><stop offset="1" stop-color="#3d2713"/></linearGradient>
  <linearGradient id="g-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a6a34"/><stop offset="1" stop-color="#6b441d"/></linearGradient>
</defs>`;

const BIG = 'x="-700" y="-500" width="2600" height="1900"';

// ——— جبل ثور من الخارج ———
const TRAIL = 'M250 900C330 800 300 740 400 700S560 640 500 570 470 470 560 440 660 390 620 340L612 292';
function mountain() {
  return `${DEFS}
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="mt-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(90, 7, [-400, 1600], [-250, 560])}
    <path class="mt-moon" d="M905 92a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="mt-sun"><circle cx="870" cy="350" r="360" fill="url(#g-warm)"/><circle cx="870" cy="350" r="70" fill="#fff4cf"/></g>
  </g>
  <g data-d=".3">
    <path class="mt-far" d="M-700 640-460 500-320 560-180 440-40 540 120 450 260 550 420 470 560 560 700 480 860 420 1000 520 1160 440 1320 540 1500 450 1900 620V1400H-700z"/>
  </g>
  <g data-d=".75">
    <path class="mt-main" d="M-700 1400V820l400-60 180-60 140-90 110-10 100-100 100-30 70-110 70-30 60-100 70-80 50 50 50 15 60 95 80 40 60 100 90 50 70 100 140 60 140 100 160 40 400 120v500z"/>
    <path class="mt-lit" d="M600 150l50 50 50 15-58 88-34-62zM760 310l80 40 60 100-104-22zM990 500l70 100 140 60-150 2z"/>
    <path class="mt-shade" d="M400 360l70-30 60-100-28 112-62 78zM230 500l100-30-28 92zM20 610l110-10-60 92z"/>
    <path class="mt-path" d="${TRAIL}" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 15"/>
    <circle class="mt-caveglow" cx="612" cy="276" r="92" fill="url(#g-warm)"/>
    <path d="M588 292q2-38 24-38t24 38z" fill="#05070f"/>
    <path class="mt-cavelight" d="M588 292q2-38 24-38t24 38z" fill="#ffd77a"/>
    <g class="mt-trail">
      <circle r="58" fill="url(#g-warm)"/><circle r="6" fill="#fff"/>
      <animateMotion dur="13s" begin="indefinite" fill="freeze" path="${TRAIL}"/>
    </g>
  </g>
  <g data-d="1.3">
    <path class="mt-front" d="M-700 1400V760l150-50 110 30 90 110 130 60 60 490zM1900 1400V740l-170-40-120 50-80 100-150 70-40 480z"/>
    <path class="mt-front" d="M330 1400l40-420 120-70 150 30 110-40 130 60 60 440z"/>
  </g>`;
}

// ——— داخل الغار (ننظر من الداخل إلى الفتحة) ———
function person(x, k) {
  return `<g transform="translate(${x} 524) scale(${k})"><g class="cv-step">
    <path d="M-30-380h60l25 312q-28 12-55 2-27 10-55-2z"/>
    <path d="M-30-70h18l-2 48h-16zM12-70h18v48H14z"/>
    <path d="M-52 0q-2-28 22-28h16q8 16 4 28zM4 0q-4-12 4-28h18q26 0 24 28z"/>
  </g></g>`;
}
function cave() {
  return `${DEFS}
  <g data-d=".7">
    <rect ${BIG} fill="url(#g-night)"/>
    ${stars(46, 23, [250, 950], [180, 470])}
    <rect class="cv-day" x="-700" y="-300" width="2600" height="900" fill="url(#g-dawn)"/>
    <path transform="translate(0 -70)" d="M-200 520l160-70 140 50 180-90 150 70 170-60 160 80 180-70 160 60 300-40v400H-200z" fill="#0a1634"/>
    <rect x="-700" y="494" width="2600" height="760" fill="#1b2d5c"/>
  </g>
  <g data-d=".85" fill="#02040b"><g class="cv-feet">
    ${person(492, 0.94)}${person(618, 1.04)}${person(742, 0.9)}
  </g></g>
  <g data-d="1">
    <path d="M396 560h416l520 840H-110z" fill="#0b1226"/>
    <path d="M400 560h410l230 840H180z" fill="url(#g-moonfloor)"/>
    <g class="cv-shadows" fill="#01030a">
      <path d="M452 560h80l-60 620h-260z"/><path d="M576 560h84l40 620h-250z"/><path d="M704 560h76l230 620h-250z"/>
    </g>
    <path fill-rule="evenodd" fill="url(#g-rock)" d="M-700-500h2600v1900h-2600zM408 560l-10-60 20-60-10-48 44-44 18-36 50-12 36-28 54 8 42-18 48 28 42 10 26 48 32 32-8 60 20 60-12 60z"/>
    <path class="cv-rim" d="M408 560l-10-60 20-60-10-48 44-44 18-36 50-12 36-28 54 8 42-18 48 28 42 10 26 48 32 32-8 60 20 60-12 60" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cv-rim cv-rim--soft" d="M408 560l-10-60 20-60-10-48 44-44 18-36 50-12 36-28 54 8 42-18 48 28 42 10 26 48 32 32-8 60 20 60-12 60" fill="none" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cv-facet" d="M300 300l80-90 70 40-60 110zM820 250l90 30 40 120-90-40zM240 520l90-50 30 120-110 40zM880 520l100 20 20 130-110-30zM520 180l110-30 80 60-90 30z"/>
    <path d="M-700 640l420-60 250 50 130 110 80 660h-880zM1900 640l-380-70-260 60-120 120-90 650h850z" fill="#04060d"/>
    <path class="cv-sun cv-sun--rise" d="M660 300l150 0 520 1100H900z" fill="url(#g-ray)"/><path class="cv-sun cv-sun--set" d="M560 300l-150 0-520 1100H320z" fill="url(#g-ray)"/>
    <g class="cv-dog" fill="#02040b"><path d="M520 560q-4-30 26-38l14-22 10 20q46-6 84 10 30 12 34 30z"/><path d="M546 552h-58q-8 0-8 8h66z"/><path d="M688 560q30-6 40-34-4 30-24 34z"/></g>
    <ellipse class="cv-glow" cx="600" cy="900" rx="900" ry="620" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3">
    <path d="M-700-500h2600v330l-200 40-90 130-110-150-190-30-120 110-140-130-210 10-130 140-150-150-200 20-130 150-110-170-220-20z" fill="#020309"/>
    <path d="M-700 1400V900l230-70 170 60 110 510zM1900 1400V880l-250-60-160 70-90 510z" fill="#020309"/>
  </g>`;
}

// ——— المسجد النبوي البسيط: جدران من لبِن، أعمدة من جذوع النخل، وسقف من جريد ———
function column(x, w, y0 = 110) {
  let rings = '';
  for (let y = y0 + 40; y < 600; y += 46) rings += `M${x - w / 2} ${y}q${w / 2} 12 ${w} 0`;
  return `<rect x="${x - w / 2}" y="${y0}" width="${w}" height="${620 - y0}" fill="url(#g-bark)"/><path d="${rings}" fill="none" stroke="#2c1a0b" stroke-width="3" opacity=".6"/>`;
}
function thatch(seed, base, amp, fill) {
  const r = rng(seed); let d = `M-700-500H1900V${base}`;
  for (let x = 1900; x > -700; x -= 46) d += `q-${(10 + r() * 14).toFixed(0)} ${(amp + r() * 30).toFixed(0)}-23 ${(6 + r() * 10).toFixed(0)}t-23-${(6 + r() * 10).toFixed(0)}`;
  return `<path d="${d}z" fill="${fill}"/>`;
}
function mosque() {
  const r = rng(11); let pebbles = '', bricks = '', scales = '';
  for (let i = 0; i < 70; i++) pebbles += `<ellipse cx="${(-300 + r() * 1800).toFixed(0)}" cy="${(630 + r() * r() * 420).toFixed(0)}" rx="${(5 + r() * 9).toFixed(0)}" ry="${(2 + r() * 3).toFixed(0)}"/>`;
  for (let y = 150; y < 600; y += 42) bricks += `M-700 ${y}H1900`;
  for (let y = -22; y > -335; y -= 28) scales += `M-33 ${y}l33 13 33-13`;
  return `${DEFS}
  <g data-d=".5">
    <rect ${BIG} fill="#3d2a1a"/>
    <rect x="-700" y="60" width="2600" height="560" fill="url(#g-wall)"/>
    <path d="${bricks}" stroke="#3a2412" stroke-width="2" opacity=".28"/>
    <ellipse class="ms-wallglow" cx="700" cy="380" rx="420" ry="300" fill="url(#g-warm)"/>
  </g>
  <g data-d=".8">
    ${column(-260, 44)}${column(150, 44)}${column(1010, 44)}${column(1420, 44)}
    <rect x="-700" y="96" width="2600" height="30" fill="#3d2713"/>
  </g>
  <g data-d="1">
    <rect x="-700" y="600" width="2600" height="800" fill="url(#g-floor)"/>
    <g fill="#4a341d" opacity=".4">${pebbles}</g>
    <g class="ms-pools" fill="url(#g-warm)"><ellipse cx="420" cy="676" rx="150" ry="32"/><ellipse cx="640" cy="706" rx="170" ry="36"/><ellipse cx="880" cy="668" rx="140" ry="30"/></g>
    <g transform="translate(452 600)"><g class="ms-minbar">
      <ellipse cx="6" cy="4" rx="120" ry="14" fill="#000" opacity=".3"/>
      <rect x="78" y="-226" width="13" height="226" fill="#5c3a18"/><rect x="8" y="-150" width="11" height="60" fill="#5c3a18"/>
      <circle cx="84.5" cy="-234" r="11" fill="#b98548"/><circle cx="13.5" cy="-158" r="9" fill="#b98548"/>
      <rect x="-96" y="-46" width="190" height="46" fill="url(#g-wood)"/><rect x="-42" y="-92" width="136" height="46" fill="url(#g-wood)"/><rect x="10" y="-138" width="84" height="46" fill="url(#g-wood)"/>
      <path d="M-96-46h190v9H-96zM-42-92H94v9H-42zM10-138h84v9H10z" fill="#c9995a"/>
      <path d="M-70-37v37M-10-37v37M50-37v37M-14-83v37M44-83v37M40-129v37" stroke="#4a2d10" stroke-width="3" opacity=".5"/>
    </g></g>
    <g class="jd-wrap" transform="translate(700 600)">
      <ellipse class="jd-halo" cx="0" cy="-190" rx="250" ry="330" fill="url(#g-warm)"/>
      <g class="jd-waves" fill="none" stroke="#bfeee8" stroke-width="5" stroke-linecap="round">
        <circle cy="-200" r="110"/><circle cy="-200" r="110"/><circle cy="-200" r="110"/>
      </g>
      <ellipse cx="0" cy="3" rx="66" ry="12" fill="#000" opacity=".32"/>
      <g class="jd">
        <path d="M-36 0l5-350q31-12 62 0l5 350q-36 12-72 0z" fill="url(#g-bark)"/>
        <path d="${scales}" fill="none" stroke="#2c1a0b" stroke-width="3.5" opacity=".6"/>
        <path d="M-22-10l4-330" stroke="#e2b877" stroke-width="5" stroke-linecap="round" opacity=".28"/>
        <ellipse cx="0" cy="-350" rx="31" ry="9" fill="#c9a06a"/><ellipse cx="0" cy="-350" rx="18" ry="5" fill="none" stroke="#8d6238" stroke-width="2"/>
      </g>
      <g class="jd-embrace">
        <path d="M-90-1300h180l40 1300h-260z" fill="url(#g-ray)" transform="rotate(180 0 -650)"/>
        <ellipse cx="0" cy="-185" rx="150" ry="260" fill="url(#g-white)"/>
      </g>
    </g>
    <g class="ms-rays" fill="url(#g-ray)">
      <path d="M560 90h70L500 720H300z"/><path d="M800 90h56L760 740H560z"/><path d="M1010 90h64L1000 700H810z"/>
    </g>
  </g>
  <g data-d="1.12">${thatch(5, 96, 44, '#4d3b1c')}${thatch(9, 62, 50, '#2c2010')}</g>
  <g data-d="1.35">${column(-420, 110, -500)}${column(1640, 110, -500)}</g>`;
}


// ——— موجة متكررة (تتحرك أفقيًّا في CSS بلا فواصل) ———
function wave(y, amp, len, fill, cls = '') {
  let d = `M-1400 ${y}`;
  for (let x = -1400; x < 2600; x += len) d += `q${len / 4} ${-amp} ${len / 2} 0t${len / 2} 0`;
  return `<path class="se-wave ${cls}" style="--len:${len}px" d="${d}V1500H-1400z" fill="${fill}"/>`;
}
function rain(n, seed) {
  const r = rng(seed); let d = '';
  for (let i = 0; i < n; i++) { const x = -300 + r() * 1800, y = -200 + r() * 1100, l = 26 + r() * 30; d += `M${x.toFixed(0)} ${y.toFixed(0)}l${(-l * 0.3).toFixed(0)} ${l.toFixed(0)}`; }
  return `<path d="${d}" fill="none" stroke="#bcd3ff" stroke-width="2.5" stroke-linecap="round"/>`;
}

// ——— البحر والسفينة (يونس ونوح عليهما السلام): لا يُرسم أحد؛ النبي نور فقط ———
function sea() {
  return `${DEFS}
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="se-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(80, 31, [-400, 1600], [-250, 440])}
    <path class="se-moon" d="M930 110a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="se-sun"><circle cx="330" cy="470" r="330" fill="url(#g-warm)"/><circle cx="330" cy="470" r="62" fill="#fff4cf"/></g>
    <rect class="se-storm" ${BIG} fill="#070b16"/>
    <g class="se-clouds" fill="#1a2238"><ellipse cx="200" cy="120" rx="330" ry="80"/><ellipse cx="700" cy="60" rx="380" ry="90"/><ellipse cx="1150" cy="140" rx="320" ry="76"/><ellipse cx="480" cy="200" rx="260" ry="56" fill="#232c46"/><ellipse cx="960" cy="230" rx="280" ry="54" fill="#232c46"/></g>
  </g>
  <g data-d=".3">
    <g class="se-water">${wave(486, 7, 240, '#0e2452', 'se-wave--far')}</g>
    <path class="se-hills" d="M-700 520q260-90 520-30t480-40 420 30 480-50 420 60v900H-700z" fill="#3a2c4e"/>
  </g>
  <g data-d=".75">
    <g class="se-ship"><g class="se-rock">
      <rect x="597" y="236" width="7" height="160" fill="#4a2f17"/>
      <g class="se-sail"><path d="M607 250q96 52 100 128h-100z" fill="#f1e4c3"/><path d="M594 262q-74 46-80 116h80z" fill="#e2d2a8"/></g>
      <path d="M528 396h144l-20-24H548z" fill="#5a3a1c"/><rect x="540" y="394" width="120" height="50" rx="5" fill="#7a5230"/>
      <rect x="560" y="408" width="22" height="22" rx="3" fill="#ffd77a" opacity=".55"/><rect x="618" y="408" width="22" height="22" rx="3" fill="#ffd77a" opacity=".55"/>
      <path d="M416 436q184 44 368 0l-46 92q-138 28-276 0z" fill="url(#g-wood)" stroke="#3d2713" stroke-width="3" stroke-linejoin="round"/>
      <path d="M434 462q166 34 332 0M452 492q148 28 296 0M520 448v74M600 452v80M680 448v74" fill="none" stroke="#3d2713" stroke-width="2.5" opacity=".7"/>
    </g></g>
  </g>
  <g data-d=".75">
    <g class="se-water">${wave(506, 12, 320, '#123066', 'se-wave--mid')}${wave(560, 16, 420, '#0d2550', 'se-wave--near')}</g>
    <path class="se-judi" d="M250 640l120-90 70 20 90-70 80 10 60 50 90-10 80 60 110 40z" fill="#2a2148"/>
    <g class="se-whale" fill="#0a1630"><path d="M780 560q130-150 290 0z"/><path d="M1090 540q10-80 66-92-14 44 6 92-36-18-72 0z"/><path d="M905 470q-6-40-30-52M912 468q8-38 34-46" fill="none" stroke="#9fc4ff" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>
    <g class="se-light"><circle cx="600" cy="386" r="96" fill="url(#g-warm)"/><circle cx="600" cy="386" r="7" fill="#fff"/></g>
    <path class="se-ground" d="M-700 1400V540q240-50 520-24t500-10 440 14 440-20 400 30v870z" fill="#8a6a40"/>
    <path class="se-ground se-ground--lit" d="M-700 560q300-40 640-10t600 0 700-10 660 30v40q-360-40-700-20t-640 10-620-10-640 20z" fill="#c9a268" opacity=".5"/>
    <g class="se-shore">
      <path d="M-700 1400V640q330-110 660-50 330 50 620 190l420 620z" fill="#b99560"/>
      <path d="M-700 660q330-110 660-50 330 50 620 190-300-120-600-150t-680 50z" fill="#e2c48c" opacity=".7"/>
      <g class="se-yaqtin">
        <path d="M150 700q60-110 150-90t120 100M300 610q-10-60 40-90" fill="none" stroke="#3f8f52" stroke-width="7" stroke-linecap="round"/>
        <g fill="#4fae66" stroke="#2f7a44" stroke-width="3"><path d="M150 700q-56-50-20-104 60 4 76 60-14 40-56 44z"/><path d="M250 624q-20-70 36-104 54 36 36 100-34 26-72 4z"/><path d="M380 640q14-70 80-80 34 54-6 106-44 12-74-26z"/><path d="M330 520q-6-56 44-78 40 34 22 86-34 16-66-8z"/></g>
        <ellipse cx="300" cy="690" rx="34" ry="24" fill="#e9d48a" stroke="#b99a48" stroke-width="3"/>
      </g>
    </g>
  </g>
  <g data-d="1.3">
    <g class="se-water">${wave(680, 22, 560, '#081a3c', 'se-wave--front')}</g>
    <g class="se-rain">${rain(90, 5)}</g>
  </g>`;
}

// ——— أعماق البحر والحوت ———
function deep() {
  const r = rng(11); let fish = '';
  for (let i = 0; i < 9; i++) { const x = 100 + r() * 1000, y = 120 + r() * 200, k = 0.6 + r() * 0.7; fish += `<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${k.toFixed(2)})" d="M0 0q14-12 30 0-16 12-30 0zM30 0l12-9v18z"/>`; }
  return `${DEFS}
  <defs><linearGradient id="g-deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#135a8a"/><stop offset=".45" stop-color="#0a2a55"/><stop offset="1" stop-color="#030816"/></linearGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-deep)"/>
    <g class="dp-rays"><path d="M300-500l140 0 240 1300h-520z" fill="url(#g-ray)"/><path d="M640-500l110 0 300 1300H700z" fill="url(#g-ray)"/><path d="M950-500l90 0 330 1200h-420z" fill="url(#g-ray)"/></g>
  </g>
  <g data-d=".3">
    <g class="dp-fish" fill="#0a2040">${fish}</g>
    <path d="M-700 1400V760q200-60 380-10t360-30 380 40 360-50 420 60v630z" fill="#061430"/>
  </g>
  <g data-d=".75">
    <g class="dp-whale"><g class="dp-bob">
      <path d="M330 440C330 346 464 296 610 302 760 308 852 368 902 420L996 352Q978 430 1004 504L902 452C852 524 742 562 600 556 456 550 330 524 330 440z" fill="#16305e" stroke="#2c5390" stroke-width="4" stroke-linejoin="round"/>
      <path d="M344 472C420 540 620 572 826 498 704 544 480 550 344 472z" fill="#3a6aa8" opacity=".75"/>
      <path d="M560 546q16 74 92 86-32-44-18-92z" fill="#122850" stroke="#2c5390" stroke-width="3" stroke-linejoin="round"/>
      <path d="M338 458q56 26 122 10" fill="none" stroke="#0a1a38" stroke-width="5" stroke-linecap="round"/>
      <circle cx="408" cy="414" r="8" fill="#060d1e"/><circle cx="406" cy="411" r="2.500" fill="#cfe0ff"/>
      <circle class="dp-glow" cx="630" cy="436" r="170" fill="url(#g-warm)"/>
    </g></g>
  </g>
  <g data-d="1.3">
    <rect class="dp-dark" ${BIG} fill="#01040c"/>
    <g class="dp-weed" fill="none" stroke="#04101f" stroke-width="26" stroke-linecap="round"><path d="M40 1100q-60-160 20-300t-10-260"/><path d="M190 1100q50-150-20-260"/><path d="M1080 1100q60-170-10-300t30-240"/><path d="M1230 1100q-50-160 30-290"/></g>
  </g>`;
}

export const SETS = { mountain, cave, mosque, sea, deep };
