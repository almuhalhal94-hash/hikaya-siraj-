#!/usr/bin/env python3
"""يضيف حكاية (أو يحدّثها) من ملف مصدر في tools/src/<id>.json إلى ملفات content.
الآيات لا تُكتب باليد: تُكتب في النص هكذا {{سورة:آية}} أو {{سورة:آية|من-إلى}} (أرقام الكلمات تبدأ من 0،
تُعرض بالأمر: python3 tools/ayah.py 7:23) ثم تُقصّ آليًّا من api.alquran.cloud (quran-uthmani).
الاستعمال من جذر المستودع: python3 tools/add_story.py tools/src/<id>.json
شكل الملف المصدر: { "lesson_name": اسم الدرس في library.json, "shelf": id الرف, "story": {...}, "scenes": {...},
  "games": { "order_events": [...], "witness": {...}, "fill_blank": [...] } }"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from ayah import ayah

def cut(m):
    words = ayah(m.group(1)).split(' ')
    if m.group(2):
        a, b = map(int, m.group(2).split('-')); words = words[a:b + 1]
    return '﴿' + ' '.join(words) + '﴾'

def resolve(o):
    if isinstance(o, str): return re.sub(r'\{\{(\d+:\d+)(?:\|(\d+-\d+))?\}\}', cut, o)
    if isinstance(o, list): return [resolve(x) for x in o]
    if isinstance(o, dict): return {k: resolve(v) for k, v in o.items()}
    return o

def load(n): return json.load(open(f'content/{n}.json', encoding='utf-8'))
def save(n, d): open(f'content/{n}.json', 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
def upsert(lst, item, key='story'):
    for i, x in enumerate(lst):
        if x.get(key) == item[key]: lst[i] = item; return
    lst.append(item)

src = resolve(json.load(open(sys.argv[1], encoding='utf-8')))
st = src['story']; sid = st['id']
assert len(st['scenes']) == len(src['scenes']['scenes']) == 6, 'ستة مشاهد'
stories = load('stories'); upsert(stories['stories'], st, 'id'); save('stories', stories)
scenes = load('scenes'); scenes[sid] = src['scenes']; save('scenes', scenes)
lib = load('library'); shelf = next(s for s in lib['shelves'] if s['id'] == src['shelf'])
item = next(i for i in shelf['items'] if i['name'] == src['lesson_name']); item['story'] = sid; save('library', lib)
g = load('games'); gm = src['games']
upsert(g['order_events'], {'story': sid, 'events': gm['order_events']})
if not any(l.get('story') == sid for l in g['order_levels']): g['order_levels'].append({'story': sid})
upsert(g['who_is_witness'], {'story': sid, **gm['witness']})
g['who_is_witness'] = [{'witness': w['witness'], 'story': w['story'], 'answer': w['answer'], 'wrong': w['wrong']} for w in g['who_is_witness']]
g['fill_blank'] = [b for b in g['fill_blank'] if b['story'] != sid] + [{'story': sid, **b} for b in gm['fill_blank']]
g['blank_levels'][-1]['count'] = len(g['fill_blank'])
save('games', g)
print('تمت إضافة', sid, '— جمل الكلمة الناقصة:', len(g['fill_blank']))
