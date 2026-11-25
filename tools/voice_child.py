#!/usr/bin/env python3
"""يحوّل مقطع صوت الراوية (wav من Speko) إلى صوت طفل ويصدّره mp3 للموقع.

parselmouth «Change gender» (formant 1.15، pitch 275) ← highpass 70 ← loudnorm -16 LUFS ← mp3 أحادي 56k.
الاستعمال: python3 tools/voice_child.py <in.wav> <out.mp3>
"""
import subprocess, sys, tempfile
import parselmouth as pm
from parselmouth.praat import call


def main(src, dst):
    s = pm.Sound(src)
    c = call(s, 'Change gender', 75, 600, 1.15, 275, 1.1, 1.0)
    with tempfile.NamedTemporaryFile(suffix='.wav') as t:
        c.save(t.name, 'WAV')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', t.name, '-af',
                        'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=7', '-ac', '1', '-ar', '44100',
                        '-c:a', 'libmp3lame', '-b:a', '56k', dst], check=True)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
