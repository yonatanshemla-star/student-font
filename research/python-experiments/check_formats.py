from fontTools.ttLib import TTFont

for name in ['Myfont-Regular.ttf', 'Myfont-Regular.otf', 'I-Regular.ttf', 'I-Regular.otf']:
    f = TTFont(f"C:/Users/Yonatan/Downloads/{name}")
    tables = list(f.keys())
    is_cff = 'CFF ' in tables or 'CFF2' in tables
    is_glyf = 'glyf' in tables
    print(f"{name}: flavor={f.flavor}, sfntVersion={repr(f.sfntVersion)}, has_cff={is_cff}, has_glyf={is_glyf}")
