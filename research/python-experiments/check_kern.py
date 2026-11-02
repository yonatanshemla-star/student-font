from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

print("Font 1 kern:", 'kern' in font1, "GPOS:", 'GPOS' in font1)
print("Font 2 kern:", 'kern' in font2, "GPOS:", 'GPOS' in font2)
