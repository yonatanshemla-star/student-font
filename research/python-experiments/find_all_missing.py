from fontTools.ttLib import TTFont
import re

font = TTFont("c:/Projects/פונט/Myfont-Combined.ttf")
cmap = font.getBestCmap()

with open("c:/Projects/פונט/notebook_solution.html", "r", encoding="utf-8") as f:
    html = f.read()

# Strip HTML tags
text = re.sub(r'<[^>]+>', '', html)

missing = {}
for ch in text:
    u = ord(ch)
    if u not in cmap and u not in (10, 13, 9, 32):
        missing[ch] = missing.get(ch, 0) + 1

for ch, count in missing.items():
    print(f"Missing: '{ch}' (U+{ord(ch):04X}) x {count}")
