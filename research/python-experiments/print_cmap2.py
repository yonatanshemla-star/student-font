import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")
cmap2 = font2.getBestCmap()

for u, g in sorted(cmap2.items()):
    print(f"U+{u:04X} ({chr(u) if u >= 32 else repr(chr(u))}): {g}")
