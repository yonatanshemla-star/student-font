import sys
import uharfbuzz as hb
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

def trace_shaping(font_path, text):
    blob = hb.Blob.from_file_path(font_path)
    face = hb.Face(blob)
    font = hb.Font(face)
    
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf)
    
    tt = TTFont(font_path)
    cmap = tt.getBestCmap()
    rev_cmap = {v: chr(k) for k, v in cmap.items() if k >= 32}
    order = tt.getGlyphOrder()
    
    chars = [rev_cmap.get(order[info.codepoint], '?') for info in buf.glyph_infos]
    print(f"Text: '{text}'")
    print("Buffer direction:", buf.direction)
    print("Shaped glyph chars (index 0 to n):", chars)

trace_shaping("c:/Projects/פונט/Myfont-Combined.ttf", "בדיקה")
trace_shaping("C:/Windows/Fonts/arial.ttf", "בדיקה")
