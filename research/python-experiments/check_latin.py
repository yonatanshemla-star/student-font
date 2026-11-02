import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

cmap1 = font1.getBestCmap()
cmap2 = font2.getBestCmap()

print("Font 1 (Myfont-Regular):")
for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz":
    u = ord(c)
    g = cmap1.get(u)
    print(f"{c} (U+{u:04X}) -> {g}", end=", " if u % 8 != 0 else "\n")
print("\n")

print("Font 2 (I-Regular):")
for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz":
    u = ord(c)
    g = cmap2.get(u)
    print(f"{c} (U+{u:04X}) -> {g}", end=", " if u % 8 != 0 else "\n")
print("\n")
