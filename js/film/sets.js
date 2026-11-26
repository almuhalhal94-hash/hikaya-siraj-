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
    <g class="cv-boulder"><path d="M370 580 L360 470 Q350 330 420 250 Q480 150 600 130 Q740 130 800 220 Q870 320 850 460 L840 580 Z" fill="#4a4a58" stroke="#22222c" stroke-width="6"/>
      <path d="M440 300 Q520 250 600 270 M520 420 Q620 380 720 430 M430 500 Q500 470 560 520 M700 250 Q760 300 770 360" stroke="#2a2a36" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M420 260 Q480 170 600 150" stroke="#7a7a8c" stroke-width="5" fill="none" opacity=".6"/></g>
    <path fill-rule="evenodd" fill="url(#g-rock)" d="M-700-500h2600v1900h-2600zM408 560l-10-60 20-60-10-48 44-44 18-36 50-12 36-28 54 8 42-18 48 28 42 10 26 48 32 32-8 60 20 60-12 60z"/>
    <path class="cv-rim" d="M408 560l-10-60 20-60-10-48 44-44 18-36 50-12 36-28 54 8 42-18 48 28 42 10 26 48 32 32-8 60 20 60-12 60" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cv-rim cv-rim--soft" d="M408 560l-10-60 20-60-10-48 44-44 18-36 50-12 36-28 54 8 42-18 48 28 42 10 26 48 32 32-8 60 20 60-12 60" fill="none" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cv-facet" d="M300 300l80-90 70 40-60 110zM820 250l90 30 40 120-90-40zM240 520l90-50 30 120-110 40zM880 520l100 20 20 130-110-30zM520 180l110-30 80 60-90 30z"/>
    <path d="M-700 640l420-60 250 50 130 110 80 660h-880zM1900 640l-380-70-260 60-120 120-90 650h850z" fill="#04060d"/>
    <path class="cv-sun cv-sun--rise" d="M660 300l150 0 520 1100H900z" fill="url(#g-ray)"/><path class="cv-sun cv-sun--set" d="M560 300l-150 0-520 1100H320z" fill="url(#g-ray)"/>
    <g class="cv-dog" fill="#02040b"><path d="M520 560q-4-30 26-38l14-22 10 20q46-6 84 10 30 12 34 30z"/><path d="M546 552h-58q-8 0-8 8h66z"/><path d="M688 560q30-6 40-34-4 30-24 34z"/></g>
    <g class="cv-trio">${[[480, 690, 0], [600, 720, 1], [720, 690, 2]].map(([x, y, i]) => `<g class="cv-man cv-man${i}"><circle cx="${x}" cy="${y}" r="70" fill="url(#g-warm)"/><circle cx="${x}" cy="${y}" r="7" fill="#fff"/></g>`).join('')}</g>
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
    <g class="ms-broom" transform="translate(800 730) scale(1.5)"><ellipse class="ms-brglow" cy="-60" rx="150" ry="110" fill="url(#g-warm)"/><g class="ms-brpos"><g class="ms-brbody">
      <path d="M0 0V-150" stroke="#8a6a3a" stroke-width="8" stroke-linecap="round"/><path d="M-8-150h16" stroke="#5a3a1a" stroke-width="6"/>
      <path d="M-4 0l-30 60M-2 0l-16 64M0 0v66M2 0l16 64M4 0l30 60M-3 0l-24 62M3 0l24 62" stroke="#c9a85a" stroke-width="5" stroke-linecap="round"/>
      <path d="M-10 4h20" stroke="#6b4a1d" stroke-width="7"/></g></g>
      <g class="ms-dust" fill="#e8d8b0">${[[-60, 64], [-40, 50], [50, 60], [70, 48], [20, 70]].map(([x, y], i) => `<circle style="--d:${-i * .5}s" cx="${x}" cy="${y}" r="5"/>`).join('')}</g></g>
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
      <g class="se-crowd" fill="url(#g-warm)">${[470, 520, 560, 640, 690, 735].map((x, i) => `<circle cx="${x}" cy="${414 + (i % 2) * 8}" r="${30 + (i % 3) * 4}"/>`).join('')}</g>
      <g class="se-hole"><path d="M640 470h34l-4 34h-28z" fill="#0b1830" stroke="#3d2713" stroke-width="3"/><path d="M700 420l40-26 8 10-40 26z" fill="url(#g-wood)" stroke="#3d2713" stroke-width="2"/></g>
      <g class="se-sparrow" transform="translate(752 432)"><g class="se-peck"><ellipse cx="0" cy="-12" rx="15" ry="11" fill="#8a6a4a"/><circle cx="12" cy="-22" r="8" fill="#8a6a4a"/><path d="M19-22l9 3-9 3z" fill="#e2b877"/><circle cx="14" cy="-24" r="1.8" fill="#111"/><path d="M-14-12l-14-6 2 10z" fill="#5a4030"/><path d="M-4-14q8-8 16 0" fill="none" stroke="#c9a27a" stroke-width="3"/></g>
        <g class="se-ripple" fill="none" stroke="#e8fffb" stroke-width="3"><ellipse cx="34" cy="40" rx="10" ry="3"/><ellipse cx="34" cy="40" rx="22" ry="6" opacity=".5"/></g></g>
    </g></g>
  </g>
  <g data-d=".75">
    <g class="se-water">${wave(506, 12, 320, '#123066', 'se-wave--mid')}${wave(560, 16, 420, '#0d2550', 'se-wave--near')}</g>
    <path class="se-judi" d="M250 640l120-90 70 20 90-70 80 10 60 50 90-10 80 60 110 40z" fill="#2a2148"/>
    <g class="se-whale" fill="#0a1630"><path d="M780 560q130-150 290 0z"/><path d="M1090 540q10-80 66-92-14 44 6 92-36-18-72 0z"/><path d="M905 470q-6-40-30-52M912 468q8-38 34-46" fill="none" stroke="#9fc4ff" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>
    <g class="se-light"><circle cx="600" cy="386" r="96" fill="url(#g-warm)"/><circle cx="600" cy="386" r="7" fill="#fff"/></g>
    <g class="se-pair"><circle cx="420" cy="620" r="70" fill="url(#g-warm)"/><circle cx="420" cy="620" r="6" fill="#fff"/></g>
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
    <g class="se-boulder" transform="translate(40 650)"><ellipse cy="10" rx="210" ry="22" fill="#000" opacity=".3"/>
      <path d="M-190 10q-20-120 60-170 80-46 170-20 90 30 110 120 8 50-20 70z" fill="#4a4258"/><path d="M60-178q80 30 100 110 6 40-10 70" fill="none" stroke="#8a7e9a" stroke-width="10" stroke-linecap="round" opacity=".6"/>
      <path d="M-120-120q30 20 40 60M20-170q-10 50 20 80" fill="none" stroke="#2a2438" stroke-width="5" stroke-linecap="round"/></g>
    <g class="se-log"><g class="se-logpos"><g class="se-logbob"><ellipse class="se-logglow" cy="-10" rx="170" ry="90" fill="url(#g-warm)"/>
      <rect x="-130" y="-30" width="260" height="52" rx="26" fill="url(#g-wood)" stroke="#3d2713" stroke-width="4"/>
      <ellipse cx="130" cy="-4" rx="14" ry="26" fill="#c9a268" stroke="#3d2713" stroke-width="3"/><path d="M-100-12h90M-60 8h120" stroke="#3d2713" stroke-width="3" opacity=".6"/>
      <rect class="se-logseal" x="-14" y="-34" width="40" height="14" rx="4" fill="#9fc4e8" stroke="#3a6a9a" stroke-width="2"/>
      <g class="se-loggold"><g fill="#e8c048" stroke="#9a7420" stroke-width="2">${[[-60, -44], [-36, -52], [-12, -46], [12, -54], [36, -46], [-24, -62], [0, -68]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="7"/>`).join('')}</g>
        <path d="M50-70h40v44h-40z" fill="#f3ead6" stroke="#c9b48e" stroke-width="2"/><path d="M56-60h28M56-50h28M56-40h20" stroke="#8a7a5a" stroke-width="2"/></g></g></g></g>
    <g class="se-hut"><g class="se-jump"><path d="M-34 0q16-22 40-18 16 2 24 12l14-12-2 18 2 18-14-12q-8 10-24 12-24 2-40-18z" fill="#9fc4e8" stroke="#3a6a9a" stroke-width="3"/><circle cx="-18" cy="-6" r="3" fill="#123"/></g>
      <g class="se-splash" fill="none" stroke="#e8fffb" stroke-width="4" stroke-linecap="round"><path d="M560 560q-10-24-26-30M580 556q0-28 0-34M600 560q10-24 26-30"/></g></g>
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
// إضافات الدفعة الجديدة في land: الصفا والمروة وزمزم، الطير، زيتونة إبراهيم وصحن الضيافة، الكبش، جدار القرية والكنز، وادي النمل
function hill(x, w, h) {
  return `<path class="ld-hill" d="M${x - w} 0q${w * 0.3}-${h * 0.9} ${w * 0.75}-${h} ${w * 0.5}-${h * 0.08} ${w * 0.75} 0q${w * 0.3} ${h * 0.4} ${w * 0.5} ${h}z"/>
    <path class="ld-hilllit" d="M${x + w * 0.05} ${-h * 1.02}q${w * 0.45} ${h * 0.1} ${w * 0.6} ${h * 0.7}" fill="none" stroke-width="7" stroke-linecap="round"/>
    <g class="ld-hillrocks">${[-0.6, -0.2, 0.3, 0.6].map((k, i) => `<path d="M${x + k * w} ${-h * (0.18 + (i % 2) * 0.22)}l18-14 22 6 6 16-30 6z"/>`).join('')}</g>`;
}
function sheep(x, y, k) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-18 14v18M14 14v18" stroke="#3a2e22" stroke-width="6"/><g fill="#f4ecdc">${[[-22, 0], [-8, -10], [8, -10], [22, 0], [0, 4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="14"/>`).join('')}</g><ellipse cx="34" cy="-6" rx="11" ry="9" fill="#3a2e22"/></g>`;
}
function landExtras() {
  const r = rng(91); let ants = '', grain = '', leaves = '', olives = '';
  for (let i = 0; i < 14; i++) ants += `<g class="ld-ant" style="--d:${(-i * 1).toFixed(2)}s;--y:${(r() * 16 - 8).toFixed(1)}px"><ellipse cx="-9" rx="7" ry="4.6"/><ellipse rx="4" ry="3.4"/><ellipse cx="8" rx="5.6" ry="4.6"/><path d="M-6 3l-5 7M0 3v8M5 3l5 7M-6-3l-5-7M0-3v-8M5-3l5-7M12-2l7-7M12-1l8-3" stroke="#1a1010" stroke-width="1.6" fill="none"/>${i % 3 ? '' : '<ellipse cx="9" cy="-9" rx="5" ry="3.4" fill="#f0d68a"/>'}</g>`;
  for (let i = 0; i < 40; i++) grain += `<ellipse cx="${(-200 + r() * 400).toFixed(0)}" cy="${(-6 + r() * 14).toFixed(0)}" rx="3" ry="2" />`;
  for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); leaves += `<ellipse cx="${(Math.cos(a) * d * 220).toFixed(0)}" cy="${(-300 + Math.sin(a) * d * 130).toFixed(0)}" rx="9" ry="3.5" transform="rotate(${(r() * 180).toFixed(0)} ${(Math.cos(a) * d * 220).toFixed(0)} ${(-300 + Math.sin(a) * d * 130).toFixed(0)})"/>`; }
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); olives += `<ellipse cx="${(Math.cos(a) * d * 200).toFixed(0)}" cy="${(-300 + Math.sin(a) * d * 110).toFixed(0)}" rx="7" ry="9"/>`; }
  const birds = [[420, 250, 1], [520, 200, 0.8], [700, 230, 1.1], [820, 190, 0.8], [600, 150, 0.7], [900, 260, 0.9]]
    .map(([x, y, k], i) => `<g class="ld-bird" style="--d:${-i * 1.3}s"><path transform="translate(${x} ${y}) scale(${k})" d="M-24 0q12-14 24 0q12-14 24 0"/></g>`).join('');
  return `
    <g class="ld-hills" transform="translate(0 660)">${hill(170, 230, 170)}${hill(1110, 240, 190)}</g>
    <g class="ld-zam" transform="translate(560 716)"><ellipse class="ld-zamglow" cy="-30" rx="210" ry="150" fill="url(#g-warm)"/>
      <ellipse rx="120" ry="22" fill="#2f8f9a"/><ellipse cy="-3" rx="80" ry="10" fill="#bfeee8" opacity=".75"/>
      <path d="M-128 4q-8-16 8-26M128 4q8-16-8-26" fill="none" stroke="#7a6a58" stroke-width="10" stroke-linecap="round"/>
      <g class="ld-zamgush" fill="none" stroke="#e8fffb" stroke-width="7" stroke-linecap="round"><path d="M-6-4q-16-62-48-50"/><path d="M0-4q0-90 0-96"/><path d="M6-4q16-62 48-50"/><path d="M-3-4q-6-70-24-82" opacity=".7"/><path d="M3-4q6-70 24-82" opacity=".7"/></g>
      <g fill="#fff">${[[-40, -70], [30, -96], [60, -40], [-70, -30], [10, -120]].map(([x, y], i) => `<circle class="ld-drop" style="--d:${-i * 0.33}s" cx="${x}" cy="${y}" r="5"/>`).join('')}</g></g>
    <g class="ld-birds" fill="none" stroke="#fff4cf" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${birds}</g>
    <g class="ld-olive" transform="translate(400 716)"><ellipse class="ld-oliveglow" cy="-260" rx="320" ry="230" fill="url(#g-warm)"/>
      <path d="M-46 0q-18-50 4-96 14-30 2-70l30 6q-4 40 10 64 4-40 30-66l20 14q-26 26-24 70 2 40 16 78z" fill="#5a4632"/>
      <path d="M-30-10q-4-50 12-90M10-10q-6-40 8-80" stroke="#3a2a1c" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g fill="#3a5636">${[[-150, -250, 110, 70], [0, -300, 150, 92], [150, -250, 110, 72], [-80, -200, 120, 60], [90, -200, 120, 58], [0, -360, 100, 56]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <g fill="#5d7c4a">${[[-150, -270, 80, 44], [0, -330, 110, 54], [150, -268, 80, 44], [0, -390, 66, 30]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join('')}</g>
      <g fill="#a9c08a" opacity=".55">${leaves}</g><g class="ld-olives" fill="#2a2440">${olives}</g></g>
    <g class="ld-dish" transform="translate(520 712)"><ellipse class="ld-dishglow" cy="-30" rx="150" ry="100" fill="url(#g-warm)"/>
      <ellipse rx="96" ry="22" fill="#c9a24a"/><ellipse cy="-4" rx="80" ry="15" fill="#e2c06a"/>
      <path d="M-62-8q4-46 56-50 60-2 70 40 0 14-14 16-56 6-104 2-10-2-8-8z" fill="#8a4a22"/><path d="M-40-26q36-24 90-10" fill="none" stroke="#c9783a" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <g class="ld-steam" fill="none" stroke="#fff4cf" stroke-width="5" stroke-linecap="round"><path d="M-20-60q-12-20 2-40"/><path d="M14-64q-12-20 2-40"/><path d="M44-56q-10-18 2-34"/></g></g>
    <g class="ld-ram" transform="translate(440 704)"><ellipse class="ld-ramglow" cy="-70" rx="200" ry="160" fill="url(#g-white)"/>
      <path d="M-70-14v14M-40-12v12M40-12v12M66-14v14" stroke="#5a4a3a" stroke-width="9" stroke-linecap="round"/>
      <g fill="#fffaf0" stroke="#d8cfc0" stroke-width="3">${Array.from({ length: 11 }, (_, i) => `<circle cx="${-70 + i * 14}" cy="${-56 + (i % 2) * 10}" r="${26 + (i % 3) * 3}"/>`).join('')}<circle cx="-4" cy="-78" r="30"/><circle cx="40" cy="-80" r="28"/></g>
      <path d="M78-74q36-10 46 18 2 22-22 26l-22-8z" fill="#eadfcc" stroke="#b8a890" stroke-width="3"/><circle cx="110" cy="-58" r="3.5" fill="#2a1a10"/>
      <path d="M84-80q-6-34 24-34 26 4 18 28-6 14-20 8" fill="none" stroke="#b98548" stroke-width="10" stroke-linecap="round"/></g>
    <g class="ld-jidarwrap" transform="translate(250 716)"><ellipse class="ld-kanz" cx="120" cy="6" rx="170" ry="40" fill="url(#g-warm)"/>
      <path class="ld-kanzbox" d="M80 8h80v-26q-40-16-80 0z" fill="#c9a24a" stroke="#6b441d" stroke-width="4"/>
      <g class="ld-jidar"><path d="M0 0h240v-210H0z" fill="url(#g-mudwall)"/><path d="M-6-210h252v-14H-6z" fill="#6b5340"/>
      <path d="M0-40h240M0-80h240M0-120h240M0-160h240M40 0v-40M120 0v-40M200 0v-40M80-40v-40M160-40v-40M40-80v-40M120-80v-40M200-80v-40M80-120v-40M160-120v-40M40-160v-50M120-160v-50M200-160v-50" stroke="#1c1418" stroke-width="3" opacity=".6"/>
      <path class="ld-crackj" d="M150-210l-14 40 18 30-20 40 10 30" fill="none" stroke="#0c0a10" stroke-width="5" stroke-linecap="round"/></g></g>
    <g class="ld-anthill">${[[470, 726], [760, 732]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="M-60 0q30-44 60-46 30 2 60 46z" fill="#7a5634"/><ellipse transform="translate(${x} ${y - 30})" rx="10" ry="6" fill="#1c120a"/>`).join('')}</g>
    <g class="ld-grain" fill="#f0d68a" transform="translate(620 744)">${grain}</g>
    <g class="ld-grove">${[[160, 700, 1.1, -6], [290, 690, 0.9, 5], [1010, 696, 1, 4], [1140, 704, 1.15, -5], [870, 690, 0.8, -3]].map(([x, y, k, l]) => `<g stroke="#1c5238">${palm(x, y, k, l)}</g>`).join('')}</g>
    <g class="ld-river"><path d="M-700 770 Q-200 740 300 760 T1300 745 L1900 750 V840 Q1300 830 800 845 T-100 840 L-700 855 Z" fill="#2f6f9a"/>
      <path class="ld-rvshine" d="M-600 790 Q-200 770 300 785 T1300 775" stroke="#bfeee8" stroke-width="4" fill="none" stroke-dasharray="40 60" opacity=".7"/>
      <path class="ld-rvshine" d="M-650 818 Q-150 800 350 812 T1350 804" stroke="#bfeee8" stroke-width="3" fill="none" stroke-dasharray="30 70" opacity=".5"/>
      <path d="M-700 770 Q-200 740 300 760 T1300 745 L1900 750 M1900 840 Q1300 830 800 845 T-100 840 L-700 855" stroke="#c9b48e" stroke-width="6" fill="none" opacity=".6"/></g>
    <g class="ld-tabut"><g class="ld-tbpos"><g class="ld-tbbob"><ellipse cy="-14" rx="120" ry="64" fill="url(#g-warm)" opacity=".75"/><path d="M-50 0v-34h100v34z" fill="#8a5a2e" stroke="#3a2010" stroke-width="4"/><path d="M-54-34q54-24 108 0z" fill="#a06a36" stroke="#3a2010" stroke-width="4"/><path d="M-50-16h100" stroke="#c9a24a" stroke-width="4"/><circle cy="-40" r="28" fill="url(#g-white)"/><circle cy="-40" r="4" fill="#fff"/></g></g></g>
    <g class="ld-jummar" transform="translate(620 736)"><ellipse class="ld-jmglow" cy="-40" rx="170" ry="110" fill="url(#g-white)"/>
      <ellipse cy="6" rx="90" ry="14" fill="#6b4a2a" opacity=".5"/><path d="M-34 0q-6-54 8-86 26-14 52 0 14 32 8 86z" fill="#f6f0dc" stroke="#d8cba4" stroke-width="3"/>
      <path d="M-18-76q-4 34 0 70M0-82v76M18-76q4 34 0 70" fill="none" stroke="#e2d6b0" stroke-width="3"/><ellipse cy="-84" rx="26" ry="8" fill="#fffbea" stroke="#d8cba4" stroke-width="2"/></g>
    <g class="ld-thorns">${[[330, 470, .8], [520, 390, .7], [760, 400, .75], [960, 480, .85], [430, 560, .6], [850, 570, .6]].map(([x, y, k], i) => `<g class="ld-thorn" style="--d:${i * 0.6}s"><g transform="translate(${x} ${y}) scale(${k})"><ellipse rx="110" ry="100" cy="-60" fill="#fff4cf" opacity=".12"/><path d="M0 40v-70M0-10l-40-40M0-20l36-46M-20-30l-30-10M18-42l30-6" stroke="#8a7a62" stroke-width="7" stroke-linecap="round" fill="none"/><ellipse cx="-40" cy="-56" rx="30" ry="12" fill="#7a8a5a"/><ellipse cx="40" cy="-70" rx="34" ry="12" fill="#7a8a5a"/><ellipse cy="-36" rx="22" ry="9" fill="#6a7a4a"/></g></g>`).join('')}</g>
    <g class="ld-souq">${[[300, '#b8503a'], [470, '#2f6f7a'], [800, '#c9a24a'], [970, '#6a4a8a']].map(([x, c], i) => `<g transform="translate(${x} 716)"><path d="M-70 0v-110M70 0v-110" stroke="#5a3a1c" stroke-width="7"/><path d="M-84-110h168l-14 34h-140z" fill="${c}"/><path d="M-84-110h168" stroke="#fff4cf" stroke-width="3" opacity=".5"/><path d="M-56-76l14 0M-28-76l14 0M0-76l14 0M28-76l14 0" stroke="#fff4cf" stroke-width="10" opacity=".25"/><rect x="-66" y="-40" width="132" height="40" fill="#7a5230"/><g class="ld-goods">${['#e8b04a', '#c9783a', '#7aa04a'].map((g, j) => `<ellipse cx="${-40 + j * 40}" cy="-48" rx="18" ry="11" fill="${g}"/>`).join('')}</g></g>`).join('')}
      <g class="ld-buyers" fill="url(#g-warm)">${[[380, 690], [640, 700], [720, 680], [880, 696], [560, 676]].map(([x, y], i) => `<circle class="ld-buyer" style="--d:${-i * 1.7}s" cx="${x}" cy="${y}" r="34"/>`).join('')}</g></g>
    <g class="ld-cloth" transform="translate(640 742)"><ellipse class="ld-clglow" cy="-30" rx="300" ry="120" fill="url(#g-warm)"/>
      <path d="M-200 0l40-36h320l40 36z" fill="#d8c8a2" stroke="#9a8460" stroke-width="3"/><path d="M-176-14h352M-150-28h300" stroke="#b07a4a" stroke-width="5" opacity=".7"/>
      <g class="ld-clfood"><g fill="#f0d68a">${Array.from({ length: 22 }, (_, i) => `<ellipse cx="${-110 + (i * 37) % 120}" cy="${-30 - (i % 4) * 8}" rx="6" ry="4"/>`).join('')}</g>
      <g fill="#7a3a1c">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="${30 + (i * 23) % 90}" cy="${-30 - (i % 3) * 9}" rx="9" ry="6"/>`).join('')}</g></g></g>
    <g class="ld-dog" transform="translate(600 770)"><g class="ld-dogbody"><ellipse cy="22" rx="80" ry="9" fill="#000" opacity=".25"/><g fill="#4e3420">
      <path d="M-44-20v40h10v-36zM-24-18v38h10v-36zM28-20v40h10v-38zM46-22v42h10v-40z"/>
      <ellipse cx="4" cy="-32" rx="62" ry="22"/><path d="M44-44q14-10 26-6l10 18-22 8z"/>
      <ellipse cx="78" cy="-40" rx="20" ry="14"/><path d="M90-40h20q4 8-4 12H92z"/><path d="M70-52l6-20 10 18z"/>
      <path d="M-56-36q-30-10-36-34" stroke="#4e3420" stroke-width="9" fill="none" stroke-linecap="round"/></g>
      <circle cx="84" cy="-44" r="3" fill="#fff4cf"/>
      <path class="ld-dogtongue" d="M104-30q4 12-2 16" stroke="#e07a7a" stroke-width="6" fill="none" stroke-linecap="round"/></g>
      <g class="ld-dogwater" fill="#9fd4ff"><ellipse cx="112" cy="16" rx="26" ry="7" opacity=".7"/></g></g>
    <g class="ld-orchard">${[[420, 706, 1], [520, 714, 1.1], [620, 704, .95], [720, 716, 1.1], [820, 706, 1], [920, 712, 1.05], [470, 744, 1.2], [600, 750, 1.25], [740, 752, 1.2], [870, 746, 1.2]].map(([x, y, k], i) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-5 0v-46h10v46z" fill="#4a2e18"/><g class="ld-crown"><circle cy="-70" r="40"/><circle cx="-26" cy="-56" r="26"/><circle cx="26" cy="-56" r="26"/></g><g class="ld-fruit">${[[-18, -74], [14, -88], [22, -60], [-30, -52], [0, -58], [-6, -96]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6"/>`).join('')}</g></g>`).join('')}
      <path class="ld-fence" d="M360 770h640M360 750v40M440 754v40M520 758v40M600 760v40M680 762v40M760 760v40M840 758v40M920 754v40M1000 750v40" stroke="#6b4426" stroke-width="6" stroke-linecap="round" fill="none"/></g>
    <g class="ld-jar" transform="translate(720 772)"><ellipse class="ld-jarglow" cy="-70" rx="200" ry="150" fill="url(#g-warm)"/>
      <ellipse cy="6" rx="120" ry="26" fill="#3a2414"/><path d="M-120 6q-6-22 30-26M120 6q6-22-30-26" stroke="#6b4426" stroke-width="10" fill="none" stroke-linecap="round"/>
      <g class="ld-jarbody"><path d="M-48 2q-34-52-8-98 10-16 14-30h84q4 14 14 30 26 46-8 98z" fill="#a8643a" stroke="#5a2e14" stroke-width="4"/>
        <path d="M-56-46h112M-44-76h88" stroke="#e0a060" stroke-width="5" opacity=".7"/><path d="M-30-126q-14-4-20 4M30-126q14-4 20 4" stroke="#5a2e14" stroke-width="5" fill="none"/>
        <ellipse cy="-128" rx="38" ry="9" fill="#4a2410" stroke="#5a2e14" stroke-width="3"/>
        <g class="ld-jargold" stroke="#a8741a" stroke-width="2" fill="#ffd34a"><ellipse cx="-16" cy="-134" rx="12" ry="5"/><ellipse cx="10" cy="-138" rx="12" ry="5"/><ellipse cx="2" cy="-146" rx="12" ry="5"/><ellipse cx="-4" cy="-130" rx="12" ry="5"/><ellipse cx="22" cy="-130" rx="11" ry="5"/>
          <ellipse cx="70" cy="-2" rx="12" ry="5"/><ellipse cx="88" cy="2" rx="11" ry="5"/><ellipse cx="78" cy="-8" rx="11" ry="5"/></g></g></g>
    <g class="ld-lion" transform="translate(1010 712)"><g class="ld-lionbody">
      <ellipse cy="6" rx="230" ry="18" fill="#000" opacity=".35"/>
      <path d="M150-118q70-14 84 44 6 34-8 48" fill="none" stroke="#120d0a" stroke-width="11" stroke-linecap="round"/><ellipse cx="226" cy="-24" rx="15" ry="20" fill="#24160c"/>
      <path d="M94-92h40l8 92h-36zM44-92h38l2 92h-34zM-104-92h40l-4 92h-36zM-56-92h38l4 92h-36z" fill="#100c12"/>
      <path d="M-134-100q0-74 84-76h150q66 0 74 54 4 46-44 48h-208q-56 0-56-26z" fill="#141018"/>
      <path d="${Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2, d = i % 2 ? 72 : 96; return `${i ? 'L' : 'M'}${(-140 + Math.cos(a) * d).toFixed(0)} ${(-150 + Math.sin(a) * d * .92).toFixed(0)}`; }).join('')}z" fill="#24160c"/>
      <circle cx="-150" cy="-192" r="13" fill="#141018"/><circle cx="-196" cy="-180" r="12" fill="#141018"/>
      <ellipse cx="-172" cy="-142" rx="46" ry="50" fill="#16111a"/><ellipse cx="-206" cy="-116" rx="24" ry="19" fill="#1c1620"/>
      <circle class="ld-lioneye" cx="-190" cy="-152" r="4.5" fill="#f0b040"/>
    </g></g>
    <g class="ld-khuff" transform="translate(720 760)"><ellipse class="ld-khglow" cy="-30" rx="110" ry="80" fill="url(#g-warm)"/>
      <path d="M-24-80h40v60q30 4 40 20v10h-82z" fill="#7a4a24" stroke="#3d2412" stroke-width="3"/><path d="M-24-72h40" stroke="#c9925a" stroke-width="4"/>
      <g class="ld-khdrip" fill="#9fd4ff"><ellipse cx="-30" cy="-6" rx="4" ry="7"/><ellipse cx="-38" cy="8" rx="3" ry="5"/></g></g>
    <g class="ld-herd">
      <g class="ld-herd1" transform="translate(640 770)"><ellipse cy="-20" rx="90" ry="60" fill="url(#g-warm)"/>${sheep(0, 0, 1)}</g>
      <g class="ld-herdall">${[[180, 780], [240, 810], [300, 776], [360, 820], [420, 790], [210, 850], [330, 860], [470, 840], [140, 820]].map(([x, y], i) => sheep(x, y, .8 + (i % 3) * .1)).join('')}
        ${[[600, 830], [700, 860], [790, 826], [660, 900]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="44" ry="24" fill="#7a4a2a"/><ellipse cx="44" cy="-14" rx="16" ry="12" fill="#6a3a1c"/><path d="M-30 20v22M-10 22v22M14 22v22M32 20v22" stroke="#4a2a12" stroke-width="7"/><path d="M50-26l8-10M40-26l-4-12" stroke="#e8dcc0" stroke-width="4"/></g>`).join('')}</g>
    </g>
    <g class="ld-donkey" transform="translate(640 718)"><g class="ld-dkbob">
      <ellipse cy="4" rx="120" ry="12" fill="#000" opacity=".25"/>
      <path d="M-70-20v24M-46-18v22M44-18v22M68-20v24" stroke="#4a3e3a" stroke-width="10" stroke-linecap="round"/>
      <path d="M-90-56q0-34 40-40h90q36 0 40 30l6 10q-2 30-40 32h-100q-36-2-36-32z" fill="#8a7a70"/>
      <path d="M-60-92h86q8 0 8 8v14h-102v-14q0-8 8-8z" fill="#6b3f24"/><path d="M-56-80h78" stroke="#c9a24a" stroke-width="4"/>
      <path d="M70-66q24-40 46-46l18 6q10 22 2 42-20 10-36 26z" fill="#8a7a70"/><path d="M118-112l-6-34 14 30M128-110l4-34 6 32" fill="#6e5e56" stroke="#4a3e3a" stroke-width="3"/>
      <ellipse cx="136" cy="-78" rx="10" ry="8" fill="#5e4e48"/><circle cx="124" cy="-98" r="3.5" fill="#1a1010"/>
      <path d="M-90-60q-24 10-26 40" fill="none" stroke="#6e5e56" stroke-width="6" stroke-linecap="round"/>
      <g class="ld-riders"><g class="ld-rd1"><circle cx="0" cy="-150" r="70" fill="url(#g-white)"/><circle cx="0" cy="-150" r="6" fill="#fff"/></g><g class="ld-rd2"><circle cx="-56" cy="-136" r="56" fill="url(#g-warm)"/><circle cx="-56" cy="-136" r="5" fill="#fff"/></g></g>
    </g></g>
    <g class="ld-ants" fill="#2a1612">${ants}</g>
    <g class="ld-army">${Array.from({ length: 36 }, (_, i) => { const row = i % 4, col = Math.floor(i / 4); const x = 880 + col * 58 + row * 22, y = 646 + row * 22, k = 0.7 + row * 0.12; return `<g class="ld-soldier" style="--d:${(-(i * 0.37) % 3.6).toFixed(2)}s"><circle cx="${x}" cy="${y}" r="${(34 * k).toFixed(0)}" fill="url(#g-warm)"/><circle cx="${x}" cy="${y}" r="${(4 * k).toFixed(1)}" fill="#fff"/></g>`; }).join('')}
      ${[0, 1, 2].map(j => `<g transform="translate(${930 + j * 170} 640)"><path d="M0 0v-150" stroke="#6b441d" stroke-width="6" stroke-linecap="round"/><path class="ld-flag" d="M3-146q34-8 66 2t60-4v62q-28 8-60-2T3-84z" fill="#f1e4c3" stroke="#c9a24a" stroke-width="3"/></g>`).join('')}</g>`;
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
      <path class="ld-lip" d="M-700 760q400-22 800-8t800-2 800-10" fill="none" stroke-width="5"/>
      <g class="ld-ukhdud"><ellipse cx="600" cy="770" rx="1100" ry="90" fill="url(#g-warm)" class="ld-ukglow"/>${Array.from({ length: 16 }, (_, i) => `<g transform="translate(${-500 + i * 150} 786)">${tongue(0, .42 + (i % 3) * .08, 'ur-fl--a', -i * .37)}${tongue(30, .3, 'ur-fl--c', -i * .21)}</g>`).join('')}</g></g>
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
    <g class="ld-palm"><ellipse class="ld-palmglow" cx="950" cy="420" rx="260" ry="320" fill="url(#g-warm)"/><g stroke="#1c5238">${palm(950, 706, 0.9, -12)}</g><g transform="translate(940 706) scale(.9)" fill="#c9792a">${dates}</g></g>
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
    <g class="ld-rockwrap" transform="translate(420 716)"><g class="ld-rock">
      <ellipse cx="0" cy="4" rx="230" ry="20" fill="#000" opacity=".3"/>
      <path class="ld-rockbody" d="M-210 0q-26-96 40-160 56-56 150-50 66-30 130 6 86 40 96 130 6 50-16 74z"/>
      <path class="ld-rocklit" d="M60-200q80 20 110 80 26 56 12 110l-16 10q10-60-14-110-26-50-92-90z"/>
      <path d="M-170-150q40 10 70 60M40-200q-10 50 20 90M140-120q-40 20-50 70" fill="none" stroke="#1c1828" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path class="ld-crack" d="M-30 0l14-50-20-36 26-40-6-34" fill="none" stroke="#120e18" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="ld-seed" transform="translate(-26 -88)"><circle r="120" fill="url(#g-warm)"/><circle r="34" fill="url(#g-white)"/><ellipse rx="7" ry="6" fill="#ffe08a" stroke="#b98548" stroke-width="2"/></g>
    </g></g>
    <g class="ld-beastwrap" transform="translate(980 712)"><g class="ld-beast">
      <ellipse cy="6" rx="240" ry="20" fill="#000" opacity=".35"/>
      <path d="M-200-40q-10-90 70-120 60-24 150-18 80 4 120 40 30-14 56-6l30-40q6 40-14 70 24 30 16 76-8 20-40 18l-20 20v40h-34l-6-56q-40 14-90 14l-8 42h-34l-4-48q-60-4-100-20l-10 68h-34l-4-70q-30-10-40-30l-20 100h-34z" fill="#0c0a14"/>
      <circle cx="198" cy="-104" r="5" fill="#c84a2a"/>
    </g><path class="ld-stone" d="M-330-40l10-12 14 4 2 14-12 8-14-4z" fill="#8a8494" stroke="#3a3448" stroke-width="2"/></g>
    <g class="ld-flock" fill="url(#g-warm)">${flock}</g>
    <g class="ld-tent" transform="translate(930 700)"><ellipse class="ld-tentglow" cy="-70" rx="220" ry="150" fill="url(#g-warm)"/>
      <path d="M-170 0L-20-150h40L170 0z" fill="#8a5a3a" stroke="#3a2412" stroke-width="4" stroke-linejoin="round"/><path d="M-20-150l-60 150M20-150l60 150" stroke="#6b3f24" stroke-width="5"/>
      <path class="ld-tentdoor" d="M-44 0L0-112 44 0z"/><path d="M0-150v-26" stroke="#4a2d10" stroke-width="6"/><path d="M-170 0h-24M170 0h24" stroke="#4a2d10" stroke-width="4"/>
      <path d="M-120-46h60M60-46h60" stroke="#e8c48a" stroke-width="6" opacity=".55"/></g>
    ${landExtras()}
    <g class="ld-cow" transform="translate(640 772)"><ellipse class="ld-cowglow" cy="-40" rx="190" ry="120" fill="url(#g-warm)"/>
      <ellipse cy="40" rx="110" ry="12" fill="#000" opacity=".22"/>
      <path d="M-62 10v30M-36 14v28M40 14v28M64 10v30" stroke="#b8861c" stroke-width="11" stroke-linecap="round"/>
      <path d="M-84-30q0-34 40-38h96q34 2 38 32v20q-4 30-40 32h-96q-38-2-38-30z" fill="#f2c230"/>
      <path d="M-84-24q-14 10-14 34" stroke="#d9a81e" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g transform="translate(96 -46)"><ellipse rx="26" ry="20" fill="#f2c230"/><ellipse cx="14" cy="8" rx="13" ry="10" fill="#f6d88a"/><path d="M-14-16q-14-14-4-26M8-18q10-16 22-14" stroke="#efe3c4" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="2" cy="-4" r="3.4" fill="#3a2a10"/></g>
      <path class="ld-cowshine" d="M-60-56q40-12 90-6" stroke="#fff6c8" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/></g>
    <g class="ld-maida" transform="translate(640 640)"><g class="ld-mdpos"><path class="ld-mdbeam" d="M-90-900L90-900L150 0L-150 0Z" fill="#fff4cf" opacity=".25"/><ellipse cy="-20" rx="200" ry="90" fill="url(#g-white)"/>
      <ellipse rx="130" ry="26" fill="#e8d8a8" stroke="#a8843a" stroke-width="4"/><ellipse cy="-6" rx="110" ry="18" fill="#f6ecd0"/>
      <g stroke="#6b441d" stroke-width="2"><ellipse cx="-60" cy="-14" rx="22" ry="10" fill="#c98a3a"/><ellipse cx="0" cy="-20" rx="26" ry="11" fill="#e8b04a"/><ellipse cx="58" cy="-14" rx="22" ry="10" fill="#7aa04a"/><circle cx="-26" cy="-4" r="9" fill="#d8584a"/><circle cx="30" cy="-4" r="9" fill="#d8584a"/></g></g></g>
    <g class="ld-dam"><path d="M-500 690Q-100 560 220 600L240 720L-500 720Z" fill="#4a6a8a" opacity=".85"/><path class="ld-dmlake" d="M-500 640Q-150 600 220 620L230 720L-500 720Z" fill="#3a7ab0"/>
      <g class="ld-dmwall"><path d="M200 500L370 500L400 740L170 740Z" fill="#8a7a62" stroke="#4a3e2e" stroke-width="5"/><path d="M194 550h182M188 610h196M182 670h210" stroke="#5a4e3e" stroke-width="5"/></g>
      <g class="ld-dmgap"><path d="M250 560L320 560L334 740L240 740Z" fill="#2f6f9a"/><path d="M285 580Q330 700 520 770T1100 820" stroke="#4a9ad0" stroke-width="70" fill="none" stroke-linecap="round"/><path class="ld-dmflow" d="M285 580Q330 700 520 770T1100 820" stroke="#bfe6fa" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="30 60" opacity=".8"/></g></g>
    <g class="ld-qurban">${[[500, 'a'], [780, 'b']].map(([x, k]) => `<g class="ld-qb-${k}" transform="translate(${x} 740)"><path class="ld-qbbeam" d="M-40-700L40-700L70 0L-70 0Z" fill="#fff4cf" opacity="0"/><ellipse cy="4" rx="70" ry="16" fill="#3a2a1a" opacity=".4"/><path d="M-56 0q8-40 56-46q48 6 56 46z" fill="#7a6a58" stroke="#3a2e22" stroke-width="3"/><ellipse cy="-46" rx="34" ry="10" fill="#c9a24a"/></g>`).join('')}</g>
    <g class="ld-crow" transform="translate(900 700) scale(1.5)"><g class="ld-crowpos"><path d="M-40 0q20-30 50-24q24 4 30 20l26 6-26 6q-14 18-46 14q-30-4-34-22z" fill="#1a1a22"/><path d="M-34-8q20-20 50-8q-10 14-50 8z" fill="#33333f"/><path d="M-40 0l-26-8l8 14z" fill="#1a1a22"/><circle cx="20" cy="-10" r="3" fill="#e8e0c0"/><path d="M-10 18l-6 14M6 18l4 14" stroke="#1a1a22" stroke-width="4"/></g></g>
    <g class="ld-way"><path d="M560 640L720 640L1500 1500L-220 1500Z" fill="#c9a072" opacity=".55"/><path d="M640 650V1500" stroke="#e8c898" stroke-width="5" stroke-dasharray="20 30" opacity=".5"/>
      <g class="ld-branch" transform="translate(640 800)"><ellipse class="ld-brglow2" rx="200" ry="70" fill="url(#g-warm)" opacity=".5"/><g class="ld-brmove">
        <path d="M-180 10Q0-20 180 6" stroke="#5a3a1c" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M-120 2l-24-30M-60-6l10-34M0-8l-20-32M60-4l16-34M120 2l-10-34M-90 4l20 26M30-4l-14 30M90 0l22 26" stroke="#5a3a1c" stroke-width="6" stroke-linecap="round"/>
        <g stroke="#8a6a4a" stroke-width="3" stroke-linecap="round">${[-150, -100, -40, 20, 80, 140].map(x => `<path d="M${x} 0l-8-12M${x + 10} 2l8-12"/>`).join('')}</g></g></g></g>
    <g class="ld-harra"><g fill="#2a2624" stroke="#14110f" stroke-width="2">${[[-260, 742, 46], [-150, 790, 38], [-40, 736, 30], [60, 800, 44], [160, 748, 34], [260, 796, 30], [-320, 820, 50], [120, 840, 40], [330, 760, 26]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${(r * .55).toFixed(0)}"/>`).join('')}</g>
      <path d="M-420 806Q-120 770 120 786T430 762" fill="none" stroke="#3a3128" stroke-width="30" stroke-linecap="round"/>
      <path class="ld-sharj" d="M-420 806Q-120 770 120 786T430 762" fill="none" stroke="#5ab0d8" stroke-width="16" stroke-linecap="round"/></g>
    <g class="ld-cloud" transform="translate(640 250)"><g class="ld-clpos"><g class="ld-rain" stroke="#bfe0f2" stroke-width="4" stroke-linecap="round">${[-150, -100, -50, 0, 50, 100, 150, -125, -25, 75, 125].map((x, i) => `<path style="--d:${(-i * .13).toFixed(2)}s" d="M${x} 40v46"/>`).join('')}</g>
      <g fill="#d8dde6" stroke="#9aa3b0" stroke-width="3"><ellipse cx="-110" cy="10" rx="90" ry="50"/><ellipse cx="110" cy="10" rx="90" ry="50"/><ellipse cy="-20" rx="120" ry="70"/><ellipse cy="26" rx="190" ry="40"/></g>
      <g class="ld-clvoice" fill="none" stroke="#fff4cf" stroke-width="5" stroke-linecap="round"><path d="M210-10a60 60 0 0 1 0 60"/><path d="M240-30a90 90 0 0 1 0 100"/></g></g></g>
    <g class="ld-milk" transform="translate(300 720)"><g class="ld-mkpos"><circle class="ld-mkglow" cy="-14" r="80" fill="url(#g-white)"/><path d="M-30-30h60q-4 40-30 42-26-2-30-42z" fill="#b98548" stroke="#4a2d10" stroke-width="3"/><ellipse cy="-30" rx="30" ry="8" fill="#fdf6e6"/><path d="M-18 16h36" stroke="#6b441d" stroke-width="6" stroke-linecap="round"/></g></g>
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
    <defs><linearGradient id="g-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9fd8"/><stop offset=".7" stop-color="#9fd4ee"/><stop offset="1" stop-color="#f6e7b8"/></linearGradient></defs>
    <rect class="dr-day" x="-700" y="-300" width="2600" height="1200" fill="url(#g-day)"/>
    ${stars(90, 37, [-400, 1600], [-300, 400])}
    <path class="dr-moon" d="M930 70a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="dr-sun" transform="translate(300 160)"><circle r="230" fill="url(#g-warm)"/><circle r="64" fill="#ffe08a"/><circle r="50" fill="#fff4cf"/></g>
  </g>
  <g data-d=".3">
    <path class="dr-hills" d="M-700 470-480 330-330 400-170 280 0 380 150 300 330 410 500 330 700 420 860 300 1040 390 1220 290 1400 400 1900 330V1400H-700z"/>
    <g class="dr-far" transform="translate(600 438)"><path class="dr-kaaba" d="M-26 0v-46h52V0z"/><path d="M-26-34h52" stroke="#c9995a" stroke-width="3" opacity=".7"/></g>
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
    <g class="dr-dates" transform="translate(600 830)"><ellipse class="dr-dtglow" cy="-24" rx="200" ry="110" fill="url(#g-warm)"/>
      <ellipse cy="0" rx="110" ry="26" fill="#b98548" stroke="#4a2d10" stroke-width="3"/><ellipse cy="-6" rx="92" ry="16" fill="#d8a868"/>
      <g class="dr-dtwhole" fill="#6a2e14" stroke="#3a160a" stroke-width="3"><ellipse cx="-44" cy="-16" rx="24" ry="13"/><ellipse cx="40" cy="-16" rx="24" ry="13"/><ellipse class="dr-dt3" cx="0" cy="-28" rx="24" ry="13"/></g>
      <g class="dr-dthalf" fill="#7a3a1a" stroke="#3a160a" stroke-width="3" transform="translate(0 -40)"><path d="M-4 12v-24q-30 0-30 12t30 12z"/><path d="M4 12v-24q30 0 30 12t-30 12z"/><path d="M-4 0h-14M4 0h14" stroke="#e8b070" stroke-width="3"/></g>
      <path d="M-30-18q30 8 60 0" stroke="#a8622e" stroke-width="2" fill="none" opacity=".6"/></g>
    <g class="dr-toy" transform="translate(720 806)"><ellipse class="dr-tyglow" cy="-30" rx="150" ry="100" fill="url(#g-warm)"/><g class="dr-typos">
      <circle cy="-34" r="34" fill="#d8584a" stroke="#7a2a22" stroke-width="3"/><path d="M-30-46q30 20 60 0M-32-26q32 20 64 0M-20-62q20 14 40 0" stroke="#f0c060" stroke-width="5" fill="none"/>
      <path d="M-10 0l-8 26M0 0v28M10 0l8 26" stroke="#4a8ac0" stroke-width="6" stroke-linecap="round"/><circle cx="-18" cy="28" r="6" fill="#7ac060"/><circle cy="31" r="6" fill="#f0c060"/><circle cx="18" cy="28" r="6" fill="#7ac060"/></g></g>
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
    <g class="dr-ewer" transform="translate(820 790)"><ellipse class="dr-ewglow" cy="-90" rx="190" ry="170" fill="url(#g-warm)"/>
      <ellipse cy="6" rx="80" ry="12" fill="#000" opacity=".25"/><path d="M-40 0q-30-60 0-110h80q30 50 0 110z" fill="#b87333" stroke="#6b3a1c" stroke-width="4"/>
      <path d="M-20-110q-4-30 20-34 24 4 20 34" fill="#c98a4a" stroke="#6b3a1c" stroke-width="4"/><path d="M-36-70q-50-10-74-60l14-6q20 40 60 48" fill="#b87333" stroke="#6b3a1c" stroke-width="3"/>
      <path d="M38-90q40 0 40 34 0 30-34 34" fill="none" stroke="#6b3a1c" stroke-width="8"/><path d="M-30-56h60" stroke="#e8b86a" stroke-width="4" opacity=".7"/>
      <circle class="dr-ewdrop" cx="-108" cy="-120" r="5" fill="#bfeee8"/></g>
    <g class="dr-reed" transform="translate(620 800)"><ellipse class="dr-rdglow" cy="-20" rx="260" ry="80" fill="url(#g-warm)"/>
      <path d="M-230 6 L230 -14 L232 -4 L-228 16 Z" fill="#d8c48a" stroke="#8a7a3a" stroke-width="2"/>
      <path d="M-150 3v10M-70 0v10M10-3v10M90-6v10M170-9v10" stroke="#8a7a3a" stroke-width="3"/>
      <path d="M230-14q24-20 44-10" stroke="#7a9a4a" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    <g class="dr-spindle" transform="translate(430 790)"><ellipse class="dr-spglow" cy="-40" rx="150" ry="110" fill="url(#g-warm)"/>
      <ellipse cy="6" rx="70" ry="10" fill="#000" opacity=".2"/>
      <g class="dr-spin"><path d="M0-120V0" stroke="#7a5230" stroke-width="6" stroke-linecap="round"/><ellipse cy="-22" rx="28" ry="9" fill="#9a6a3a"/></g>
      <path d="M0-110 q60 10 90 60" stroke="#f3ead6" stroke-width="3" fill="none"/>
      <circle cx="96" cy="-30" r="30" fill="#efe3c6" stroke="#c9b48e" stroke-width="2"/><path d="M74-40q22 10 44-4M72-24q24 10 48-2" stroke="#c9b48e" stroke-width="2" fill="none"/></g>
    <g class="dr-musalla" transform="translate(560 812)"><ellipse class="dr-muglow" cy="-30" rx="220" ry="110" fill="url(#g-warm)"/>
      <path d="M-130 20 L-90-50 H90 L130 20 Z" fill="#a8402e" stroke="#5a2010" stroke-width="3"/>
      <path d="M-104 8 L-76-38 H76 L104 8 Z" fill="none" stroke="#f0d68a" stroke-width="3" opacity=".8"/>
      <path d="M-40-38 q40-22 80 0" stroke="#f0d68a" stroke-width="3" fill="none"/></g>
    <g class="dr-meteor"><g class="dr-mtrail"><path d="M0 0 L-260 120" stroke="url(#g-white)" stroke-width="10" stroke-linecap="round" opacity=".9"/><path d="M0 0 L-200 92" stroke="#fffbe8" stroke-width="3" stroke-linecap="round"/><circle r="9" fill="#fff"/><circle r="26" fill="url(#g-white)"/></g></g>
    <g class="dr-axe" transform="translate(720 812)"><ellipse class="dr-axglow" cy="-110" rx="200" ry="160" fill="url(#g-warm)"/>
      <path d="M-110 10 Q-120-70-70-80 H70 Q120-70 110 10 Z" fill="#8a5a2e" stroke="#4a2d10" stroke-width="3"/>
      <path d="M-100-40 H100" stroke="#c9a060" stroke-width="5" opacity=".7"/><path d="M-60-80 Q0-120 60-80" stroke="#4a2d10" stroke-width="6" fill="none"/>
      <g class="dr-axhead"><path d="M-46-150 L30-170 Q62-150 58-110 Q60-80 30-60 L-46-80 Z" fill="#8f99a6" stroke="#3a4048" stroke-width="3"/>
        <path d="M44-160 Q66-118 44-70" stroke="#e8eef4" stroke-width="5" fill="none"/>
        <ellipse cx="-26" cy="-115" rx="12" ry="20" fill="#2a2e36"/></g></g>
    <g class="dr-coins">${[[560, 800], [690, 800]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse cy="-30" rx="120" ry="70" fill="url(#g-warm)"/>${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${-36 + (i % 4) * 24 + (i > 3 ? 12 : 0) + (i > 6 ? 12 : 0)}" cy="${-(i > 3 ? 14 : 0) - (i > 6 ? 14 : 0)}" rx="16" ry="7" fill="#e8c048" stroke="#9a7420" stroke-width="2"/>`).join('')}</g>`).join('')}</g>
    <g class="dr-siraj" transform="translate(540 760)"><ellipse class="dr-sjglow" cy="-90" rx="220" ry="200" fill="url(#g-warm)"/>
      <path d="M-40 0h80l-10-60h-60z" fill="#6b441d"/><path d="M-56-60h112v-10H-56z" fill="#8a5a2e"/>
      <path d="M-50-70q-6-28 26-30h48q36 0 40 18l18-8q4 12-12 18-10 4-24 2-4 6-12 8h-60q-24-2-24-8z" fill="#b8703a" stroke="#6b3a1c" stroke-width="3"/>
      <ellipse cx="-6" cy="-92" rx="16" ry="5" fill="#3a2010"/>
      <g class="dr-sjflame"><path d="M50-96q-14-16 0-44 16 26 0 44z" fill="#ffd77a"/><path d="M50-100q-6-8 0-22 8 12 0 22z" fill="#fff4cf"/></g>
      <path class="dr-sjsmoke" d="M50-100q-10-20 4-36t-2-36" fill="none" stroke="#9a9aaa" stroke-width="4" stroke-linecap="round"/></g>
    <g class="dr-candle" transform="translate(450 760)"><ellipse class="dr-cdglow" cy="-150" rx="170" ry="170" fill="url(#g-warm)"/>
      <path d="M-46 0h92l-10-16h-72zM-6-16h12v-70H-6zM-34-86h68l-6-12h-56z" fill="#b98548" stroke="#4a2d10" stroke-width="3"/>
      <rect x="-18" y="-170" width="36" height="74" rx="6" fill="#f3ead6" stroke="#c9b48e" stroke-width="2"/><path d="M-10-150q4 10 0 26" stroke="#e2d2a8" stroke-width="3" fill="none"/>
      <path d="M0-170v-10" stroke="#3a2412" stroke-width="3"/><path class="dr-cdflame" d="M0-180q-12-18 0-40 12 22 0 40z" fill="#ffd77a"/><path class="dr-cdflame" d="M0-184q-5-9 0-20 5 11 0 20z" fill="#fff"/></g>
    <g class="dr-lights">
      <g class="dr-b"><circle cx="680" cy="680" r="90" fill="url(#g-white)"/><circle cx="680" cy="680" r="7" fill="#fff"/></g>
      <g class="dr-a"><circle cx="560" cy="700" r="110" fill="url(#g-warm)"/><circle cx="560" cy="700" r="8" fill="#fff"/></g>
      <g class="dr-girls"><circle cx="450" cy="756" r="62" fill="url(#g-warm)"/><circle cx="450" cy="756" r="5" fill="#fff"/><circle cx="500" cy="784" r="56" fill="url(#g-warm)"/><circle cx="500" cy="784" r="5" fill="#fff"/></g>
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
      <path class="hr-band" d="M-150-236h170v22h-170zM20-236l140 22v20L20-214z" fill="#ffe9a8"/>
      <g class="hr-hem"><path d="M-150-6q42 10 85 0t85 0" fill="none" stroke="#2a2a36" stroke-width="10"/></g>
      <g class="hr-hold" transform="translate(-170 -70)"><circle r="96" fill="url(#g-warm)"/><circle r="8" fill="#fff"/></g>
      <path d="M-60-90v-120h50v120z" fill="#c9a24a" opacity=".85"/><path d="M-66-90h62v8h-62z" fill="#8a6a2a"/>
      <g class="hr-stone" transform="translate(12 -64)"><circle r="70" fill="url(#g-warm)"/><ellipse rx="20" ry="24" fill="#c0c4cc"/><ellipse rx="13" ry="16" fill="#120c10"/></g>
    </g>
    <g class="hr-maqam" transform="translate(890 740)"><circle cy="-30" r="110" fill="url(#g-warm)"/><path d="M-30 0v-44h60V0z" fill="#b8a888"/><path d="M-36-44h72l-8-20h-56z" fill="#d8c8a0"/></g>
    <g class="hr-halqa" transform="translate(250 900)">${[...Array(9)].map((_, i) => { const a = Math.PI * (0.08 + i * 0.105); return `<circle class="hr-q" cx="${(Math.cos(a) * 170).toFixed(0)}" cy="${(-Math.sin(a) * 60).toFixed(0)}" r="34" fill="url(#g-warm)"/>`; }).join('')}<circle class="hr-q hr-q0" cy="-20" r="70" fill="url(#g-warm)"/><circle cy="-20" r="7" fill="#fff"/></g>
    <g class="hr-lights">
      <g class="hr-a"><circle cx="420" cy="760" r="110" fill="url(#g-warm)"/><circle cx="420" cy="760" r="8" fill="#fff"/></g>
    </g>
    <ellipse class="hr-glow" cx="600" cy="640" rx="900" ry="600" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3"><path d="M-700 1400V940l220-50 110 60 80 450zM1900 1400V920l-220-40-120 70-70 450z" fill="#0c0a08"/></g>`;
}

// ——— قصر فرعون على النيل (مؤمن آل فرعون): لا يُرسم أحد. المؤمن نور دافئ، وموسى عليه السلام نور أبيض بعيد،
// وفرعون لا يُرسم: عرشه في عمق البوابة فقط. لا رموز آلهة على الجدران (أشرطة ونجوم فقط) ———
function papyrus(x, y, h, w) { // عمود بتاج زهرة البردي
  return `<g transform="translate(${x} ${y})"><path d="M${-w / 2} 0V${-h}h${w}V0z" fill="url(#g-qcol)"/>
    <path d="M${-w / 2} ${-h}Q${-w * 1.15} ${-h - w * 0.5} ${-w * 0.95} ${-h - w * 1.1}H${w * 0.95}Q${w * 1.15} ${-h - w * 0.5} ${w / 2} ${-h}z" fill="#b98548"/>
    <path d="M${-w * 0.95} ${-h - w * 1.1}h${w * 1.9}v${-w * 0.22}h${-w * 1.9}z" fill="#8a6234"/>
    <path d="M${-w * 0.6} ${-h - w * 0.2}q${w * 0.1}-${w * 0.5} ${-w * 0.2}-${w * 0.85}M0 ${-h - w * 0.1}v${-w * 0.95}M${w * 0.6} ${-h - w * 0.2}q${-w * 0.1}-${w * 0.5} ${w * 0.2}-${w * 0.85}" fill="none" stroke="#6b441d" stroke-width="${(w * 0.06).toFixed(1)}" opacity=".6"/>
    <path d="M${-w / 2} ${-h + w * 0.25}h${w}M${-w / 2} ${-h + w * 0.45}h${w}M${-w / 2} ${-h + w * 0.65}h${w}" stroke="#2f8f9a" stroke-width="${(w * 0.08).toFixed(1)}"/>
    <path d="M${-w / 2} ${-h + w * 0.35}h${w}M${-w / 2} ${-h + w * 0.55}h${w}" stroke="#c9a24a" stroke-width="${(w * 0.06).toFixed(1)}"/></g>`;
}
function pylon(x0, x1) { // برج بوابة مائل الجانبين
  const t0 = x0 + 34, t1 = x1 - 34; let rows = '';
  for (let y = 300; y < 620; y += 46) { const k = (y - 230) / 410 * 34; for (let x = x0 + 60 - k; x < x1 - 60 + k; x += 30) rows += `<rect x="${x.toFixed(0)}" y="${y}" width="12" height="${(y / 46) % 2 < 1 ? 18 : 10}" rx="2"/>`; }
  return `<path d="M${x0} 640L${t0} 230H${t1}L${x1} 640z" fill="url(#g-pylon)"/><path class="qs-lit" d="M${t1 - 40} 230H${t1}L${x1} 640h-60z"/>
    <path d="M${t0 - 18} 230q${(t1 - t0) / 2 + 18}-30 ${t1 - t0 + 36} 0v-26H${t0 - 18}z" fill="#8a6234"/><path d="M${t0 - 18} 204h${t1 - t0 + 36}v-8H${t0 - 18}z" fill="#c9a24a"/>
    <path d="M${x0 + 28} 600h${x1 - x0 - 56}M${t0 + 6} 270h${t1 - t0 - 12}" stroke="#c9a24a" stroke-width="6" opacity=".55"/>
    <g class="qs-glyph" fill="#2a1c14" opacity=".35">${rows}</g>`;
}
function qasr() {
  const r = rng(73); let bricks = '', tiles = '', court = '', reeds = '';
  for (let y = 0; y < 900; y += 30) bricks += `M-100 ${-y}h200`;
  for (let i = 0; i < 11; i++) tiles += `M${-700 + i * 260} 1400L${330 + i * 54} 650`;
  for (const [x, y, q] of [[250, 700, 34], [330, 728, 30], [180, 742, 28], [900, 700, 34], [980, 726, 30], [1060, 744, 28], [430, 750, 26], [800, 752, 26]]) court += `<circle cx="${x}" cy="${y}" r="${q}"/>`;
  for (let i = 0; i < 40; i++) { const x = -600 + r() * 2400; reeds += `M${x.toFixed(0)} 604q${(r() * 8 - 4).toFixed(0)}-24 ${(r() * 10 - 5).toFixed(0)}-${(20 + r() * 26).toFixed(0)}`; }
  return `${DEFS}
  <defs><linearGradient id="g-pylon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5a3a"/><stop offset="1" stop-color="#4a3424"/></linearGradient>
    <linearGradient id="g-qcol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a4030"/><stop offset=".45" stop-color="#a07850"/><stop offset="1" stop-color="#4a3424"/></linearGradient>
    <radialGradient id="g-ember"><stop offset="0" stop-color="#ffb070" stop-opacity=".9"/><stop offset=".4" stop-color="#c8402a" stop-opacity=".5"/><stop offset="1" stop-color="#6a1010" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-cold"><stop offset="0" stop-color="#cfd8ff" stop-opacity=".6"/><stop offset=".5" stop-color="#7f8cc0" stop-opacity=".25"/><stop offset="1" stop-color="#3a4478" stop-opacity="0"/></radialGradient>
    <linearGradient id="g-nile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c3a6a"/><stop offset="1" stop-color="#0c1c3c"/></linearGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="qs-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    ${stars(100, 97, [-400, 1600], [-300, 420])}
    <path class="qs-moon" d="M1010 70a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="qs-sun"><circle cx="300" cy="520" r="360" fill="url(#g-warm)"/><circle cx="300" cy="520" r="62" fill="#fff4cf"/></g>
  </g>
  <g data-d=".3">
    <path class="qs-far" d="M-700 580h2600v900H-700z"/>
    <g class="qs-pyr"><path d="M1180 580l120-130 120 130zM1370 580l80-90 80 90z"/><path class="qs-pyrlit" d="M1300 450l120 130h-40zM1450 490l80 90h-26z"/></g>
    <g class="qs-ruins" transform="translate(560 -290)">
      <ellipse cx="80" cy="520" rx="460" ry="150" fill="url(#g-cold)"/>
      <g fill="#8a96c8" opacity=".55"><path d="M-180 580v-110h26v110zM-120 580v-64h26v64zM-60 580v-150h26v150zM-70 430h46v-14h-46zM20 580l60-36 80 10 30 26zM120 580v-90h24v90zM190 580v-40h70v40zM300 580v-120l30-12v132zM360 580l40-60 60 60zM-260 580h720v8h-720z"/></g>
    </g>
    <rect x="-700" y="592" width="2600" height="44" fill="url(#g-nile)"/>
    <g class="qs-tabut"><g class="qs-tbpos"><g class="qs-tbbob"><ellipse cy="-14" rx="110" ry="60" fill="url(#g-warm)" opacity=".7"/><path d="M-50 0v-34h100v34z" fill="#8a5a2e" stroke="#3a2010" stroke-width="4"/><path d="M-54-34q54-24 108 0z" fill="#a06a36" stroke="#3a2010" stroke-width="4"/><path d="M-50-16h100" stroke="#c9a24a" stroke-width="4"/><circle cy="-40" r="26" fill="url(#g-white)"/></g></g></g>
    <path class="qs-shine" d="M-500 606h180M-80 614h240M380 604h200M820 616h220M1240 606h180" stroke="#9fc4ff" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <path d="${reeds}" stroke="#16302a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <g stroke="#0f241e">${palm(-260, 600, 0.55, -8)}${palm(1300, 600, 0.6, 10)}${palm(1430, 604, 0.45, -6)}</g>
  </g>
  <g data-d=".5">
    <g class="qs-sarhwrap" transform="translate(940 640)"><g class="qs-sarh">
      <path d="M-110 0L-70-940H70L110 0z" fill="#6a4a30"/><path d="M30-940h40L110 0H70z" fill="#8a6440"/>
      <path d="${bricks}" stroke="#3a2618" stroke-width="3" opacity=".45"/>
      <path d="M-130 0v-420M130 0v-420M-130-140h260M-130-280h260M-130-420h260M-130-140l260-140M130-140l-260-140" stroke="#c9995a" stroke-width="4" fill="none" opacity=".55"/>
    </g></g>
  </g>
  <g data-d=".75">
    <g class="qs-palace">
      ${pylon(130, 450)}${pylon(750, 1070)}
      <path d="M450 640V340h300v300z" fill="#5a4030"/>
      <path d="M440 340h320v-30H440z" fill="#8a6234"/><path d="M440 312h320v-8H440z" fill="#c9a24a"/>
      <path d="M520 640V400h160v240z" fill="#0c0610"/>
      <g class="qs-throne"><ellipse cx="600" cy="560" rx="130" ry="150" fill="url(#g-ember)"/>
        <path d="M562 640v-60h-12v-24h12v-60q38-26 76 0v60h12v24h-12v60z" fill="#1a0c0c"/><path d="M570 500q30-20 60 0" fill="none" stroke="#c9a24a" stroke-width="4"/></g>
      <path d="M520 400h160v-14H520z" fill="#c9a24a" opacity=".7"/>
      <g class="qs-flags">${[200, 380, 820, 1000].map((x, i) => `<path d="M${x} 640V150" stroke="#3a2418" stroke-width="7"/><path class="qs-flag" style="animation-delay:${-i * .7}s" d="M${x + 3} 156q34 6 66 -4t60 4v34q-30-8-60 2t-66 2z" fill="${i % 2 ? '#c9a24a' : '#a8322a'}"/>`).join('')}</g>
      ${[470, 730].map((x, i) => `<g transform="translate(${x} 600)"><path d="M-22 40h44l-8-40h-28z" fill="#6b441d"/><circle class="qs-brazier" cy="-30" r="90" fill="url(#g-warm)"/><g transform="translate(0 2) scale(.32)">${tongue(-10, 1, 'ur-fl--a', -i * .4)}${tongue(14, .8, 'ur-fl--b', -i * .4 - .3)}${tongue(0, .6, 'ur-fl--c', -.2)}</g></g>`).join('')}
    </g>
  </g>
  <g data-d="1">
    <path class="qs-floor" d="M-700 1400V640h2600v760z"/>
    <path d="${tiles}" stroke="#000" stroke-width="2" opacity=".18"/>
    <path d="M430 640h340l26 22H404zM404 662h392l26 22H378z" fill="#8a6a4a"/>
    <g class="qs-treasure" transform="translate(860 700)"><ellipse class="qs-tglow" cy="-30" rx="190" ry="110" fill="url(#g-warm)"/>
      ${[[-90, 0], [40, 10], [-20, -46]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-56 0v-52h112v52z" fill="#6b3f1c" stroke="#3a2010" stroke-width="4"/><path d="M-60-52q60-40 120 0z" fill="#8a5428" stroke="#3a2010" stroke-width="4"/><path d="M-56-30h112" stroke="#c9a24a" stroke-width="5"/><g fill="#ffd34a" stroke="#a8741a" stroke-width="2"><ellipse cx="-20" cy="-60" rx="12" ry="5"/><ellipse cx="8" cy="-64" rx="12" ry="5"/><ellipse cx="30" cy="-58" rx="11" ry="5"/></g></g>`).join('')}
      <g class="qs-keys" fill="none" stroke="#e0b44a" stroke-width="7" stroke-linecap="round">${[[-150, -10, -20], [-128, 4, 10], [130, -4, 25], [150, 12, -8]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><circle cy="-34" r="12"/><path d="M0-22v40M0 8h12M0 16h10"/></g>`).join('')}</g></g>
    <g class="qs-found" transform="translate(560 712)"><ellipse cy="-20" rx="150" ry="90" fill="url(#g-warm)"/><path d="M-50 0v-34h100v34z" fill="#8a5a2e" stroke="#3a2010" stroke-width="4"/><path d="M-54-34q54-24 108 0z" fill="#a06a36" stroke="#3a2010" stroke-width="4"/><path d="M-50-16h100" stroke="#c9a24a" stroke-width="4"/><circle cy="-46" r="40" fill="url(#g-white)"/><circle cy="-46" r="5" fill="#fff"/></g>
    <g class="qs-court" fill="url(#g-cold)">${court}</g>
    <g class="qs-musa"><circle cx="1000" cy="690" r="90" fill="url(#g-white)"/><circle cx="1000" cy="690" r="7" fill="#fff"/></g>
    <g class="qs-lights">
      <g class="qs-voice" transform="translate(600 690)" fill="none" stroke="#fff4cf" stroke-width="5" stroke-linecap="round">
        <path style="--d:0s" d="M60-40q30 40 0 80M-60-40q-30 40 0 80"/><path style="--d:1s" d="M60-40q30 40 0 80M-60-40q-30 40 0 80"/><path style="--d:2s" d="M60-40q30 40 0 80M-60-40q-30 40 0 80"/></g>
      <g class="qs-safe" transform="translate(600 690)"><circle r="150" fill="url(#g-warm)" opacity=".5"/><circle class="qs-ring" r="124" fill="none" stroke="#ffd77a" stroke-width="5" stroke-dasharray="20 16"/></g>
      <g class="qs-a"><circle cx="600" cy="690" r="110" fill="url(#g-warm)"/><circle cx="600" cy="690" r="8" fill="#fff"/></g>
    </g>
    <ellipse class="qs-glow" cx="600" cy="640" rx="900" ry="620" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3">
    ${papyrus(-40, 1400, 1000, 130)}${papyrus(1240, 1400, 1000, 130)}
  </g>`;
}

// ——— الردم بين السدّين (ذو القرنين): لا يُرسم أحد؛ ذو القرنين نور دافئ، والقوم أنوار صغيرة، ويأجوج ومأجوج لا يُرسمون (غبار أحمر خلف الفتحة) ———
function sadd() {
  const r = rng(19); let blocks = '', sparks = '', cracks = '', drips = '';
  for (let row = 0; row < 12; row++) { const y = 660 - (row + 1) * 40, off = row % 2 ? 32 : 0;
    for (let x = 440 - off; x < 760; x += 64) { const x0 = Math.max(440, x), x1 = Math.min(760, x + 64);
      blocks += `<rect class="sd-blk" style="--i:${row}" x="${x0 + 2}" y="${y + 2}" width="${x1 - x0 - 4}" height="36" rx="3"/>`; } }
  for (let i = 0; i < 16; i++) sparks += `<circle class="sd-spark" style="--d:${(-r() * 2).toFixed(2)}s;--x:${(r() * 160 - 80).toFixed(0)}px" cx="${(480 + r() * 240).toFixed(0)}" cy="650" r="${(2 + r() * 3).toFixed(1)}"/>`;
  for (let i = 0; i < 18; i++) { const x = -500 + r() * 2200, y = 650 + r() * 300; cracks += `M${x.toFixed(0)} ${y.toFixed(0)}l${(20 + r() * 40).toFixed(0)} ${(r() * 14 - 7).toFixed(0)}l${(14 + r() * 30).toFixed(0)} ${(r() * 20 - 10).toFixed(0)}`; }
  for (const [x, d] of [[470, 0], [530, .7], [590, 1.3], [650, .4], [710, 1]]) drips += `<path class="sd-drip" style="--d:${d}s" d="M${x} 180V660"/>`;
  return `${DEFS}
  <defs><linearGradient id="g-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a4a"/><stop offset=".45" stop-color="#9a3a3a"/><stop offset=".7" stop-color="#f07a3a"/><stop offset="1" stop-color="#ffc070"/></linearGradient>
    <linearGradient id="g-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a6270"/><stop offset="1" stop-color="#2a2e38"/></linearGradient>
    <linearGradient id="g-copper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a4a22"/><stop offset=".5" stop-color="#e8955a"/><stop offset="1" stop-color="#7a3a1a"/></linearGradient>
    <radialGradient id="g-forge"><stop offset="0" stop-color="#fff0b0" stop-opacity=".95"/><stop offset=".35" stop-color="#ff8a30" stop-opacity=".6"/><stop offset="1" stop-color="#c83a10" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-red"><stop offset="0" stop-color="#c84a2a" stop-opacity=".55"/><stop offset="1" stop-color="#6a1a10" stop-opacity="0"/></radialGradient></defs>
  <g data-d=".08">
    <rect ${BIG} fill="url(#g-night)"/>
    <rect class="sd-dawn" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dawn)"/>
    <rect class="sd-dusk" x="-700" y="-300" width="2600" height="1200" fill="url(#g-dusk)"/>
    ${stars(100, 23, [-400, 1600], [-300, 460])}
    <path class="sd-moon" d="M250 80a44 44 0 1 0 40 68 36 36 0 0 1-40-68z" fill="#ffe9a8"/>
    <g class="sd-sun"><circle cx="600" cy="0" r="380" fill="url(#g-warm)"/><circle class="sd-disc" cx="600" cy="0" r="74" fill="#fff4cf"/></g>
  </g>
  <g data-d=".3">
    <path class="sd-far" d="M-700 600q300-12 640-4t620 2 640-6 700 8v800H-700z"/>
    <g class="sd-pool"><ellipse cx="600" cy="606" rx="300" ry="26" fill="#1a120c"/><ellipse cx="600" cy="604" rx="230" ry="14" fill="#3a2414"/>
      <ellipse class="sd-poolsun" cx="600" cy="604" rx="120" ry="9" fill="#ff9a50"/><path d="M340 610q60-8 120 2M700 612q70-10 150 0" stroke="#5a3a1e" stroke-width="4" fill="none"/></g>
    <g class="sd-threat"><ellipse cx="600" cy="400" rx="260" ry="320" fill="url(#g-red)"/><g fill="#a84a2a" opacity=".55">${[[560, 520, 40], [640, 460, 54], [590, 380, 46], [650, 300, 36], [570, 250, 30]].map(([x, y, q], i) => `<circle class="sd-dust" style="--d:${-i * 1.3}s" cx="${x}" cy="${y}" r="${q}"/>`).join('')}</g></g>
  </g>
  <g data-d=".6">
    <g class="sd-mts">
      <path class="sd-mt" d="M-700 1400V560Q-520 430-360 400T-90 250Q60 150 210 100T400 120L440 168V660z"/>
      <path class="sd-mt" d="M1900 1400V540Q1720 420 1560 390T1280 240Q1130 130 980 84T800 112L760 160V660z"/>
      <path class="sd-mt2" d="M-700 1400V700Q-480 600-300 590T40 470Q200 400 340 420T440 470V660z"/>
      <path class="sd-mt2" d="M1900 1400V690Q1680 590 1500 580T1160 460Q1000 390 860 410T760 460V660z"/>
      <path class="sd-mtlit" d="M210 100Q330 64 400 120L440 168V320Q400 210 350 175T210 100zM980 84Q870 56 800 112L760 160V300Q800 200 850 160T980 84z"/>
      <path class="sd-ridge" d="M-700 560Q-520 430-360 400T-90 250Q60 150 210 100T400 120L440 168M1900 540Q1720 420 1560 390T1280 240Q1130 130 980 84T800 112L760 160" fill="none" stroke-width="4" stroke-linecap="round"/>
      <path class="sd-face" d="M440 168l-22 60 10 90-16 110 12 110-10 122h26zM760 160l20 70-12 100 16 110-14 110 12 110h-22z"/>
      <path d="M-300 520q120-30 240-90M60 330q90-50 200-60M1500 500q-120-30-240-90M1140 320q-90-50-200-60M300 300q60 0 120 40M900 290q-60 0-120 40" fill="none" stroke="#000" stroke-width="5" opacity=".18" stroke-linecap="round"/>
    </g>
    <g class="sd-wall">
      <g class="sd-blocks" fill="url(#g-iron)" stroke="#1a1c22" stroke-width="2">${blocks}</g>
      <rect class="sd-heat" x="440" y="180" width="320" height="480" fill="#ff6a20"/>
      <g class="sd-qitr" stroke="url(#g-copper)" stroke-width="16" stroke-linecap="round" fill="none">${drips}</g>
      <rect class="sd-copper" x="440" y="180" width="320" height="480" fill="url(#g-copper)"/>
      <path class="sd-sheen" d="M450 640l70-460h40l-70 460z" fill="#fff4cf"/>
    </g>
  </g>
  <g data-d="1">
    <path class="sd-ground" d="M-700 1400V650q320-20 660-6t640-4 660 6 640-10v764z"/>
    <path class="sd-bare" d="${cracks}" fill="none" stroke-width="3" stroke-linecap="round"/>
    <g class="sd-forge"><ellipse cx="600" cy="660" rx="260" ry="120" fill="url(#g-forge)"/><g fill="#ffd77a">${sparks}</g></g>
    <g class="sd-flock" fill="url(#g-warm)">${[[260, 690, 30], [320, 712, 26], [210, 716, 24], [370, 694, 24], [150, 700, 22], [300, 740, 22]].map(([x, y, q]) => `<circle cx="${x}" cy="${y}" r="${q}"/>`).join('')}</g>
    <g class="sd-lights"><g class="sd-a"><circle cx="800" cy="700" r="115" fill="url(#g-warm)"/><circle cx="800" cy="700" r="8" fill="#fff"/></g></g>
    <ellipse class="sd-glow" cx="600" cy="600" rx="900" ry="620" fill="url(#g-warm)"/>
  </g>
  <g data-d="1.3"><path class="sd-front" d="M-700 1400V920l230-60 120 50 100 490zM1900 1400V900l-220-40-140 60-80 480z"/></g>`;
}

export const SETS = { mountain, cave, mosque, sea, deep, garden, dunes, hijr, ur, land, mihrab, dar, haram, qasr, sadd };
