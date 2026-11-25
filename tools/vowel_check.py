#!/usr/bin/env python3
"""فحص حركات أواخر الكلمات في التعليق الصوتي (الضمة/الفتحة/الكسرة) بقياس الصوت نفسه.

التفريغ النصي لا يرى التشكيل، فهذا الفحص يقيس رنين الحركة الأخيرة (F1/F2 عبر Praat):
الفتحة F1 عالٍ، والكسرة F2 عالٍ، والضمة F2 منخفض. لكل مقطع تُحسب مراكز الحركات الثلاث من
كلماته نفسها، وتُعلَّم الكلمة التي تشبه حركتُها المقيسة حركةً غير المكتوبة.
الكلمات قبل علامة وقف (، . : ! ؟) لا تُفحص، لأن الوقف بالسكون جائز.

الاستعمال: python3 tools/vowel_check.py <id> <مجلد wav الأصلي قبل تحويل الطبقة>
النتيجة إنذار يحتاج سماعًا أو إعادة توليد، لا حكمًا نهائيًّا.
"""
import json, re, sys
from pathlib import Path
import parselmouth as pm

ROOT = Path(__file__).resolve().parent.parent
CLS = {'َ': 'a', 'ً': 'a', 'ُ': 'u', 'ٌ': 'u', 'ِ': 'i', 'ٍ': 'i'}


def final_vowel(tok):
    if re.search(r'[،.:!؟?,]$', tok):
        return None
    core = re.sub(r'[^ء-ْٰ]', '', tok)
    m = re.search(r'([ً-ِ])ّ?$|ّ([ً-ِ])$', core)
    if not m:
        return None
    v = m.group(1) or m.group(2)
    if re.search(r'[اىي]$', re.sub(r'[ً-ْ]', '', core)) and v in 'ًَ':
        return None  # ألف تنوين النصب أو مد
    return CLS.get(v)


def measure(snd, t0, t1):
    seg = snd.extract_part(from_time=max(0, t0), to_time=t1)
    f = seg.to_formant_burg(max_number_of_formants=5, maximum_formant=6500)
    p = seg.to_pitch()
    pts = []
    n = 12
    for k in range(n):
        t = seg.xmin + (seg.xmax - seg.xmin) * (0.45 + 0.5 * k / n)
        if p.get_value_at_time(t) and p.get_value_at_time(t) > 0:
            f1, f2 = f.get_value_at_time(1, t), f.get_value_at_time(2, t)
            if f1 == f1 and f2 == f2:
                pts.append((f1, f2))
    if len(pts) < 3:
        return None
    pts.sort(key=lambda x: x[0])
    mid = pts[len(pts) // 4: len(pts) - len(pts) // 4] or pts
    return sum(x for x, _ in mid) / len(mid), sum(y for _, y in mid) / len(mid)


def main():
    sid, rawdir = sys.argv[1], Path(sys.argv[2])
    script = json.load(open(ROOT / f'tools/voice/{sid}.script.json'))
    words = json.load(open(ROOT / f'tools/voice/{sid}.words.json'))
    bad = 0
    for key, text in script.items():
        toks, ws = text.split(), words[key]
        if len(toks) != len(ws):
            print(f'{key}: عدد الكلمات لا يطابق التفريغ'); bad += 1; continue
        snd = pm.Sound(str(rawdir / f'{key}.wav'))
        rows = []
        for j, tok in enumerate(toks):
            v = final_vowel(tok)
            if not v:
                continue
            t1 = (ws[j + 1][1] if j + 1 < len(ws) else ws[j][1] + 600) / 1000
            m = measure(snd, ws[j][1] / 1000, t1)
            if m:
                rows.append((tok, v, *m))
        for tok, v, f1, f2 in rows:
            cent = {}
            for c in 'aiu':
                xs = [(a, b) for t, cc, a, b in rows if cc == c and t != tok]
                if xs:
                    cent[c] = (sum(a for a, _ in xs) / len(xs), sum(b for _, b in xs) / len(xs))
            if v not in cent:
                continue
            dist = {c: ((f1 - a) / 300) ** 2 + ((f2 - b) / 600) ** 2 for c, (a, b) in cent.items()}
            best = min(dist, key=dist.get)
            flag = best != v and dist[best] < 0.6 * dist[v]
            if flag:
                bad += 1
            print(f'{key:7} {"⚠" if flag else " "} {tok:18} مكتوب={v} أقرب={best}  F1={f1:4.0f} F2={f2:4.0f}')
    print('إنذارات:', bad)


if __name__ == '__main__':
    main()
