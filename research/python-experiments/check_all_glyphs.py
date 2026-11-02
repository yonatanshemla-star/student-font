import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

print("=== Font1 (Myfont-Regular) glyphs ===")
for g in font1.getGlyphOrder():
    c = font1['glyf'][g].numberOfContours
    print(f"{g}: contours={c}", end=", ")
print("\n")

print("=== Font2 (I-Regular) glyphs ===")
for g in font2.getGlyphOrder():
    c = font2['glyf'][g].numberOfContours
    print(f"{g}: contours={c}", end=", ")
print("\n")

