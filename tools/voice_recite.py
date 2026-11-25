#!/usr/bin/env python3
"""يضع تلاوة الشيخ مشاري العفاسي مكان الوقفة الصامتة عند كل آية في التعليق الصوتي (طلب أ. طلال).

الصوت المولَّد لا يقرأ الآيات أبدًا. بعد voice_build.py تبقى عند كل آية وقفة صامتة؛ هذه الأداة:
  ١. تعرف موضع كل آية معروضة في المصحف (سورة:آية ورقم أول كلمة وآخرها) بمطابقة نصها حرفيًّا على
     quran-uthmani من api.alquran.cloud (المصدر نفسه الذي قُصّت منه الآيات في الحكايات).
  ٢. تجلب تلاوة الآية وتوقيت كلماتها من api.quran.com (القارئ 7: مشاري العفاسي، ملف لكل آية) وتقص
     الكلمات المعروضة فقط عند أهدأ نقطة قرب حدود الكلمة.
  ٣. تضع التلاوة مكان الوقفة، وتؤخر ما بعدها من كلمات، وتجعل توقيت كل كلمة من الآية على تلاوتها
     (تضيء الكلمة حين يقرؤها الشيخ)، وتسجّل المدى في recite ليبقى فم الشاهد مغلقًا أثناء التلاوة.
لا تُعاد المعالجة لمقطع فيه recite (آمنة للتكرار).

الاستعمال: python3 tools/voice_recite.py [id ...]   (بلا معرّف = كل الحكايات المسجّلة في voice.json)
"""
import json, os, re, ssl, subprocess, sys, unicodedata, urllib.request
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from voice_align import norm, tokens  # noqa: E402
from voice_build import gap_ms  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / 'tools/voice/.cache'
SR = 44100
LEAD, TAIL, JOIN = 450, 550, 350  # ms: قبل التلاوة، بعدها، وبين آيتين متتاليتين
QARI = 'تلاوة الشيخ مشاري راشد العفاسي (api.quran.com، القارئ 7)'
BISM = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt')
op = urllib.request.build_opener(urllib.request.ProxyHandler(), urllib.request.HTTPSHandler(context=ctx))


def get(url, path, binary=False):
    path = CACHE / path
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        data = op.open(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()
        path.write_bytes(data)
    return path if binary else json.loads(path.read_text())


def mushaf():
    d = get('https://api.alquran.cloud/v1/quran/quran-uthmani', 'quran-uthmani.json')['data']['surahs']
    out = []
    for s in d:
        for a in s['ayahs']:
            t = unicodedata.normalize('NFC', a['text'])
            b = unicodedata.normalize('NFC', BISM)  # ترتيب الشدة والحركة يختلف بين السور
            if s['number'] not in (1, 9) and a['numberInSurah'] == 1 and t.startswith(b):
                t = t[len(b):].strip()  # البسملة ليست من الآية في تلاوة quran.com
            out.append((s['number'], a['numberInSurah'], unicodedata.normalize('NFC', t).split(' ')))
    return out


QURAN = None
AUDIT = []


def locate(words):
    """[(سورة، آية، أول كلمة، آخر كلمة)] لنص آية معروض (قد يمتد على آيتين)."""
    global QURAN
    QURAN = QURAN or mushaf()
    words = [unicodedata.normalize('NFC', w) for w in words]  # ترتيب الشدة والحركة يختلف بين النسخ
    n = len(words)
    for i, (s, a, w) in enumerate(QURAN):
        for k in range(len(w)):
            if w[k] != words[0]:
                continue
            if w[k:k + n] == words:
                return [(s, a, k, k + n - 1)]
            if w[k:] == words[:len(w) - k] and i + 1 < len(QURAN):  # يكمل في الآية التالية
                s2, a2, w2 = QURAN[i + 1]
                rest = words[len(w) - k:]
                if w2[:len(rest)] == rest:
                    return [(s, a, k, len(w) - 1), (s2, a2, 0, len(rest) - 1)]
    raise SystemExit(f'لم أجد الآية في المصحف: {" ".join(words)}')


def decode(path):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.int16).astype(np.float32) / 32768


def rms_frames(x, ms=10):
    n = int(SR * ms / 1000)
    m = len(x) // n
    return np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1) + 1e-12)


def quiet(x, t_ms, before=140, after=140):
    """أهدأ نقطة (ms) حول t_ms."""
    r = rms_frames(x)
    a, b = max(0, (t_ms - before) // 10), min(len(r), (t_ms + after) // 10 + 1)
    if b <= a:
        return t_ms
    return int((a + int(np.argmin(r[a:b]))) * 10)


def edges(x, thr_db=-45):
    r = 20 * np.log10(rms_frames(x))
    on = np.where(r > thr_db)[0]
    return (int(on[0] * 10), int(on[-1] * 10 + 10)) if len(on) else (0, len(x) * 1000 // SR)


def recitation(s, a, w0, w1):
    """قطعة التلاوة ([عيّنات]) وبداية كل كلمة فيها بالـms."""
    info = get(f'https://api.quran.com/api/v4/recitations/7/by_ayah/{s}:{a}?fields=segments', f'seg/{s}_{a}.json')
    f = info['audio_files'][0]
    segs = [g for g in f['segments'] if len(g) >= 4]
    mp3 = get(f'https://verses.quran.com/{f["url"]}', f'mp3/{s:03d}{a:03d}.mp3', binary=True)
    x = decode(mp3)
    toks = next(w for ss, aa, w in QURAN if ss == s and aa == a)
    real = [i for i, t in enumerate(toks) if re.search('[\u0621-\u064a\u0671]', t)]  # علامات الوقف كلمات مستقلة في quran-uthmani
    if len(segs) != len(real):
        raise SystemExit(f'{s}:{a} عدد كلمات التوقيت {len(segs)} لا يساوي كلمات المصحف {len(real)}: راجعها يدويًّا')
    seg_of = {}
    for k in range(len(toks)):  # علامة الوقف تأخذ توقيت الكلمة قبلها
        seg_of[k] = real.index(k) if k in real else seg_of.get(k - 1, 0)
    last_word = w1 >= real[-1]
    first, last = edges(x)
    # الكلمات في التلاوة موصولة: البداية عند بداية الكلمة تقريبًا (لا تأخذ مدّ الكلمة قبلها)
    start = first if w0 <= real[0] else quiet(x, segs[seg_of[w0]][2], 50, 30)
    end = last + 60 if last_word else quiet(x, segs[seg_of[w1]][3] + 40, 80, 60)
    # إن وقف الشيخ بعد الكلمة الأخيرة ثم أعاد ما قبلها (يدخل في توقيتها): القص عند أول وقفة
    r = 20 * np.log10(rms_frames(x)); w = segs[seg_of[w1]]
    for t in range((w[2] + 300) // 10, min(len(r), w[3] // 10) - 15):
        if (r[t:t + 15] < r.max() - 25).all():
            end = min(end, t * 10 + 120); break
    piece = x[int(start * SR / 1000):int(end * SR / 1000)].copy()
    for name, t, cut in (('بداية', start, w0 > real[0]), ('نهاية', end, not last_word)):
        lv = r[min(len(r) - 1, t // 10)]
        if cut and lv > r.max() - 30:
            AUDIT.append(f'{s}:{a} {name} القص عند {t}ms في صوت ({lv - r.max():.0f} dB): للسماع')
    fi, fo = int(0.02 * SR), int((0.06 if last_word else 0.14) * SR)
    piece[:fi] *= np.linspace(0, 1, fi); piece[-fo:] *= np.linspace(1, 0, fo)
    starts = [max(0, segs[seg_of[k]][2] - start) for k in range(w0, w1 + 1)]
    return piece, starts


def loud(x, target=-14.5):
    """تسوية علو التلاوة قريبًا من صوت الراوي (-16 LUFS) عبر ffmpeg."""
    raw = (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-',
                        '-af', f'loudnorm=I={target}:TP=-1.5:LRA=11', '-ar', str(SR), '-f', 's16le', '-'],
                       input=raw, capture_output=True, check=True)
    y = np.frombuffer(r.stdout, np.int16).astype(np.float32) / 32768
    return y[:len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))


def runs(text):
    """الآيات المعروضة مجمّعة كما في الوقفات: آيتان بينهما علامة فقط = وقفة واحدة."""
    blocks = [(m.start(), m.end(), m.group(1)) for m in re.finditer('﴿(.*?)﴾', text)]
    out = []
    for i, (a, b, t) in enumerate(blocks):
        if out and not norm(text[blocks[i - 1][1]:a]):
            out[-1].append(t)
        else:
            out.append([t])
    return out


def process(sid, key, clip, text):
    legacy = not clip.get('ayah') and None in clip['words']  # الصيغة الأولى (غار ثور): الآية بعد نهاية الصوت
    if 'recite' in clip or not (clip.get('ayah') or legacy):
        return False
    cues = clip.get('ayah') or [clip['ms'] + 300]
    groups = runs(text)
    if len(groups) != len(cues):
        raise SystemExit(f'{sid}/{key}: عدد الوقفات {len(clip["ayah"])} لا يساوي مجموعات الآيات {len(groups)}')
    toks = tokens(text)
    if len(toks) != len(clip['words']):
        raise SystemExit(f'{sid}/{key}: عدد الكلمات لا يطابق voice.json')
    x = decode(ROOT / clip['src'])
    words = list(clip['words'])
    # فهارس كلمات كل مجموعة آيات في قائمة الكلمات
    idx, cur, run = [], [], False
    for i, (tk, kind) in enumerate(toks):
        if kind == 'ayah':
            cur.append(i); run = True
        elif run and not norm(tk):
            continue
        elif run:
            idx.append(cur); cur = []; run = False
    if cur: idx.append(cur)
    out, pos_src, shift, new_ayah, recite, gaps = [], 0, 0, [], [], []
    for g, (cue, group, wi) in enumerate(zip(cues, groups, idx)):
        g0 = cue - 300  # بداية الوقفة القديمة (voice_build: الآية عند بداية الوقفة + 300)
        old = 0 if legacy else gap_ms(len(wi))
        seg = x[int(g0 * SR / 1000):int((g0 + old) * SR / 1000)]
        if not legacy and len(seg) and 20 * np.log10(np.sqrt((seg[int(0.05 * SR):-int(0.05 * SR) or None] ** 2).mean() + 1e-12)) > -50:
            raise SystemExit(f'{sid}/{key}: الوقفة عند {g0}ms ليست صامتة؛ لا أضع التلاوة فوق كلام')
        pieces, starts, t = [], [], 0
        for bi, block in enumerate(group):
            if bi:
                pieces.append(np.zeros(int(JOIN * SR / 1000), np.float32)); t += JOIN
            for ref in locate(block.split(' ')):
                p, st = recitation(*ref)
                starts += [t + s for s in st]
                pieces.append(p); t += len(p) * 1000 // SR
        rec = loud(np.concatenate(pieces))
        if len(starts) != len(wi):
            raise SystemExit(f'{sid}/{key}: كلمات الآية المعروضة {len(wi)} وكلمات التلاوة {len(starts)}')
        new_g0 = g0 + shift
        out.append(x[int(pos_src * SR / 1000):int(g0 * SR / 1000)])
        out += [np.zeros(int(LEAD * SR / 1000), np.float32), rec, np.zeros(int(TAIL * SR / 1000), np.float32)]
        r0 = new_g0 + LEAD; r1 = r0 + len(rec) * 1000 // SR
        new_len = LEAD + len(rec) * 1000 // SR + TAIL
        for i, s in zip(wi, starts):
            words[i] = r0 + s
        for i in range(wi[0], wi[-1] + 1):  # علامة بين آيتين في المجموعة تأخذ وقت الكلمة السابقة
            if i not in wi:
                words[i] = words[i - 1]
        gaps.append((g0, new_len - old, set(range(wi[0], wi[-1] + 1))))
        delta = new_len - old
        new_ayah.append(new_g0 + 120); recite.append([r0, r1])
        shift += delta; pos_src = g0 + old
    out.append(x[int(pos_src * SR / 1000):])
    inside = set().union(*(g[2] for g in gaps))
    for i, w in enumerate(clip['words']):  # كلام الراوي بعد كل وقفة يتأخر بفرق طولها
        if i not in inside:
            words[i] = words[i - 1] if w is None else w + sum(d for g0, d, _ in gaps if w >= g0)
    y = np.concatenate(out)
    tmp = ROOT / clip['src']
    raw = (np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-c:a', 'libmp3lame', '-b:a', '64k', str(tmp)], input=raw, check=True)
    clip['words'] = words; clip['ayah'] = new_ayah; clip['recite'] = recite
    clip['ms'] = round(len(y) * 1000 / SR)
    return True


def main(ids):
    path = ROOT / 'content/voice.json'
    data = json.load(open(path))
    stories = {s['id']: s for s in json.load(open(ROOT / 'content/stories.json'))['stories']}
    for sid in ids or [k for k in data if not k.startswith('_')]:
        st, entry, done = stories[sid], data[sid], 0
        clips = [(f's{i + 1}', c, st['scenes'][i]['text']) for i, c in enumerate(entry['scenes'])]
        if entry.get('choice'): clips.append(('q', entry['choice'], st['choice']['question']))
        if entry.get('lesson'): clips.append(('lesson', entry['lesson'], st['lesson']))
        for key, clip, text in clips:
            done += process(sid, key, clip, text)
        if done:
            entry['recite'] = QARI
            path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('],"', '],\n"') + '\n')
        print(sid, 'تلاوة في', done, 'مقطع')
        for w in AUDIT: print('  ', w)
        AUDIT.clear()


if __name__ == '__main__':
    main(sys.argv[1:])
