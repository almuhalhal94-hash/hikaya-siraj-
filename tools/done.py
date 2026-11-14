#!/usr/bin/env python3
"""يسجّل حكاية منجزة في جدول README: python3 tools/done.py "لوط عليه السلام" "الفجر يحكي" lut-alfajr "التالي" """
import sys, re
name, title, sid, nxt = sys.argv[1:5]
r = open('README.md', encoding='utf-8').read()
lines = r.split('\n')
lines = [l for l in lines if not (l.startswith('| ') and ('لم تُكتب' in l or '| التالية' in l or name in l))]
i = max(n for n, l in enumerate(lines) if l.startswith('| '))
lines[i + 1:i + 1] = [f'| {name} | «{title}» `{sid}` | منجزة ومفحوصة على الجوال — النص ينتظر مراجعة أ. طلال |', f'| {nxt} | لم تُكتب | التالية (ثم بقية ترتيب `content/library.json`) |']
open('README.md', 'w', encoding='utf-8').write('\n'.join(lines))
