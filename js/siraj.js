// «سِراج»: فانوس حيّ بلا وجه. يعبّر بتوهجه ولونه وحركته، ويتكلم في فقاعة.
import { html } from './core.js';

const SVG = `
<svg class="siraj__svg" viewBox="0 0 120 184" aria-hidden="true">
  <defs>
    <linearGradient id="sj-gold" x1="0" x2="1"><stop offset="0" stop-color="#8f6b22"/><stop offset=".45" stop-color="#f3d58a"/><stop offset="1" stop-color="#a47b2a"/></linearGradient>
    <radialGradient id="sj-glass" cx=".5" cy=".55" r=".65"><stop offset="0" stop-color="var(--sj-core)"/><stop offset=".45" stop-color="var(--sj-glow)" stop-opacity=".85"/><stop offset="1" stop-color="#16305a" stop-opacity=".9"/></radialGradient>
    <clipPath id="sj-clip"><path d="M40 52h40c17 20 17 60 2 80H38c-15-20-15-60 2-80z"/></clipPath>
  </defs>
  <circle cx="60" cy="11" r="7" fill="none" stroke="url(#sj-gold)" stroke-width="3.5"/>
  <path d="M60 18v8" stroke="url(#sj-gold)" stroke-width="4" stroke-linecap="round"/>
  <path d="M38 46q22-34 44 0z" fill="url(#sj-gold)"/>
  <rect x="34" y="45" width="52" height="8" rx="4" fill="url(#sj-gold)"/>
  <path class="siraj__glass" d="M40 52h40c17 20 17 60 2 80H38c-15-20-15-60 2-80z" fill="url(#sj-glass)"/>
  <g clip-path="url(#sj-clip)">
    <g class="siraj__flame">
      <path d="M60 68c13 16 18 27 18 36a18 18 0 0 1-36 0c0-9 5-20 18-36z" fill="var(--sj-glow)"/>
      <path d="M60 86c7 9 9 14 9 19a9 9 0 0 1-18 0c0-5 2-10 9-19z" fill="var(--sj-core)"/>
    </g>
    <path d="M36 62q24 18 48 0M30 92q30 16 60 0M34 122q26-16 52 0" fill="none" stroke="url(#sj-gold)" stroke-width="2" opacity=".75"/>
    <path d="M47 60q-8 32 3 64" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".28"/>
  </g>
  <path d="M40 52h40c17 20 17 60 2 80H38c-15-20-15-60 2-80z" fill="none" stroke="url(#sj-gold)" stroke-width="3.5"/>
  <path d="M60 52v80M40 52q-6 40-2 80M80 52q6 40 2 80" fill="none" stroke="url(#sj-gold)" stroke-width="2.2"/>
  <path d="M33 131h54l-6 12H39z" fill="url(#sj-gold)"/>
  <path d="M45 143h30l-4 11H49z" fill="url(#sj-gold)"/>
  <path d="M60 154v9" stroke="url(#sj-gold)" stroke-width="2.5"/>
  <circle cx="60" cy="169" r="5.5" fill="url(#sj-gold)"/>
</svg>`;

/**
 * ينشئ سِراج مع فقاعة كلامه.
 * @returns {{el:HTMLElement, lantern:HTMLElement, say:(t:string)=>void, react:(mood?:string)=>void}}
 */
export function createSiraj({ label = '' } = {}) {
  const el = html(`
    <div class="siraj-wrap">
      <button class="siraj" type="button">
        <span class="siraj__halo"></span>
        <span class="siraj__body">${SVG}</span>
        <i class="siraj__spark"></i><i class="siraj__spark"></i><i class="siraj__spark"></i>
      </button>
      <p class="bubble" aria-live="polite" hidden></p>
    </div>`);
  const lantern = el.querySelector('.siraj');
  const bubble = el.querySelector('.bubble');
  if (label) lantern.setAttribute('aria-label', label);

  /** يعرض النص كلمة بعد كلمة. */
  function say(text) {
    bubble.hidden = false;
    bubble.textContent = '';
    bubble.setAttribute('aria-label', text);
    text.split(/\s+/).forEach((word, i) => {
      const s = document.createElement('span');
      s.textContent = word + ' ';
      s.style.animationDelay = `${i * 110}ms`;
      s.setAttribute('aria-hidden', 'true');
      bubble.append(s);
    });
    bubble.classList.remove('is-pop'); void bubble.offsetWidth; bubble.classList.add('is-pop');
    lantern.classList.remove('is-talk'); void lantern.offsetWidth; lantern.classList.add('is-talk');
  }

  /** حركة تعبيرية قصيرة: joy (فرح) أو shy (خجل/تشجيع). */
  function react(mood = 'joy') {
    lantern.dataset.mood = mood;
    lantern.classList.remove('is-react'); void lantern.offsetWidth; lantern.classList.add('is-react');
  }

  lantern.addEventListener('animationend', e => {
    if (e.animationName === 'sj-react') { lantern.classList.remove('is-react'); delete lantern.dataset.mood; }
  });

  return { el, lantern, say, react };
}
