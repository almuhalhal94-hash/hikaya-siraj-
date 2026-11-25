#!/usr/bin/env python3
"""يستبدل مقطعًا من التسجيل الكامل بتسجيل أُعيد توليده (حين يُسقط الصوت كلمات أو يخطئ).
الاستعمال: python3 tools/voice_splice.py <id> <full.wav> <من ms> <إلى ms> <new.wav> '<words json>'
من/إلى: حدود المقطع القديم في الصمت. words: كلمات التسجيل الجديد [[كلمة، بداية، نهاية]…].
يكتب full.wav الجديد فوق القديم ويحدّث tools/voice/<id>.full.json."""
import json, sys, wave
from pathlib import Path
import numpy as np
ROOT = Path(__file__).resolve().parent.parent
sid, fw, a, b, nw, nwords = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5], json.loads(sys.argv[6])
def rd(p):
    w = wave.open(p); sr = w.getframerate(); return sr, np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
sr, x = rd(fw); sr2, y = rd(nw); assert sr == sr2
lead = max(0, nwords[0][1] - 250)  # يبقى ربع ثانية قبل أول كلمة
y = y[int(lead * sr / 1000):]
ia, ib = int(a * sr / 1000), int(b * sr / 1000)
pad = np.zeros(int(0.25 * sr), np.int16)
out = np.concatenate([x[:ia], y, pad, x[ib:]])
w = wave.open(fw, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(out.tobytes()); w.close()
p = ROOT / f'tools/voice/{sid}.full.json'
old = json.load(open(p))
shift = len(y) * 1000 // sr + 250 - (b - a)
new = [w for w in old if w[1] < a] + [[t, s - lead + a] + ([e - lead + a] if len(w2) > 2 else []) for w2 in nwords for t, s, *r in [w2] for e in (r or [0])] + [[w[0], w[1] + shift] + ([w[2] + shift] if len(w) > 2 else []) for w in old if w[1] >= b]
p.write_text(json.dumps(new, ensure_ascii=False) + '\n')
print('ok', len(old), '->', len(new))
