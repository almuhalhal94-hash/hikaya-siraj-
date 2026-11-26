#!/usr/bin/env python3
"""يبني content/daily.json («أذكار يومي») من «حصن المسلم» (hisnmuslim.com/api/ar/<الباب>.json) آليًّا؛ لا يُكتب ذكر باليد.
الآية في دعاء الركوب تُقصّ من api.alquran.cloud عبر tools/ayah.py. الاستعمال: python3 tools/daily_build.py <مجلد ملفات الأبواب>"""
import json, re, sys, os, unicodedata
sys.path.insert(0, os.path.dirname(__file__))
from ayah import ayah

SRC = sys.argv[1]
def chapter(i):
    d = json.load(open(f'{SRC}/{i}.json', encoding='utf-8-sig')); k = next(iter(d)); return k, {x['ID']: x for x in d[k]}
AR = '٠١٢٣٤٥٦٧٨٩'; a = lambda n: ''.join(AR[int(c)] for c in str(n))
def tidy(t): return unicodedata.normalize('NFC', re.sub(r'\s+', ' ', t.replace('ـ', '')).strip(' .)('))
def inner(t):  # ما بين (( )) أو ( ) هو لفظ الذكر
    m = re.findall(r'\(\((.*?)\)\)', t, re.S) or re.findall(r'\((.*?)\)', t, re.S)
    return tidy('، '.join(x.strip(' .،') for x in m))

# [id, عنوان الموقف, أيقونة, [(الباب, رقم الذكر, طريقة الاستخراج أو نص مقطوع حرفيًّا من الذكر, عدد, ملاحظة)]]
G = [
 ('wake', 'إذا استيقظت', 'sun', [(1, 1, None, 1, None)]),
 ('toilet_in', 'عند دخول الخلاء', 'door', [(6, 10, 'raw', 1, 'تُقال قبل الدخول')]),
 ('toilet_out', 'عند الخروج من الخلاء', 'door', [(7, 11, None, 1, None)]),
 ('wudu', 'الوضوء', 'drop', [(8, 12, None, 1, 'قبل الوضوء'), (9, 13, None, 1, 'بعد الوضوء'), (9, 14, None, 1, 'بعد الوضوء')]),
 ('dress', 'عند لبس الثوب', 'shirt', [(2, 5, 'cut:الْحَمْدُ|قُوَّة', 1, None), (3, 6, None, 1, 'إذا لبست ثوبًا جديدًا')]),
 ('out', 'إذا خرجت من البيت', 'door', [(10, 16, None, 1, None)]),
 ('in', 'إذا دخلت البيت', 'home', [(11, 18, 'cut:بِسْمِ اللَّهِ وَلَجْنَا|تَوَكَّلْنَا', 1, 'ثم سلّم على أهلك')]),
 ('ride', 'إذا ركبت السيارة', 'car', [(95, 206, 'ride', 1, None)]),
 ('mosque', 'المسجد', 'mosque', [(13, 20, 'last', 1, 'عند الدخول، وتبدأ برجلك اليمنى'), (14, 21, 'cut:بِسْمِ اللَّهِ وَالصّلَاةُ|الرَّجِيمِ', 1, 'عند الخروج، وتبدأ برجلك اليسرى')]),
 ('adhan', 'إذا سمعت الأذان', 'call', [(15, 22, 'note', 1, None), (15, 25, None, 1, 'بعد الأذان')]),
 ('food', 'الطعام', 'plate', [(69, 178, 'cut:بِسْمِ اللَّهِ|اللَّهِ', 1, 'قبل الأكل'), (69, 178, 'cut:بسمِ اللَّهِ فِي أَوَّلِهِ|وَآخِرِهِ', 1, 'إذا نسيت في أوله'), (70, 180, None, 1, 'بعد الأكل')]),
 ('sneeze', 'إذا عطست', 'sneeze', [(77, 188, 'sneeze', 1, None)]),
 ('thanks', 'لمن أحسن إليك', 'heart', [(87, 198, None, 1, None)]),
 ('anger', 'إذا غضبت', 'flame', [(82, 193, None, 1, None)]),
 ('majlis', 'في آخر المجلس', 'circle', [(85, 196, None, 1, None)]),
 ('rain', 'المطر', 'rain', [(64, 172, None, 1, 'إذا نزل المطر'), (65, 173, None, 1, 'بعد نزول المطر')]),
 ('thunder', 'إذا سمعت الرعد', 'bolt', [(62, 168, None, 1, None)]),
 ('wind', 'إذا هبّت الريح', 'wind', [(61, 166, None, 1, None)]),
 ('hilal', 'إذا رأيت الهلال', 'moon', [(67, 175, None, 1, None)]),
 ('sleep', 'قبل النوم', 'stars', [(28, 99, 'quls', 3, None), (28, 105, None, 1, None), (28, 106, 'tasbih', 1, None)]),
]
out = []
for gid, title, icon, items in G:
    rows = []
    for ch, n, how, count, note in items:
        ctitle, ch_items = chapter(ch); raw = unicodedata.normalize('NFC', ch_items[n]['ARABIC_TEXT'])
        it = {'text': inner(raw), 'count': count, 'source': f'«حصن المسلم»، {ctitle}، رقم {a(n)}'}
        if how == 'raw': it['text'] = tidy(raw.replace('[', '').replace(']', ''))
        elif how and how.startswith('cut:'):
            s, e = (unicodedata.normalize('NFC', x) for x in how[4:].split('|')); t = tidy(raw); assert s in t, (n, s, t); i = t.index(s); it['text'] = t[i:t.index(e, i) + len(e)]
        elif how == 'last': it['text'] = tidy(re.findall(r'\(\((.*?)\)\)', raw)[-1])
        elif how == 'note':
            it['text'] = 'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ'; assert it['text'] in raw
            note = 'تقول مثل ما يقول المؤذن، إلا عند «حيّ على الصلاة» و«حيّ على الفلاح» فتقول:'
        elif how == 'sneeze':
            t = inner(raw); assert 'الْحَمْدُ لِلَّهِ' in t and 'يَرْحَمُكَ اللَّهُ' in t and 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ' in t
            it['lines'] = [['تقول', 'الْحَمْدُ لِلَّهِ'], ['ويقول لك أخوك', 'يَرْحَمُكَ اللَّهُ'], ['فتردّ عليه', 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ']]; it['text'] = ''
        elif how == 'ride':
            post = re.findall(r'\(\((.*?)\)\)', raw[raw.index('﴾'):], re.S)[0]
            q = ayah('43:13').split(' ')[11:] + ayah('43:14').split(' ')
            it['pre'] = 'بِسْمِ اللَّهِ، وَالْحَمْدُ للَّهِ'; assert it['pre'] in raw
            it['quran'] = ' '.join(q); it['ref'] = 'الزخرف: ١٣–١٤ (النص من المصحف بالرسم العثماني)'; it['text'] = tidy(post)
        elif how == 'quls':
            it['text'] = ''; it['surahs'] = [112, 113, 114]
            note = 'تجمع كفّيك، ثم تنفث فيهما وتقرأ: قل هو الله أحد، وقل أعوذ برب الفلق، وقل أعوذ برب الناس، ثم تمسح بهما ما استطعت من جسدك، تبدأ برأسك ووجهك. تفعل ذلك ثلاث مرات.'
        elif how == 'tasbih':
            it['text'] = ''; it['lines'] = [['٣٣ مرة', 'سُبْحَانَ اللَّهِ'], ['٣٣ مرة', 'الْحَمْدُ لِلَّهِ'], ['٣٤ مرة', 'اللَّهُ أَكْبَرُ']]
            for _, x in it['lines']: assert unicodedata.normalize('NFC', x) in raw
        if note: it['note'] = note
        rows.append(it)
    out.append({'id': gid, 'title': title, 'icon': icon, 'items': rows})
data = {'_note': 'مولَّد آليًّا بـ tools/daily_build.py من «حصن المسلم» (hisnmuslim.com/api/ar)؛ لا يُعدَّل باليد. text لفظ الذكر كما في الكتاب (ما بين القوسين)، وما قُصّ من ذكر طويل مقطوع حرفيًّا منه. note توجيه للطفل بالمعنى من نص الكتاب. lines أسطر بأسمائها (العطاس، تسبيح النوم). quran في دعاء الركوب من api.alquran.cloud. surahs يربط بقسم «قرآني».', 'groups': out}
open('content/daily.json', 'w', encoding='utf-8').write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
for g in out:
    for it in g['items']: print(g['id'], '|', it.get('note', ''), '|', it.get('pre', ''), it.get('quran', ''), '|', it['text'] or it.get('lines') or it.get('surahs'))
