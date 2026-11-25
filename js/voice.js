// التعليق الصوتي للحكايات: ملف صوت لكل مشهد (content/voice.json) يُشغَّل بعنصر audio واحد عاديّ.
// لا يمر الصوت عبر Web Audio (في iPhone يُكتم مع زر الصامت أو يبقى معلّقًا داخل الإطارات)؛
// حركة فم الشاهد تأتي من غلاف ارتفاع الصوت يُحسب بفك الملف نفسه مرة واحدة. لا موسيقى: كلام الراوي، والآيات بتلاوة
// الشيخ مشاري العفاسي (recite) يصمت فيها فم الشاهد.
import { store } from './core.js';

const STEP = 20; // ms لكل نقطة في غلاف الارتفاع
const envs = new Map(); // src -> Float32Array | Promise

function envelope(src) {
  if (envs.has(src)) return envs.get(src);
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) return null;
  const p = fetch(src).then(r => r.arrayBuffer()).then(buf => new Promise((ok, no) => {
    const ac = new OAC(1, 1, 22050);
    const r = ac.decodeAudioData(buf, ok, no);
    r?.then?.(ok, no);
  })).then(ab => {
    const d = ab.getChannelData(0), n = Math.max(1, Math.round(ab.sampleRate * STEP / 1000));
    const env = new Float32Array(Math.ceil(d.length / n));
    for (let i = 0; i < env.length; i++) {
      let s = 0; const a = i * n, b = Math.min(d.length, a + n);
      for (let j = a; j < b; j++) s += d[j] * d[j];
      env[i] = Math.min(1, Math.sqrt(s / Math.max(1, b - a)) * 4.2);
    }
    envs.set(src, env); return env;
  }).catch(() => { envs.set(src, null); return null; });
  envs.set(src, p);
  return p;
}

export class Narrator {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.setAttribute('playsinline', '');
    this.onEnd = null;
    this.env = null;
    this.audio.addEventListener('ended', () => { const f = this.onEnd; this.onEnd = null; f?.(); });
  }

  get on() { return !!store.state.sound; }

  /** يُستدعى داخل لمسة الطفل (زر «ابدأ»): تشغيل صامت لأول مقطع يفتح العنصر للتشغيل لاحقًا، خصوصًا في iPhone. */
  unlock(src) {
    try {
      if (src) { this.audio.src = src; envelope(src); }
      this.audio.muted = true; this.unlocking = true;
      const p = this.audio.play();
      const done = () => { if (!this.unlocking) return; this.unlocking = false; this.audio.pause(); this.audio.currentTime = 0; this.audio.muted = false; };
      p ? p.then(done, () => { this.audio.muted = false; }) : done();
    } catch { this.audio.muted = false; /* المتصفح لا يدعم: يبقى النص وحده */ }
  }

  /** يشغّل مقطعًا. يعيد وعدًا يتحقق عند بدء الصوت فعلًا (true) أو تعذّره (false). */
  play(clip, onEnd) {
    this.unlocking = false;
    this.stop();
    if (!clip || !this.on) return Promise.resolve(false);
    this.onEnd = onEnd || null;
    this.env = null;
    this.recite = clip.recite || null;
    const e = envelope(clip.src);
    if (e instanceof Float32Array) this.env = e; else e?.then(v => { if (this.audio.src.endsWith(clip.src)) this.env = v; });
    if (!this.audio.src.endsWith(clip.src)) this.audio.src = clip.src;
    this.audio.muted = false;
    try { this.audio.currentTime = 0; } catch { /* لم يُحمَّل بعد */ }
    return this.audio.play().then(() => true).catch(() => { this.onEnd = null; return false; });
  }

  stop() { this.onEnd = null; if (!this.audio.paused) this.audio.pause(); }

  get playing() { return !this.audio.paused && !this.audio.ended; }

  /** ارتفاع الصوت الآن 0..1 (من الغلاف المحسوب؛ وإن لم يجهز بعد فحركة خفيفة). */
  level() {
    if (!this.playing) return 0;
    const t = this.audio.currentTime * 1000;
    if (this.recite?.some(([a, b]) => t >= a && t <= b)) return 0; // الشاهد يصمت أثناء تلاوة الشيخ
    if (this.env) return this.env[Math.floor(t / STEP)] || 0;
    return 0.35 + 0.3 * Math.sin(t / 70);
  }
}
