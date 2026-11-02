import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font = TTFont("c:/Projects/פונט/Myfont-Combined.ttf")
hmtx = font['hmtx']
glyf = font['glyf']
cmap = font.getBestCmap()

sample_chars = "אבגדהוזחטיכלמנסעפצקרשתabcABC0123+-=•αβγ"

print(f"{'Char':<6} {'Glyph':<12} {'AdvWidth':<10} {'lsb':<8} {'xMin':<8} {'xMax':<8} {'rsb':<8} {'GlyphWidth':<10}")
print("-" * 75)

for ch in sample_chars:
    u = ord(ch)
    g = cmap.get(u)
    if not g:
        continue
    adv, lsb = hmtx[g]
    glyph = glyf[g]
    if glyph.numberOfContours > 0:
        xMin = glyph.xMin
        xMax = glyph.xMax
        rsb = adv - xMax
        gw = xMax - xMin
    else:
        xMin = xMax = rsb = gw = 0
    print(f"{ch:<6} {g:<12} {adv:<10} {lsb:<8} {xMin:<8} {xMax:<8} {rsb:<8} {gw:<10}")
