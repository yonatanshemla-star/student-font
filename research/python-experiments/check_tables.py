from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

print("Font 1 tables:", font1.keys())
print("Font 2 tables:", font2.keys())

for tag in ['head', 'hhea', 'maxp', 'OS/2', 'post', 'name']:
    t1 = font1[tag]
    t2 = font2[tag]
    print(f"\n--- Table {tag} ---")
    if tag == 'head':
        print("f1 upem:", t1.unitsPerEm, "f2 upem:", t2.unitsPerEm)
        print("f1 yMin/yMax:", t1.yMin, t1.yMax, "f2 yMin/yMax:", t2.yMin, t2.yMax)
    elif tag == 'hhea':
        print("f1 asc/desc/linegap:", t1.ascender, t1.descender, t1.lineGap)
        print("f2 asc/desc/linegap:", t2.ascender, t2.descender, t2.lineGap)
    elif tag == 'OS/2':
        print("f1 typoAsc/Desc/Gap:", t1.sTypoAscender, t1.sTypoDescender, t1.sTypoLineGap)
        print("f2 typoAsc/Desc/Gap:", t2.sTypoAscender, t2.sTypoDescender, t2.sTypoLineGap)
        print("f1 winAsc/Desc:", t1.usWinAscent, t1.usWinDescent)
        print("f2 winAsc/Desc:", t2.usWinAscent, t2.usWinDescent)
    elif tag == 'name':
        for r in t1.names:
            if r.nameID in [1, 2, 4, 6]:
                print("f1 name:", r.nameID, r.toUnicode())
        for r in t2.names:
            if r.nameID in [1, 2, 4, 6]:
                print("f2 name:", r.nameID, r.toUnicode())

