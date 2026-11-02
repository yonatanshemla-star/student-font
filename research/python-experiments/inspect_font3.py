import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font3 = TTFont("C:/Users/Yonatan/Downloads/Myfontttt-Regular.ttf")
cmap3 = font3.getBestCmap()
glyf3 = font3['glyf']

print(f"Total entries in cmap: {len(cmap3)}")
print(f"Total glyphs in font: {len(font3.getGlyphOrder())}")

for u, g in sorted(cmap3.items()):
    c = glyf3[g].numberOfContours if g in glyf3 else 0
    ch = chr(u) if u >= 32 else repr(chr(u))
    print(f"U+{u:04X} ({ch}): glyph '{g}' (contours={c})")
