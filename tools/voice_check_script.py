#!/usr/bin/env python3
"""يتأكد أن النص المشكول المنطوق يطابق نص الحكاية المعروض كلمة كلمة (بلا الآيات)."""
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from voice_align import norm, tokens
from voice_build import clips_of
ROOT = Path(__file__).resolve().parent.parent
for sid in sys.argv[1:]:
    st = next(s for s in json.load(open(ROOT / 'content/stories.json'))['stories'] if s['id'] == sid)
    sc = json.load(open(ROOT / f'tools/voice/{sid}.script.json'))
    ok = True
    for k, text in clips_of(st):
        disp = []
        for t, kind in tokens(text):
            if kind == 'ayah':
                if disp[-1:] != ['﴿﴾']: disp.append('﴿﴾')
                continue
            n = norm(t)
            if 'ﷺ' in t: disp += ['صلي', 'الله', 'عليه', 'وسلم']
            elif n: disp.append(n)
        sp = []
        for w in sc[k].split():
            if w == '﴿﴾': sp.append(w)
            elif norm(w): sp.append(norm(w))
        if disp != sp:
            ok = False
            i = next((i for i, (a, b) in enumerate(zip(disp, sp)) if a != b), min(len(disp), len(sp)))
            print(f'{sid}/{k}: يختلف عند {i}: المعروض {disp[i:i+4]} المنطوق {sp[i:i+4]}')
        bare = [w for w in sc[k].split() if norm(w) and not re.search('[ًٌٍَُِْ]', w) and len(norm(w)) > 1]
        if bare: print(f'{sid}/{k}: كلمات بلا تشكيل: {bare}')
    print(sid, 'مطابق' if ok else 'فيه اختلاف')
