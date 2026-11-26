// أدوات مشتركة: التخزين المحلي، تحميل المحتوى، ووقت اليوم.

const KEY = 'hikaya-siraj:v1';
const defaults = { name: '', sound: true, stars: 0, lastStory: '', completed: [], days: [], badges: [], adhkar: null, adhkarTotal: { morning: 0, evening: 0 }, games: {}, house: [], met: [], gift: '', shelf: '' };

function read() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
  catch { return { ...defaults }; }
}

export const store = {
  state: read(),
  set(patch) {
    Object.assign(this.state, patch);
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch { /* تخزين غير متاح */ }
    return this.state;
  }
};

const cache = new Map();
/** يحمّل ملف JSON من مجلد content مرة واحدة. */
export function content(name) {
  if (!cache.has(name)) {
    cache.set(name, fetch(`content/${name}.json`).then(r => {
      if (!r.ok) throw new Error(`content/${name}.json: ${r.status}`);
      return r.json();
    }));
  }
  return cache.get(name);
}

export const pick = list => list[Math.floor(Math.random() * list.length)];

/** يستبدل {name} وغيرها في نصوص المحتوى. */
export const fill = (text, vars = {}) =>
  text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

/** صباح من 4 فجرًا حتى 4 عصرًا، وما عداه مساء. */
export function dayPart(date = new Date()) {
  const h = date.getHours();
  return h >= 4 && h < 16 ? 'morning' : 'evening';
}

/** مفتاح اليوم بالتوقيت المحلي: 2026-01-31 */
export function dayKey(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** يسجّل زيارة اليوم (لحديقة الأيام). الغياب لا يُنقص شيئًا. */
export function touchDay() {
  const k = dayKey();
  if (!store.state.days.includes(k)) store.set({ days: [...store.state.days, k] });
}

/** أرقام عربية مشرقية. */
export const num = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

export const wait = ms => new Promise(r => setTimeout(r, ms));

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** ينشئ عنصرًا من نص HTML ثابت (لا يُستخدم مع مدخلات الطفل). */
export function html(markup) {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}
