import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

glyf1 = font1['glyf']
glyf2 = font2['glyf']
cmap1 = font1.getBestCmap()
cmap2 = font2.getBestCmap()

common_unicodes = set(cmap1.keys()) & set(cmap2.keys())
print(f"Common unicodes count: {len(common_unicodes)}")
for u in sorted(common_unicodes):
    ch = chr(u) if u >= 32 else f"\\x{u:02x}"
    g1 = cmap1[u]
    g2 = cmap2[u]
    c1 = glyf1[g1].numberOfContours
    c2 = glyf2[g2].numberOfContours
    print(f"U+{u:04X} ({ch}): font1 glyph '{g1}' (contours={c1}), font2 glyph '{g2}' (contours={c2})")

