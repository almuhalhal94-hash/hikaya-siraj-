#!/usr/bin/env python3
"""مسار الصوت لكلمة: النغمة والشدة وF1/F2 كل 25ms، لفحص حركة أو حرف يشك فيه التفريغ.
الاستعمال: python3 tools/voice_track.py <wav> <من ث> <إلى ث>"""
import sys
import parselmouth as pm
x = pm.Sound(sys.argv[1]); a, b = float(sys.argv[2]), float(sys.argv[3])
s = x.extract_part(from_time=a, to_time=b, preserve_times=True)
f = s.to_formant_burg(max_number_of_formants=5, maximum_formant=6500); p = s.to_pitch(); it = s.to_intensity()
g = lambda v: 0 if (v is None or v != v) else round(v)
t = a + 0.02
while t < b - 0.02:
    print(f'{t:7.3f} f0={g(p.get_value_at_time(t)):4} dB={g(it.get_value(t)):3} F1={g(f.get_value_at_time(1, t)):5} F2={g(f.get_value_at_time(2, t)):5}')
    t += 0.025
