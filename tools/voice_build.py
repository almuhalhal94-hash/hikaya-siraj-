#!/usr/bin/env python3
"""يبني التعليق الصوتي لحكاية كاملة من تسجيل واحد (أرخص من توليد كل مقطع وحده).

المدخلات:
  tools/voice/<id>.script.json  النص المنطوق مشكولًا لكل مقطع (s1..s6, q, lesson). علامة ﴿﴾ تحدد موضع
                                الآية التي لا تُقرأ (يُستعمل سطرًا جديدًا عند التوليد ليقف الصوت).
  tools/voice/<id>.full.json    تفريغ التسجيل الكامل بتوقيت الكلمات [{text,start_ms,end_ms}].
  <raw.wav>                     التسجيل الكامل (Speko munsit، الصوت Mayssa).

ما يفعله: يطابق كلمات نص الحكاية المعروض بكلمات التفريغ، ويقص التسجيل عند أهدأ نقطة بين المقاطع،
ويضع عند كل آية وقفةً صامتة تظهر فيها الآية مضيئة (الآيات لا تُقرأ بصوت مولَّد)، ثم يحوّل كل مقطع
إلى صوت طفل (tools/voice_child.py) ويكتب content/voice.json[<id>].

الاستعمال:
  python3 tools/voice_build.py text <id>               نص التوليد (المقاطع مفصولة بأسطر)
  python3 tools/voice_build.py build <id> <raw.wav> "وصف الصوت"
"""
import json, re, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from voice_align import norm, tokens  # noqa: E402
from voice_child import main as childify  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
AYAH = '﴿﴾'
SR = 24000


def clips_of(story):
    out = [(f's{i + 1}', sc['text']) for i, sc in enumerate(story['scenes'])]
    if story.get('choice'):
        out.append(('q', story['choice']['question']))
    out.append(('lesson', story['lesson']))
    return out


HARAKA = 'ًٌٍَُِْ'


def waqf(text):
    """الوقف بالسكون على آخر كلمة قبل علامات الوقف (. ! ؟ : …) وآخر النص، وتنوين الفتح يُقرأ ألفًا."""
    def fix(m):
        w, tail = m.group(1), m.group(2)
        if re.search('ة[ًٌٍَُِ]$', w):
            return w[:-1] + 'ْ' + tail
        if w.endswith('ً') or w.endswith('ًّ'):
            return w.rstrip('ًّ') + ('ّ' if 'ّ' in w[-2:] else '') + 'َ' + tail
        if re.search('يَّ$|يَّ$', w):  # فِيَّ، إِلَيَّ: بلا ألف يُنطق «فِي/فِيه» (قيس بـ Praat)، وبالألف «فِيَّا» صحيح
            return w + 'ا' + tail
        if re.search('ّ[َُِ]$|[َُِ]ّ$', w):  # بقية المشدّد في آخر الكلمة يُقرأ بحركته لئلا يلتبس
            return w + tail
        core = w.rstrip('ٌٍَُِّ')
        if core != w and not re.search('[اىو]$', core):
            return core + ('ّ' if 'ّ' in w[len(core):] else '') + 'ْ' + tail
        return w + tail
    return re.sub(r'([^\s.!؟?:…«»،]+)((?:\.\.\.|[.!؟?:…»،])+|$)', fix, text)


def synth_text(script, keys):
    return '\n\n'.join(waqf(script[k].replace(AYAH, '').strip()).replace(': ', ':\n').replace('...', '،').replace('…', '،') for k in keys)


WARN = []
HEARD = {}


def near(a, b):
    """فرق حرف واحد بين كلمتين طولهما 3 فأكثر."""
    if min(len(a), len(b)) < 3 or abs(len(a) - len(b)) > 1:
        return False
    if len(a) == len(b):
        return sum(x != y for x, y in zip(a, b)) <= 1
    s, l = sorted((a, b), key=len)
    return any(l[:i] + l[i + 1:] == s for i in range(len(l)))


def match(display, spoken, label):
    """يعيد لكل مقطع قائمة: رقم أول كلمة منطوقة لكل كلمة معروضة، أو 'A' للآية."""
    j, res = 0, {}
    for key, text in display:
        row = []
        for tok, kind in tokens(text):
            if kind == 'ayah':
                row.append('A'); continue
            need = ['صلي', 'الله', 'عليه', 'وسلم'] if 'ﷺ' in tok else [norm(tok)]
            if not need[0]:
                row.append(None); continue
            k = next((x for x in range(j, min(j + 4, len(spoken))) if spoken[x] == need[0]), None)
            if k is None and need[0] in HEARD:  # خطأ تفريغ تحقّقتُ منه بقياس الصوت (tools/voice/<id>.heard.json)
                k = next((x for x in range(j, min(j + 2, len(spoken))) if spoken[x] == HEARD[need[0]]), None)
            if k is None:  # قرب في الكتابة (حرف زائد أو ناقص): يُقبل ويُسجَّل للسماع
                k = next((x for x in range(j, min(j + 2, len(spoken))) if near(spoken[x], need[0])), None)
                if k is not None:
                    WARN.append(f'{key}: المكتوب «{tok}» وسمعه التفريغ «{spoken[k]}»')
            if k is None:
                raise SystemExit(f'{label}/{key}: لم أجد «{tok}» قرب الكلمة {j}: {spoken[j:j + 5]}')
            row.append((k, k + len(need) - 1))
            j = k + len(need)
        res[key] = row
    if j < len(spoken) - 2:
        raise SystemExit(f'{label}: بقيت كلمات منطوقة بلا مقابل: {spoken[j:]}')
    return res


def read_wav(p):
    w = wave.open(str(p))
    assert w.getnchannels() == 1 and w.getsampwidth() == 2
    global SR
    SR = w.getframerate()
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)


def quiet_cut(x, a_ms, b_ms):
    """أهدأ نقطة بين a وb (نافذة 20ms)."""
    a, b = int(a_ms * SR / 1000), int(b_ms * SR / 1000)
    a, b = max(0, a), min(len(x), max(b, a + 1))
    win = int(0.02 * SR)
    if b - a <= win:
        return (a + b) // 2
    e = np.convolve(x[a:b] ** 2, np.ones(win) / win, mode='valid')
    lo = e.min() * 4 + 1e3
    quiet = e <= lo
    # مركز أطول مقطع هادئ
    best, run, start = (0, int(np.argmin(e))), 0, 0
    for i, q in enumerate(quiet):
        if q:
            if run == 0: start = i
            run += 1
            if run > best[0]: best = (run, start + run // 2)
        else:
            run = 0
    return a + best[1] + win // 2


def trim(seg, keep_ms=140):
    """يقص الصمت الزائد في الطرفين ويترك keep_ms."""
    win = int(0.01 * SR)
    if len(seg) < win * 4:
        return seg, 0
    e = np.sqrt(np.convolve(seg ** 2, np.ones(win) / win, mode='same'))
    on = np.where(e > max(e.max() * 0.03, 60))[0]
    if not len(on):
        return seg, 0
    k = int(keep_ms * SR / 1000)
    s, t = max(0, on[0] - k), min(len(seg), on[-1] + k)
    return seg[s:t], s


def gap_ms(n):
    return int(min(9000, max(2000, 1400 + 420 * n)))


def write_wav(p, x):
    w = wave.open(str(p), 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(np.clip(x, -32768, 32767).astype(np.int16).tobytes()); w.close()


def duration(mp3):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)],
                       capture_output=True, text=True, check=True)
    return round(float(r.stdout) * 1000)


def build(sid, raw, desc):
    story = next(s for s in json.load(open(ROOT / 'content/stories.json'))['stories'] if s['id'] == sid)
    full = json.load(open(ROOT / f'tools/voice/{sid}.full.json'))
    words = full['words'] if isinstance(full, dict) else full
    if words and isinstance(words[0], list):  # الصيغة المختصرة: [كلمة، بداية، نهاية]
        st = [w[1] for w in words] + [words[-1][1] + 600]
        words = [{'text': w[0], 'start_ms': w[1], 'end_ms': w[2] if len(w) > 2 else st[i + 1]} for i, w in enumerate(words)]
    spoken = [norm(w['text']) for w in words]
    # كلمة فارغة بعد التطبيع (علامة أو رقم) تُحذف
    keep = [i for i, s in enumerate(spoken) if s]
    words = [words[i] for i in keep]; spoken = [spoken[i] for i in keep]
    display = clips_of(story)
    hp = ROOT / f'tools/voice/{sid}.heard.json'
    if hp.exists():
        HEARD.update(json.load(open(hp)))
    m = match(display, spoken, sid)
    x = read_wav(raw)

    # حدود كل قطعة منطوقة (بين الآيات وبين المقاطع)
    pieces = []  # (key, [(k0,k1)...]) قطعة = كلمات متتالية بلا آية بينها
    for key, _ in display:
        cur, segs = [], []
        for r in m[key]:
            if r == 'A':
                if cur: segs.append(cur); cur = []
                if not segs or segs[-1] != 'A': segs.append('A')
            elif r:
                cur.append(r)
        if cur: segs.append(cur)
        pieces.append((key, segs))
    flat = [s for _, segs in pieces for s in segs if s != 'A']
    cuts = [0]
    for a, b in zip(flat, flat[1:]):
        ea, sb = words[a[-1][1]]['end_ms'], words[b[0][0]]['start_ms']
        lo, hi = min(ea, sb) - 120, max(ea, sb) + 120
        lo = max(lo, words[a[-1][1]]['start_ms'] + 60); hi = min(hi, words[b[0][0]]['end_ms'] - 60)
        cuts.append(quiet_cut(x, lo, hi))
    cuts.append(len(x))

    base = f'assets/voice/{sid}'
    (ROOT / base).mkdir(parents=True, exist_ok=True)
    entry = {'voice': desc, 'scenes': []}
    fi = 0
    tmp = Path(tempfile.mkdtemp())
    for key, segs in pieces:
        audio, times, ayahs = [], [], []
        pos = 0  # عيّنات
        ayah_words = {}
        disp = tokens(dict(display)[key])
        # عدد كلمات كل آية بالترتيب
        counts, run = [], 0
        for _, kind in disp:
            if kind == 'ayah': run += 1
            elif run: counts.append(run); run = 0
        if run: counts.append(run)
        ai = 0
        seg_start_ms = {}
        for s in segs:
            if s == 'A':
                g = gap_ms(counts[ai]); ayahs.append(round(pos / SR * 1000) + 300)
                ayah_words[ai] = (round(pos / SR * 1000) + 300, max(160, min(420, (g - 900) // max(1, counts[ai]))))
                audio.append(np.zeros(int(g * SR / 1000), np.float32)); pos += int(g * SR / 1000); ai += 1
                continue
            seg, off = trim(x[cuts[fi]:cuts[fi + 1]])
            seg_start_ms[id(s)] = (pos, cuts[fi] + off)
            audio.append(seg); pos += len(seg); fi += 1
        # توقيت كل كلمة معروضة
        ai, inayah, last = 0, 0, 0
        segi = iter([s for s in segs if s != 'A'])
        cur = next(segi, None); cur_set = {r for r in (cur or [])}
        for r, (tok, kind) in zip(m[key], disp):
            if r == 'A':
                t0, step = ayah_words[ai]
                last = t0 + inayah * step; times.append(last); inayah += 1
                continue
            if inayah:
                ai += 1; inayah = 0
            if r is None:
                times.append(last); continue
            while cur is not None and r not in cur_set:
                cur = next(segi, None); cur_set = {q for q in (cur or [])}
            p0, src0 = seg_start_ms[id(cur)]
            t = round((p0 + words[r[0]]['start_ms'] * SR / 1000 - src0) / SR * 1000)
            last = max(0, t); times.append(last)
        wav = tmp / f'{key}.wav'
        write_wav(wav, np.concatenate(audio))
        mp3 = ROOT / base / f'{key}.mp3'
        childify(str(wav), str(mp3))
        clip = {'src': f'{base}/{key}.mp3', 'ms': duration(mp3), 'words': times}
        if ayahs: clip['ayah'] = ayahs
        if key == 'q': entry['choice'] = clip
        elif key == 'lesson': entry['lesson'] = clip
        else: entry['scenes'].append(clip)

    path = ROOT / 'content/voice.json'
    data = json.load(open(path))
    data[sid] = entry
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('],"', '],\n"') + '\n')
    print(sid, [c['ms'] for c in entry['scenes']], 'ok')
    for w in WARN:
        print('  للسماع:', w)
    rev = ROOT / 'tools/voice/review.json'
    r = json.load(open(rev)) if rev.exists() else {}
    r[sid] = WARN
    rev.write_text(json.dumps(r, ensure_ascii=False, indent=1) + '\n')


if __name__ == '__main__':
    cmd, sid = sys.argv[1], sys.argv[2]
    if cmd == 'text':
        story = next(s for s in json.load(open(ROOT / 'content/stories.json'))['stories'] if s['id'] == sid)
        script = json.load(open(ROOT / f'tools/voice/{sid}.script.json'))
        print(synth_text(script, [k for k, _ in clips_of(story)]))
    else:
        build(sid, sys.argv[3], sys.argv[4])
