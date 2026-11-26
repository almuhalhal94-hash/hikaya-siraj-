// رسوم الشهود الكرتونية: كل رسمة viewBox 200×200. skin لون الجفن، ink لون الحاجب والخطوط.
// noface: الأشياء المعظَّمة (المصحف والصحف والحجر الأسود وستر الكعبة والمسجد والمحراب) لا يُرسم لها وجه؛
// يتوهّج نورها مع الصوت بدل الفم.

// عينان بجفنين وحاجبين
export const eyes = (cx1, cx2, cy, r = 15) => `
  <g class="wt-eyes">
    ${[cx1, cx2].map((cx, i) => `
    <g class="wt-eye wt-eye--${i ? 'b' : 'a'}" style="transform-origin:${cx}px ${cy}px">
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.12}" fill="#fffaf0"/>
      <g class="wt-pupil"><circle cx="${cx}" cy="${cy + 2}" r="${r * 0.55}" fill="#2a1a10"/>
        <circle cx="${cx + r * 0.22}" cy="${cy - r * 0.18}" r="${r * 0.2}" fill="#fff"/></g>
      <rect class="wt-lid" x="${cx - r - 2}" y="${cy - r * 1.3}" width="${r * 2 + 4}" height="${r * 2.6}" style="fill:var(--wt-skin)"/>
    </g>
    <path class="wt-happy" d="M${cx - r} ${cy + 4} q${r} -${r * 1.5} ${r * 2} 0" fill="none" style="stroke:var(--wt-ink)" stroke-width="${Math.max(4, r * 0.4)}" stroke-linecap="round"/>
    <path class="wt-brow wt-brow--${i ? 'b' : 'a'}" d="M${cx - r} ${cy - r * 1.55} q${r} -${r * 0.45} ${r * 2} 0" fill="none" style="stroke:var(--wt-ink)" stroke-width="${Math.max(3.5, r * 0.33)}" stroke-linecap="round"/>`).join('')}
  </g>`;

// فم كرتوني يُفتح من وسطه
const mouth = (cx, cy, w = 30, h = 22) => (w *= 1.3, h *= 1.3, `
  <g class="wt-mouth wt-c">
    <ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="#3b1612" style="stroke:var(--wt-ink)" stroke-width="3.5"/>
    <ellipse cx="${cx}" cy="${cy + h * 0.24}" rx="${w * 0.27}" ry="${h * 0.19}" fill="#e9776a"/>
  </g>`);

const cheeks = (x1, x2, y, c = '#ef8f78') =>
  `<ellipse class="wt-cheek" cx="${x1}" cy="${y}" rx="11" ry="6" fill="${c}" opacity=".42"/><ellipse class="wt-cheek" cx="${x2}" cy="${y}" rx="11" ry="6" fill="${c}" opacity=".42"/>`;

const lg = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

// نور ينبض مع الصوت (للأشياء المعظَّمة)
const halo = (cx, cy, r, c = '#ffe3a0') => `
  <defs><radialGradient id="wtHalo"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset=".45" stop-color="${c}" stop-opacity=".45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>
  <g class="wt-mouth wt-halo"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#wtHalo)"/></g>`;

// فم الكهف/الباب: فتحة مظلمة يتوهّج داخلها
const doorMouth = (d, gx, gy) => `
  <g class="wt-mouth">
    <path d="${d}" fill="url(#wtDoor)" style="stroke:var(--wt-ink)" stroke-width="4" stroke-linejoin="round"/>
    <ellipse class="wt-glow" cx="${gx}" cy="${gy}" rx="12" ry="5" fill="#ffe3a0"/>
  </g>`;
const doorGrad = `<radialGradient id="wtDoor" cx="50%" cy="70%" r="75%"><stop offset="0" stop-color="#ffcf73"/><stop offset=".3" stop-color="#b8692a"/><stop offset=".75" stop-color="#3a2212"/><stop offset="1" stop-color="#1a0f08"/></radialGradient>`;

const mountain = (a, b, c, d) => `
  <defs>${lg('wtM1', a, b, 1, 1)}${lg('wtM2', c, d, 1, 1)}</defs>
  <path d="M6 190 L44 98 L70 106 L102 24 L136 86 L156 76 L194 190 Z" fill="url(#wtM2)"/>
  <path d="M6 190 L44 98 L70 106 L102 24 L112 70 L96 120 L104 190 Z" fill="url(#wtM1)"/>
  <path d="M102 24 L90 52 L100 50 L94 70" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>`;

export const ART = {
  cave: {
    skin: '#a9855f', ink: '#4a3424',
    svg: `<defs>${doorGrad}</defs>
      <g class="wt-body">${mountain('#d9b58a', '#a9855f', '#8d6b4b', '#5e4632')}
        <path d="M30 168 l16 -6 M160 150 l14 8 M140 104 l10 8 M58 132 l-10 6" stroke="#4a3424" stroke-width="3.5" stroke-linecap="round" opacity=".45"/>
        ${cheeks(58, 146, 146)}${eyes(80, 120, 108, 15)}
        ${doorMouth('M76 178 C76 150 86 140 101 140 C116 140 126 150 126 178 Z', 101, 172)}
      </g>`
  },
  earth: {
    skin: '#8a5a33', ink: '#3e2814',
    svg: `<defs>${lg('wtE', '#b07a48', '#6b4426')}</defs><g class="wt-body">
      <path d="M12 188 C12 98 54 50 100 50 C146 50 188 98 188 188 Z" fill="url(#wtE)"/>
      <path d="M26 112 C48 62 152 62 174 112 C154 98 136 104 118 96 C100 106 76 94 26 112 Z" fill="#6fae4f"/>
      <path d="M100 52 C96 34 84 28 74 30 C80 42 90 48 100 52 C104 34 116 26 128 28 C122 42 110 50 100 52" fill="#8fd06a" stroke="#4f8a36" stroke-width="2"/>
      <circle cx="46" cy="160" r="4" fill="#4e3018"/><circle cx="154" cy="166" r="5" fill="#4e3018"/><circle cx="130" cy="178" r="3" fill="#4e3018"/>
      ${cheeks(60, 140, 146)}${eyes(78, 122, 124, 15)}${mouth(100, 160, 30, 20)}</g>`
  },
  ark: {
    skin: '#8d5a2e', ink: '#3e230e',
    svg: `<defs>${lg('wtW', '#b97b44', '#6b4223')}</defs><g class="wt-body">
      <rect x="64" y="52" width="72" height="48" rx="6" fill="#c99257" stroke="#5a3519" stroke-width="3"/>
      <path d="M54 56 L100 28 L146 56 Z" fill="#7a4a28" stroke="#5a3519" stroke-width="3" stroke-linejoin="round"/>
      <rect x="92" y="70" width="16" height="16" rx="3" fill="#ffd77a" opacity=".85"/>
      <path d="M8 96 L192 96 L170 170 Q100 188 30 170 Z" fill="url(#wtW)" stroke="#5a3519" stroke-width="3" stroke-linejoin="round"/>
      <path d="M16 116 L184 116 M24 140 L176 140" stroke="#5a3519" stroke-width="2.5" opacity=".5"/>
      <path d="M0 176 q16 -10 32 0 t32 0 t32 0 t32 0 t32 0 t40 0 V200 H0Z" fill="#3f86c4" opacity=".9"/>
      ${cheeks(56, 144, 146)}${eyes(76, 124, 124, 14)}${mouth(100, 152, 28, 18)}</g>`
  },
  wind: {
    skin: '#a9b8cf', ink: '#3c4a66',
    svg: `<defs>${lg('wtC', '#eef3fb', '#a9b8cf')}</defs><g class="wt-body">
      <g fill="url(#wtC)"><circle cx="64" cy="112" r="44"/><circle cx="108" cy="84" r="52"/><circle cx="148" cy="118" r="40"/><rect x="40" y="110" width="128" height="52" rx="26"/></g>
      <path d="M14 168 q40 -14 80 0 t80 0 M30 186 q30 -10 60 0 t60 0" fill="none" stroke="#dfe8f6" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      <path d="M168 60 q20 -8 24 8 q2 12 -12 10" fill="none" stroke="#dfe8f6" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      ${cheeks(62, 146, 132, '#b5c4e6')}${eyes(82, 124, 108, 14)}${mouth(104, 140, 20, 20)}</g>`
  },
  hijr: {
    skin: '#c48466', ink: '#5a2d1c',
    svg: `<defs>${lg('wtH', '#e3a688', '#a35d40')}${doorGrad}</defs><g class="wt-body">
      <path d="M10 190 L22 60 Q30 40 60 38 L140 38 Q170 40 178 60 L190 190 Z" fill="url(#wtH)"/>
      <path d="M40 60 H160 M46 74 H154" stroke="#7a3c26" stroke-width="3" opacity=".5"/>
      <rect x="62" y="122" width="10" height="56" fill="#b56b4c"/><rect x="128" y="122" width="10" height="56" fill="#b56b4c"/>
      ${cheeks(52, 148, 130)}${eyes(78, 122, 104, 15)}
      ${doorMouth('M80 182 L80 150 Q100 132 120 150 L120 182 Z', 100, 176)}</g>`
  },
  fire: {
    skin: '#ff9a3c', ink: '#8a2a10',
    svg: `<defs><linearGradient id="wtF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d8401c"/><stop offset=".55" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ffd36b"/></linearGradient></defs><g class="wt-body">
      <path d="M100 10 C124 48 162 70 162 124 C162 164 134 190 100 190 C66 190 38 164 38 124 C38 92 58 76 68 52 C74 76 84 82 92 84 C88 58 94 34 100 10 Z" fill="url(#wtF)"/>
      <path d="M100 96 C114 118 130 130 128 152 C126 172 114 184 100 184 C86 184 74 172 72 152 C70 132 88 120 100 96 Z" fill="#ffe08a" opacity=".55"/>
      ${cheeks(62, 138, 146, '#ff5a3a')}${eyes(80, 120, 122, 14)}${mouth(100, 156, 26, 18)}</g>`
  },
  dawn: {
    skin: '#ffb26b', ink: '#7a3b1c',
    svg: `<defs>${lg('wtS', '#ffe29a', '#ff9e5e')}</defs><g class="wt-body">
      <g stroke="#ffd98a" stroke-width="6" stroke-linecap="round" opacity=".75"><path d="M100 18 V36 M38 46 L50 58 M162 46 L150 58 M14 106 H32 M168 106 H186"/></g>
      <circle cx="100" cy="128" r="72" fill="url(#wtS)"/>
      <path d="M0 160 Q50 146 100 156 T200 152 V200 H0Z" fill="#4a3566"/>
      <path d="M0 176 Q60 166 120 178 T200 174 V200 H0Z" fill="#2e2147"/>
      ${cheeks(62, 138, 126)}${eyes(80, 120, 104, 14)}${mouth(100, 136, 24, 16)}</g>`
  },
  valley: {
    skin: '#c9a06a', ink: '#5a3b1c',
    svg: `<defs>${lg('wtV', '#e6c48e', '#a77b45')}</defs><g class="wt-body">
      <path d="M6 190 L6 118 C26 64 72 62 92 108 C102 128 112 128 122 108 C142 66 182 70 194 120 L194 190 Z" fill="url(#wtV)"/>
      <path d="M30 76 l0 -26 M30 50 c-10 -6 -20 -2 -24 4 M30 50 c10 -6 20 -2 24 4 M30 50 c-6 -10 -2 -18 4 -20" stroke="#5f8a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${cheeks(56, 144, 160)}${eyes(76, 124, 146, 14)}${mouth(100, 172, 24, 14)}</g>`
  },
  shirt: {
    skin: '#e6d6b2', ink: '#6a5330',
    svg: `<defs>${lg('wtSh', '#fbf3e0', '#d9c59a')}</defs><g class="wt-body">
      <path d="M58 28 L84 20 Q100 36 116 20 L142 28 L180 64 L160 90 L144 78 L144 188 L56 188 L56 78 L40 90 L20 64 Z" fill="url(#wtSh)" stroke="#a88a55" stroke-width="3" stroke-linejoin="round"/>
      <path d="M84 20 Q100 44 116 20" fill="none" stroke="#a88a55" stroke-width="3"/>
      <path d="M56 172 H144" stroke="#c8963d" stroke-width="6"/><path d="M56 162 H144" stroke="#2f7a8a" stroke-width="3" opacity=".7"/>
      ${cheeks(70, 130, 136)}${eyes(82, 118, 112, 13)}${mouth(100, 146, 22, 16)}</g>`
  },
  spring: {
    skin: '#5fb6e6', ink: '#16507a',
    svg: `<defs>${lg('wtD', '#b8ecff', '#2b8ccf')}</defs><g class="wt-body">
      <path d="M100 12 C126 58 164 94 164 132 C164 168 136 190 100 190 C64 190 36 168 36 132 C36 94 74 58 100 12 Z" fill="url(#wtD)"/>
      <path d="M68 102 C62 118 60 132 64 146" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55" fill="none"/>
      ${cheeks(64, 136, 150, '#ff9fb0')}${eyes(80, 120, 126, 14)}${mouth(100, 160, 24, 16)}</g>`
  },
  scale: {
    skin: '#c99a3e', ink: '#5a4012',
    svg: `<defs>${lg('wtB', '#f3d27a', '#b07f2a')}</defs><g class="wt-body">
      <rect x="94" y="110" width="12" height="62" fill="#9c7228"/><path d="M60 186 Q100 166 140 186 Z" fill="#9c7228"/>
      <path d="M18 46 H182" stroke="#b07f2a" stroke-width="7" stroke-linecap="round"/>
      <path d="M30 46 L14 102 M30 46 L46 102 M170 46 L154 102 M170 46 L186 102" stroke="#8a6a2a" stroke-width="2"/>
      <path d="M8 102 Q30 122 52 102 Z M148 102 Q170 122 192 102 Z" fill="url(#wtB)" stroke="#8a6a2a" stroke-width="2"/>
      <circle cx="100" cy="94" r="44" fill="url(#wtB)" stroke="#8a6a2a" stroke-width="3"/>
      ${cheeks(74, 126, 110)}${eyes(84, 116, 88, 11)}${mouth(100, 116, 20, 14)}</g>`
  },
  staff: {
    skin: '#9b6a3a', ink: '#4a2c12',
    svg: `<defs>${lg('wtSt', '#c08a52', '#7a4c24', 1, 0)}</defs><g class="wt-body">
      <path d="M72 190 L72 60 Q72 22 108 20 Q140 20 140 50 Q140 64 128 64 L128 190 Z" fill="url(#wtSt)" stroke="#5a3519" stroke-width="3" stroke-linejoin="round"/>
      <path d="M84 150 q10 -6 4 -16 M112 170 q-8 -6 0 -14 M116 130 q-6 -4 -2 -10" stroke="#5a3519" stroke-width="2.5" fill="none" opacity=".55"/>
      ${cheeks(80, 122, 104, '#e98a6a')}${eyes(88, 114, 82, 11)}${mouth(100, 110, 18, 13)}</g>`
  },
  iron: {
    skin: '#7d8794', ink: '#2a3038',
    svg: `<defs>${lg('wtI', '#cfd6df', '#5d6774')}</defs><g class="wt-body">
      <path d="M34 72 L166 72 L186 180 L14 180 Z" fill="url(#wtI)" stroke="#3a424c" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 72 L166 72 L156 88 L44 88 Z" fill="#e6ebf1" opacity=".7"/>
      <path d="M14 180 L186 180" stroke="#ff8a3a" stroke-width="5" opacity=".75"/>
      <circle cx="40" cy="166" r="4" fill="#3a424c"/><circle cx="160" cy="166" r="4" fill="#3a424c"/>
      <g fill="#ffd27a"><circle cx="30" cy="48" r="3"/><circle cx="172" cy="40" r="2.5"/><circle cx="150" cy="56" r="2"/></g>
      ${cheeks(58, 142, 140, '#e7a08a')}${eyes(80, 120, 118, 14)}${mouth(100, 150, 26, 16)}</g>`
  },
  hoopoe: {
    skin: '#d79a5a', ink: '#4a2a10',
    svg: `<defs>${lg('wtHp', '#f0bd80', '#c98446')}</defs><g class="wt-body">
      <g stroke="#3a2210" stroke-width="2"><path d="M100 50 L74 10 L84 8 Z" fill="#e4a25e"/><path d="M100 50 L92 4 L102 4 Z" fill="#e4a25e"/><path d="M100 50 L112 6 L122 10 Z" fill="#e4a25e"/><path d="M100 50 L130 16 L138 22 Z" fill="#e4a25e"/></g>
      <g fill="#2a1a10"><circle cx="78" cy="11" r="4"/><circle cx="97" cy="5" r="4"/><circle cx="117" cy="8" r="4"/><circle cx="134" cy="19" r="4"/></g>
      <ellipse cx="100" cy="146" rx="64" ry="44" fill="url(#wtHp)"/>
      <path d="M40 140 Q60 120 82 150 Q60 170 40 140Z M160 140 Q140 120 118 150 Q140 170 160 140Z" fill="#2a1a10"/>
      <path d="M48 140 L76 148 M152 140 L124 148" stroke="#fff" stroke-width="4"/>
      <circle cx="100" cy="86" r="40" fill="url(#wtHp)"/>
      <path d="M96 100 L30 112 L98 108 Z" fill="#3a2a20"/>
      ${cheeks(76, 124, 98)}${eyes(86, 114, 80, 10)}${mouth(102, 106, 12, 10)}</g>`
  },
  whale: {
    skin: '#3f7fb8', ink: '#163a5e',
    svg: `<defs>${lg('wtWh', '#6cb6e6', '#2a5f99')}</defs><g class="wt-body">
      <path d="M180 120 L198 92 L196 136 Z" fill="#2a5f99"/>
      <path d="M12 122 C12 72 66 46 118 50 C162 54 188 88 188 122 C188 160 150 182 100 182 C50 182 12 160 12 122 Z" fill="url(#wtWh)"/>
      <path d="M40 154 Q100 186 162 154 Q130 174 100 174 Q66 174 40 154 Z" fill="#cfeaf8" opacity=".8"/>
      <path d="M96 48 C92 32 80 24 72 28 M100 48 C104 30 118 22 126 26 M98 46 V24" stroke="#bfe6ff" stroke-width="5" stroke-linecap="round" fill="none"/>
      ${cheeks(58, 142, 128, '#ff9fb0')}${eyes(76, 124, 106, 14)}${mouth(100, 142, 44, 16)}</g>`
  },
  mihrab: {
    skin: '#c9b28a', ink: '#5a4426', noface: true,
    svg: `<defs>${lg('wtMh', '#ead8b0', '#bfa27a')}</defs><g class="wt-body">
      <path d="M26 190 L26 80 Q26 20 100 20 Q174 20 174 80 L174 190 Z" fill="url(#wtMh)" stroke="#8a6a44" stroke-width="3"/>
      <path d="M50 190 L50 88 Q50 44 100 44 Q150 44 150 88 L150 190 Z" fill="#5b4330"/>
      ${halo(100, 112, 56)}
      <path d="M100 44 V82" stroke="#c8963d" stroke-width="2"/>
      <path d="M88 82 H112 L106 112 H94 Z" fill="#e8b84a" stroke="#8a6a2a" stroke-width="2"/><circle cx="100" cy="102" r="6" fill="#fff4c2"/></g>`
  },
  cradle: {
    skin: '#b07a46', ink: '#4a2c12',
    svg: `<defs>${lg('wtCr', '#d39a5e', '#8a5a2e')}</defs><g class="wt-body">
      <path d="M20 182 Q100 206 180 182" fill="none" stroke="#6b4223" stroke-width="8" stroke-linecap="round"/>
      <path d="M130 100 Q140 44 184 60 L184 100 Z" fill="#e9dcc0" stroke="#a88a55" stroke-width="3"/>
      <path d="M16 96 L184 96 Q180 162 100 168 Q20 162 16 96 Z" fill="url(#wtCr)" stroke="#5a3519" stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 96 Q100 80 180 96" fill="#f4ecdc" stroke="#a88a55" stroke-width="3"/>
      ${cheeks(58, 142, 138)}${eyes(78, 122, 120, 13)}${mouth(100, 146, 22, 14)}</g>`
  },
  trunk: {
    skin: '#9a6b3e', ink: '#43280f',
    svg: `<defs>${lg('wtT', '#b88550', '#7a4e28', 1, 0)}<pattern id="wtTp" width="20" height="16" patternUnits="userSpaceOnUse"><path d="M0 16 L10 0 L20 16" fill="none" stroke="#5a3519" stroke-width="2.5" opacity=".55"/></pattern></defs><g class="wt-body">
      <path d="M100 40 C80 22 52 22 36 34 C56 34 76 40 92 48 M100 40 C120 20 150 22 166 36 C146 34 124 40 108 48" fill="#6f9a3e" stroke="#4f7a2a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M58 190 L62 44 Q100 34 138 44 L142 190 Z" fill="url(#wtT)"/><path d="M58 190 L62 44 Q100 34 138 44 L142 190 Z" fill="url(#wtTp)"/>
      <path d="M44 190 Q100 176 156 190" fill="#6b4223"/>
      ${cheeks(72, 128, 120)}${eyes(82, 118, 96, 13)}${mouth(100, 132, 22, 16)}</g>`
  },
  mosque: {
    skin: '#d6b98c', ink: '#5a4426', noface: true,
    svg: `<defs>${lg('wtMq', '#e8cfa2', '#b8946a')}</defs><g class="wt-body">
      <path d="M14 70 L186 70 L176 84 L24 84 Z" fill="#7a9a46" stroke="#4f6a2a" stroke-width="2"/>
      <path d="M22 70 l8 -10 M40 70 l8 -10 M58 70 l8 -10 M76 70 l8 -10 M94 70 l8 -10 M112 70 l8 -10 M130 70 l8 -10 M148 70 l8 -10 M166 70 l8 -10" stroke="#5f8a36" stroke-width="3"/>
      <rect x="26" y="84" width="148" height="104" fill="url(#wtMq)" stroke="#8a6a44" stroke-width="3"/>
      <path d="M78 188 L78 138 Q100 116 122 138 L122 188 Z" fill="#5b4330"/>
      ${halo(100, 150, 50)}
      <rect x="44" y="110" width="18" height="22" rx="9" fill="#ffd77a" opacity=".8"/><rect x="138" y="110" width="18" height="22" rx="9" fill="#ffd77a" opacity=".8"/></g>`
  },
  blackstone: {
    skin: '#9aa3ad', ink: '#3a424c', noface: true,
    svg: `<defs>${lg('wtSv', '#eef2f6', '#9aa3ad')}<radialGradient id="wtBs" cx="40%" cy="35%"><stop offset="0" stop-color="#4a4048"/><stop offset="1" stop-color="#120c10"/></radialGradient></defs><g class="wt-body">
      ${halo(100, 104, 92)}
      <ellipse cx="100" cy="104" rx="70" ry="80" fill="url(#wtSv)" stroke="#6b737c" stroke-width="3"/>
      <ellipse cx="100" cy="104" rx="46" ry="54" fill="url(#wtBs)"/>
      <path d="M78 84 q8 -6 14 0 M104 110 q8 -4 12 4 M84 128 q6 -4 12 2" stroke="#6a5a66" stroke-width="2" fill="none"/></g>`
  },
  well: {
    skin: '#a89a86', ink: '#3e352a',
    svg: `<defs>${lg('wtWl', '#cfc3b0', '#8a7d6a')}</defs><g class="wt-body">
      <path d="M40 104 V28 M160 104 V28 M32 28 H168" stroke="#7a4e28" stroke-width="7" stroke-linecap="round"/>
      <path d="M100 28 V64" stroke="#5a3519" stroke-width="2"/><path d="M88 64 H112 L108 84 H92 Z" fill="#8a5a2e"/>
      <rect x="26" y="100" width="148" height="88" rx="8" fill="url(#wtWl)" stroke="#5e5446" stroke-width="3"/>
      <ellipse cx="100" cy="100" rx="74" ry="12" fill="#3a4e5e" stroke="#5e5446" stroke-width="3"/>
      <path d="M26 128 H174 M26 158 H174 M60 100 V128 M120 100 V128 M90 128 V158 M150 128 V158 M50 158 V188 M120 158 V188" stroke="#5e5446" stroke-width="2" opacity=".45"/>
      ${cheeks(54, 146, 156)}${eyes(76, 124, 134, 13)}${mouth(100, 166, 24, 14)}</g>`
  },
  banner: {
    skin: '#e9e4d8', ink: '#4a4436',
    svg: `<g class="wt-body">
      <path d="M36 16 V194" stroke="#7a4e28" stroke-width="8" stroke-linecap="round"/><circle cx="36" cy="14" r="7" fill="#e3b04a"/>
      <path d="M40 24 Q90 10 130 28 T190 28 L186 120 Q150 104 110 122 T40 118 Z" fill="#fbf8f0" stroke="#c9c0ad" stroke-width="3" stroke-linejoin="round"/>
      <path d="M60 40 Q90 32 120 44" stroke="#e3ddd0" stroke-width="5" fill="none"/>
      ${cheeks(88, 152, 88)}${eyes(100, 140, 66, 11)}${mouth(120, 94, 20, 12)}</g>`
  },
  uhud: {
    skin: '#b5604a', ink: '#4e1f14',
    svg: `<g class="wt-body">${mountain('#df8a6c', '#b5604a', '#94442f', '#5e2a1c')}
      <path d="M30 168 l16 -6 M160 150 l14 8 M140 104 l10 8" stroke="#4e1f14" stroke-width="3.5" stroke-linecap="round" opacity=".45"/>
      ${cheeks(60, 144, 142)}${eyes(82, 120, 114, 14)}${mouth(101, 150, 26, 18)}</g>`
  },
  trench: {
    skin: '#9a7048', ink: '#3e2814',
    svg: `<defs>${lg('wtTr', '#c39a68', '#7a5432')}</defs><g class="wt-body">
      <path d="M6 172 C18 104 60 74 100 74 C140 74 182 104 194 172 Z" fill="url(#wtTr)"/>
      <path d="M0 168 H200 V200 H0 Z" fill="#3a2614"/><path d="M0 168 H200" stroke="#a77b4a" stroke-width="4"/>
      <path d="M150 40 L170 118" stroke="#7a4e28" stroke-width="6" stroke-linecap="round"/><path d="M162 112 l16 -4 l6 22 l-16 6 Z" fill="#9aa3ad" stroke="#5d6774" stroke-width="2"/>
      ${cheeks(58, 140, 140)}${eyes(78, 120, 120, 14)}${mouth(99, 150, 24, 14)}</g>`
  },
  bow: {
    skin: '#9b6a3a', ink: '#4a2c12',
    svg: `<g class="wt-body">
      <path d="M56 14 Q182 100 56 186" fill="none" stroke="#8a5a2e" stroke-width="14" stroke-linecap="round"/>
      <path d="M56 14 Q182 100 56 186" fill="none" stroke="#c08a52" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M56 16 L56 184" stroke="#efe6d2" stroke-width="2.5"/>
      <path d="M10 100 H180" stroke="#7a4e28" stroke-width="4"/><path d="M180 100 l-14 -8 v16 Z" fill="#9aa3ad"/><path d="M10 100 l-6 -8 h10 l6 8 l-6 8 h-10 Z" fill="#e9e4d8"/>
      <circle cx="122" cy="100" r="40" fill="#a3683a" stroke="#5a3519" stroke-width="3"/>
      <path d="M86 84 H158 M84 116 H160" stroke="#5a3519" stroke-width="2" opacity=".45"/>
      ${cheeks(102, 142, 108)}${eyes(108, 136, 92, 10)}${mouth(122, 116, 16, 11)}</g>`
  },
  shore: {
    skin: '#e3c48e', ink: '#6a4a1c',
    svg: `<defs>${lg('wtSa', '#f6dfaa', '#d4ac6c')}</defs><g class="wt-body">
      <path d="M0 176 C20 96 70 62 120 64 C162 66 192 100 200 140 L200 200 H0 Z" fill="url(#wtSa)"/>
      <path d="M0 160 Q24 146 46 160 T94 162 T140 168 V200 H0 Z" fill="#3f9ad0" opacity=".85"/>
      <path d="M0 156 Q24 142 46 156 T94 158" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>
      <path d="M150 156 q8 -12 16 0 q-8 6 -16 0" fill="#f2b6a0" stroke="#c97a62" stroke-width="2"/>
      ${cheeks(84, 164, 136)}${eyes(104, 144, 112, 13)}${mouth(124, 142, 22, 14)}</g>`
  },
  sandals: {
    skin: '#9b6a3e', ink: '#43280f',
    svg: `<g class="wt-body">
      <rect x="28" y="36" width="70" height="150" rx="35" fill="#6f4624" stroke="#43280f" stroke-width="3" transform="rotate(-10 63 111)"/>
      <path d="M40 70 Q62 54 86 66" stroke="#c8963d" stroke-width="8" fill="none" stroke-linecap="round" transform="rotate(-10 63 111)"/>
      <rect x="76" y="22" width="84" height="168" rx="42" fill="#9b6a3e" stroke="#43280f" stroke-width="3"/>
      <rect x="84" y="30" width="68" height="152" rx="34" fill="#b88550"/>
      <path d="M84 132 Q118 112 152 132" stroke="#c8963d" stroke-width="10" fill="none" stroke-linecap="round"/>
      ${cheeks(98, 138, 100)}${eyes(104, 132, 76, 11)}${mouth(118, 104, 20, 13)}</g>`
  },
  burda: {
    skin: '#d8c39a', ink: '#5a3b1c',
    svg: `<defs><pattern id="wtBr" width="22" height="10" patternUnits="userSpaceOnUse"><rect width="22" height="10" fill="#e8d6ae"/><rect width="7" height="10" fill="#8a5a3a" opacity=".55"/></pattern></defs><g class="wt-body">
      <path d="M40 34 Q100 14 160 34 L180 188 Q100 176 20 188 Z" fill="url(#wtBr)" stroke="#8a6a44" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 34 Q100 52 160 34" fill="none" stroke="#8a6a44" stroke-width="3"/>
      <path d="M62 60 Q56 120 50 186 M138 60 Q144 120 150 186" stroke="#8a6a44" stroke-width="2" opacity=".35" fill="none"/>
      ${cheeks(66, 134, 116)}${eyes(80, 120, 94, 13)}${mouth(100, 128, 22, 15)}</g>`
  },
  pleiades: {
    skin: '#f0c64a', ink: '#7a5a10',
    svg: `<defs>${lg('wtSr', '#fff2b0', '#f0b43a')}</defs><g class="wt-body">
      <g fill="#fff4c2"><circle cx="24" cy="30" r="5"/><circle cx="176" cy="24" r="4"/><circle cx="186" cy="70" r="3"/><circle cx="16" cy="96" r="3.5"/><circle cx="34" cy="176" r="4"/><circle cx="172" cy="170" r="5"/></g>
      <path d="M100 14 L124 74 L188 78 L138 118 L156 182 L100 146 L44 182 L62 118 L12 78 L76 74 Z" fill="url(#wtSr)" stroke="#c8902a" stroke-width="3" stroke-linejoin="round"/>
      ${cheeks(76, 124, 120)}${eyes(84, 116, 100, 12)}${mouth(100, 128, 20, 14)}</g>`
  },
  door: {
    skin: '#8a5a2e', ink: '#3e230e',
    svg: `<defs>${lg('wtDr', '#b07a46', '#6b4223', 1, 0)}</defs><g class="wt-body">
      <path d="M24 192 L24 70 Q24 14 100 14 Q176 14 176 70 L176 192 Z" fill="#c9a172"/>
      <path d="M38 192 L38 74 Q38 28 100 28 Q162 28 162 74 L162 192 Z" fill="url(#wtDr)" stroke="#43280f" stroke-width="3"/>
      <path d="M70 34 V192 M100 28 V192 M130 34 V192" stroke="#4e2e14" stroke-width="2.5" opacity=".5"/>
      <circle cx="100" cy="150" r="10" fill="none" stroke="#e3b04a" stroke-width="4"/>
      ${cheeks(64, 136, 104)}${eyes(80, 120, 84, 13)}${mouth(100, 116, 22, 14)}</g>`
  },
  suffa: {
    skin: '#c9a172', ink: '#5a3b1c',
    svg: `<defs>${lg('wtSf', '#dcbb8a', '#a77b4a')}</defs><g class="wt-body">
      <rect x="28" y="70" width="144" height="118" fill="url(#wtSf)" stroke="#8a6a44" stroke-width="3"/>
      <path d="M8 76 L192 76 L180 50 L20 50 Z" fill="#7a9a46" stroke="#4f6a2a" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 50 l10 26 M52 50 l10 26 M76 50 l10 26 M100 50 l10 26 M124 50 l10 26 M148 50 l10 26" stroke="#4f7a2a" stroke-width="3"/>
      <rect x="20" y="76" width="10" height="112" fill="#7a4e28"/><rect x="170" y="76" width="10" height="112" fill="#7a4e28"/>
      ${cheeks(60, 140, 140)}${eyes(80, 120, 118, 14)}${mouth(100, 152, 24, 15)}</g>`
  },
  sword: {
    skin: '#b6c0cc', ink: '#2e3640',
    svg: `<defs>${lg('wtSw', '#f2f6fa', '#9aa6b4', 1, 0)}</defs><g class="wt-body">
      <path d="M72 140 L72 30 Q100 2 128 30 L128 140 Z" fill="url(#wtSw)" stroke="#5d6774" stroke-width="3" stroke-linejoin="round"/>
      <path d="M100 18 V136" stroke="#fff" stroke-width="3" opacity=".6"/>
      <rect x="40" y="138" width="120" height="14" rx="7" fill="#c8963d" stroke="#7a5a10" stroke-width="2"/>
      <rect x="90" y="152" width="20" height="34" rx="4" fill="#6b4223"/><circle cx="100" cy="190" r="8" fill="#c8963d"/>
      ${cheeks(80, 120, 102, '#e7a08a')}${eyes(88, 112, 78, 10)}${mouth(100, 108, 18, 12)}</g>`
  },
  blanket: {
    skin: '#c9564a', ink: '#5a1e16',
    svg: `<defs><pattern id="wtBl" width="10" height="28" patternUnits="userSpaceOnUse"><rect width="10" height="28" fill="#f2e6cc"/><rect y="0" width="10" height="8" fill="#c9564a"/><rect y="12" width="10" height="3" fill="#2f6a7a"/></pattern></defs><g class="wt-body">
      <path d="M18 76 Q100 56 182 76 L186 182 Q100 196 14 182 Z" fill="url(#wtBl)" stroke="#8a3a2e" stroke-width="3" stroke-linejoin="round"/>
      <path d="M18 76 Q100 96 182 76 Q172 66 100 64 Q28 66 18 76 Z" fill="#e6d6b4" stroke="#8a3a2e" stroke-width="3"/>
      ${cheeks(56, 144, 136)}${eyes(78, 122, 114, 13)}${mouth(100, 148, 22, 14)}</g>`
  },
  necklace: {
    skin: '#b5503a', ink: '#4e1a10',
    svg: `<defs><radialGradient id="wtNk" cx="40%" cy="35%"><stop offset="0" stop-color="#f08a6a"/><stop offset="1" stop-color="#9a3a26"/></radialGradient></defs><g class="wt-body">
      <path d="M30 30 Q100 120 170 30" fill="none" stroke="#c8963d" stroke-width="2"/>
      <g fill="#f4ecdc" stroke="#c8b48a" stroke-width="1.5">${[[30, 30], [42, 50], [56, 66], [72, 80], [128, 80], [144, 66], [158, 50], [170, 30]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 8 : 7}" ${i % 3 ? '' : 'fill="#f0b43a"'}/>`).join('')}</g>
      <circle cx="100" cy="128" r="56" fill="url(#wtNk)" stroke="#c8963d" stroke-width="5"/>
      ${cheeks(72, 128, 144, '#ffb0a0')}${eyes(84, 116, 120, 12)}${mouth(100, 150, 20, 13)}</g>`
  },
  suhuf: {
    skin: '#e6d4a8', ink: '#6a5330', noface: true,
    svg: `<defs>${lg('wtSc', '#fbf1d6', '#d9c08a')}</defs><g class="wt-body">
      ${halo(100, 110, 92)}
      <g stroke="#a88a55" stroke-width="3"><rect x="30" y="116" width="140" height="34" rx="17" fill="url(#wtSc)"/><rect x="40" y="84" width="120" height="34" rx="17" fill="url(#wtSc)"/><rect x="50" y="52" width="100" height="34" rx="17" fill="url(#wtSc)"/></g>
      <g fill="#e9dcbc" stroke="#a88a55" stroke-width="2"><circle cx="47" cy="133" r="13"/><circle cx="57" cy="101" r="13"/><circle cx="67" cy="69" r="13"/></g>
      <path d="M100 48 V154" stroke="#2f7a5a" stroke-width="5"/><path d="M90 160 l10 -8 l10 8" stroke="#2f7a5a" stroke-width="4" fill="none"/></g>`
  },
  tent: {
    skin: '#9b7a5a', ink: '#3e2a18',
    svg: `<defs>${lg('wtTe', '#c9a47e', '#7a5a3c')}${doorGrad}</defs><g class="wt-body">
      <path d="M100 18 L190 186 L10 186 Z" fill="url(#wtTe)" stroke="#5a3e24" stroke-width="3" stroke-linejoin="round"/>
      <path d="M100 18 L60 186 M100 18 L140 186" stroke="#5a3e24" stroke-width="2" opacity=".4"/>
      <path d="M100 18 V6" stroke="#5a3e24" stroke-width="4"/>
      ${cheeks(70, 130, 130)}${eyes(84, 116, 110, 12)}
      ${doorMouth('M80 186 L100 140 L120 186 Z', 100, 180)}</g>`
  },
  millstone: {
    skin: '#9a958c', ink: '#3a3630',
    svg: `<defs><radialGradient id="wtMl" cx="40%" cy="35%"><stop offset="0" stop-color="#d6d1c6"/><stop offset="1" stop-color="#8a857a"/></radialGradient></defs><g class="wt-body">
      <ellipse cx="100" cy="164" rx="88" ry="24" fill="#6e6a62"/>
      <circle cx="100" cy="106" r="80" fill="url(#wtMl)" stroke="#5e5a52" stroke-width="3"/>
      <g fill="#7e796e" opacity=".5"><circle cx="58" cy="70" r="3"/><circle cx="146" cy="84" r="2.5"/><circle cx="136" cy="150" r="3"/><circle cx="62" cy="146" r="2.5"/></g>
      <path d="M156 52 L176 22" stroke="#7a4e28" stroke-width="10" stroke-linecap="round"/>
      ${cheeks(60, 140, 120)}${eyes(78, 122, 96, 14)}${mouth(100, 134, 26, 16)}</g>`
  },
  nitaq: {
    skin: '#3f7a8a', ink: '#163a44',
    svg: `<defs>${lg('wtNq', '#6fb0c0', '#2f6a7a')}</defs><g class="wt-body">
      <path d="M4 86 Q50 70 100 86 T196 84 L196 122 Q150 108 100 124 T4 122 Z" fill="url(#wtNq)" stroke="#1e4a56" stroke-width="3"/>
      <path d="M84 140 L60 190 L82 184 L94 150 Z M116 140 L140 190 L118 184 L106 150 Z" fill="#2f6a7a" stroke="#1e4a56" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="100" cy="106" rx="56" ry="48" fill="url(#wtNq)" stroke="#1e4a56" stroke-width="3"/>
      <path d="M60 96 Q100 84 140 96" stroke="#c8963d" stroke-width="3" fill="none"/>
      ${cheeks(72, 128, 120, '#f2a090')}${eyes(82, 118, 102, 11)}${mouth(100, 128, 20, 12)}</g>`
  },
  khimar: {
    skin: '#4a5a8a', ink: '#1e2648',
    svg: `<defs>${lg('wtKh', '#6f80b4', '#3a4878')}</defs><g class="wt-body">
      <path d="M82 54 Q70 20 92 26 Q100 40 100 54 Q100 40 108 26 Q130 20 118 54 Z" fill="#5a6a9a" stroke="#2a3258" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 182 C8 120 40 62 100 58 C160 62 192 120 172 182 Z" fill="url(#wtKh)" stroke="#2a3258" stroke-width="3"/>
      <path d="M60 90 Q80 120 70 176 M140 90 Q120 120 130 176" stroke="#2a3258" stroke-width="2" opacity=".35" fill="none"/>
      <path d="M150 170 q10 -8 22 -2" stroke="#d9b46a" stroke-width="6" stroke-linecap="round" fill="none"/>
      ${cheeks(62, 138, 140, '#f2a0b0')}${eyes(80, 120, 118, 14)}${mouth(100, 152, 24, 15)}</g>`
  },
  qirba: {
    skin: '#9a6a3e', ink: '#43280f',
    svg: `<defs>${lg('wtQ', '#c08a58', '#7a4e2a')}</defs><g class="wt-body">
      <path d="M86 40 L84 20 H116 L114 40" fill="#8a5a2e" stroke="#43280f" stroke-width="3"/><path d="M80 22 H120" stroke="#d9b46a" stroke-width="5" stroke-linecap="round"/>
      <path d="M52 52 Q100 34 148 52 C190 84 188 168 140 182 Q100 192 60 182 C12 168 10 84 52 52 Z" fill="url(#wtQ)" stroke="#43280f" stroke-width="3"/>
      <path d="M40 120 Q100 136 160 120" stroke="#43280f" stroke-width="2" opacity=".35" fill="none"/>
      <path d="M100 190 q-5 8 0 12 q5 -4 0 -12" fill="#7cc8f0"/>
      ${cheeks(58, 142, 134)}${eyes(78, 122, 112, 14)}${mouth(100, 146, 24, 15)}</g>`
  },
  pillar: {
    skin: '#bfb29a', ink: '#4a4030',
    svg: `<defs>${lg('wtP', '#e2d8c2', '#a89c84', 1, 0)}</defs><g class="wt-body">
      <path d="M36 20 H164 L150 46 H50 Z" fill="#d9ccb0" stroke="#7a6e58" stroke-width="3" stroke-linejoin="round"/>
      <rect x="58" y="46" width="84" height="128" fill="url(#wtP)" stroke="#7a6e58" stroke-width="3"/>
      <path d="M68 150 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l2 2" stroke="#8a7e66" stroke-width="2.5" fill="none"/>
      <path d="M44 174 H156 L166 192 H34 Z" fill="#cfc2a6" stroke="#7a6e58" stroke-width="3" stroke-linejoin="round"/>
      ${cheeks(70, 130, 112)}${eyes(84, 116, 90, 12)}${mouth(100, 122, 20, 14)}</g>`
  },
  crescent: {
    skin: '#e8b84a', ink: '#6a4a10',
    svg: `<defs>${lg('wtCs', '#fff0b0', '#f0b43a')}<mask id="wtCm"><rect width="200" height="200" fill="#fff"/><circle cx="140" cy="82" r="68" fill="#000"/></mask></defs><g class="wt-body">
      <circle cx="100" cy="102" r="84" fill="url(#wtCs)" mask="url(#wtCm)"/>
      <g fill="#fff4c2"><circle cx="168" cy="160" r="4"/><circle cx="184" cy="122" r="2.5"/></g>
      ${cheeks(40, 84, 140)}${eyes(46, 80, 118, 11)}${mouth(64, 148, 18, 12)}</g>`
  },
  pebble: {
    skin: '#a69a88', ink: '#3e362a',
    svg: `<defs><radialGradient id="wtPb" cx="40%" cy="30%"><stop offset="0" stop-color="#e6dccb"/><stop offset="1" stop-color="#9a8e7a"/></radialGradient></defs><g class="wt-body">
      <ellipse cx="30" cy="180" rx="16" ry="10" fill="#b5a994"/><ellipse cx="172" cy="182" rx="14" ry="9" fill="#a89c86"/>
      <path d="M24 130 C20 76 64 46 108 48 C156 50 184 86 180 130 C176 170 140 188 100 188 C58 188 28 170 24 130 Z" fill="url(#wtPb)" stroke="#7a6e5a" stroke-width="3"/>
      <g fill="#8a7e6a" opacity=".5"><circle cx="60" cy="80" r="3"/><circle cx="150" cy="96" r="2.5"/><circle cx="140" cy="164" r="3"/></g>
      ${cheeks(58, 142, 138)}${eyes(80, 120, 112, 14)}${mouth(100, 146, 24, 15)}</g>`
  },
  chain: {
    skin: '#7d8794', ink: '#2a3038',
    svg: `<defs>${lg('wtCh', '#dfe5ec', '#7d8794', 1, 1)}</defs><g class="wt-body">
      <ellipse cx="100" cy="14" rx="16" ry="26" fill="none" stroke="#9aa3ad" stroke-width="9"/>
      <ellipse cx="100" cy="186" rx="16" ry="26" fill="none" stroke="#9aa3ad" stroke-width="9"/>
      <ellipse cx="100" cy="100" rx="62" ry="72" fill="#3a3f4a" stroke="url(#wtCh)" stroke-width="20"/>
      ${cheeks(70, 130, 116, '#c98a8a')}${eyes(82, 118, 92, 13)}${mouth(100, 126, 22, 14)}</g>`
  },
  candle: {
    skin: '#f2e6cc', ink: '#6a5330',
    svg: `<defs>${lg('wtCn', '#fffaf0', '#e6d4ac', 1, 0)}<radialGradient id="wtFl"><stop offset="0" stop-color="#fff4c2"/><stop offset=".6" stop-color="#ffb84a"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient></defs><g class="wt-body">
      <circle cx="100" cy="40" r="34" fill="url(#wtFl)" opacity=".7"/>
      <path d="M100 10 C112 28 114 44 100 58 C86 44 88 28 100 10 Z" fill="#ffb84a"/><path d="M100 30 C106 38 106 46 100 54 C94 46 94 38 100 30 Z" fill="#fff4c2"/>
      <path d="M100 58 V68" stroke="#3a2a1a" stroke-width="3"/>
      <path d="M62 70 Q100 62 138 70 L138 172 H62 Z" fill="url(#wtCn)" stroke="#c9b48a" stroke-width="3"/>
      <path d="M70 70 q0 18 6 20 q6 -2 6 -16 M120 70 q0 24 6 26 q6 -2 4 -24" fill="#fffaf0" stroke="#c9b48a" stroke-width="2"/>
      <path d="M40 172 H160 Q156 190 100 190 Q44 190 40 172 Z" fill="#c8963d" stroke="#7a5a10" stroke-width="2"/>
      ${cheeks(72, 128, 132)}${eyes(84, 116, 110, 11)}${mouth(100, 142, 20, 13)}</g>`
  },
  kiswa: {
    skin: '#2a2a2e', ink: '#0e0e10', noface: true,
    svg: `<g class="wt-body">
      <path d="M20 30 Q100 20 180 30 L184 186 Q100 196 16 186 Z" fill="#1c1c20" stroke="#3a3a40" stroke-width="3"/>
      <path d="M30 60 Q100 96 170 60 M30 140 Q100 176 170 140" stroke="#26262c" stroke-width="6" fill="none"/>
      ${halo(100, 96, 80)}
      <rect x="18" y="80" width="166" height="32" fill="#1c1c20"/>
      <path d="M18 80 H184 M18 112 H184" stroke="#e3b04a" stroke-width="3"/>
      <g fill="none" stroke="#e3b04a" stroke-width="2.5">${[38, 70, 102, 134, 166].map(x => `<path d="M${x - 10} 96 q10 -12 20 0 q-10 12 -20 0"/>`).join('')}</g></g>`
  },
  wall: {
    skin: '#b88a5a', ink: '#4e3018',
    svg: `<defs><pattern id="wtBk" width="40" height="24" patternUnits="userSpaceOnUse"><rect width="40" height="24" fill="#c99a68"/><path d="M0 0 H40 M0 12 H40 M20 0 V12 M0 12 V24 M40 12 V24" stroke="#8a5e36" stroke-width="2.5"/></pattern></defs><g class="wt-body">
      <path d="M14 46 Q100 30 186 46 L186 190 H14 Z" fill="url(#wtBk)" stroke="#6b4426" stroke-width="3"/>
      <path d="M8 44 Q100 26 192 44" stroke="#8a5e36" stroke-width="8" fill="none" stroke-linecap="round"/>
      <rect x="46" y="74" width="108" height="92" rx="20" fill="#d9ad7a" opacity=".85"/>
      ${cheeks(62, 138, 128)}${eyes(80, 120, 106, 13)}${mouth(100, 140, 22, 14)}</g>`
  },
  sun: {
    skin: '#ffb84a', ink: '#8a4a10',
    svg: `<defs>${lg('wtSu', '#fff0a0', '#ffb43a')}</defs><g class="wt-body">
      <g stroke="#ffd36b" stroke-width="8" stroke-linecap="round">${Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6, c = Math.cos(a), s = Math.sin(a); return `<path d="M${100 + c * 74} ${104 + s * 74} L${100 + c * 92} ${104 + s * 92}"/>`; }).join('')}</g>
      <circle cx="100" cy="104" r="62" fill="url(#wtSu)" stroke="#f09a2a" stroke-width="3"/>
      ${cheeks(66, 134, 120)}${eyes(82, 118, 96, 12)}${mouth(100, 128, 22, 14)}</g>`
  },
  mushaf: {
    skin: '#8a5a2e', ink: '#3e230e', noface: true,
    svg: `<defs>${lg('wtPg', '#fffaf0', '#e9dcbc')}</defs><g class="wt-body">
      ${halo(100, 84, 90)}
      <path d="M40 186 L100 120 L160 186 M60 186 L100 140 L140 186" stroke="#7a4e28" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M100 140 L24 120 L28 46 L100 64 Z" fill="url(#wtPg)" stroke="#2f6a4a" stroke-width="5" stroke-linejoin="round"/>
      <path d="M100 140 L176 120 L172 46 L100 64 Z" fill="url(#wtPg)" stroke="#2f6a4a" stroke-width="5" stroke-linejoin="round"/>
      <g stroke="#b8a47a" stroke-width="2.5" opacity=".7"><path d="M40 70 L88 82 M40 84 L88 96 M40 98 L88 110 M160 70 L112 82 M160 84 L112 96 M160 98 L112 110"/></g></g>`
  },
  rock: {
    skin: '#8a8478', ink: '#2e2a24',
    svg: `<defs>${lg('wtRk', '#c2bcae', '#6e685c', 1, 1)}</defs><g class="wt-body">
      <path d="M10 186 L26 96 L70 50 L132 44 L178 84 L192 186 Z" fill="url(#wtRk)" stroke="#4e4a40" stroke-width="3" stroke-linejoin="round"/>
      <path d="M132 44 L118 92 L140 120 L130 160" stroke="#4e4a40" stroke-width="3" fill="none" opacity=".7"/>
      <circle cx="136" cy="128" r="4" fill="#ffd77a"/>
      ${cheeks(56, 124, 140)}${eyes(72, 108, 116, 13)}${mouth(90, 150, 22, 14)}</g>`
  },
  palace: {
    skin: '#d6b07a', ink: '#5a3b14',
    svg: `<defs>${lg('wtPl', '#ecd2a2', '#b88a52')}${doorGrad}</defs><g class="wt-body">
      <path d="M16 188 L34 46 L166 46 L184 188 Z" fill="url(#wtPl)" stroke="#7a5428" stroke-width="3" stroke-linejoin="round"/>
      <path d="M28 46 H172 V34 H28 Z" fill="#c8963d" stroke="#7a5428" stroke-width="3"/>
      <path d="M34 60 H166" stroke="#2f6a8a" stroke-width="4" opacity=".7"/><path d="M30 76 H170" stroke="#b5503a" stroke-width="3" opacity=".6"/>
      ${cheeks(56, 144, 124)}${eyes(76, 124, 104, 14)}
      ${doorMouth('M80 188 L80 150 Q100 134 120 150 L120 188 Z', 100, 182)}</g>`
  },
  radm: {
    skin: '#6e5a4a', ink: '#2a1e14',
    svg: `<defs>${lg('wtRd', '#9a7a5e', '#4e3a2a')}</defs><g class="wt-body">
      <path d="M0 190 L0 40 L30 20 L40 190 Z M200 190 L200 40 L170 20 L160 190 Z" fill="#6e6a62"/>
      <rect x="34" y="34" width="132" height="156" fill="url(#wtRd)" stroke="#2a1e14" stroke-width="3"/>
      <path d="M34 72 H166 M34 112 H166 M34 152 H166" stroke="#e07a3a" stroke-width="4" opacity=".8"/>
      <g fill="#2a1e14">${[48, 84, 116, 152].map(x => `<circle cx="${x}" cy="52" r="3.5"/><circle cx="${x}" cy="172" r="3.5"/>`).join('')}</g>
      ${cheeks(62, 138, 130, '#e88a6a')}${eyes(80, 120, 100, 14)}${mouth(100, 136, 24, 15)}</g>`
  },
  peak: {
    skin: '#7a8a6a', ink: '#2e3624',
    svg: `<g class="wt-body">${mountain('#a9b892', '#7a8a6a', '#5e6c50', '#3a4430')}
      <path d="M102 24 L90 52 L100 50 L94 70" fill="none" stroke="#fff" stroke-width="5" opacity=".6"/>
      ${cheeks(60, 144, 146)}${eyes(82, 120, 118, 14)}${mouth(101, 154, 26, 18)}</g>`
  },
  zamzam: {
    skin: '#9a8e7e', ink: '#3a3026',
    svg: `<defs>${lg('wtZm', '#c9bca6', '#7e715e')}${lg('wtZw', '#c8f4ff', '#3a9ccf')}</defs><g class="wt-body">
      <path d="M100 18 C92 40 84 52 84 64 a16 16 0 0 0 32 0 C116 52 108 40 100 18Z" fill="url(#wtZw)"/>
      <path d="M58 70 q-8-18 6-26 M142 70 q8-18-6-26" stroke="#bfeee8" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M22 96 Q100 70 178 96 L170 184 Q100 200 30 184 Z" fill="url(#wtZm)" stroke="#5a4e40" stroke-width="3"/>
      <ellipse cx="100" cy="94" rx="78" ry="16" fill="url(#wtZw)" stroke="#5a4e40" stroke-width="3"/>
      <path d="M32 124 Q100 140 168 124 M34 156 Q100 172 166 156 M66 96 V132 M134 96 V132 M100 136 V166" stroke="#5a4e40" stroke-width="2" opacity=".45" fill="none"/>
      ${cheeks(56, 144, 160)}${eyes(78, 122, 138, 13)}${mouth(100, 170, 22, 13)}</g>`
  },
  ram: {
    skin: '#efe6d6', ink: '#6b5236',
    svg: `<g class="wt-body">
      <path d="M44 70 C10 60 8 110 36 116 C52 118 56 100 48 92" fill="none" stroke="#b98548" stroke-width="14" stroke-linecap="round"/>
      <path d="M156 70 C190 60 192 110 164 116 C148 118 144 100 152 92" fill="none" stroke="#b98548" stroke-width="14" stroke-linecap="round"/>
      <g fill="#fffaf0" stroke="#d8cfc0" stroke-width="3">${[[60, 52], [84, 40], [116, 40], [140, 52], [100, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20"/>`).join('')}</g>
      <path d="M56 70 C56 50 144 50 144 70 L136 150 C128 186 72 186 64 150 Z" fill="#f4ecdc" stroke="#c9bca0" stroke-width="3"/>
      <ellipse cx="100" cy="164" rx="26" ry="14" fill="#e8c8b8"/><path d="M92 160 q8 6 16 0" stroke="#6b5236" stroke-width="3" fill="none"/>
      ${cheeks(70, 130, 136, '#f0a090')}${eyes(80, 120, 108, 13)}${mouth(100, 172, 18, 11)}</g>`
  },
  olive: {
    skin: '#5e7a4a', ink: '#24341a',
    svg: `<g class="wt-body">
      <path d="M86 196 C90 170 84 150 92 132 L108 132 C116 150 110 170 114 196 Z" fill="#6b5034"/>
      <path d="M100 12 C150 12 190 44 186 86 C184 124 150 146 100 146 C50 146 16 124 14 86 C10 44 50 12 100 12 Z" fill="#4e6e3e"/>
      <g fill="#7ea062">${[[40, 50], [70, 30], [130, 30], [160, 50], [30, 100], [170, 100], [60, 130], [140, 130]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="6" transform="rotate(${i * 37} ${x} ${y})"/>`).join('')}</g>
      <g fill="#2e2a48">${[[50, 74], [150, 76], [78, 132], [126, 130], [100, 26]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="8"/>`).join('')}</g>
      ${cheeks(62, 138, 106)}${eyes(80, 120, 84, 14)}${mouth(100, 116, 24, 14)}</g>`
  },
  oldwall: {
    skin: '#8a7462', ink: '#3a2c22',
    svg: `<defs>${lg('wtOw', '#b49a80', '#7a6250')}</defs><g class="wt-body">
      <path d="M22 186 V40 H178 V186 Z" fill="url(#wtOw)" stroke="#5a4636" stroke-width="3"/><path d="M16 40 H184 V28 H16 Z" fill="#6b5340"/>
      <path d="M22 72 H178 M22 104 H178 M22 136 H178 M22 168 H178 M60 40 V72 M120 40 V72 M90 72 V104 M150 72 V104 M50 136 V168 M110 136 V168 M160 136 V168 M80 168 V186 M140 168 V186" stroke="#5a4636" stroke-width="2.5" opacity=".5"/>
      <path d="M150 40 L142 62 L152 76" fill="none" stroke="#3a2c22" stroke-width="3" stroke-linecap="round"/>
      ${cheeks(58, 142, 126)}${eyes(78, 122, 100, 14)}${mouth(100, 140, 24, 14)}</g>`
  },
  ant: {
    skin: '#5a2e22', ink: '#1a0c08',
    svg: `<g class="wt-body">
      <path d="M74 44 C66 22 52 14 40 14 M126 44 C134 22 148 14 160 14" fill="none" stroke="#2a1410" stroke-width="5" stroke-linecap="round"/><circle cx="40" cy="14" r="6" fill="#2a1410"/><circle cx="160" cy="14" r="6" fill="#2a1410"/>
      <path d="M58 150 l-30 34 M142 150 l30 34 M54 132 l-36 6 M146 132 l36 6" stroke="#2a1410" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="100" cy="158" rx="44" ry="34" fill="#4a2018"/><ellipse cx="100" cy="132" rx="22" ry="16" fill="#5a2a1e"/>
      <circle cx="100" cy="86" r="56" fill="#6a3426"/><ellipse cx="86" cy="58" rx="20" ry="10" fill="#9a5a44" opacity=".6"/>
      ${cheeks(62, 138, 106, '#ff9f8a')}${eyes(80, 120, 84, 15)}${mouth(100, 116, 22, 13)}</g>`
  },
  donkey: {
    skin: '#9a8a80', ink: '#3a2e2a',
    svg: `<g class="wt-body">
      <path d="M62 52 L48 6 L80 44 Z M138 52 L152 6 L120 44 Z" fill="#8a7a70" stroke="#5a4a44" stroke-width="3" stroke-linejoin="round"/><path d="M60 40 L52 16 L72 40Z M140 40 L148 16 L128 40Z" fill="#e8b8a8"/>
      <path d="M52 60 C52 36 148 36 148 60 L150 120 C150 150 50 150 50 120 Z" fill="#a8988c" stroke="#6e5e56" stroke-width="3"/>
      <path d="M86 40 q14-14 28 0 q-6 10-14 6 q-8 4-14-6z" fill="#4a3e3a"/>
      <ellipse cx="100" cy="150" rx="46" ry="36" fill="#d8cabc" stroke="#6e5e56" stroke-width="3"/><ellipse cx="84" cy="146" rx="6" ry="8" fill="#5a4a44"/><ellipse cx="116" cy="146" rx="6" ry="8" fill="#5a4a44"/>
      ${cheeks(62, 138, 116)}${eyes(78, 122, 92, 14)}${mouth(100, 172, 22, 11)}</g>`
  },
  lamp: {
    skin: '#c07a40', ink: '#5a2e12',
    svg: `<defs>${lg('wtLp', '#e0a060', '#9a5a2a')}</defs><g class="wt-body">
      <g class="wt-flame"><path d="M160 74 C140 52 152 26 162 10 C176 30 182 54 160 74Z" fill="#ffd77a"/><path d="M161 66 C152 54 156 40 162 30 C170 42 170 56 161 66Z" fill="#fff4cf"/></g>
      <path d="M20 110 C20 76 60 66 100 66 C134 66 150 72 158 82 L176 78 C184 86 174 100 156 102 C150 132 126 156 92 156 C48 156 20 140 20 110 Z" fill="url(#wtLp)" stroke="#6b3a1c" stroke-width="3"/>
      <ellipse cx="82" cy="72" rx="26" ry="8" fill="#3a2010"/><path d="M40 166 H140 L128 186 H52 Z" fill="#8a5a2e"/>
      ${cheeks(46, 120, 128)}${eyes(62, 104, 106, 13)}${mouth(84, 136, 20, 12)}</g>`
  },
  palm: {
    skin: '#8a6a40', ink: '#3a2a14',
    svg: `<g class="wt-body">
      <g fill="none" stroke="#3f8f52" stroke-width="12" stroke-linecap="round"><path d="M100 54 Q60 10 14 34"/><path d="M100 54 Q140 10 186 34"/><path d="M100 54 Q50 40 20 84"/><path d="M100 54 Q150 40 180 84"/><path d="M100 54 Q100 20 92 4"/></g>
      <g fill="#c9792a">${[[86, 64], [100, 70], [114, 64], [92, 78], [108, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g>
      <path d="M66 196 C70 150 72 110 78 76 L122 76 C128 110 130 150 134 196 Z" fill="#9a7444" stroke="#5a4020" stroke-width="3"/>
      <path d="M74 96 H126 M72 120 H128 M70 146 H130 M68 172 H132" stroke="#5a4020" stroke-width="3" opacity=".5"/>
      ${cheeks(80, 120, 150)}${eyes(86, 114, 122, 11)}${mouth(100, 160, 18, 11)}</g>`
  },
  ewer: {
    skin: '#a8b4c0', ink: '#2e3a46',
    svg: `<defs>${lg('wtEw', '#dfe8f0', '#8a9aaa')}</defs><g class="wt-body">
      <path d="M140 70 C176 64 186 100 160 120" fill="none" stroke="#7a8a9a" stroke-width="10" stroke-linecap="round"/>
      <path d="M56 104 L18 70 L26 62 L64 88 Z" fill="#9aaaba" stroke="#5a6a7a" stroke-width="3"/>
      <path d="M72 30 H128 L122 52 C156 66 164 110 150 150 C140 180 60 180 50 150 C36 110 44 66 78 52 Z" fill="url(#wtEw)" stroke="#5a6a7a" stroke-width="3"/>
      <ellipse cx="100" cy="30" rx="30" ry="7" fill="#5a6a7a"/><circle cx="20" cy="74" r="5" fill="#bfeee8"/>
      ${cheeks(68, 132, 134)}${eyes(82, 118, 108, 13)}${mouth(100, 146, 20, 12)}</g>`
  },
  stall: {
    skin: '#c9995a', ink: '#4a2d10',
    svg: `<g class="wt-body">
      <path d="M14 70 L30 22 H170 L186 70 Z" fill="#c9792a" stroke="#6b3a1c" stroke-width="3"/>
      <path d="M14 70 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 28 0 q14 14 30 0" fill="#f1e4c3" stroke="#6b3a1c" stroke-width="3"/>
      <path d="M40 30 L36 66 M80 24 L78 66 M120 24 L122 66 M160 30 L164 66" stroke="#f1e4c3" stroke-width="8"/>
      <rect x="28" y="84" width="144" height="102" rx="8" fill="#9a6a34" stroke="#5a3a1a" stroke-width="3"/>
      <g><ellipse cx="56" cy="178" rx="16" ry="8" fill="#f0d68a"/><ellipse cx="144" cy="178" rx="16" ry="8" fill="#e8c06a"/></g>
      ${cheeks(58, 142, 146)}${eyes(78, 122, 118, 14)}${mouth(100, 156, 22, 12)}</g>`
  },
  reed: {
    skin: '#d8c48a', ink: '#4a3a1c',
    svg: `<defs>${lg('wtRd', '#e8d89a', '#a8904a')}</defs><g class="wt-body">
      <path d="M78 10 Q72 100 80 196 L122 196 Q128 100 122 10 Z" fill="url(#wtRd)" stroke="#6b5a2a" stroke-width="3"/>
      <path d="M78 52 H122 M76 100 H124 M78 150 H122" stroke="#6b5a2a" stroke-width="4"/>
      <path d="M122 30 q30-20 50-6 M78 70 q-30-16-50 0" stroke="#7a9a4a" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${cheeks(84, 136, 116)}${eyes(90, 110, 118, 9)}${mouth(100, 134, 14, 9)}</g>`
  },
  musalla: {
    skin: '#b8503a', ink: '#3a1a10',
    svg: `<defs>${lg('wtMs', '#c9604a', '#8a3020')}</defs><g class="wt-body">
      <path d="M30 40 Q100 4 170 40 L170 190 L30 190 Z" fill="url(#wtMs)" stroke="#5a2010" stroke-width="3"/>
      <path d="M50 58 Q100 30 150 58 L150 176 L50 176 Z" fill="none" stroke="#f0d68a" stroke-width="4" opacity=".8"/>
      <path d="M100 46 V62" stroke="#f0d68a" stroke-width="4"/>
      <g fill="#f0d68a"><path d="M30 190 v10 M50 190 v10 M70 190 v10 M90 190 v10 M110 190 v10 M130 190 v10 M150 190 v10 M170 190 v10" stroke="#f0d68a" stroke-width="3"/></g>
      ${cheeks(66, 138, 134)}${eyes(80, 120, 114, 13)}${mouth(100, 146, 20, 11)}</g>`
  },
  sail: {
    skin: '#f1e4c3', ink: '#4a3a24',
    svg: `<defs>${lg('wtSl', '#fbf3dc', '#d8c49a')}</defs><g class="wt-body">
      <path d="M100 6 V196" stroke="#5a3a1c" stroke-width="8"/>
      <path d="M106 16 Q190 70 184 176 H106 Z" fill="url(#wtSl)" stroke="#8a7350" stroke-width="3"/>
      <path d="M94 30 Q24 90 22 176 H94 Z" fill="url(#wtSl)" stroke="#8a7350" stroke-width="3" opacity=".9"/>
      ${cheeks(118, 136, 170)}${eyes(132, 112, 166, 11)}${mouth(148, 142, 18, 10)}</g>`
  },
  sea: {
    skin: '#2f6f9a', ink: '#0a2030',
    svg: `<defs>${lg('wtSe', '#4a9aca', '#1a4a7a')}</defs><g class="wt-body">
      <path d="M10 90 Q40 50 70 80 Q100 40 130 80 Q160 50 190 90 L190 196 L10 196 Z" fill="url(#wtSe)" stroke="#0e3050" stroke-width="3"/>
      <path d="M20 112 q20-12 40 0 t40 0 t40 0 t40 0" stroke="#bfeee8" stroke-width="4" fill="none" opacity=".7"/>
      <path d="M40 80 q10-14 22-6 M110 70 q12-14 24-4" stroke="#e8fffb" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${cheeks(56, 156, 144)}${eyes(78, 136, 122, 14)}${mouth(100, 166, 22, 12)}</g>`
  },
  caravan: {
    skin: '#c9a06a', ink: '#3a2410',
    svg: `<defs>${lg('wtCv', '#d8b07a', '#9a6a3a')}</defs><g class="wt-body">
      <path d="M30 120 Q36 70 80 70 Q96 40 118 66 Q150 64 160 100 L176 96 Q192 60 180 40 L170 46 Q178 66 168 84 L160 86 L158 150 L146 150 L144 124 Q100 136 62 126 L58 196 L46 196 L44 128 Q34 126 30 120 Z" fill="url(#wtCv)" stroke="#5a3a1c" stroke-width="3"/>
      <path d="M70 70 h60 v-8 h-60 z" fill="#8a2a2a"/><path d="M74 66 h52" stroke="#e8c048" stroke-width="3"/>
      <path d="M150 150 v46 M70 130 v66" stroke="#5a3a1c" stroke-width="8" stroke-linecap="round"/>
      ${cheeks(76, 112, 118)}${eyes(84, 100, 106, 9)}${mouth(96, 118, 14, 9)}</g>`
  },
  river: {
    skin: '#3a8aba', ink: '#0a2030',
    svg: `<defs>${lg('wtRv', '#5aaad8', '#1a5a8a')}</defs><g class="wt-body">
      <path d="M40 10 Q120 50 70 100 Q20 150 110 196 L170 196 Q90 150 140 100 Q190 50 110 10 Z" fill="url(#wtRv)" stroke="#0e3a5a" stroke-width="3"/>
      <path d="M86 40 q16 10 6 24 M100 130 q-16 14 4 30" stroke="#e8fffb" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M30 60 q-10-20 6-30 M176 150 q14-14 4-30" stroke="#4a8a3a" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${cheeks(84, 116, 120)}${eyes(92, 96, 102, 10)}${mouth(102, 116, 16, 10)}</g>`
  },
  cloth: {
    skin: '#c9a87a', ink: '#4a3220',
    svg: `<defs>${lg('wtCl', '#ead8b4', '#b8956a')}</defs><g class="wt-body">
      <path d="M20 70 C40 40 160 40 180 70 L186 150 C160 190 40 190 14 150 Z" fill="url(#wtCl)" stroke="#7a5a3a" stroke-width="3"/>
      <path d="M100 36 C90 20 110 10 100 4 M100 36 L80 60 M100 36 L120 60" stroke="#7a5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M26 96 Q100 110 174 96 M24 132 Q100 146 176 132" stroke="#8a2a2a" stroke-width="6" fill="none" opacity=".55"/>
      <g fill="#f0d68a"><circle cx="40" cy="176" r="8"/><circle cx="160" cy="176" r="8"/><circle cx="148" cy="186" r="6"/></g>
      ${cheeks(56, 144, 140)}${eyes(78, 122, 112, 14)}${mouth(100, 154, 22, 12)}</g>`
  }
};
ART.kahf = ART.cave;
