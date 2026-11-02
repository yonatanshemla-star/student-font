from fontTools.ttLib import TTFont

font = TTFont("c:/Projects/פונט/Myfont-Combined.ttf")
for r in font['name'].names:
    print(r.nameID, r.platformID, r.platEncID, repr(r.toUnicode()))
