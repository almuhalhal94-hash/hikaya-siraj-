// مؤثرات صوتية خفيفة مولّدة بـ Web Audio: بلا موسيقى ولا إيقاع.
import { store } from './core.js';

let ac, noiseBuf;

function ctx() {
  if (!store.state.sound) return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ac ||= new AC();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function tone({ from, to = from, dur = 0.15, type = 'sine', gain = 0.12, delay = 0 }) {
  const a = ctx(); if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

function noise({ from, to, dur = 0.5, gain = 0.08, q = 1.2, delay = 0 }) {
  const a = ctx(); if (!a) return;
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = a.currentTime + delay;
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = noiseBuf;
  f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t); src.stop(t + dur + 0.02);
}

export const sfx = {
  tap() { tone({ from: 520, to: 340, dur: 0.07, type: 'triangle', gain: 0.1 }); },
  star() { tone({ from: 1500, to: 2300, dur: 0.28, gain: 0.07 }); noise({ from: 5000, to: 8000, dur: 0.22, gain: 0.025, q: 4 }); },
  glow() { tone({ from: 300, to: 620, dur: 0.4, gain: 0.07 }); },
  wind() { noise({ from: 300, to: 900, dur: 0.9, gain: 0.06 }); },
  door() { noise({ from: 220, to: 1400, dur: 0.55, gain: 0.07 }); tone({ from: 150, to: 90, dur: 0.16, type: 'triangle', gain: 0.1, delay: 0.02 }); },
  success() { tone({ from: 700, to: 1400, dur: 0.45, gain: 0.08 }); noise({ from: 4000, to: 9000, dur: 0.5, gain: 0.03, q: 3, delay: 0.1 }); },
  oops() { tone({ from: 330, to: 220, dur: 0.22, type: 'triangle', gain: 0.08 }); }
};

export function setSound(on) {
  store.set({ sound: on });
  if (on) sfx.tap();
}
