from fontTools.ttLib import TTFont

font = TTFont("c:/Projects/פונט/Myfont-Combined.ttf")
cmap = font.getBestCmap()

def check_text(text):
    missing = set()
    for ch in text:
        u = ord(ch)
        if u not in cmap and u not in (10, 13, 9): # skip newline/tab
            missing.add(ch)
    return missing

sample = """
y(t) = 7 • u(t)
y'(t) = 7 • u'(t)
y(t - τ) = 7 • u(t - τ)
y(t) = 6 • u(t) + 4
u(t) = 0 -> y(t) = 4 ≠ 0
y(t) = t • u(t)
y(t - τ) = (t - τ) • u(t - τ) ≠ t • u(t - τ)
y(t) = t^3 • u(t - 2) + 4
y(t) = t • u''(t) + t^2 • u(t)
"""
print("Missing in sample:", [f"{c} (U+{ord(c):04X})" for c in check_text(sample)])
