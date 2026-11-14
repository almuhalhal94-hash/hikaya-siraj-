// السماء الحية (نجوم تتلألأ وشهب) + جزيئات الاحتفال.
import { reducedMotion } from './core.js';

const TAU = Math.PI * 2;
const STAR_COLORS = ['#ffffff', '#fff4cf', '#ffe9a8', '#bfeee8'];

export function initSky(canvas) {
  const c = canvas.getContext('2d');
  const still = reducedMotion();
  let w = 0, h = 0, stars = [], shoot = null, nextShoot = 3500;
  let px = 0, py = 0, tx = 0, ty = 0, lastPx = 0, lastPy = 0;
  const root = document.documentElement.style, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function seed() {
    stars = Array.from({ length: 190 }, () => {
      const d = Math.random();
      return {
        x: Math.random(), y: Math.pow(Math.random(), 1.3) * 0.9, d,
        r: 0.4 + d * d * 1.7, p: Math.random() * TAU, s: 0.5 + Math.random() * 1.6,
        col: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      };
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (still) draw(0);
  }

  function draw(t) {
    c.clearRect(0, 0, w, h);
    px += (tx - px) * 0.04; py += (ty - py) * 0.04;
    if (fine && (Math.abs(px - lastPx) > 0.002 || Math.abs(py - lastPy) > 0.002)) { // عمق المؤشر للقمر والأرض
      lastPx = px; lastPy = py;
      root.setProperty('--px', px.toFixed(3)); root.setProperty('--py', py.toFixed(3));
    }
    const n = w < 600 ? 120 : stars.length;
    for (let i = 0; i < n; i++) {
      const s = stars[i];
      const a = still ? 0.8 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.s + s.p));
      const x = s.x * w + px * s.d * 22, y = s.y * h + py * s.d * 14;
      c.globalAlpha = a; c.fillStyle = s.col;
      c.beginPath(); c.arc(x, y, s.r, 0, TAU); c.fill();
      if (s.r > 1.5) { // وميض صليبي للنجوم الكبيرة
        const k = s.r * 3.2 * a;
        c.globalAlpha = a * 0.55; c.fillRect(x - k, y - 0.4, k * 2, 0.8); c.fillRect(x - 0.4, y - k, 0.8, k * 2);
      }
    }
    if (shoot) {
      const q = (t - shoot.t0) / shoot.dur;
      if (q >= 1) shoot = null;
      else {
        const x = shoot.x + shoot.vx * q, y = shoot.y + shoot.vy * q;
        const g = c.createLinearGradient(x, y, x - shoot.vx * 0.22, y - shoot.vy * 0.22);
        g.addColorStop(0, 'rgba(255,244,207,.95)'); g.addColorStop(1, 'rgba(255,244,207,0)');
        c.globalAlpha = Math.sin(q * Math.PI); c.strokeStyle = g; c.lineWidth = 2; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, y); c.lineTo(x - shoot.vx * 0.22, y - shoot.vy * 0.22); c.stroke();
      }
    } else if (t > nextShoot) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      shoot = { t0: t, dur: 900, x: w * (0.5 - dir * (0.1 + Math.random() * 0.35)), y: h * (0.05 + Math.random() * 0.25), vx: dir * w * 0.45, vy: h * 0.22 };
      nextShoot = t + 5000 + Math.random() * 7000;
    }
    c.globalAlpha = 1;
  }

  function loop(t) { draw(t); if (!document.hidden) requestAnimationFrame(loop); }

  seed(); resize();
  window.addEventListener('resize', resize);
  if (!still) {
    window.addEventListener('pointermove', e => { tx = e.clientX / w - 0.5; ty = e.clientY / h - 0.5; }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(loop); });
    requestAnimationFrame(loop);
  }
}

// ——— جزيئات الاحتفال: نجوم صغيرة تتطاير من نقطة ———
let fx, fc, parts = [], running = false;

function fxResize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fx.width = window.innerWidth * dpr; fx.height = window.innerHeight * dpr;
  fc.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function initFx(canvas) {
  fx = canvas; fc = canvas.getContext('2d');
  fxResize(); window.addEventListener('resize', fxResize);
}

function starPath(x, y, r, rot) {
  fc.beginPath();
  for (let i = 0; i < 8; i++) {
    const rr = i % 2 ? r * 0.38 : r, a = rot + i * Math.PI / 4;
    fc.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  fc.closePath();
}

function fxLoop() {
  fc.clearRect(0, 0, window.innerWidth, window.innerHeight);
  parts = parts.filter(p => p.life > 0);
  for (const p of parts) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.985; p.rot += p.spin; p.life -= p.fade;
    fc.globalAlpha = Math.max(p.life, 0); fc.fillStyle = p.col;
    starPath(p.x, p.y, p.r, p.rot); fc.fill();
  }
  fc.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(fxLoop);
  else { running = false; fc.clearRect(0, 0, window.innerWidth, window.innerHeight); }
}

/** يطلق نجومًا من نقطة على الشاشة، أو من مركز عنصر. */
export function sparkle(target, { count = 16, power = 4, colors = ['#ffd77a', '#fff4cf', '#5fd6c8'] } = {}) {
  if (!fx || reducedMotion()) return;
  let x, y;
  if (target instanceof Element) {
    const b = target.getBoundingClientRect(); x = b.left + b.width / 2; y = b.top + b.height / 2;
  } else ({ x, y } = target);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU, v = power * (0.4 + Math.random());
    parts.push({
      x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.2, r: 3 + Math.random() * 5,
      rot: Math.random() * TAU, spin: (Math.random() - 0.5) * 0.3, life: 1, fade: 0.012 + Math.random() * 0.014,
      col: colors[i % colors.length]
    });
  }
  if (!running) { running = true; requestAnimationFrame(fxLoop); }
}
