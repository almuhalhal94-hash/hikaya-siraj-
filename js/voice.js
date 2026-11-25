// التعليق الصوتي للحكايات: ملف صوت لكل مشهد (content/voice.json) يُشغَّل بعنصر audio واحد،
// ومُحلِّل Web Audio يقيس ارتفاع الصوت ليحرك فم الشاهد. لا موسيقى: كلام الراوي فقط.
import { store } from './core.js';

export class Narrator {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.setAttribute('playsinline', '');
    this.buf = null; this.an = null; this.ac = null;
    this.onEnd = null;
    this.audio.addEventListener('ended', () => { const f = this.onEnd; this.onEnd = null; f?.(); });
  }

  get on() { return !!store.state.sound; }

  /** يُستدعى داخل لمسة الطفل (زر «ابدأ») ليسمح المتصفح بالصوت لاحقًا، خصوصًا في iPhone. */
  unlock() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC && !this.ac) {
        this.ac = new AC();
        const src = this.ac.createMediaElementSource(this.audio);
        this.an = this.ac.createAnalyser(); this.an.fftSize = 512;
        this.buf = new Uint8Array(this.an.fftSize);
        src.connect(this.an).connect(this.ac.destination);
      }
      this.ac?.resume();
      this.audio.muted = true;
      const p = this.audio.play(); p?.then(() => { this.audio.pause(); this.audio.muted = false; }).catch(() => { this.audio.muted = false; });
    } catch { /* المتصفح لا يدعم: يبقى النص وحده */ }
  }

  /** يشغّل مقطعًا. يعيد وعدًا يتحقق عند بدء الصوت فعلًا (true) أو تعذّره (false). */
  play(clip, onEnd) {
    this.stop();
    if (!clip || !this.on) return Promise.resolve(false);
    this.onEnd = onEnd || null;
    this.audio.src = clip.src;
    this.audio.currentTime = 0;
    this.ac?.resume();
    return this.audio.play().then(() => true).catch(() => { this.onEnd = null; return false; });
  }

  stop() { this.onEnd = null; if (!this.audio.paused) this.audio.pause(); }

  get playing() { return !this.audio.paused && !this.audio.ended; }

  /** ارتفاع الصوت الآن 0..1 */
  level() {
    if (!this.an || !this.playing) return 0;
    this.an.getByteTimeDomainData(this.buf);
    let s = 0;
    for (let i = 0; i < this.buf.length; i++) { const v = (this.buf[i] - 128) / 128; s += v * v; }
    return Math.min(1, Math.sqrt(s / this.buf.length) * 4.2);
  }
}
