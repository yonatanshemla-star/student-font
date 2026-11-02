from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
print([m for m in dir(font1['maxp']) if 'recalc' in m.lower() or 'calc' in m.lower()])
