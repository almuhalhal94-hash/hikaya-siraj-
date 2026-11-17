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
  <g data-d=".5"><g class="mt-birds" fill="none" stroke="#fff4cf" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M300 210q10-10 20 0q10-10 20 0"/><path d="M380 170q12-12 24 0q12-12 24 0"/><path d="M470 230q9-9 18 0q9-9 18 0"/><path d="M760 180q12-12 24 0q12-12 24 0"/><path d="M850 230q10-10 20 0q10-10 20 0"/><path d="M930 160q9-9 18 0q9-9 18 0"/><path d="M560 120q8-8 16 0q8-8 16 0"/></g></g>
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
  return `<g class="ms-col"><rect x="${x - w / 2}" y="${y0}" width="${w}" height="${620 - y0}" fill="url(#g-bark)"/><path d="${rings}" fill="none" stroke="#2c1a0b" stroke-width="3" opacity=".6"/></g>`;
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
    <g class="ms-stonewall"><rect x="-700" y="60" width="2600" height="560" fill="#7d7468"/><path d="${bricks}" stroke="#4a443c" stroke-width="3" opacity=".5"/>
      <path d="${Array.from({ length: 40 }, (_, i) => `M${-700 + i * 66} 60v560`).join('')}" stroke="#4a443c" stroke-width="2" opacity=".25"/></g>
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
    <g class="ms-suffa"><path d="M760 690V318M1060 690V318M1340 690V318" stroke="url(#g-bark)" stroke-width="22" stroke-linecap="round"/>
      <path d="M720 300h680l-20 40H740z" fill="#4d3b1c"/><path d="M720 300q40-26 80 0t80 0 80 0 80 0 80 0 80 0 80 0 80 0 80 0" fill="#6b5320"/><path d="M740 340q30 22 60 0t60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0" fill="none" stroke="#2c2010" stroke-width="6"/>
      <path d="M740 690h640v-26H740z" fill="#5c4424"/><path d="M740 664h640" stroke="#c9995a" stroke-width="3" opacity=".6"/>
      <g class="ms-flock" fill="url(#g-warm)">${[[830, 654, 34], [920, 640, 30], [1130, 646, 32], [1210, 636, 28], [1290, 652, 30], [870, 628, 24], [1180, 622, 24]].map(([x, y, q]) => `<circle cx="${x}" cy="${y}" r="${q}"/>`).join('')}</g></g>
    <g class="ms-cloak" transform="translate(600 720)"><circle class="ms-cloakglow" cy="-30" r="210" fill="url(#g-warm)"/>
      <g class="ms-cloth"><path d="M-150-30q75-18 150-4t150-6l14 80q-82 16-164 6t-164 8z" fill="#8a6a4a" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-148-12q75-14 150-2t148-8M-146 12q75-14 150-2t146-8" fill="none" stroke="#e2d2a8" stroke-width="7" opacity=".7"/></g>
      <g class="ms-scoop" fill="#fff4cf">${[[-60, -220], [-10, -260], [40, -230], [80, -270], [-90, -280], [10, -300]].map(([x, y], i) => `<circle style="--d:${-i * 0.5}s" cx="${x}" cy="${y}" r="7"/>`).join('')}</g></g>
    <g class="ms-cupwrap" transform="translate(830 640)"><g class="ms-cup"><circle cy="-10" r="70" fill="url(#g-warm)"/><path d="M-26-22h52q-4 34-26 36-22-2-26-36z" fill="#b98548"/><ellipse cy="-22" rx="26" ry="7" fill="#fdf6e6"/><path d="M-16 14h32" stroke="#6b441d" stroke-width="5" stroke-linecap="round"/></g></g>
    <g class="ms-hasa" transform="translate(860 712)"><ellipse class="ms-hsglow" rx="230" ry="60" fill="url(#g-warm)"/>
      <g fill="#c9b48e" stroke="#6b5340" stroke-width="2">${Array.from({ length: 34 }, (_, i) => { const a = i * 2.39, d = 18 + (i % 9) * 18; return `<ellipse cx="${(Math.cos(a) * d * 1.9).toFixed(0)}" cy="${(Math.sin(a) * d * 0.32).toFixed(0)}" rx="${8 + (i % 4) * 2}" ry="${4 + (i % 3)}"/>`; }).join('')}</g></g>
    <g class="ms-pillar" transform="translate(720 620)"><ellipse class="ms-plglow" cy="-260" rx="190" ry="340" fill="url(#g-warm)"/>
      <ellipse cy="2" rx="70" ry="12" fill="#000" opacity=".3"/><rect x="-56" y="-26" width="112" height="26" fill="#9a9184"/><rect x="-46" y="-500" width="92" height="474" fill="#b3aa9c"/><rect x="-60" y="-530" width="120" height="30" fill="#9a9184"/>
      <path d="M-46-440h92M-46-120h92" stroke="#6f675c" stroke-width="5"/>
      <g fill="none" stroke="#6f675c" stroke-width="3">${[-400, -340, -280, -220, -160].map(y => `<path d="M-30 ${y}l30-26 30 26-30 26z"/><circle cy="${y}" r="7"/>`).join('')}</g>
      <path d="M-34-490v460" stroke="#e8e0d0" stroke-width="6" opacity=".35"/></g>
    <g class="ms-call" transform="translate(640 230)" fill="none" stroke="#fff4cf" stroke-width="6" stroke-linecap="round">
      <path style="--d:0s" d="M60-60a85 85 0 0 1 0 120M-60-60a85 85 0 0 0 0 120"/><path style="--d:1s" d="M60-60a85 85 0 0 1 0 120M-60-60a85 85 0 0 0 0 120"/><path style="--d:2s" d="M60-60a85 85 0 0 1 0 120M-60-60a85 85 0 0 0 0 120"/></g>
    <g class="ms-lights"><g class="ms-b"><circle cx="1000" cy="660" r="80" fill="url(#g-white)"/><circle cx="1000" cy="660" r="7" fill="#fff"/></g><g class="ms-a"><circle cx="880" cy="700" r="100" fill="url(#g-warm)"/><circle cx="880" cy="700" r="8" fill="#fff"/></g></g>
    <g class="ms-rays" fill="url(#g-ray)">
      <path d="M560 90h70L500 720H300z"/><path d="M800 90h56L760 740H560z"/><path d="M1010 90h64L1000 700H810z"/>
    </g>
  </g>
  <g data-d="1.12" class="ms-roof">${thatch(5, 96, 44, '#4d3b1c')}${thatch(9, 62, 50, '#2c2010')}<rect class="ms-teak" x="-700" y="-500" width="2600" height="620" fill="#4a2d14"/><path class="ms-teak" d="M-700 120H1900" stroke="#2a180a" stroke-width="10"/></g>
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
      <g class="se-fish" transform="translate(40 700)"><path d="M-230 0q40-96 230-100t260 70q34-34 80-54-12 44 0 96-44-20-80-42-80 50-260 52T-230 0z" fill="#3c3a58"/><path d="M-200 4q190 40 450 2-200 30-450-2z" fill="#8a86a8" opacity=".6"/><circle cx="-150" cy="-26" r="7" fill="#151226"/></g>
      <g class="se-rib" transform="translate(430 730)"><ellipse rx="190" ry="26" fill="#000" opacity=".22"/><path d="M-120 0q0-270 120-310 120 40 120 310" fill="none" stroke="#f1e4c3" stroke-width="24" stroke-linecap="round"/><path d="M-120 0q0-270 120-310 120 40 120 310" fill="none" stroke="#fffaf0" stroke-width="7" stroke-linecap="round" opacity=".8"/>
        <g class="se-rider"><g transform="scale(.6)" fill="#2a2030">${CAMEL}</g><circle cx="-10" cy="-140" r="60" fill="url(#g-warm)"/><circle cx="-10" cy="-140" r="6" fill="#fff"/></g></g>
      <g class="se-crew" fill="url(#g-warm)"><circle cx="-120" cy="760" r="40"/><circle cx="-40" cy="790" r="34"/><circle cx="40" cy="770" r="36"/><circle cx="130" cy="800" r="32"/><circle cx="220" cy="780" r="34"/><circle cx="-200" cy="800" r="30"/></g>
    </g>
    <g class="se-split">
      <path d="M-700 1400V430Q-100 400 460 290V530L220 1400z" fill="#0f2c60"/><path d="M1900 1400V430Q1300 400 740 290V530l240 870z" fill="#0f2c60"/>
      <path d="M-700 430Q-100 400 460 290v60Q-100 450-700 480zM1900 430Q1300 400 740 290v60q560 100 1160 130z" fill="#3a6ab0" opacity=".7"/>
      <path d="M460 350v180L220 1400h-90zM740 350v180l240 870h90z" fill="#1c4488" opacity=".8"/>
      <path d="M460 530h280l240 870H220z" fill="#b99560"/><path d="M560 530h80l70 870H490z" fill="#e2c48c" opacity=".45"/>
      <g class="se-cross" fill="url(#g-warm)"><circle cx="540" cy="900" r="44"/><circle cx="668" cy="930" r="40"/><circle cx="600" cy="990" r="44"/><circle cx="510" cy="1010" r="34"/><circle cx="700" cy="1030" r="34"/><circle cx="600" cy="800" r="100"/><circle cx="600" cy="800" r="8" fill="#fff"/></g>
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

// ——— نخلة (جذع وسعف) تُستعمل في أكثر من ديكور ———
function palm(x, y, k = 1, lean = 0, cls = '') {
  return `<g class="palm ${cls}" transform="translate(${x} ${y}) scale(${k})" fill="none" stroke-linecap="round">
    <path d="M0 0q${14 + lean}-110 ${lean}-230" stroke-width="16"/>
    <g stroke-width="9" transform="translate(${lean} -230)">
      <path d="M0 0q-60-56-128-10"/><path d="M0 0q-74-8-108 62"/><path d="M0 0q-30-76-98-86"/>
      <path d="M0 0q62-58 130-18"/><path d="M0 0q78-10 112 56"/><path d="M0 0q34-76 98-82"/><path d="M0 0q4-70-10-100"/>
    </g>
  </g>`;
}

// ——— الجنة والأرض (آدم عليه السلام): لا يُرسم أحد؛ آدم وزوجه نور فقط، ولا تُرسم الملائكة ولا إبليس ———
function gtree(x, y, k, c1, c2, fruit = '') {
  return `<g transform="translate(${x} ${y}) scale(${k})">
    <path d="M-14 0q10-70-6-150h40q-16 80-6 150z" fill="#3a2a1c"/>
    <g class="gd-sway"><circle cx="-70" cy="-190" r="78" fill="${c1}"/><circle cx="70" cy="-196" r="84" fill="${c1}"/><circle cx="0" cy="-260" r="96" fill="${c1}"/>
    <circle cx="-34" cy="-286" r="54" fill="${c2}"/><circle cx="52" cy="-240" r="40" fill="${c2}" opacity=".7"/>${fruit}</g>
  </g>`;
}
function garden() {
  const r = rng(41); let blooms = '', tufts = '', fruit = '', sprouts = '';
  for (let i = 0; i < 46; i++) { const x = -500 + r() * 2200, y = 640 + r() * r() * 520; blooms += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3 + r() * 5).toFixed(1)}" fill="${['#ffd77a', '#fff4cf', '#f6a5c0', '#bfeee8'][i % 4]}"/>`; }
  for (let i = 0; i < 60; i++) { const x = -600 + r() * 2400, y = 624 + r() * r() * 560; tufts += `M${x.toFixed(0)} ${y.toFixed(0)}q-6-16-14-20M${x.toFixed(0)} ${y.toFixed(0)}q2-18 0-26M${x.toFixed(0)} ${y.toFixed(0)}q8-14 16-18`; }
  for (const [x, y] of [[-96, -214], [-40, -150], [36, -180], [100, -230], [-10, -300], [64, -322], [-78, -306]]) fruit += `<circle cx="${x}" cy="${y}" r="11" fill="#ffd77a"/><circle cx="${x - 3}" cy="${y - 3}" r="4" fill="#fff4cf"/>`;
  for (let i = 0; i < 9; i++) { const x = 180 + r() * 840, y = 650 + r() * 160; sprouts += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}v-26m0 6q-16-4-20-20 18 0 20 20zm0-8q16-4 20-22-18 2-20 22z"/>`; }
  return `${DEFS}
  <defs>
    <linearGradient id="g-eden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2748"/><stop offset=".4" stop-color="#1c6470"/><stop offset=".62" stop-color="#7fc9a8"/><stop offset=".76" stop-color="#ffe9a8"/></linearGradient>
    <linearGradient id="g-meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f9a6a"/><stop offset=".35" stop-color="#1c6b52"/><stop offset="1" stop-color="#0a2c2a"/></linearGradient>
    <linearGradient id="g-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87a48"/><stop offset=".4" stop-color="#6b4a2c"/><stop offset="1" stop-color="#2a1c12"/></linearGradient>
    <linearGradient id="g-river" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fe0da"/><stop offset=".5" stop-color="#e8fffb"/><stop offset="1" stop-color="#8fe0da"/></linearGradient>
  </defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="gd-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    <rect class="gd-eden" x="-700" y="-500" width="2600" height="1500" fill="url(#g-eden)"/>
    ${stars(70, 53, [-400, 1600], [-300, 420])}
    <g class="gd-sun"><circle cx="600" cy="470" r="520" fill="url(#g-warm)"/></g>
  </g>
  <g data-d=".3">
    <g class="gd-eden">
      <path d="M-700 560q220-130 470-60t420-70 430 60 420-80 460 90v900H-700z" fill="#1d6a66"/>
      <g opacity=".85">${gtree(-120, 520, 0.5, '#1a5a55', '#22706a')}${gtree(120, 500, 0.42, '#1a5a55', '#22706a')}${gtree(420, 530, 0.4, '#1a5a55', '#22706a')}${gtree(640, 515, 0.34, '#1a5a55', '#22706a')}${gtree(980, 480, 0.46, '#1a5a55', '#22706a')}${gtree(1240, 520, 0.54, '#1a5a55', '#22706a')}${gtree(1500, 500, 0.4, '#1a5a55', '#22706a')}</g>
    </g>
    <path class="gd-earth gd-ridge" d="M-700 580-420 470-300 520-150 420 20 520 180 450 330 540 520 480 700 560 880 470 1040 540 1220 450 1420 540 1900 470V1400H-700z"/>
  </g>
  <g data-d=".6">
    <g class="gd-eden">
      <path d="M-700 566q300-40 620 0t640-6 660 4 680-10v70q-340 16-680 10t-660 0-640 4-620-2z" fill="url(#g-river)"/>
      <path class="gd-ripple" d="M-600 590h90m120 12h70m160-16h110m90 22h60m150-20h100m120 14h80m140-18h100m110 16h70m130-12h90" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    </g>
  </g>
  <g data-d=".75">
    <g class="gd-eden">
      ${gtree(60, 660, 1.05, '#1f7a5a', '#35a878', '<circle cx="-60" cy="-220" r="8" fill="#f6a5c0"/><circle cx="40" cy="-170" r="8" fill="#f6a5c0"/><circle cx="84" cy="-250" r="8" fill="#f6a5c0"/>')}
      ${gtree(1150, 650, 1.1, '#1f7a5a', '#35a878', '<circle cx="-70" cy="-200" r="8" fill="#fff4cf"/><circle cx="30" cy="-300" r="8" fill="#fff4cf"/><circle cx="90" cy="-190" r="8" fill="#fff4cf"/>')}
      ${gtree(-330, 680, 0.9, '#1b6c52', '#2c9a6c')}${gtree(1540, 670, 0.95, '#1b6c52', '#2c9a6c')}
      ${gtree(250, 640, 0.78, '#1b6c52', '#2c9a6c', '<circle cx="-50" cy="-230" r="8" fill="#ffd77a"/><circle cx="60" cy="-190" r="8" fill="#ffd77a"/>')}${gtree(960, 650, 0.84, '#1b6c52', '#2c9a6c')}
    </g>
  </g>
  <g data-d="1">
    <path class="gd-eden" d="M-700 1400V640q260-50 560-22t520-14 480 18 480-20 560 30v768z" fill="url(#g-meadow)"/>
    <path class="gd-earth" d="M-700 1400V640q260-50 560-22t520-14 480 18 480-20 560 30v768z" fill="url(#g-soil)"/>
    <path class="gd-earth" d="M-700 660q300-44 640-14t600-2 700-12 660 30v36q-360-40-700-22t-640 10-620-10-640 22z" fill="#d9a868" opacity=".45"/>
    <g class="gd-eden">
      <path d="${tufts}" fill="none" stroke="#5fd09a" stroke-width="3" stroke-linecap="round" opacity=".55"/>
      ${blooms}
      <g transform="translate(790 668)">
        <circle class="gd-mark" cy="-230" r="250" fill="url(#g-warm)"/>
        <ellipse cx="0" cy="4" rx="120" ry="16" fill="#000" opacity=".28"/>
        <path d="M-22 0q16-90-10-180l-40-40 14-10 38 30 12-60h18l8 62 40-36 14 12-44 44q-22 88-6 174z" fill="#4a3220"/>
        <g class="gd-sway gd-sway--slow"><circle cx="-92" cy="-240" r="92" fill="#16624e"/><circle cx="94" cy="-250" r="98" fill="#16624e"/><circle cx="0" cy="-330" r="118" fill="#1b7a5e"/><circle cx="-40" cy="-360" r="62" fill="#2fae82"/><circle cx="70" cy="-300" r="44" fill="#2fae82" opacity=".7"/>
        <g class="gd-fruit">${fruit}</g></g>
      </g>
    </g>
    <g class="gd-earth gd-sprouts" fill="#5fd09a" stroke="#5fd09a" stroke-width="4" stroke-linecap="round">${sprouts}</g>
    <rect class="gd-dusk" ${BIG} fill="#040b18"/>
    <g class="gd-lights">
      <g class="gd-light gd-light--b"><circle cx="372" cy="560" r="84" fill="url(#g-warm)"/><circle cx="372" cy="560" r="6" fill="#fff"/></g>
      <g class="gd-light gd-light--a"><circle cx="470" cy="540" r="120" fill="url(#g-warm)"/><circle cx="470" cy="540" r="8" fill="#fff"/></g>
    </g>
    <ellipse class="gd-glow" cx="600" cy="560" rx="900" ry="620" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3">
    <g class="gd-eden" fill="#07231f">
      <path d="M-700-500h700q-60 190-250 250t-250 300-200 140z"/><path d="M1900-500h-640q70 200 250 260t230 300 160 120z"/>
      <path d="M-700 1400V900q170-70 300 30t170 470zM1900 1400V880q-190-60-310 40t-150 480z"/>
    </g>
    <path class="gd-earth" d="M-700 1400V920l230-70 170 60 110 490zM1900 1400V900l-250-60-160 70-90 490z" fill="#150d08"/>
  </g>`;
}

// ——— كثبان الأحقاف ومساكن عاد (هود عليه السلام): لا يُرسم أحد؛ هود نور فقط ———
function pillar(x, h, w = 34) {
  return `<g transform="translate(${x} 0)"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="url(#g-stone)"/>
    <rect x="${-w / 2 - 8}" y="${-h - 16}" width="${w + 16}" height="16" rx="3" fill="#e9c98c"/><rect x="${-w / 2 - 6}" y="-12" width="${w + 12}" height="12" fill="#8a6234"/>
    <path d="M${-w / 6} ${-h + 6}V-14M${w / 6} ${-h + 6}V-14" stroke="#7a5426" stroke-width="2.5" opacity=".45"/></g>`;
}
function dunes() {
  const r = rng(77); let sand = '', ripples = '';
  for (let i = 0; i < 60; i++) { const x = -700 + r() * 2600, y = -300 + r() * 1500, l = 120 + r() * 320; sand += `M${x.toFixed(0)} ${y.toFixed(0)}h${l.toFixed(0)}`; }
  for (let i = 0; i < 11; i++) { const y = 760 + i * 52; ripples += `M-700 ${y}q330-${26 + i * 2} 660 0t660 0 660 0 660 0`; }
  return `${DEFS}
  <defs>
    <linearGradient id="g-desert" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20387a"/><stop offset=".36" stop-color="#7a6a9c"/><stop offset=".56" stop-color="#f0a66a"/><stop offset=".72" stop-color="#ffe2a4"/></linearGradient>
    <linearGradient id="g-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2b877"/><stop offset=".55" stop-color="#c79450"/><stop offset="1" stop-color="#8a6234"/></linearGradient>
    <linearGradient id="g-dune" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b876"/><stop offset=".5" stop-color="#b98248"/><stop offset="1" stop-color="#5a3a1c"/></linearGradient>
    <linearGradient id="g-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1420"/><stop offset=".7" stop-color="#3a2a24"/><stop offset="1" stop-color="#6b4a2a"/></linearGradient>
  </defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    ${stars(70, 19, [-400, 1600], [-300, 420])}
    <rect class="du-day" x="-700" y="-500" width="2600" height="1500" fill="url(#g-desert)"/>
    <g class="du-sun"><circle cx="880" cy="430" r="380" fill="url(#g-warm)"/><circle cx="880" cy="430" r="58" fill="#fff4cf"/></g>
    <rect class="du-stormsky" ${BIG} fill="#4a321c"/>
    <g class="du-cloud">
      <path d="M-700 430q120-150 330-120 60-150 260-140 120-130 330-70 160-110 340-20 190-70 300 60 220-40 340 120 200 0 300 170H-700z" fill="url(#g-cloud)"/>
      <path d="M-500 430q140-90 300-60 90-110 280-80 150-90 320-20 170-60 300 40 180-30 300 120z" fill="#2a1e22" opacity=".8"/>
    </g>
  </g>
  <g data-d=".3">
    <path class="du-far" d="M-700 560q240-110 500-50t460-60 440 50 420-70 480 80v900H-700z"/>
  </g>
  <g data-d=".75">
    <g class="du-city">
      <path class="du-hill" d="M-200 700q200-150 440-150h700q260 0 460 150v700H-200z"/>
      <g transform="translate(0 556)">
        <rect x="318" y="-150" width="170" height="150" fill="#b98248"/><rect x="306" y="-166" width="194" height="18" fill="#e2b877"/>
        <path d="M318-166v-22h26v22m22 0v-22h26v22m22 0v-22h26v22m22 0v-22h26v22" fill="#e2b877"/>
        <rect class="du-door" x="384" y="-70" width="40" height="70" rx="20" fill="#3a2412"/>
        <rect x="716" y="-110" width="150" height="110" fill="#b98248"/><rect x="706" y="-124" width="170" height="16" fill="#e2b877"/>
        <rect class="du-door" x="772" y="-60" width="36" height="60" rx="18" fill="#3a2412"/>
        ${pillar(250, 250)}${pillar(540, 330, 38)}${pillar(600, 380, 40)}${pillar(660, 330, 38)}${pillar(930, 270)}${pillar(1000, 210, 30)}${pillar(180, 190, 30)}
        <rect x="520" y="-352" width="160" height="20" rx="3" fill="#e9c98c"/><rect x="578" y="-404" width="44" height="18" rx="3" fill="#e9c98c"/>
      </g>
      <g class="du-green">
        <g stroke="#1f5a3c">${palm(130, 620, 0.5, -8)}${palm(1070, 616, 0.55, 10)}${palm(450, 606, 0.42, 6)}${palm(840, 606, 0.44, -6)}</g>
        <ellipse cx="620" cy="604" rx="130" ry="15" fill="#7fd6d0"/><ellipse cx="620" cy="602" rx="80" ry="6" fill="#e8fffb" opacity=".7"/>
        <path d="M240 610q20-22 44 0zM300 614q16-18 36 0zM880 612q22-22 46 0zM950 616q16-18 34 0zM770 620q18-20 40 0zM450 618q16-18 36 0z" fill="#2f8a58"/>
      </g>
      <path class="du-drift" d="M-200 760q180-170 420-130t380-10 380 20 420-40 300 160v700H-200z" fill="url(#g-dune)"/>
    </g>
  </g>
  <g data-d="1">
    <path class="du-near" d="M-700 1400V700q300-90 620-40t560-30 520 40 500-50 400 60v720z" fill="url(#g-dune)"/>
    <path d="M-700 720q300-90 620-40t560-30 520 40 500-50 400 60v24q-200-50-400-40t-500 50-520-40-560 30-620 20z" fill="#ffe2a4" opacity=".4"/>
    <path d="${ripples}" fill="none" stroke="#5a3a1c" stroke-width="3" opacity=".22"/>
    <rect class="du-veil" ${BIG} fill="#070d26"/>
    <g class="du-birdwrap"><g class="du-bird" transform="translate(600 500)">
      <path d="M-58 8l-44 20 46-2z" fill="#3a2a1c"/>
      <path class="du-wing" d="M-30-4q-10-70 40-96-6 60 24 92z" fill="#2a2018"/><path class="du-wing" d="M-22-30l44-34M-16-12l52-30" stroke="#fff4cf" stroke-width="6" fill="none"/>
      <ellipse cx="0" cy="6" rx="62" ry="30" fill="#e39a4a"/><circle cx="56" cy="-10" r="24" fill="#e8a658"/>
      <path d="M76-12l64 14-64 2z" fill="#3a2a1c"/><circle cx="62" cy="-16" r="4" fill="#1a1024"/>
      <path d="M44-28l-26-44M52-32l-12-50M60-34l2-52M68-32l16-48M74-26l28-38" stroke="#e8a658" stroke-width="7" stroke-linecap="round"/>
      <g fill="#1a1024"><circle cx="18" cy="-72" r="5"/><circle cx="40" cy="-82" r="5"/><circle cx="62" cy="-86" r="5"/><circle cx="84" cy="-80" r="5"/><circle cx="102" cy="-64" r="5"/></g>
    </g></g>
    <g class="du-staff" fill="none" stroke-linecap="round"><path d="M500 716V560q0-26 24-26" stroke="#6b441d" stroke-width="11"/><path d="M500 716V560q0-26 24-26" stroke="#c9995a" stroke-width="3"/></g>
    <g class="du-ropes" fill="none" stroke="#3a2a1c" stroke-width="8" stroke-linecap="round"><path d="M610 716q14-14 28 0t28 0 28 0"/><path d="M640 746q14-14 28 0t28 0 28 0"/><path d="M720 720q14-14 28 0t28 0"/><path d="M600 770q14-14 28 0t28 0"/></g>
    <g class="du-snake" fill="none" stroke-linecap="round"><path d="M430 740q70 20 90-30t-30-80 20-90 70-40" stroke="#2f6a3a" stroke-width="26"/><path d="M430 740q70 20 90-30t-30-80 20-90 70-40" stroke="#6fbf6a" stroke-width="6" stroke-dasharray="14 18"/><circle cx="584" cy="498" r="20" fill="#2f6a3a" stroke="none"/></g>
    <g class="du-light"><circle cx="380" cy="640" r="110" fill="url(#g-warm)"/><circle cx="380" cy="640" r="8" fill="#fff"/></g>
    <g class="du-flock" fill="url(#g-warm)"><circle cx="300" cy="668" r="34"/><circle cx="340" cy="690" r="28"/><circle cx="430" cy="686" r="30"/><circle cx="262" cy="700" r="24"/></g>
  </g>
  <g data-d="1.3">
    <rect class="du-haze" ${BIG} fill="#8a5e30"/>
    <g class="du-sand"><path d="${sand}" fill="none" stroke="#f3d6a0" stroke-width="5" stroke-linecap="round"/></g>
    <path d="M-700 1400V960q260-80 480 0t420 440zM1900 1400V940q-240-70-460 20t-380 440z" fill="#3a2412"/>
  </g>`;
}

// ——— جبال الحِجر وبيوت ثمود المنحوتة (صالح عليه السلام): لا يُرسم أحد؛ صالح نور فقط، والناقة ظلّ ———
function carved(x, y, w, h) {
  const d = w * 0.3, win = w * 0.16;
  return `<g transform="translate(${x} ${y})">
    <path class="hj-recess" d="M${-w / 2} 0V${-h}h${w}V0z"/>
    <path class="hj-trim" d="M${-w / 2 - 10} ${-h}h${w + 20}v-14h${-w - 20}zM${-w / 2} ${-h * 0.62}h${w}v-8h${-w}z"/>
    <path class="hj-win" d="M${-d / 2} 0v${-h * 0.42}q${d / 2}-${d * 0.6} ${d} 0V0zM${-w * 0.32 - win / 2} ${-h * 0.74}h${win}v${-win * 1.3}h${-win}zM${w * 0.32 - win / 2} ${-h * 0.74}h${win}v${-win * 1.3}h${-win}z"/>
  </g>`;
}
function hijr() {
  const r = rng(91); let strata = '', crops = '';
  for (let y = 250; y < 640; y += 44) strata += `M-700 ${y}q650 ${(r() * 30 - 15).toFixed(0)} 1300 0t1300 0`;
  for (let i = 0; i < 26; i++) { const x = 60 + r() * 520, y = 716 + r() * 70; crops += `M${x.toFixed(0)} ${y.toFixed(0)}q-7-18-16-22M${x.toFixed(0)} ${y.toFixed(0)}v-28M${x.toFixed(0)} ${y.toFixed(0)}q7-18 16-22`; }
  return `${DEFS}
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="hj-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(90, 67, [-400, 1600], [-300, 420])}
    <path class="hj-moon" d="M300 70a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="hj-sun"><circle cx="330" cy="400" r="360" fill="url(#g-warm)"/><circle cx="330" cy="400" r="60" fill="#fff4cf"/></g>
  </g>
  <g data-d=".3">
    <path class="hj-far" d="M-700 520h160l30-90h190l30 60h130l40-120h230l30 90h150l40-60h200l30 80h170l40-110h210l30 100h140l30-70h180l30 110h200v900H-700z"/>
  </g>
  <g data-d=".75">
    <path class="hj-rock" d="M-700 1400V360q60-70 150-60 40-90 150-80 70-70 170-30 60-90 190-70 90-50 180 10 80-60 190-10 110-40 180 50 100-30 170 50 120-20 180 70 110 0 170 80 90 10 130 70v970z"/>
    <path class="hj-lit" d="M-140 220q70-70 170-30l-60 130-130 60zM210 120q90-50 180 10l-40 150-150-20zM580 130q80-60 190-10l-70 150-130 20zM950 170q100-30 170 50l-110 110-80-40zM1300 290q110 0 170 80l-150 60z"/>
    <path d="${strata}" fill="none" stroke="#000" stroke-width="5" opacity=".1"/>
    <g class="hj-homes">${carved(300, 650, 190, 250)}${carved(620, 650, 240, 320)}${carved(930, 650, 180, 230)}${carved(20, 650, 150, 190)}${carved(1200, 650, 160, 200)}</g>
  </g>
  <g data-d="1">
    <path class="hj-ground" d="M-700 1400V660q300-36 640-12t600-4 700-10 660 26v740z"/>
    <path class="hj-groundlit" d="M-700 676q300-36 640-12t600-4 700-10 660 26v30q-360-34-700-18t-640 8-620-8-640 18z"/>
    <g class="hj-oasis">
      <path d="${crops}" fill="none" stroke="#3f9a62" stroke-width="4" stroke-linecap="round"/>
      <g stroke="#1c5238">${palm(120, 720, 0.62, -10)}${palm(560, 706, 0.5, 8)}</g>
      <ellipse cx="350" cy="730" rx="170" ry="28" fill="#2f8f9a"/><ellipse class="hj-shine" cx="350" cy="726" rx="110" ry="12" fill="#bfeee8" opacity=".7"/>
    </g>
    <g class="hj-camelwrap"><g class="hj-camel" transform="translate(600 742) scale(1.15)">
      <ellipse cx="-10" cy="-120" rx="230" ry="190" fill="url(#g-warm)" opacity=".75"/>
      <ellipse cx="6" cy="2" rx="120" ry="10" fill="#000" opacity=".3"/>
      <g class="hj-camelbody">
        <path d="M-84-112C-104-140-120-180-140-212l-34 8q-12-6-6-18l32-18 4-12 8 10c22 6 30 26 38 52 10 26 26 32 46 30 28-4 40-44 66-44s40 38 62 46c22 6 32 28 30 54-4 20-44 26-104 24-40-2-70-6-84-32z"/>
        <path d="M-72-96l-6 96h14l8-90zM-46-88l4 88h14l-2-88zM62-90l12 90h14l-8-94zM86-98l16 98h14l-14-104z"/>
        <path d="M104-124q18 22 10 60" fill="none" stroke-width="6" stroke-linecap="round"/>
      </g>
    </g></g>
    <g class="hj-light"><circle cx="840" cy="660" r="110" fill="url(#g-warm)"/><circle cx="840" cy="660" r="8" fill="#fff"/></g>
    <g class="hj-flock" fill="url(#g-warm)"><circle cx="910" cy="690" r="30"/><circle cx="950" cy="672" r="24"/><circle cx="880" cy="712" r="26"/></g>
  </g>
  <g data-d="1.3">
    <path class="hj-front" d="M-700 1400V900l200-90 90 40 60 120 160 60 60 370zM1900 1400V880l-180-70-110 50-70 110-150 70-50 360z"/>
  </g>`;
}

// ——— معبد الأصنام والنار العظيمة (إبراهيم عليه السلام): لا يُرسم أحد؛ إبراهيم نور فقط، والأصنام حجارة قائمة بلا ملامح ———
function tongue(x, k, cls, delay) {
  return `<g transform="translate(${x} 0) scale(${k})"><path class="ur-fl ${cls}" style="animation-delay:${delay}s" d="M0 0C-74-30-66-124-22-176-30-122 10-112 4-250 64-176 78-70 0 0z"/></g>`;
}
function idol(x, k, n) {
  return `<g transform="translate(${x} 0) scale(${k})"><g class="ur-idol ur-idol--${n}"><path d="M-24 0V-112q24-40 48 0V0z"/><path d="M-24-70h48" fill="none" stroke="#000" stroke-width="4" opacity=".25"/></g></g>`;
}
function ur() {
  const r = rng(29); let bricks = '', rubble = '';
  for (let y = 380; y < 640; y += 34) bricks += `M40 ${y}H560`;
  for (let i = 0; i < 16; i++) { const x = 110 + r() * 380, y = 596 + r() * 10, w = 8 + r() * 16; rubble += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l${w.toFixed(0)}-${(w * 0.7).toFixed(0)} ${(w * 0.8).toFixed(0)} ${(w * 0.7).toFixed(0)}z"/>`; }
  return `${DEFS}
  <defs><linearGradient id="g-mud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4130"/><stop offset="1" stop-color="#2c1d18"/></linearGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="ur-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(90, 13, [-400, 1600], [-300, 460])}
    <path class="ur-moon" d="M1010 90a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="ur-sun"><circle cx="1050" cy="520" r="340" fill="url(#g-warm)"/></g>
  </g>
  <g data-d=".3">
    <path class="ur-far" d="M-700 560h200v-60h90v-50h70v50h60v60h180v-40h120v40h140v-90h50v-60h60v-50h80v50h60v60h50v90h170v-50h130v50h210v-70h80v-40h70v40h60v70h500v900H-700z"/>
  </g>
  <g data-d="1">
    <path class="ur-ground" d="M-700 1400V640q320-20 660-8t640-4 660 6 640-10v776z"/>
    <g class="ur-temple">
      <rect x="40" y="360" width="520" height="280" fill="url(#g-mud)"/><path d="${bricks}" stroke="#000" stroke-width="3" opacity=".22"/>
      <path d="M40 360h520v-20H40zM40 340v-26h44v26m44 0v-26h44v26m44 0v-26h44v26m44 0v-26h44v26m44 0v-26h44v26m44 0v-26h44v26" fill="#5a4130"/>
      <path d="M90 640h420l-24-40H114z" fill="#6b4e3a"/><path d="M114 600h372v-10H114z" fill="#8a6a4e"/>
      <ellipse class="ur-niche" cx="300" cy="520" rx="210" ry="150" fill="url(#g-warm)"/>
      <g class="ur-torch" transform="translate(84 470)"><rect x="-5" y="0" width="10" height="130" fill="#2c1d18"/><path d="M-16 0h32l-6 16h-20z" fill="#8a6a4e"/><path class="ur-fl ur-fl--c" d="M0 0q-20-14-6-44 0 18 10 14-4-22 8-36 14 34-12 66z"/></g>
      <g class="ur-torch" transform="translate(516 470)"><rect x="-5" y="0" width="10" height="130" fill="#2c1d18"/><path d="M-16 0h32l-6 16h-20z" fill="#8a6a4e"/><path class="ur-fl ur-fl--c" style="animation-delay:-.4s" d="M0 0q-20-14-6-44 0 18 10 14-4-22 8-36 14 34-12 66z"/></g>
      <g transform="translate(0 600)" class="ur-idols">
        ${idol(160, 0.7, 1)}${idol(218, 0.9, 2)}${idol(382, 0.9, 3)}${idol(440, 0.7, 4)}${idol(120, 0.5, 5)}${idol(480, 0.5, 6)}
        <g class="ur-rubble">${rubble}</g>
        <g transform="translate(300 0) scale(1.5)"><path class="ur-big" d="M-26 0V-118q26-44 52 0V0z"/><path d="M-26-74h52M-26-30h52" fill="none" stroke="#000" stroke-width="3" opacity=".25"/></g>
      </g>
    </g>
    <g transform="translate(880 652)">
      <circle class="ur-fireglow" cy="-150" r="430" fill="url(#g-warm)"/>
      <path class="ur-pit" d="M-250 0v-44h56v-22h60v22h50v-26h64v26h54v-24h60v24h50v-20h56v64z"/>
      <g class="ur-fire">
        ${tongue(-120, 1.25, 'ur-fl--a', 0)}${tongue(110, 1.35, 'ur-fl--a', -0.5)}${tongue(0, 1.9, 'ur-fl--a', -0.9)}
        ${tongue(-70, 1.15, 'ur-fl--b', -0.3)}${tongue(64, 1.3, 'ur-fl--b', -0.7)}${tongue(-150, 0.8, 'ur-fl--b', -1.1)}${tongue(160, 0.75, 'ur-fl--b', -0.2)}
        ${tongue(-24, 1.05, 'ur-fl--c', -0.6)}${tongue(40, 0.85, 'ur-fl--c', -1)}${tongue(-96, 0.6, 'ur-fl--c', -0.1)}${tongue(108, 0.6, 'ur-fl--c', -0.8)}
        ${tongue(6, 0.6, 'ur-fl--d', -0.4)}
      </g>
      <path class="ur-wood" d="M-170-6l150-30 10 14-150 30zM170-6L20-36 10-22l150 30zM-90-2h180v14H-90z"/>
      <path class="ur-pit ur-pit--front" d="M-270 20v-40h70v-16h64v16h60v-18h70v18h64v-16h70v16h60v-14h52v54z"/>
    </g>
    <g class="ur-light"><circle cx="300" cy="680" r="150" fill="url(#g-warm)"/><circle cx="300" cy="680" r="80" fill="url(#g-white)"/><circle cx="300" cy="680" r="10" fill="#fff"/></g>
    <g class="ur-light2"><circle cx="1010" cy="700" r="70" fill="url(#g-warm)"/><circle cx="1010" cy="700" r="6" fill="#fff"/></g>
  </g>
  <g data-d="1.3">
    <path d="M-700 1400V930l210-60 150 50 120 480zM1900 1400V910l-230-50-150 60-110 480z" fill="#04050c"/>
  </g>`;
}

// ——— أرض وبلدة (ديكور عام لقصص عدة): عناصره كلها مخفية وتُظهرها الحالات. لا يُرسم أحد؛ الأنبياء وأهلهم أنوار ———
const CAMEL = '<path d="M-84-112C-104-140-120-180-140-212l-34 8q-12-6-6-18l32-18 4-12 8 10c22 6 30 26 38 52 10 26 26 32 46 30 28-4 40-44 66-44s40 38 62 46c22 6 32 28 30 54-4 20-44 26-104 24-40-2-70-6-84-32z"/><path d="M-72-96l-6 96h14l8-90zM-46-88l4 88h14l-2-88zM62-90l12 90h14l-8-94zM86-98l16 98h14l-14-104z"/>';
function house(x, w, h, dome) {
  const wins = [];
  for (let i = 0; i < Math.max(1, Math.round(w / 60)); i++) wins.push(`<rect class="ld-win" x="${x + 16 + i * 52}" y="${-h + 26}" width="20" height="28" rx="10"/>`);
  return `<rect x="${x}" y="${-h}" width="${w}" height="${h}" fill="url(#g-mudwall)"/><rect x="${x - 6}" y="${-h - 10}" width="${w + 12}" height="12" fill="#6b5340"/>
    ${dome ? `<path d="M${x + w * 0.2} ${-h - 10}q${w * 0.3}-${w * 0.5} ${w * 0.6} 0z" fill="#6b5340"/>` : ''}${wins.join('')}
    <path class="ld-win" d="M${x + w / 2 - 13} 0v-40q13-16 26 0V0z"/>`;
}
// قِربة أم عطية رضي الله عنها: قربة ماء من جلد معلّقة على حامل خشبي، تقطر منها قطرة (qirba=on)
function qirba(x, y, k = 1) {
  return `<g class="qb" transform="translate(${x} ${y}) scale(${k})"><ellipse class="qb-glow" cy="-100" rx="130" ry="130" fill="url(#g-warm)"/>
    <path d="M-48 0L0-176 48 0M0-176l-8 176" fill="none" stroke="#6b441d" stroke-width="8" stroke-linecap="round"/><path d="M0-176v24" stroke="#e2d2a8" stroke-width="3"/>
    <path d="M-10-152h20l4 14q30 10 30 50 0 40-34 50-30 8-46-14-14-22 0-56 10-24 22-30z" fill="#8a5a32" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-8-138q-24 24-18 64M8-132q22 22 18 60" fill="none" stroke="#c9995a" stroke-width="3" opacity=".55"/><path d="M-10-152h20" stroke="#f0e2c0" stroke-width="6" stroke-linecap="round"/>
    <circle class="qb-drop" cx="-6" cy="-36" r="5" fill="#bfeee8"/></g>`;
}
function land() {
  const r = rng(57); let dream = '', rub = '', dates = '', flock = '';
  for (let i = 0; i < 11; i++) { const a = Math.PI * (0.08 + 0.84 * i / 10); dream += `<path transform="translate(${(600 - Math.cos(a) * 250).toFixed(0)} ${(210 - Math.sin(a) * 150).toFixed(0)})" d="M0-15l4 10 11 1-8 7 2 11-9-6-9 6 2-11-8-7 11-1z"/>`; }
  for (let i = 0; i < 26; i++) { const x = 90 + r() * 440, w = 16 + r() * 40; rub += `<path d="M${x.toFixed(0)} 644l${(w * 0.4).toFixed(0)}-${(8 + r() * 26).toFixed(0)} ${(w * 0.6).toFixed(0)} ${(4 + r() * 10).toFixed(0)}v20z"/>`; }
  for (const [x, y] of [[-14, -180], [0, -170], [14, -182], [-6, -158], [8, -160]]) dates += `<circle cx="${x}" cy="${y}" r="7"/>`;
  for (const [x, y, q] of [[-90, 26, 30], [-52, 44, 26], [70, 40, 28], [112, 22, 24], [-128, 48, 22], [150, 50, 22]]) flock += `<circle cx="${640 + x}" cy="${650 + y}" r="${q}"/>`;
  return `${DEFS}
  <defs><linearGradient id="g-mudwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a36"/><stop offset="1" stop-color="#2a2028"/></linearGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="ld-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(90, 83, [-400, 1600], [-300, 460])}
    <path class="ld-moon" d="M240 80a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="ld-sun"><circle cx="940" cy="480" r="380" fill="url(#g-warm)"/><circle cx="940" cy="480" r="60" fill="#fff4cf"/></g>
    <g class="ld-dream"><circle cx="600" cy="150" r="230" fill="url(#g-warm)" opacity=".5"/><g fill="#fff4cf">${dream}</g>
      <circle cx="540" cy="150" r="34" fill="#ffd77a"/><path d="M640 118a34 34 0 1 0 30 52 28 28 0 0 1-30-52z" fill="#fff4cf"/></g>
    <g class="ld-pleiades" transform="translate(600 170)"><circle class="ld-plglow" r="190" fill="url(#g-warm)"/><g fill="#fff4cf">${[[-60, -30, 9], [-20, -54, 8], [26, -40, 10], [60, -6, 8], [14, 6, 11], [-34, 22, 8], [40, 44, 7]].map(([x, y, q], i) => `<path class="ld-pl" style="--d:${-i * 0.6}s" transform="translate(${x} ${y}) scale(${q / 10})" d="M0-15l4 10 11 1-8 7 2 11-9-6-9 6 2-11-8-7 11-1z"/>`).join('')}</g></g>
  </g>
  <g data-d=".3">
    <path class="ld-ridge" d="M-700 580-460 470-330 530-190 430-40 530 110 450 250 540 420 470 570 550 720 480 880 430 1020 520 1170 450 1330 540 1500 460 1900 600V1400H-700z"/>
  </g>
  <g data-d="1">
    <path class="ld-ground" d="M-700 1400V640q320-22 660-8t640-6 660 8 640-12v778z"/>
    <path class="ld-groundlit" d="M-700 652q320-22 660-8t640-6 660 8 640-12v26q-320 18-640 12t-660-8-640 6-660 8z"/>
    <path class="ld-road" d="M330 660q200 60 420 50t520 150" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 22"/>
    <g class="ld-trench"><path class="ld-mound" d="M-700 742q180-34 360-18t360-14 360 16 360-12 360 14 360-18 360 16v18H-700z"/>
      <path class="ld-ditch" d="M-700 760q400-22 800-8t800-2 800-10v50q-400 16-800 10t-800 0-800 6z"/>
      <path class="ld-wall" d="M-700 760q400-22 800-8t800-2 800-10v22q-400 8-800 10t-800 0-800 10z"/>
      <path class="ld-lip" d="M-700 760q400-22 800-8t800-2 800-10" fill="none" stroke-width="5"/></g>
    <g class="ld-rubble" fill="#2a2028">${rub}</g>
    <g class="ld-town" transform="translate(0 646)">
      ${house(90, 120, 150, true)}${house(214, 100, 210, false)}${house(320, 130, 130, false)}${house(452, 90, 180, true)}
      <g class="ld-silos">${[560, 632, 704].map(x => `<path d="M${x} 0v-120q30-60 60 0V0z" fill="#b98548"/><path d="M${x + 22} 0v-34q8-10 16 0V0z" fill="#3a2412"/><path d="M${x} -70h60" stroke="#8a6234" stroke-width="4"/>`).join('')}</g>
    </g>
    <g class="ld-scale" transform="translate(330 760)">
      <path d="M-60 0h120l-14-18H-46zM-7-18h14v-210H-7z" fill="#8a6234"/><circle cy="-234" r="13" fill="#ffd77a"/>
      <g class="ld-beam"><g transform="translate(0 -230)">
        <rect x="-150" y="-6" width="300" height="12" rx="6" fill="#c9995a"/>
        <path d="M-140 0l-36 96M-140 0l36 96M140 0l-36 96M140 0l36 96" stroke="#e2b877" stroke-width="3"/>
        <path d="M-186 96q46 44 92 0zM94 96q46 44 92 0z" fill="#ffd77a"/><path d="M118 96h44v-22h-44z" fill="#6b5340"/>
      </g></g>
    </g>
    <g class="ld-kaabawrap" transform="translate(640 652)"><g class="ld-kaaba">
      <rect x="-86" y="-190" width="172" height="190" fill="#3a3340"/><path d="M-86-190h172v10H-86z" fill="#5a5262"/>
      <path d="M-86-152h172M-86-114h172M-86-76h172M-86-38h172M-40-190v38M30-152v38M-10-114v38M50-76v38M-50-38V0" stroke="#1c1822" stroke-width="3"/>
      <path d="M-22 0v-64h44V0z" fill="#17131c"/>
    </g></g>
    <g class="ld-well" transform="translate(800 672)">
      <path d="M-58 0v-46q58-18 116 0V0q-58 18-116 0z" fill="#5a5262"/><ellipse cy="-46" rx="58" ry="14" fill="#120e18"/>
      <path d="M-58-24q58 18 116 0" fill="none" stroke="#3a3340" stroke-width="4"/>
      <path d="M-52-46v-92h10v92zM42-46v-92h10v92zM-60-138h120v-10H-60z" fill="#6b441d"/><path d="M0-138v60" stroke="#e2d2a8" stroke-width="3"/><path d="M-12-78h24l-4 22h-16z" fill="#8a6234"/>
    </g>
    <g class="ld-spring" transform="translate(800 690)">
      <ellipse rx="150" ry="24" fill="#2f8f9a"/><ellipse cy="-3" rx="96" ry="11" fill="#bfeee8" opacity=".7"/>
      <g class="ld-gush" fill="none" stroke="#e8fffb" stroke-width="6" stroke-linecap="round"><path d="M0-4q-10-50-34-34"/><path d="M0-4q0-66 0-70"/><path d="M0-4q10-50 34-34"/></g>
      <path d="M-170 6q-8-30-22-36M-170 6v-44M-170 6q8-30 22-36M170 8q-8-26-20-32M170 8v-40M170 8q8-26 20-32M-110 22q-6-22-16-26M-110 22q6-22 16-26M110 24q-6-22-16-26M110 24q6-22 16-26" fill="none" stroke="#3f9a62" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="ld-palm"><g stroke="#1c5238">${palm(950, 706, 0.9, -12)}</g><g transform="translate(940 706) scale(.9)" fill="#c9792a">${dates}</g></g>
    <g class="ld-caravan" fill="#150e1c"><g transform="translate(980 716) scale(.62)">${CAMEL}</g><g transform="translate(1110 724) scale(.7)">${CAMEL}</g><g transform="translate(1250 716) scale(.6)">${CAMEL}</g></g>
    <g class="ld-cradle" transform="translate(640 712)">
      <ellipse cy="-40" rx="170" ry="150" fill="url(#g-warm)"/>
      <path d="M-84-6q84 30 168 0" fill="none" stroke="#6b441d" stroke-width="9" stroke-linecap="round"/>
      <path d="M-70-64h140l-14 56q-56 14-112 0z" fill="url(#g-wood)"/><path d="M-70-64q-4-34 26-44v44z" fill="#8a6234"/><path d="M-60-40h118M-56-22h110" stroke="#4a2d10" stroke-width="3" opacity=".5"/>
      <ellipse cx="14" cy="-66" rx="52" ry="10" fill="#fff4cf"/>
    </g>
    <g class="ld-shirt" transform="translate(640 560)">
      <circle r="150" fill="url(#g-warm)"/>
      <path d="M-34-70q34 22 68 0l62 30-22 44-30-14l12 140h-112l12-140-30 14-22-44z" fill="#f1e4c3" stroke="#b99a48" stroke-width="3" stroke-linejoin="round"/><path d="M-34-70q34 40 68 0" fill="none" stroke="#b99a48" stroke-width="3"/>
    </g>
    <g class="ld-banner" transform="translate(540 720)"><circle cy="-200" r="170" fill="url(#g-warm)"/><path d="M0 0v-330" stroke="#6b441d" stroke-width="10" stroke-linecap="round"/><circle cy="-336" r="10" fill="#ffd77a"/>
      <path class="ld-flag" d="M5-322q60-16 120 4t110-6v120q-50 14-110-4T5-202z" fill="#f1e4c3" stroke="#c9a24a" stroke-width="4"/></g>
    <g class="ld-bow" transform="translate(470 560) rotate(-8)"><circle r="190" fill="url(#g-warm)" class="ld-bowglow"/>
      <path d="M40-170q-120 60-120 170t120 170" fill="none" stroke="#8a5a26" stroke-width="16" stroke-linecap="round"/><path d="M40-170q-120 60-120 170t120 170" fill="none" stroke="#e2b877" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M-86-22h28v44h-28z" fill="#4a2d10"/><path d="M40-170V170" stroke="#f1e4c3" stroke-width="3"/>
      <path d="M40 0H-150" stroke="#c9b48a" stroke-width="5" stroke-linecap="round"/><path d="M-150 0l22-11v22z" fill="#ffd77a"/><path d="M34 0l16-12M34 0l16 12M22 0l16-12M22 0l16 12" stroke="#f1e4c3" stroke-width="3"/></g>
    <g class="ld-cloak" transform="translate(600 650)"><circle class="ld-cloakglow" cy="-10" r="200" fill="url(#g-warm)"/>
      <path d="M-130-40q66-16 130-4t130-6l10 92q-70 12-140 4t-140 6z" fill="#8a6a4a" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-128-22q66-14 130-2t128-6M-125 0q66-14 130-2t126-6M-122 22q66-14 130-2t124-6" fill="none" stroke="#e2d2a8" stroke-width="7" opacity=".75"/>
      <path d="M-140 48l-6 14M-122 50l-2 14M-104 50l-4 14M110 46l4 14M128 44l2 14M146 42l6 14" stroke="#3a2412" stroke-width="3"/></g>
    <g class="ld-idhkhir" fill="none" stroke="#7fbf5a" stroke-width="5" stroke-linecap="round">${[[360, 712], [420, 726], [790, 724], [850, 710], [300, 730], [900, 732]].map(([x, y]) => `<path d="M${x} ${y}q-10-40-30-54M${x} ${y}q-2-50 4-64M${x} ${y}q10-40 30-50M${x} ${y}q-18-26-40-30M${x} ${y}q18-24 38-26"/>`).join('')}</g>
    <g class="ld-book" transform="translate(640 540)"><circle class="ld-bookglow" cy="-40" r="160" fill="url(#g-warm)"/><path d="M-70 0l70-30 70 30z" fill="#6b441d"/><path d="M-70 0V6l70-30 70 30V0" fill="#4a2d10"/><path d="M0-30l-74-18v-46l74 18z" fill="#fff4cf"/><path d="M0-30l74-18v-46L0-76z" fill="#f1e4c3"/><path d="M-60-60l50 12M-60-70l50 12M10-48l50-12M10-58l50-12" stroke="#2f8f9a" stroke-width="3"/><path d="M0-76v46" stroke="#c9a24a" stroke-width="3"/></g>
    <g class="ld-arrows" transform="translate(1300 0)"><g class="ld-arrow" style="--d:0s;--y:600px"><path d="M0 0h110" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/><path d="M0 0l16-8v16z" fill="#c9b48a"/><path d="M100 0l14-10M100 0l14 10" stroke="#e2d2a8" stroke-width="3"/></g><g class="ld-arrow" style="--d:0.5s;--y:640px"><path d="M0 0h110" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/><path d="M0 0l16-8v16z" fill="#c9b48a"/><path d="M100 0l14-10M100 0l14 10" stroke="#e2d2a8" stroke-width="3"/></g><g class="ld-arrow" style="--d:1.1s;--y:580px"><path d="M0 0h110" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/><path d="M0 0l16-8v16z" fill="#c9b48a"/><path d="M100 0l14-10M100 0l14 10" stroke="#e2d2a8" stroke-width="3"/></g><g class="ld-arrow" style="--d:1.6s;--y:660px"><path d="M0 0h110" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/><path d="M0 0l16-8v16z" fill="#c9b48a"/><path d="M100 0l14-10M100 0l14 10" stroke="#e2d2a8" stroke-width="3"/></g><g class="ld-arrow" style="--d:2.2s;--y:620px"><path d="M0 0h110" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/><path d="M0 0l16-8v16z" fill="#c9b48a"/><path d="M100 0l14-10M100 0l14 10" stroke="#e2d2a8" stroke-width="3"/></g><g class="ld-arrow" style="--d:2.7s;--y:600px"><path d="M0 0h110" stroke="#c9b48a" stroke-width="4" stroke-linecap="round"/><path d="M0 0l16-8v16z" fill="#c9b48a"/><path d="M100 0l14-10M100 0l14 10" stroke="#e2d2a8" stroke-width="3"/></g></g>
    <g class="ld-sword" transform="translate(620 600) rotate(-28)"><circle class="ld-swglow" r="230" fill="url(#g-warm)"/>
      <path d="M-24-300q24-14 48 0v300h-48z" fill="#cfd6e2"/><path d="M0-306v306" stroke="#f4f8ff" stroke-width="5" opacity=".8"/><path d="M-24-300q24-14 48 0" fill="none" stroke="#fff" stroke-width="3"/>
      <path class="ld-swshine" d="M-20-260l40-20v40l-40 20z" fill="#fff" opacity=".0"/>
      <path d="M-70 0h140q6 14 0 22H-70q-6-8 0-22z" fill="#c9a24a"/><path d="M-12 22h24v96h-24z" fill="#4a2d10"/><path d="M-12 40h24M-12 60h24M-12 80h24M-12 100h24" stroke="#8a6234" stroke-width="4"/><circle cy="128" r="16" fill="#c9a24a"/></g>
    <g class="ld-armor" transform="translate(600 640)"><circle class="ld-arglow" cy="-120" r="230" fill="url(#g-warm)"/>
      <path d="M-50-250q50 26 100 0l84 44-26 70-34-18 12 160H-86l12-160-34 18-26-70z" fill="#55606e" stroke="#2a2f3a" stroke-width="5" stroke-linejoin="round"/><path d="M-50-250q50 26 100 0l84 44-26 70-34-18 12 160H-86l12-160-34 18-26-70z" fill="none" stroke="#9aa6b8" stroke-width="2" opacity=".6"/>
      <path d="M-70-150q70 14 140 0M-74-120q74 14 148 0M-78-90q78 14 156 0M-80-60q80 14 160 0M-82-30q82 14 164 0M-84 0q84 14 168 0M-60-180q60 14 120 0" fill="none" stroke="#d8dee8" stroke-width="7" stroke-dasharray="7 5" opacity=".95"/>
      <path d="M-50-250q50 44 100 0" fill="none" stroke="#c9a24a" stroke-width="6"/>
      <g transform="translate(190 -40)"><circle r="74" fill="#6b441d" stroke="#c9a24a" stroke-width="8"/><circle r="18" fill="#c9a24a"/><circle r="48" fill="none" stroke="#4a2d10" stroke-width="4"/></g></g>
    <g class="ld-neckwrap"><g class="ld-necklace" transform="translate(640 600)"><circle class="ld-nkglow" r="190" fill="url(#g-warm)"/>
      <ellipse rx="96" ry="70" fill="none" stroke="#c9a24a" stroke-width="3"/>
      <g>${Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return `<circle cx="${(Math.cos(a) * 96).toFixed(1)}" cy="${(Math.sin(a) * 70).toFixed(1)}" r="${i % 2 ? 8 : 10}" fill="${i % 2 ? '#fff4cf' : '#e2482a'}"/>`; }).join('')}</g>
      <path d="M0 70l-16 26 16 26 16-26z" fill="#ffd77a" stroke="#8a6234" stroke-width="3"/></g></g>
    <g class="ld-pot" transform="translate(370 712)"><circle class="ld-potglow" cy="-20" r="110" fill="url(#g-warm)"/>
      <path d="M-26 0q-6-20 6-30M0 0q-8-24 0-36M26 0q6-20-6-30" fill="none" stroke="#ff9a3c" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="-40" cy="2" rx="16" ry="9" fill="#5a5262"/><ellipse cx="40" cy="2" rx="16" ry="9" fill="#5a5262"/><ellipse cy="8" rx="16" ry="9" fill="#4a4250"/>
      <path d="M-44-32h88q-4 36-44 40-40-4-44-40z" fill="#3a3340" stroke="#17131c" stroke-width="3"/><ellipse cy="-32" rx="44" ry="9" fill="#5a5262"/>
      <g class="ld-steam" fill="none" stroke="#fff4cf" stroke-width="4" stroke-linecap="round"><path d="M-14-46q-8-16 2-30"/><path d="M10-46q-8-16 2-30"/></g></g>
    ${qirba(480, 712, .9)}
    <g class="ld-sahl" transform="translate(930 700)"><ellipse rx="260" ry="34" fill="#e8c48a" opacity=".55"/><ellipse cy="-4" rx="170" ry="18" fill="#fff0c8" opacity=".6"/></g>
    <g class="ld-samura" transform="translate(500 690)"><ellipse class="ld-smglow" cy="-200" rx="300" ry="220" fill="url(#g-warm)"/>
      <path d="M-12 0q-4-80 6-130q-50-40-110-60M-6-130q30-50 100-70M0-120q4-60-10-110" fill="none" stroke="#4a2d14" stroke-width="16" stroke-linecap="round"/>
      <path d="M-16 0q-6-60 2-120" stroke="#4a2d14" stroke-width="24" stroke-linecap="round"/>
      <path d="M-230-200q60-70 230-74t230 70q-90 30-230 26t-230-22z" fill="#3f6a3a"/><path d="M-200-214q70-50 200-52t200 50" fill="none" stroke="#6f9a52" stroke-width="10" stroke-linecap="round" opacity=".7"/>
      <g fill="#7fae5c">${[[-150, -226], [-80, -250], [10, -258], [90, -246], [160, -224], [-40, -232], [60, -228]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="10"/>`).join('')}</g></g>
    <g class="ld-flock" fill="url(#g-warm)">${flock}</g>
    <g class="ld-tent" transform="translate(930 700)"><ellipse class="ld-tentglow" cy="-70" rx="220" ry="150" fill="url(#g-warm)"/>
      <path d="M-170 0L-20-150h40L170 0z" fill="#8a5a3a" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/><path d="M-20-150l-60 150M20-150l60 150" stroke="#6b3f24" stroke-width="5"/>
      <path class="ld-tentdoor" d="M-44 0L0-112 44 0z"/><path d="M0-150v-26" stroke="#4a2d10" stroke-width="6"/><path d="M-170 0h-24M170 0h24" stroke="#4a2d10" stroke-width="4"/>
      <path d="M-120-46h60M60-46h60" stroke="#e8c48a" stroke-width="6" opacity=".55"/></g>
    <g class="ld-lights">
      <g class="ld-b"><circle cx="722" cy="664" r="80" fill="url(#g-warm)"/><circle cx="722" cy="664" r="6" fill="#fff"/></g>
      <g class="ld-a"><circle cx="640" cy="650" r="115" fill="url(#g-warm)"/><circle cx="640" cy="650" r="8" fill="#fff"/></g>
      <g class="ld-nawa" transform="translate(640 572)"><ellipse rx="44" ry="16" fill="#6b441d" stroke="#3a2412" stroke-width="3"/><path d="M-44 0q44-44 88 0" fill="#8a5a32" stroke="#3a2412" stroke-width="3"/>
        <g fill="#c9995a" stroke="#4a2d10" stroke-width="1.5"><ellipse cx="-20" cy="-14" rx="7" ry="4"/><ellipse cx="-4" cy="-20" rx="7" ry="4"/><ellipse cx="14" cy="-15" rx="7" ry="4"/><ellipse cx="4" cy="-8" rx="7" ry="4"/><ellipse cx="-12" cy="-4" rx="7" ry="4"/><ellipse cx="22" cy="-4" rx="7" ry="4"/></g></g>
    </g>
    <ellipse class="ld-glow" cx="640" cy="620" rx="900" ry="620" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3">
    <path class="ld-front" d="M-700 1400V930l210-60 150 50 120 480zM1900 1400V910l-230-50-150 60-110 480z"/>
  </g>`;
}

// ——— المحراب (زكريا ويحيى عليهما السلام): لا يُرسم أحد ولا تُرسم الملائكة؛ أنوار فقط ———
// صحف القرآن المجموعة (حفصة رضي الله عنها): رزمة صحف مربوطة تتوهّج، ومصاحف صغيرة تنطلق منها إلى الآفاق (copies=on)
function suhuf(x, y) {
  let sheets = '', books = '';
  [[-8, -4], [4, 3], [-3, 10], [6, 17]].forEach(([r, dy], i) => { sheets += `<g transform="translate(0 ${-dy * 2}) rotate(${r})"><rect x="-96" y="-62" width="192" height="124" rx="6" fill="${i % 2 ? '#f1e4c3' : '#fff4cf'}" stroke="#b98548" stroke-width="3"/></g>`; });
  let lines = ''; for (let k = 0; k < 5; k++) lines += `M-74 ${-66 + k * 20}h${k % 2 ? 120 : 148}`;
  [[-560, -200], [-380, -330], [0, -400], [380, -330], [560, -200], [-300, 120], [300, 120]].forEach(([tx, ty], i) => { books += `<g class="sf-bk" style="--tx:${tx}px;--ty:${ty}px;--d:${(i * .55).toFixed(2)}s"><rect x="-26" y="-34" width="52" height="68" rx="5" fill="#1f5a4a" stroke="#c9a24a" stroke-width="3"/><rect x="-16" y="-22" width="32" height="44" rx="3" fill="none" stroke="#c9a24a" stroke-width="2"/></g>`; });
  return `<g class="sf-wrap" transform="translate(${x} ${y})"><circle class="sf-glow" cy="-30" r="190" fill="url(#g-warm)"/>${sheets}
    <path d="${lines}" stroke="#2f8f9a" stroke-width="4" stroke-linecap="round" opacity=".75"/>
    <path d="M-104-14h208v18h-208z" fill="#8a3a2a"/><path d="M-10-24h20v38h-20z" fill="#c9792a"/>
    <g class="sf-copies">${books}</g></g>`;
}

function mihrab() {
  let bricks = '';
  for (let y = -60; y < 640; y += 46) bricks += `M-700 ${y}H1900`;
  return `${DEFS}
  <defs><linearGradient id="g-stonewall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1e44"/><stop offset="1" stop-color="#2e2a52"/></linearGradient>
    <linearGradient id="g-rug" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a2f3a"/><stop offset="1" stop-color="#4a1a26"/></linearGradient></defs>
  <g data-d=".5">
    <rect ${BIG} fill="url(#g-stonewall)"/><path d="${bricks}" stroke="#0c0d24" stroke-width="3" opacity=".4"/>
    <g transform="translate(960 300)">
      <path d="M-70 150v-170q70-110 140 0v170z" fill="#040918"/><path class="mh-sky" d="M-70 150v-170q70-110 140 0v170z" fill="url(#g-dawn)"/>
      <g fill="#fff4cf" class="stars"><circle class="st" cx="-30" cy="20" r="3"/><circle class="st st--1" cx="20" cy="-30" r="2.5"/><circle class="st st--2" cx="36" cy="60" r="2"/><circle class="st st--3" cx="-10" cy="90" r="2.5"/><circle class="st" cx="0" cy="-64" r="2"/></g>
      <path d="M-70 150v-170q70-110 140 0v170" fill="none" stroke="#4a4478" stroke-width="12"/><path d="M-84 150h168v16H-84z" fill="#4a4478"/>
    </g>
  </g>
  <g data-d=".8">
    <path d="M430 640V300q170-250 340 0v340z" fill="#0c0d24"/>
    <path d="M430 640V300q170-250 340 0v340" fill="none" stroke="#5a5290" stroke-width="18"/><path d="M400 640V290q200-290 400 0v350" fill="none" stroke="#3a3468" stroke-width="10"/>
    <ellipse class="mh-nicheglow" cx="600" cy="470" rx="170" ry="230" fill="url(#g-warm)"/>
    <g class="mh-lamp"><path d="M600 96v110" stroke="#b98548" stroke-width="4"/><path d="M576 206h48l12 46q-36 26-72 0z" fill="#b98548"/><circle cx="600" cy="236" r="70" fill="url(#g-warm)"/><path d="M600 222q-10 12 0 26 10-14 0-26z" fill="#fff4cf"/></g>
  </g>
  <g data-d="1">
    <path d="M-700 640h2600v800H-700z" fill="#17153a"/><path d="M-700 640h2600v16H-700z" fill="#3a3468"/>
    <path d="M400 700h400l70 220H330z" fill="url(#g-rug)"/><path d="M420 716h360l52 180H368z" fill="none" stroke="#ffd77a" stroke-width="4" opacity=".6"/>
    <g class="mh-fruit" transform="translate(330 664)"><ellipse cx="0" cy="-30" rx="110" ry="90" fill="url(#g-warm)" opacity=".6"/><path d="M-56-14q56 44 112 0l-14 22h-84z" fill="#b98548"/><circle cx="-26" cy="-22" r="14" fill="#e2482a"/><circle cx="2" cy="-28" r="15" fill="#ffb03a"/><circle cx="28" cy="-22" r="13" fill="#7fbf5a"/><circle cx="-10" cy="-40" r="11" fill="#c9792a"/><circle cx="16" cy="-42" r="10" fill="#e2482a"/></g>
    <g class="mh-book" transform="translate(600 640)"><circle cy="-40" r="150" fill="url(#g-warm)"/><path d="M-70 0l70-30 70 30z" fill="#6b441d"/><path d="M-70 0V6l70-30 70 30V0" fill="#4a2d10"/><path d="M0-30l-74-18v-46l74 18z" fill="#fff4cf"/><path d="M0-30l74-18v-46L0-76z" fill="#f1e4c3"/><path d="M-60-60l50 12M-60-70l50 12M10-48l50-12M10-58l50-12" stroke="#2f8f9a" stroke-width="3"/><path d="M0-76v46" stroke="#c9a24a" stroke-width="3"/></g>
    ${suhuf(600, 800)}
    <g class="mh-b"><circle cx="500" cy="640" r="74" fill="url(#g-warm)"/><circle cx="500" cy="640" r="6" fill="#fff"/></g>
    <g class="mh-a"><circle cx="600" cy="620" r="120" fill="url(#g-warm)"/><circle cx="600" cy="620" r="8" fill="#fff"/></g>
    <ellipse class="mh-glow" cx="600" cy="500" rx="900" ry="640" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3"><path d="M-700-500h380v1900h-380zM1520-500h380v1900h-380z" fill="#06061a"/><path d="M-320-500h40v1900h-40zM1480-500h40v1900h-40z" fill="#12123a"/></g>`;
}

// ——— فناء دار في مكة ومسجد صغير من حجارة (أبو بكر الصدّيق رضي الله عنه): لا يُرسم أحد؛ النبي ﷺ والصحابة أنوار فقط ———
function dar() {
  const r = rng(71); let stones = '', wall = '', peep = '';
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, x = 600 + Math.cos(a) * 250, y = 760 + Math.sin(a) * 60; stones += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(16 + r() * 8).toFixed(0)}" ry="${(9 + r() * 4).toFixed(0)}"/>`; }
  for (let y = 430; y < 690; y += 30) wall += `M-700 ${y}H1900`;
  for (const x of [120, 200, 300, 900, 1000, 1080]) peep += `<circle cx="${x}" cy="${416 + (x % 3) * 4}" r="26"/>`;
  return `${DEFS}
  <defs><linearGradient id="g-court" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4434"/><stop offset="1" stop-color="#2a1e18"/></linearGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="dr-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(90, 37, [-400, 1600], [-300, 400])}
    <path class="dr-moon" d="M930 70a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
  </g>
  <g data-d=".3">
    <path class="dr-hills" d="M-700 470-480 330-330 400-170 280 0 380 150 300 330 410 500 330 700 420 860 300 1040 390 1220 290 1400 400 1900 330V1400H-700z"/>
    <g transform="translate(600 438)"><path class="dr-kaaba" d="M-26 0v-46h52V0z"/><path d="M-26-34h52" stroke="#c9995a" stroke-width="3" opacity=".7"/></g>
  </g>
  <g data-d=".75">
    <rect x="-700" y="420" width="2600" height="280" fill="url(#g-court)"/><path d="${wall}" stroke="#1a120e" stroke-width="3" opacity=".35"/>
    <rect x="-700" y="412" width="2600" height="14" fill="#6b5340"/>
    <g class="dr-peep" fill="url(#g-warm)">${peep}</g>
    <g transform="translate(1180 700)"><rect x="-90" y="-250" width="180" height="250" fill="#3a2a20"/><path class="dr-door" d="M-40 0v-150q40-46 80 0V0z"/></g>
  </g>
  <g data-d="1">
    <path d="M-700 1400V690h2600v710z" fill="#3a2c22"/><path d="M-700 690h2600v18H-700z" fill="#6b5340" opacity=".6"/>
    <ellipse cx="600" cy="770" rx="270" ry="74" fill="#5a4434"/>
    <g fill="#8a7458" stroke="#2a1e18" stroke-width="2">${stones}</g>
    <g transform="translate(600 700)"><path d="M-60 0v-80q60-70 120 0V0z" fill="#6b5340"/><path d="M-40 0v-66q40-46 80 0V0z" fill="#2a1e18"/></g>
    <g class="dr-lamp" transform="translate(760 560)"><path d="M0-60v52" stroke="#b98548" stroke-width="3"/><path d="M-16-8h32l6 30q-22 16-44 0z" fill="#b98548"/><circle cy="10" r="80" fill="url(#g-warm)"/><path d="M0 0q-8 10 0 20 8-10 0-20z" fill="#fff4cf"/></g>
    <g class="dr-chain" transform="translate(600 720)">
      <circle class="dr-chainglow" r="150" fill="url(#g-warm)"/>
      <g fill="none" stroke="#9aa0b0" stroke-width="9"><ellipse cx="-120" cy="0" rx="26" ry="16"/><ellipse cx="-74" cy="0" rx="26" ry="16"/><ellipse class="dr-l" cx="-28" cy="0" rx="26" ry="16"/><ellipse class="dr-r" cx="28" cy="0" rx="26" ry="16"/><ellipse cx="74" cy="0" rx="26" ry="16"/><ellipse cx="120" cy="0" rx="26" ry="16"/></g>
    </g>
    <g class="dr-sandals" transform="translate(600 870)"><circle class="dr-sglow" r="170" fill="url(#g-warm)"/>
      <g class="dr-s1" transform="translate(-44 6) rotate(-10)"><path d="M0-62c22 0 30 22 28 50-2 30-8 50-6 70 2 22-6 42-22 42s-24-20-22-42c2-20-4-40-6-70-2-28 6-50 28-50z" fill="#9a6a3a" stroke="#4a2d10" stroke-width="4"/><path d="M-26-20q26-22 52 0" fill="none" stroke="#c9792a" stroke-width="10" stroke-linecap="round"/><path d="M-4-50l4 30 4-30" fill="none" stroke="#c9792a" stroke-width="5"/></g><g class="dr-s2" transform="translate(44 -14) rotate(8)"><path d="M0-62c22 0 30 22 28 50-2 30-8 50-6 70 2 22-6 42-22 42s-24-20-22-42c2-20-4-40-6-70-2-28 6-50 28-50z" fill="#9a6a3a" stroke="#4a2d10" stroke-width="4"/><path d="M-26-20q26-22 52 0" fill="none" stroke="#c9792a" stroke-width="10" stroke-linecap="round"/><path d="M-4-50l4 30 4-30" fill="none" stroke="#c9792a" stroke-width="5"/></g></g>
    <g class="dr-call" transform="translate(600 300)" fill="none" stroke="#fff4cf" stroke-width="6" stroke-linecap="round">
      <path style="--d:0s" d="M60-60a85 85 0 0 1 0 120M-60-60a85 85 0 0 0 0 120"/><path style="--d:1s" d="M60-60a85 85 0 0 1 0 120M-60-60a85 85 0 0 0 0 120"/><path style="--d:2s" d="M60-60a85 85 0 0 1 0 120M-60-60a85 85 0 0 0 0 120"/></g>
    <g class="dr-deeds">
      <g transform="translate(330 640)"><circle r="70" fill="url(#g-warm)"/><path d="M-30 4q30 30 60 0z" fill="#c9995a"/><circle cx="-8" cy="-2" r="9" fill="#c9792a"/><circle cx="10" cy="-4" r="8" fill="#e8a658"/></g>
      <g transform="translate(470 590)"><circle r="70" fill="url(#g-warm)"/><path d="M14-30a26 26 0 1 0 22 40 22 22 0 0 1-22-40z" fill="#fff4cf"/></g>
      <g transform="translate(730 590)"><circle r="70" fill="url(#g-warm)"/><path d="M-22-24h44l-6 50h-32z" fill="#bfeee8"/><path d="M-16-8h32" stroke="#2f8f9a" stroke-width="4"/></g>
      <g transform="translate(870 640)"><circle r="70" fill="url(#g-warm)"/><path d="M0 20l-26-24q-12-14 0-26t26 6q14-18 26-6t0 26z" fill="#f6a5c0"/></g>
    </g>
    <g class="dr-blanket" transform="translate(610 770)"><ellipse class="dr-blglow" cy="-30" rx="260" ry="150" fill="url(#g-warm)"/>
      <path d="M-170-40q85-26 170-8t170-10l16 76q-90 22-186 10t-186 12z" fill="#7a4a3a" stroke="#3a1e18" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-166-20q85-22 170-6t166-10M-162 4q85-22 170-6t164-10" fill="none" stroke="#e8c48a" stroke-width="7" opacity=".75"/>
      <path d="M-172 46l-6 14M-154 46l-2 14M-136 46l-4 14M150 44l4 14M168 42l2 14M186 40l6 14" stroke="#3a1e18" stroke-width="3"/></g>
    <g class="dr-vessel" transform="translate(420 700)"><circle class="dr-vsglow" cy="-20" r="110" fill="url(#g-warm)"/>
      <path d="M-46-30h92q-6 50-46 54-40-4-46-54z" fill="#b98548" stroke="#4a2d10" stroke-width="3"/><ellipse cy="-30" rx="46" ry="11" fill="#e8a658"/><path d="M-30 24h60" stroke="#6b441d" stroke-width="6" stroke-linecap="round"/>
      <path d="M-12-52q-6-14 4-26M8-52q-6-14 4-26" fill="none" stroke="#fff4cf" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>
    <g class="dr-bread" transform="translate(600 820)"><ellipse class="dr-brglow" cy="-30" rx="230" ry="140" fill="url(#g-warm)"/>
      <path d="M-150 30q-20-60 40-74q110-20 220 0q60 14 40 74q-150 30-300 0z" fill="#e9dcc0" stroke="#8a7458" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-120 20q120 22 240 0M-100-10q100 14 200 0" fill="none" stroke="#c9b48e" stroke-width="3"/>
      <g fill="#c98a3a" stroke="#6b441d" stroke-width="3"><ellipse cx="-62" cy="-40" rx="46" ry="18"/><ellipse cx="44" cy="-44" rx="46" ry="18"/><ellipse cx="-8" cy="-62" rx="46" ry="18"/></g>
      <g fill="none" stroke="#8a5a2a" stroke-width="2" opacity=".7"><path d="M-80-42h36M26-46h36M-26-64h36"/></g>
      <path class="dr-brfold" d="M110-30q40 30 60 70" fill="none" stroke="#e9dcc0" stroke-width="16" stroke-linecap="round"/></g>
    <g class="dr-sufra" transform="translate(720 790) scale(.85)"><ellipse class="dr-sfglow" cy="-40" rx="200" ry="150" fill="url(#g-warm)"/>
      <path d="M-70 40q-20-60 0-110h140q20 50 0 110q-70 22-140 0z" fill="#8a5a32" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-50-70q-14-30 10-44h80q24 14 10 44z" fill="#a06a3c" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-60 0q60 18 120 0M-56 24q56 16 112 0" fill="none" stroke="#c9995a" stroke-width="3" opacity=".6"/>
      <g class="dr-tie"><path d="M-62-70q62 18 124 0" fill="none" stroke="#f0e2c0" stroke-width="12" stroke-linecap="round"/><path d="M0-66q-30 30-40 60M0-66q26 34 30 64" fill="none" stroke="#f0e2c0" stroke-width="9" stroke-linecap="round"/><circle cy="-66" r="10" fill="#fffaf0"/></g></g>
    <g class="dr-belt" transform="translate(600 900)"><ellipse class="dr-btglow" rx="260" ry="90" fill="url(#g-warm)"/>
      <g class="dr-bt1"><path d="M-220 0q110-34 220 0" fill="none" stroke="#f0e2c0" stroke-width="22" stroke-linecap="round"/><path d="M-200-4q100-28 200 0" fill="none" stroke="#c9792a" stroke-width="4" stroke-dasharray="10 12"/></g>
      <g class="dr-bt2"><path d="M0 0q110 34 220 0" fill="none" stroke="#f0e2c0" stroke-width="22" stroke-linecap="round"/><path d="M0 4q100 28 200 0" fill="none" stroke="#c9792a" stroke-width="4" stroke-dasharray="10 12"/></g></g>
    ${suhuf(600, 810)}
    <g class="dr-mill" transform="translate(600 800)"><ellipse class="dr-mlglow" cy="-30" rx="230" ry="150" fill="url(#g-warm)"/>
      <ellipse cy="30" rx="150" ry="36" fill="#efe3c6" opacity=".85"/><path d="M-110 4v26q110 34 220 0V4z" fill="#6f6a66"/><ellipse cy="4" rx="110" ry="28" fill="#8d8781"/>
      <path d="M-96-14v18q96 30 192 0v-18z" fill="#7d7771"/><ellipse cy="-14" rx="96" ry="24" fill="#a39d96"/><path d="M-60-20q60-18 120 0M-70-8q70-20 140 0" fill="none" stroke="#6f6a66" stroke-width="3" opacity=".6"/>
      <ellipse cy="-16" rx="16" ry="6" fill="#3a3330"/><circle cx="-6" cy="-24" r="3" fill="#e8c48a"/><circle cx="6" cy="-22" r="3" fill="#e8c48a"/>
      <g class="dr-handle"><path d="M0-14v-70" stroke="#6b441d" stroke-width="12" stroke-linecap="round"/><path d="M0-84v-4" stroke="#9a6a3a" stroke-width="14" stroke-linecap="round"/></g></g>
    ${qirba(880, 780, .95)}
    <g class="dr-lights">
      <g class="dr-b"><circle cx="680" cy="680" r="90" fill="url(#g-white)"/><circle cx="680" cy="680" r="7" fill="#fff"/></g>
      <g class="dr-a"><circle cx="560" cy="700" r="110" fill="url(#g-warm)"/><circle cx="560" cy="700" r="8" fill="#fff"/></g>
    </g>
    <ellipse class="dr-glow" cx="600" cy="660" rx="900" ry="600" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3"><path d="M-700 1400V900l210-50 120 60 80 490zM1900 1400V880l-230-40-120 70-70 490z" fill="#0c0806"/></g>`;
}

// ——— المسجد الحرام والكعبة (عمر بن الخطاب رضي الله عنه): لا يُرسم أحد؛ الطائفون والصحابة أنوار فقط ———
function haram() {
  const r = rng(53); let tawaf = '', houses = '', tiles = '';
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; tawaf += `<circle class="hr-t" cx="${(600 + Math.cos(a) * 330).toFixed(0)}" cy="${(700 + Math.sin(a) * 90).toFixed(0)}" r="${(18 + r() * 10).toFixed(0)}"/>`; }
  for (let x = -700; x < 1900; x += 150 + r() * 60) { const h = 90 + r() * 120, w = 110 + r() * 60; houses += `<rect x="${x.toFixed(0)}" y="${(520 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}"/><rect class="hr-win" x="${(x + w / 2 - 9).toFixed(0)}" y="${(520 - h + 24).toFixed(0)}" width="18" height="24" rx="9"/>`; }
  for (let i = 0; i < 9; i++) tiles += `M${-700 + i * 330} 1400L${280 + i * 80} 620`;
  return `${DEFS}
  <defs><linearGradient id="g-kiswa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a10"/><stop offset=".55" stop-color="#1c1c26"/><stop offset="1" stop-color="#050508"/></linearGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="hr-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(100, 61, [-400, 1600], [-300, 380])}
    <path class="hr-moon" d="M260 80a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="hr-cup" transform="translate(600 150)"><circle r="170" fill="url(#g-warm)"/><path d="M-50-40h100l-14 90q-36 16-72 0z" fill="#e2d2a8" opacity=".9"/><ellipse cy="-40" rx="50" ry="12" fill="#fffaf0"/><path d="M-36-24h72" stroke="#fffaf0" stroke-width="10" stroke-linecap="round"/></g>
  </g>
  <g data-d=".3">
    <path class="hr-hills" d="M-700 470-480 330-330 400-170 300 0 380 150 310 330 400 500 330 700 410 860 310 1040 390 1220 300 1400 400 1900 330V1400H-700z"/>
    <g class="hr-houses">${houses}</g>
  </g>
  <g data-d="1">
    <path d="M-700 1400V560h2600v840z" fill="#cfc6b4"/><path class="hr-floor" d="M-700 1400V560h2600v840z"/>
    <path d="${tiles}" stroke="#9a9080" stroke-width="2" opacity=".35"/>
    <ellipse cx="600" cy="700" rx="420" ry="120" fill="#000" opacity=".08"/>
    <g class="hr-tawaf" fill="url(#g-warm)">${tawaf}</g>
    <g transform="translate(600 690)">
      <ellipse cy="6" rx="190" ry="26" fill="#000" opacity=".3"/>
      <path d="M-150 0V-300h170V-6z" fill="url(#g-kiswa)"/><path d="M20-6V-300l140 26V-20z" fill="#14141c"/>
      <path d="M-150-236h170v22h-170zM20-236l140 22v20L20-214z" fill="#c9a24a"/>
      <path d="M-150-236h170M20-236l140 22" stroke="#ffe9a8" stroke-width="2" opacity=".6"/>
      <path d="M-60-90v-120h50v120z" fill="#c9a24a" opacity=".85"/><path d="M-66-90h62v8h-62z" fill="#8a6a2a"/>
      <g class="hr-stone" transform="translate(12 -64)"><circle r="70" fill="url(#g-warm)"/><ellipse rx="20" ry="24" fill="#c0c4cc"/><ellipse rx="13" ry="16" fill="#120c10"/></g>
    </g>
    <g class="hr-maqam" transform="translate(890 740)"><circle cy="-30" r="110" fill="url(#g-warm)"/><path d="M-30 0v-44h60V0z" fill="#b8a888"/><path d="M-36-44h72l-8-20h-56z" fill="#d8c8a0"/></g>
    <g class="hr-lights">
      <g class="hr-a"><circle cx="420" cy="760" r="110" fill="url(#g-warm)"/><circle cx="420" cy="760" r="8" fill="#fff"/></g>
    </g>
    <ellipse class="hr-glow" cx="600" cy="640" rx="900" ry="600" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3"><path d="M-700 1400V940l220-50 110 60 80 450zM1900 1400V920l-220-40-120 70-70 450z" fill="#0c0a08"/></g>`;
}

export const SETS = { mountain, cave, mosque, sea, deep, garden, dunes, hijr, ur, land, mihrab, dar, haram };
