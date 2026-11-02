import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

def inspect(name):
    path = f"C:/Users/Yonatan/Downloads/{name}"
    font = TTFont(path)
    cmap = font.getBestCmap()
    unicodes = sorted(cmap.keys())
    print(f"=== {name} ===")
    print(f"Total glyphs in cmap: {len(unicodes)}")
    
    hebrew = [chr(u) for u in unicodes if 0x0590 <= u <= 0x05FF]
    latin = [chr(u) for u in unicodes if ('a' <= chr(u) <= 'z') or ('A' <= chr(u) <= 'Z')]
    digits = [chr(u) for u in unicodes if '0' <= chr(u) <= '9']
    others = [chr(u) for u in unicodes if chr(u) not in hebrew and chr(u) not in latin and chr(u) not in digits]
    
    print(f"Hebrew ({len(hebrew)}): {''.join(hebrew)}")
    print(f"Latin ({len(latin)}): {''.join(latin)}")
    print(f"Digits ({len(digits)}): {''.join(digits)}")
    print(f"Others ({len(others)}): {' '.join(repr(c) for c in others)}")
    
    # Check head / hhea metrics
    head = font['head']
    print(f"unitsPerEm: {head.unitsPerEm}")
    if 'OS/2' in font:
        os2 = font['OS/2']
        print(f"OS/2 sTypoAscender: {os2.sTypoAscender}, sTypoDescender: {os2.sTypoDescender}, sTypoLineGap: {os2.sTypoLineGap}")
    if 'hhea' in font:
        hhea = font['hhea']
        print(f"hhea ascender: {hhea.ascender}, descender: {hhea.descender}, lineGap: {hhea.lineGap}")
    print()

for f in ['Myfont-Regular.ttf', 'I-Regular.ttf']:
    inspect(f)
