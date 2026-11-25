#!/usr/bin/env python3
"""يربط توقيت كلمات التعليق الصوتي بكلمات نص الحكاية كما تُعرض في المشغّل.

المدخلات (في tools/voice/):
  <id>.words.json  توقيت كل كلمة منطوقة بالملّي ثانية لكل مقطع (s1..s6, q, lesson)،
                   من تفريغ المقطع الأصلي (Speko audio_transcribe مع word_timestamps).
والصوت في assets/voice/<id>/<مقطع>.mp3.

المخرج: يكتب content/voice.json[<id>] = لكل مشهد مصدر الصوت ومدة المقطع وبداية كل كلمة معروضة
(بنفس تقسيم renderText في js/views/stories.js). كلمات الآيات ﴿﴾ لا تُنطق بصوت مولَّد: توقيتها null
فتظهر بعد انتهاء الصوت.

الاستعمال: python3 tools/voice_align.py ghar-thawr "وصف الصوت"
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HARAKAT = re.compile('[ً-ْٰـ]')


def norm(w):
    w = HARAKAT.sub('', w)
    w = re.sub(r'[^ء-ي]', '', w)
    for a, b in (('أ', 'ا'), ('إ', 'ا'), ('آ', 'ا'), ('ٱ', 'ا'), ('ى', 'ي'), ('ة', 'ه'), ('ؤ', 'و'), ('ئ', 'ي')):
        w = w.replace(a, b)
    return w


def tokens(text):
    """نفس تقسيم renderText: أجزاء «» و﴿﴾ ثم المسافات."""
    out = []
    for part in re.split(r'(﴿[^﴾]*﴾|«[^»﴿]*»)', text):  # قول فيه آية لا يُعدّ جزءًا واحدًا: الآية تنفصل
        kind = 'ayah' if part.startswith('﴿') else ''
        out += [(w, kind) for w in part.split() if w]
    return out


def duration(mp3):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(mp3)],
                       capture_output=True, text=True, check=True)
    return round(float(r.stdout) * 1000)


def align(text, words, label):
    spoken = [(norm(w), ms) for w, ms in words]
    j, starts = 0, []
    for tok, kind in tokens(text):
        if kind == 'ayah':
            starts.append(None); continue
        if 'ﷺ' in tok:
            need = ['صلي', 'الله', 'عليه', 'وسلم']
        else:
            need = [norm(tok)]
            if not need[0]:
                starts.append(starts[-1] if starts else 0); continue
        # ابحث عن أول كلمة مطلوبة قريبًا (يسمح بكلمة زائدة في التفريغ)
        k = next((x for x in range(j, min(j + 3, len(spoken))) if spoken[x][0] == need[0]), None)
        if k is None:
            raise SystemExit(f'{label}: لم أجد «{tok}» قرب الكلمة {j} في التفريغ: {[s for s, _ in spoken[j:j+4]]}')
        starts.append(spoken[k][1])
        j = k + len(need)
    if j != len(spoken):
        raise SystemExit(f'{label}: بقيت كلمات منطوقة بلا مقابل في النص: {[s for s, _ in spoken[j:]]}')
    return starts


def main():
    sid, voice_desc = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else '')
    story = next(s for s in json.load(open(ROOT / 'content/stories.json'))['stories'] if s['id'] == sid)
    words = json.load(open(ROOT / f'tools/voice/{sid}.words.json'))
    base = f'assets/voice/{sid}'

    def clip(key, text):
        src = f'{base}/{key}.mp3'
        return {'src': src, 'ms': duration(ROOT / src), 'words': align(text, words[key], key)}

    entry = {
        'voice': voice_desc,
        'scenes': [clip(f's{i + 1}', sc['text']) for i, sc in enumerate(story['scenes'])],
    }
    if story.get('choice') and 'q' in words:
        entry['choice'] = clip('q', story['choice']['question'])
    if 'lesson' in words:
        entry['lesson'] = clip('lesson', story['lesson'])

    path = ROOT / 'content/voice.json'
    data = json.load(open(path)) if path.exists() else {
        '_schema': 'التعليق الصوتي لكل حكاية (المفتاح = id القصة). لكل مشهد: src ملف الصوت، ms مدته، words بداية كل كلمة معروضة بالملّي ثانية (null لكلمات الآيات: لا تُقرأ بصوت مولَّد وتظهر بعد انتهاء الصوت). choice سؤال الاختيار، lesson الدرس. يُولَّد بـ tools/voice_align.py ولا يُعدَّل باليد.'}
    data[sid] = entry
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('],"', '],\n"') + '\n')
    print(sid, [c['ms'] for c in entry['scenes']], 'ok')


if __name__ == '__main__':
    main()
