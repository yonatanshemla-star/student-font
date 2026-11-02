from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

g1 = set(font1.getGlyphOrder())
g2 = set(font2.getGlyphOrder())

common = g1 & g2
print("Common glyph names:", common)
print("Glyphs only in font1:", len(g1 - g2))
print("Glyphs only in font2:", len(g2 - g1))
