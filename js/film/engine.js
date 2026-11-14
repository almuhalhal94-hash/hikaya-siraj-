// محرك المشاهد: مسرح واحد يعرض أي ديكور من sets.js بحسب وصف JSON
// (ديكور + حالة + حركة كاميرا + جزيئات). يُعاد استخدامه لكل القصص.
import { SETS } from './sets.js';
import { wait, reducedMotion } from '../core.js';

const CX = 600, CY = 400; // مركز لوحة الرسم (1200×800)
const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const rand = (a, b) => a + Math.random() * (b - a);

// أنواع الجزيئات (الطقس والإضاءة)
const FX = {
  dust: { n: 46, col: '255,236,190', size: [0.8, 2.4], vx: [-0.18, 0.18], vy: [-0.14, 0.06], a: [0.15, 0.7] },
  motes: { n: 40, col: '255,215,122', size: [1.2, 3.4], vx: [-0.12, 0.12], vy: [-0.6, -0.15], a: [0.3, 0.9], glow: true },
  wind: { n: 16, col: '200,220,255', size: [30, 90], vx: [5, 9], vy: [0.1, 0.5], a: [0.04, 0.16], shape: 'streak' },
  leaves: { n: 16, col: '158,116,62', size: [6, 12], vx: [-0.5, 0.5], vy: [0.7, 1.5], a: [0.7, 1], shape: 'leaf' }
};

class Particles {
  constructor(canvas) { this.c = canvas; this.g = canvas.getContext('2d'); this.list = []; this.w = this.h = 0; }
  resize(w, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w; this.h = h; this.c.width = w * dpr; this.c.height = h * dpr;
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  set(kinds) {
    this.list.forEach(p => (p.dying = true)); // القديمة تخفت بهدوء
    for (const kind of kinds) {
      const f = FX[kind]; if (!f) continue;
      for (let i = 0; i < f.n; i++) {
        this.list.push({
          f, x: rand(0, this.w), y: rand(0, this.h), vx: rand(...f.vx), vy: rand(...f.vy), s: rand(...f.size),
          a: rand(...f.a), p: rand(0, 6.28), rot: rand(0, 6.28), spin: rand(-0.04, 0.04), life: 0
        });
      }
    }
  }
  step(t) {
    const { g, w, h } = this;
    g.clearRect(0, 0, w, h);
    this.list = this.list.filter(p => !(p.dying && p.life <= 0));
    for (const p of this.list) {
      p.life = Math.max(0, Math.min(1, p.life + (p.dying ? -0.02 : 0.012)));
      p.x += p.vx + (p.f.shape === 'leaf' ? Math.sin(t * 0.002 + p.p) * 0.8 : 0); p.y += p.vy; p.rot += p.spin;
      const m = p.f.shape === 'streak' ? p.s : 12;
      if (p.x > w + m) p.x = -m; else if (p.x < -m) p.x = w + m;
      if (p.y > h + m) p.y = -m; else if (p.y < -m) p.y = h + m;
      const a = p.a * p.life * (p.f.shape ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0018 + p.p));
      if (p.f.shape === 'streak') {
        const gr = g.createLinearGradient(p.x, p.y, p.x + p.s, p.y);
        gr.addColorStop(0, `rgba(${p.f.col},0)`); gr.addColorStop(0.5, `rgba(${p.f.col},${a})`); gr.addColorStop(1, `rgba(${p.f.col},0)`);
        g.strokeStyle = gr; g.lineWidth = 1.2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + p.s, p.y + p.vy * 3); g.stroke();
      } else if (p.f.shape === 'leaf') {
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(1, 0.6 + 0.4 * Math.sin(t * 0.004 + p.p));
        g.fillStyle = `rgba(${p.f.col},${a})`;
        g.beginPath(); g.ellipse(0, 0, p.s, p.s * 0.32, 0, 0, 6.28); g.fill(); g.restore();
      } else {
        if (p.f.glow) { g.fillStyle = `rgba(${p.f.col},${a * 0.18})`; g.beginPath(); g.arc(p.x, p.y, p.s * 3.2, 0, 6.28); g.fill(); }
        g.fillStyle = `rgba(${p.f.col},${a})`; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 6.28); g.fill();
      }
    }
  }
}

export class Stage {
  constructor(host) {
    this.host = host;
    host.classList.add('stage');
    host.innerHTML = `<svg class="stage__svg" aria-hidden="true"></svg><canvas class="stage__fx"></canvas>
      <div class="stage__tint"></div><div class="stage__vignette"></div><div class="stage__flash"></div><div class="stage__cut is-on"></div>`;
    this.svg = host.querySelector('svg');
    this.cut = host.querySelector('.stage__cut');
    this.flashEl = host.querySelector('.stage__flash');
    this.particles = new Particles(host.querySelector('canvas'));
    this.still = reducedMotion();
    this.layers = []; this.keys = []; this.setName = '';
    this.cam = { x: CX, y: CY, s: 760 }; this.move = null;
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(host);
    this.resize();
    this.alive = true;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    this.w = this.host.clientWidth || 1; this.h = this.host.clientHeight || 1;
    this.svg.setAttribute('viewBox', `0 0 ${this.w} ${this.h}`);
    this.particles.resize(this.w, this.h);
  }

  /** يعرض مشهدًا: { set, state, camera:{from:[x,y,size], to:[x,y,size], dur}, fx:[] } */
  async show(spec) {
    const same = spec.set === this.setName;
    const [fx, fy, fs] = spec.camera.from, [tx, ty, ts] = spec.camera.to;
    if (!same) {
      if (this.setName) { this.cut.classList.add('is-on'); await wait(420); }
      if (!this.alive) return;
      this.svg.innerHTML = (SETS[spec.set] || SETS.mountain)();
      this.layers = [...this.svg.querySelectorAll('[data-d]')].map(g => ({ g, d: +g.dataset.d }));
      this.setName = this.host.dataset.set = spec.set;
      this.cam = { x: fx, y: fy, s: fs };
    }
    this.setState(spec.state || {}, true);
    const to = { x: tx, y: ty, s: ts };
    if (this.still) { this.cam = to; this.move = null; }
    else this.move = { from: same ? { ...this.cam } : { x: fx, y: fy, s: fs }, to, t0: performance.now(), dur: (spec.camera.dur || 14) * 1000 };
    this.particles.set(this.still ? [] : spec.fx || []);
    this.svg.querySelectorAll('animateMotion').forEach(a => { try { a.beginElement(); } catch { /* غير مدعوم */ } });
    if (!same) { this.frame(performance.now()); await wait(80); this.cut.classList.remove('is-on'); }
  }

  /** يغيّر حالة الديكور (مثل light:"full")؛ التحريك في CSS. */
  setState(state, replace = false) {
    if (replace) { this.keys.forEach(k => delete this.host.dataset[k]); this.keys = []; }
    for (const [k, v] of Object.entries(state)) { this.host.dataset[k] = v; if (!this.keys.includes(k)) this.keys.push(k); }
  }

  flash() {
    this.flashEl.classList.remove('is-on'); void this.flashEl.offsetWidth; this.flashEl.classList.add('is-on');
  }

  frame(t) {
    const m = this.move;
    if (m) {
      const q = Math.min((t - m.t0) / m.dur, 1), e = ease(q);
      this.cam = { x: m.from.x + (m.to.x - m.from.x) * e, y: m.from.y + (m.to.y - m.from.y) * e, s: m.from.s + (m.to.s - m.from.s) * e };
    }
    const k = Math.min(this.w, this.h) / this.cam.s;
    // تنفّس خفيف حتى لا تتجمد اللقطة
    const x = this.cam.x + (this.still ? 0 : Math.sin(t / 3100) * this.cam.s * 0.008);
    const y = this.cam.y + (this.still ? 0 : Math.cos(t / 3700) * this.cam.s * 0.006);
    for (const { g, d } of this.layers) {
      const tx = this.w / 2 - k * (CX + (x - CX) * d), ty = this.h / 2 - k * (CY + (y - CY) * d);
      g.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(4)})`);
    }
  }

  loop(t) {
    if (!this.alive) return;
    this.frame(t);
    if (!this.still) this.particles.step(t);
    requestAnimationFrame(this.loop);
  }

  destroy() { this.alive = false; this.ro.disconnect(); }
}

/** صورة مصغّرة ثابتة لديكور (لبطاقات القصص). */
export function thumbnail(spec) {
  const [x, y, s] = spec.camera.to;
  const attrs = Object.entries(spec.state || {}).map(([k, v]) => `data-${k}="${v}"`).join(' ');
  return `<div class="stage stage--thumb" data-set="${spec.set}" ${attrs}><svg class="stage__svg" viewBox="${x - s / 2} ${y - s / 2} ${s} ${s}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(SETS[spec.set] || SETS.mountain)()}</svg><div class="stage__tint"></div></div>`;
}
