import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")
cmap2 = font2.getBestCmap()
rev = {v: k for k, v in cmap2.items()}

for g in font2.getGlyphOrder():
    u = rev.get(g)
    if u:
        ch = chr(u)
        print(f"glyph '{g}' -> U+{u:04X} ('{ch}')")
    else:
        print(f"glyph '{g}' -> No unicode")
