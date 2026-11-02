import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
cmap1 = font1.getBestCmap()

for u, g in sorted(cmap1.items()):
    print(f"U+{u:04X} ({chr(u) if u >= 32 else repr(chr(u))}): {g}")
