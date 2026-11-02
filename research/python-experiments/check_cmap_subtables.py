from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
for t in font1['cmap'].tables:
    print(t.platformID, t.platEncID, t.format)
