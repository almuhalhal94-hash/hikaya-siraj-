// لعبة «متاهات الرحلات» (الهجرة، موسى إلى مدين، ذو القرنين، الحج): متاهة مولَّدة ببذرة ثابتة، يقود فيها الطفل الفانوس من البداية إلى النهاية مرورًا بالمحطة.
// لا يُرسم فيها أحد: الفانوس وحده يتحرك، والأماكن رموز بلا أشخاص.
import { fill, html, wait } from '../core.js';
import { sparkle } from '../sky.js';
import { sfx } from '../audio.js';

const U = 60, PAD = 10;

function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** يولّد متاهة كاملة (DFS) ثم يفتح loops جدارًا إضافيًّا لتسهيلها. */
export function build({ cols, rows, seed = 1, loops = 0 }) {
  const rand = rng(seed), N = cols * rows, open = new Set();
  const key = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const near = i => {
    const r = Math.floor(i / cols), c = i % cols, out = [];
    if (r > 0) out.push(i - cols); if (r < rows - 1) out.push(i + cols);
    if (c > 0) out.push(i - 1); if (c < cols - 1) out.push(i + 1);
    return out;
  };
  const seen = new Uint8Array(N), stack = [N - 1]; seen[N - 1] = 1;
  while (stack.length) {
    const cur = stack[stack.length - 1], next = near(cur).filter(j => !seen[j]);
    if (!next.length) { stack.pop(); continue; }
    const j = next[Math.floor(rand() * next.length)];
    open.add(key(cur, j)); seen[j] = 1; stack.push(j);
  }
  for (let k = 0, guard = 0; k < loops && guard < 400; guard++) {
    const i = Math.floor(rand() * N), opts = near(i).filter(j => !open.has(key(i, j)));
    if (opts.length) { open.add(key(i, opts[Math.floor(rand() * opts.length)])); k++; }
  }
  const can = (a, b) => open.has(key(a, b));
  const dist = (from, block = -1) => { // block: خلية لا يُمَرّ منها
    const d = new Int16Array(N).fill(-1), q = [from]; d[from] = 0;
    for (let h = 0; h < q.length; h++) for (const j of near(q[h])) if (d[j] < 0 && j !== block && can(q[h], j)) { d[j] = d[q[h]] + 1; q.push(j); }
    return d;
  };
  const start = N - 1, end = 0, dS = dist(start, end), dE = dist(end);
  // المحطة: أبعد خلية عن البداية والنهاية معًا (ويُفضَّل أن تكون نهاية ممر)، ويُوصَل إليها دون المرور بالنهاية
  let stopCell = -1, bestScore = -1;
  for (let i = 1; i < N - 1; i++) {
    if (dS[i] < 0) continue;
    const deadEnd = near(i).filter(j => can(i, j)).length === 1;
    const score = Math.min(dS[i], dE[i]) + (deadEnd ? 2 : 0);
    if (score > bestScore) { bestScore = score; stopCell = i; }
  }
  return { cols, rows, N, near, can, dist, start, end, stop: stopCell, shortest: dS[stopCell] + dE[stopCell] };
}

const ICON = {
  start: `<rect x="-14" y="-13" width="28" height="28" rx="2.500" fill="#0b0b14" stroke="#c9a24a" stroke-width="2"/><path d="M-14-5h28" stroke="#ffd77a" stroke-width="4"/>`,
  stop: `<path d="M-25 20L-8-15q8-12 16 0L25 20z" fill="#3b4c80" stroke="#6d86c4" stroke-width="2" stroke-linejoin="round"/><path class="mz__cave" d="M-8 20q0-17 8-17t8 17z"/>`,
  end: `<g fill="none" stroke="#5fd6a0" stroke-linecap="round"><path d="M-9 20q3-17-1-32" stroke-width="3.500"/><path d="M-10-12q-10-8-17 0M-10-12q-11 0-14 10M-10-12q9-9 17-2M-10-12q11-1 14 9M-10-12q-3-10-12-11M-10-12q4-10 12-10" stroke-width="2.600"/><path d="M12 20q2-11 0-21" stroke-width="3"/><path d="M12-1q-7-6-12 0M12-1q7-7 13-1M12-1q-2-8-9-9M12-1q3-8 9-8" stroke-width="2.300"/></g>`
};
// أماكن الرحلات الأخرى (رموز بلا أشخاص)
const TRIPS = {
  madyan: {
    start: `<path d="M-20 18v-22h40v22z" fill="#d9b36a" stroke="#8f6b22" stroke-width="2"/><path d="M-22-4h44" stroke="#8f6b22" stroke-width="3"/><path d="M-6 18v-12h12v12z" fill="#3d2a1c"/><path d="M-24 22q12-5 24 0t24 0" fill="none" stroke="#4fa3d1" stroke-width="3" stroke-linecap="round"/>`,
    stop: `<ellipse cy="12" rx="18" ry="7" fill="#6b5a44" stroke="#a8946a" stroke-width="2"/><ellipse class="mz__cave" cy="11" rx="11" ry="4"/><path d="M-14 10v-22M14 10v-22M-17-12h34" stroke="#8f6b22" stroke-width="3" stroke-linecap="round"/><path d="M0-12v14" stroke="#e8d3a2" stroke-width="1.5"/>`,
    end: `<path d="M-20 20v-24l20-12 20 12v24z" fill="#c98f4a" stroke="#8f6b22" stroke-width="2" stroke-linejoin="round"/><path d="M-5 20v-12h10v12z" fill="#3d2a1c"/><rect x="8" y="-2" width="7" height="7" fill="#ffcf6b"/>`
  },
  dq: {
    start: `<path d="M-24 14h48" stroke="#4fa3d1" stroke-width="4"/><path d="M-13 13a13 13 0 0 1 26 0z" fill="#ff8a4a"/><path d="M-20 20h40" stroke="#2a6ab0" stroke-width="3" stroke-dasharray="6 4"/>`,
    stop: `<g class="mz__cave"><circle r="10"/></g><g stroke="#ffd77a" stroke-width="3" stroke-linecap="round"><path d="M0-16v-6M0 16v6M-16 0h-6M16 0h6M-11-11l-4-4M11-11l4-4M-11 11l-4 4M11 11l4 4"/></g>`,
    end: `<path d="M-26 20l8-34 8 34z" fill="#6b5a44"/><path d="M26 20l-8-34-8 34z" fill="#6b5a44"/><path d="M-10 20v-26h20v26z" fill="#8a96a8" stroke="#c9a24a" stroke-width="2"/><path d="M-10-2h20M-10 8h20M0-6v26" stroke="#c9a24a" stroke-width="1.5"/>`
  },
  hajj: {
    start: `${[-14, 0, 14].map(x => `<path d="M${x - 8} 18l8-16 8 16z" fill="#fff4cf" stroke="#c9a24a" stroke-width="1.5"/>`).join('')}<path d="M-24 20h48" stroke="#c9a24a" stroke-width="2"/>`,
    stop: `<path d="M-24 20q8-30 24-34 16 4 24 34z" fill="#8a6a3e" stroke="#c9a24a" stroke-width="2"/><path class="mz__cave" d="M-2-18h4v10h-4z"/>`,
    end: `<rect x="-15" y="-14" width="30" height="32" rx="2" fill="#0b0b14" stroke="#c9a24a" stroke-width="2"/><path d="M-15-6h30" stroke="#ffd77a" stroke-width="4"/><rect class="mz__cave" x="-4" y="6" width="8" height="12"/>`
  }
};

const LANTERN = `<circle class="mz__halo" r="24"/><circle cy="-19" r="3" fill="none" stroke="#c9a24a" stroke-width="2"/><path d="M-8-9q8-13 16 0z" fill="#c9a24a"/><path d="M-9-9H9q7 11 0 22H-9q-7-11 0-22z" fill="#ffd77a" stroke="#c9a24a" stroke-width="2"/><ellipse class="mz__flame" cy="3" rx="4" ry="7" fill="#fff4cf"/><path d="M-7 13H7l-2 5h-10z" fill="#c9a24a"/>`;

export default function maze(board, api) {
  const { level, data, t } = api, cfg = data.hijra_maze, trip = cfg.trips?.[level.trip] || cfg, icons = TRIPS[level.trip] || ICON;
  const m = build(level), { cols, rows } = m;
  const names = { start: trip.start, stop: trip.stops[0], end: trip.end, trip: trip.title || t.hijra };
  const W = cols * U + PAD * 2, Ht = rows * U + PAD * 2;
  const xy = i => [PAD + (i % cols) * U + U / 2, PAD + Math.floor(i / cols) * U + U / 2];

  let walls = '';
  for (let i = 0; i < m.N; i++) {
    const r = Math.floor(i / cols), c = i % cols, x = PAD + c * U, y = PAD + r * U;
    if (r > 0 && !m.can(i, i - cols)) walls += `M${x} ${y}h${U}`;
    if (c > 0 && !m.can(i, i - 1)) walls += `M${x} ${y}v${U}`;
  }
  const cells = Array.from({ length: m.N }, (_, i) => { const [x, y] = xy(i); return { x, y }; });
  const place = (kind, i) => `<g class="mz__place mz__place--${kind}" transform="translate(${cells[i].x} ${cells[i].y})"><circle class="mz__ring" r="27"/>${icons[kind]}</g>`;

  const root = html(`
    <div class="mz${level.dark ? ' mz--dark' : ''}">
      <ol class="mz__route">${['start', 'stop', 'end'].map(k => `<li data-k="${k}"><i></i><span></span></li>`).join('')}</ol>
      <div class="mz__frame" style="--ratio:${(W / Ht).toFixed(4)}">
        <svg class="mz__svg" viewBox="0 0 ${W} ${Ht}" tabindex="0" role="application">
          <rect class="mz__floor" x="${PAD}" y="${PAD}" width="${cols * U}" height="${rows * U}" rx="10"/>
          <g class="mz__trail">${cells.map(c => `<circle cx="${c.x}" cy="${c.y}" r="4.500"/>`).join('')}</g>
          <path class="mz__walls" d="${walls}"/>
          <rect class="mz__edge" x="${PAD}" y="${PAD}" width="${cols * U}" height="${rows * U}" rx="10"/>
          ${level.dark ? `<g class="mz__fog">${cells.map(c => `<rect x="${c.x - U / 2 - 0.6}" y="${c.y - U / 2 - 0.6}" width="${U + 1.2}" height="${U + 1.2}"/>`).join('')}</g>` : ''}
          ${place('start', m.start)}${place('stop', m.stop)}${place('end', m.end)}
          <g class="mz__lantern"><g class="mz__body">${LANTERN}</g></g>
        </svg>
      </div>
    </div>`);
  const svg = root.querySelector('.mz__svg'), lantern = root.querySelector('.mz__lantern');
  const trail = [...root.querySelectorAll('.mz__trail circle')], fog = [...root.querySelectorAll('.mz__fog rect')];
  const route = k => root.querySelector(`.mz__route [data-k="${k}"]`);
  const placeEl = k => root.querySelector(`.mz__place--${k}`);
  svg.setAttribute('aria-label', t.board_label);
  ['start', 'stop', 'end'].forEach(k => { route(k).querySelector('span').textContent = names[k]; });
  route('start').classList.add('is-on');

  let pos = m.start, steps = 0, visitedStop = false, done = false, warned = false, down = false;

  function reveal() {
    if (!fog.length) return;
    const near2 = new Set([pos]);
    for (const a of m.near(pos)) if (m.can(pos, a)) { near2.add(a); for (const b of m.near(a)) if (m.can(a, b)) near2.add(b); }
    near2.forEach(i => fog[i].classList.add('is-clear'));
  }
  function paint() {
    lantern.style.transform = `translate(${cells[pos].x}px, ${cells[pos].y}px)`;
    trail[pos].classList.add('is-on');
    reveal();
  }

  function step(to) {
    if (done || !m.can(pos, to)) return false;
    pos = to; steps++; paint(); sfx.step();
    if (pos === m.stop && !visitedStop) {
      visitedStop = true;
      route('stop').classList.add('is-on'); placeEl('stop').classList.add('is-on'); placeEl('end').classList.add('is-ready');
      sfx.glow(); api.cheer(); sparkle(placeEl('stop'), { count: 14, power: 4 });
      api.say(t.at_stop, names);
    } else if (pos === m.end) {
      if (visitedStop) finish();
      else if (!warned) { warned = true; api.oops(fill(t.need_stop, names)); }
    } else if (pos !== m.end) warned = false;
    return true;
  }

  async function finish() {
    done = true;
    route('end').classList.add('is-on'); placeEl('end').classList.add('is-on');
    root.classList.add('is-done');
    fog.forEach(f => f.classList.add('is-clear'));
    await wait(350);
    if (!api.alive()) return;
    api.win(steps <= m.shortest * 1.25 + 2 ? 3 : steps <= m.shortest * 2 ? 2 : 1);
  }

  function bump() { lantern.classList.remove('is-bump'); void lantern.getBoundingClientRect(); lantern.classList.add('is-bump'); }

  /** يحرّك الفانوس خطوة خطوة نحو الخلية التي تحت الإصبع ما دام الطريق مفتوحًا. */
  function follow(e) {
    const b = svg.getBoundingClientRect();
    const c = Math.floor(((e.clientX - b.left) / b.width * W - PAD) / U), r = Math.floor(((e.clientY - b.top) / b.height * Ht - PAD) / U);
    if (c < 0 || r < 0 || c >= cols || r >= rows) return;
    for (let guard = 0; guard < cols + rows; guard++) {
      const pr = Math.floor(pos / cols), pc = pos % cols, dr = Math.sign(r - pr), dc = Math.sign(c - pc);
      if (!dr && !dc) break;
      const tryRow = () => dr && step(pos + dr * cols), tryCol = () => dc && step(pos + dc);
      const moved = Math.abs(r - pr) >= Math.abs(c - pc) ? tryRow() || tryCol() : tryCol() || tryRow();
      if (!moved) break;
    }
  }
  svg.addEventListener('pointerdown', e => { if (done) return; down = true; svg.setPointerCapture(e.pointerId); follow(e); });
  svg.addEventListener('pointermove', e => { if (down) follow(e); });
  const up = () => { down = false; };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  svg.addEventListener('keydown', e => {
    const d = { ArrowUp: -cols, ArrowDown: cols, ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (!d || done) return;
    e.preventDefault();
    const c = pos % cols;
    if ((d === -1 && c === 0) || (d === 1 && c === cols - 1) || pos + d < 0 || pos + d >= m.N || !step(pos + d)) bump();
  });

  board.append(root);
  paint();
  api.say(level.dark ? t.intro_dark : t.intro, names);
}
