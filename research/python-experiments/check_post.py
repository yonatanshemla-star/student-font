from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

print("f1 post formatType:", font1['post'].formatType)
print("f2 post formatType:", font2['post'].formatType)
print("f1 extra glyphs in post:", len(getattr(font1['post'], 'extraNames', [])))
print("f2 extra glyphs in post:", len(getattr(font2['post'], 'extraNames', [])))
