// ذاكرة الألعاب: لا يتكرر على الطفل ما أجاب عنه صحيحًا حتى يمرّ على بقية الأسئلة،
// ويعود إليه ما أخطأ فيه أولًا، وتُقدَّم أسئلة الحكايات التي قرأها.
import { store } from '../core.js';

const mem = kind => store.state.mem?.[kind] || {};

/** يختار count عنصرًا من list. key(item) مفتاح ثابت للسؤال. */
export function choose(kind, list, count, key) {
  const m = mem(kind), read = new Set(store.state.completed || []);
  const rank = it => {
    const v = m[key(it)], fresh = read.has(it.story) ? 0 : 1;
    if (v === -1) return [0, fresh, 0];            // أخطأ فيه: يعود أولًا
    if (v === undefined) return [1, fresh, 0];      // لم يُسأل عنه بعد
    return [2, 0, v];                               // أجاب صحيحًا: الأقدم أولًا
  };
  return list
    .map(it => ({ it, r: rank(it), z: Math.random() }))
    .sort((a, b) => a.r[0] - b.r[0] || a.r[1] - b.r[1] || a.r[2] - b.r[2] || a.z - b.z)
    .slice(0, count)
    .map(x => x.it)
    .sort(() => Math.random() - 0.5);
}

/** يسجّل نتيجة سؤال: صحيح من أول محاولة أو خطأ. */
export function mark(kind, k, ok) {
  const all = { ...(store.state.mem || {}) };
  all[kind] = { ...mem(kind), [k]: ok ? Date.now() : -1 };
  store.set({ mem: all });
}
