#!/usr/bin/env python3
"""يبني قسم «قرآني»: content/quran.json وملفات التلاوة assets/quran/SSSAAA.mp3.
النص من api.alquran.cloud (quran-uthmani) ولا يُكتب باليد، والتلاوة للشيخ مشاري العفاسي من verses.quran.com
وتوقيت كلماتها من api.quran.com (القارئ 7). الصوت يُحوَّل أحاديًّا 48k ليخف حجمه.
الاستعمال من جذر المستودع: python3 tools/quran_build.py"""
import json, os, ssl, subprocess, unicodedata, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SURAHS = [1] + list(range(78, 115))  # الفاتحة وجزء عمّ
CACHE = Path('/tmp/quran-cache'); OUT = Path('assets/quran')
BISM = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt') if os.path.exists('/root/.ccr/ca-bundle.crt') else ssl.create_default_context()
op = urllib.request.build_opener(urllib.request.ProxyHandler(), urllib.request.HTTPSHandler(context=ctx))

def get(url, name, binary=False):
    p = CACHE / name
    if not p.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(op.open(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read())
    return p if binary else json.loads(p.read_text())

nfc = lambda s: unicodedata.normalize('NFC', s)
def words(t):
    out = []
    for w in t.split(' '):
        if out and not any('ء' <= c <= 'ي' or c == 'ٱ' for c in w): out[-1] += ' ' + w  # علامة وقف تلحق بما قبلها
        elif w: out.append(w)
    return out

def mp3(key):
    s, a = key.split(':'); name = f'{int(s):03d}{int(a):03d}.mp3'; dst = OUT / name
    if not dst.exists():
        src = get(f'https://verses.quran.com/Alafasy/mp3/{name}', f'mp3/{name}', binary=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-ac', '1', '-b:a', '48k', str(dst)], check=True)
    return name

def build(n):
    s = get(f'https://api.alquran.cloud/v1/surah/{n}/quran-uthmani', f'txt/{n}.json')['data']
    seg = {f['verse_key']: f for f in get(f'https://api.quran.com/api/v4/recitations/7/by_chapter/{n}?per_page=300&fields=segments', f'seg/{n}.json')['audio_files']}
    ayahs, bad = [], 0
    for a in s['ayahs']:
        t = nfc(a['text']); b = nfc(BISM)
        if n not in (1, 9) and a['numberInSurah'] == 1 and t.startswith(b): t = t[len(b):].strip()
        w, key = words(t), f'{n}:{a["numberInSurah"]}'
        g = sorted([x for x in seg[key]['segments'] if len(x) >= 4], key=lambda x: x[0])
        times = [[x[2], x[3]] for x in g] if len(g) == len(w) else None
        bad += times is None
        ayahs.append({'n': a['numberInSurah'], 'w': w, 't': times, 'a': mp3(key)})
    print(n, s['name'], len(ayahs), 'بلا توقيت:', bad)
    return {'n': n, 'name': s['name'], 'en': s['englishName'], 'ayahs': ayahs}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    mp3('1:1')  # البسملة قبل السور
    with ThreadPoolExecutor(8) as ex: surahs = list(ex.map(build, SURAHS))
    data = {'_note': 'مولَّد آليًّا بـ tools/quran_build.py؛ لا يُعدَّل باليد. النص من api.alquran.cloud (quran-uthmani)، والتلاوة للشيخ مشاري راشد العفاسي (verses.quran.com)، وتوقيت الكلمات من api.quran.com. w كلمات الآية، t توقيت كل كلمة بالملّي ثانية (null إن لم يتطابق العدد فتُظلَّل الآية كلها)، a ملف التلاوة في assets/quran.',
            'bismillah': {'text': nfc(BISM), 'a': '001001.mp3'}, 'surahs': surahs}
    Path('content/quran.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
