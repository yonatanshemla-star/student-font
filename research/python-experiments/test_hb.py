import uharfbuzz as hb
from fontTools.ttLib import TTFont

blob = hb.Blob.from_file_path("c:/Projects/פונט/Myfont-Combined.ttf")
face = hb.Face(blob)
font = hb.Font(face)

buf = hb.Buffer()
buf.add_str("זהו")
buf.guess_segment_properties()
print("Direction:", buf.direction)
print("Script:", buf.script)
print("Language:", buf.language)

hb.shape(font, buf)

infos = buf.glyph_infos
positions = buf.glyph_positions

for info, pos in zip(infos, positions):
    print(f"glyph_id={info.codepoint}, x_advance={pos.x_advance}, x_offset={pos.x_offset}")

tt = TTFont("c:/Projects/פונט/Myfont-Combined.ttf")
rev = {i: name for i, name in enumerate(tt.getGlyphOrder())}
print("Glyph order shaped:", [rev[info.codepoint] for info in infos])
