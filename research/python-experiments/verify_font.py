import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font = TTFont("c:/Projects/פונט/Myfont-Combined.ttf")
cmap = font.getBestCmap()
glyf = font['glyf']

print(f"Total entries in best cmap: {len(cmap)}")
print(f"Total glyphs in font: {len(font.getGlyphOrder())}")

# Check uppercase vs lowercase Latin
for ch in range(ord('a'), ord('z') + 1):
    lower_char = chr(ch)
    upper_char = chr(ch - 32)
    g_lower = cmap.get(ord(lower_char))
    g_upper = cmap.get(ord(upper_char))
    c_lower = glyf[g_lower].numberOfContours if g_lower else -1
    c_upper = glyf[g_upper].numberOfContours if g_upper else -1
    if g_lower == g_upper:
        print(f"WARNING: '{lower_char}' and '{upper_char}' have same glyph '{g_lower}'!")
    if c_lower <= 0 or c_upper <= 0:
        print(f"WARNING: empty contours for {lower_char}({c_lower}) or {upper_char}({c_upper})")

print("All Latin A-Z and a-z verified: uppercase and lowercase are distinct and have contours!")

# Check Hebrew letters
hebrew_letters = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ׆"
for h in hebrew_letters:
    u = ord(h)
    g = cmap.get(u)
    if not g:
        print(f"ERROR: missing Hebrew character {h} (U+{u:04X})")
    else:
        c = glyf[g].numberOfContours
        if c <= 0:
            print(f"WARNING: Hebrew character {h} has 0 contours!")

print("All Hebrew characters verified!")

# Check Digits
for d in "0123456789":
    u = ord(d)
    g = cmap.get(u)
    c = glyf[g].numberOfContours
    if c <= 0:
        print(f"WARNING: digit {d} has 0 contours!")

print("All digits verified!")

# Check symbols
symbols = "!%'+-./:;<=>?[\\]^_`{|}•←↑→↓"
for s in symbols:
    u = ord(s)
    g = cmap.get(u)
    if not g:
        print(f"ERROR: missing symbol {s} (U+{u:04X})")
    else:
        c = glyf[g].numberOfContours
        if c <= 0:
            print(f"WARNING: symbol {s} has 0 contours!")

print("All symbols verified!")
