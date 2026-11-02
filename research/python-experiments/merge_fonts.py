import os
import sys
import shutil
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._c_m_a_p import CmapSubtable

sys.stdout.reconfigure(encoding='utf-8')

def merge_fonts(font1_path, font2_path, output_ttf_path, output_otf_path, font_family_name="Myfont"):
    font1 = TTFont(font1_path)
    font2 = TTFont(font2_path)

    glyf1 = font1['glyf']
    glyf2 = font2['glyf']
    hmtx1 = font1['hmtx']
    hmtx2 = font2['hmtx']
    
    # 1. Collect glyphs from font2 that are not in font1 (or are real glyphs)
    common_controls = {'.notdef', '.null', 'nonmarkingreturn', 'CR', 'space', 'nbsp'}
    glyphs_to_add = [g for g in font2.getGlyphOrder() if g not in common_controls]
    
    # Existing glyph order in font1
    new_glyph_order = list(font1.getGlyphOrder())
    
    for g in glyphs_to_add:
        glyf1[g] = glyf2[g]
        hmtx1[g] = hmtx2[g]
        if g not in new_glyph_order:
            new_glyph_order.append(g)
            
    font1.setGlyphOrder(new_glyph_order)
    
    # 2. Build the unified unicode cmap
    # In font1, cmap had fallback mappings for lowercase i-z -> uppercase I-Z. We must strip those.
    # In font2, cmap had fallback mappings for uppercase I-Z -> lowercase i-z. We must strip those.
    cmap1 = font1.getBestCmap()
    cmap2 = font2.getBestCmap()
    
    unified_cmap = {}
    
    # From font1:
    for u, g in cmap1.items():
        # Skip fallback lowercase i-z
        if ord('i') <= u <= ord('z') and g.isupper():
            continue
        unified_cmap[u] = g
        
    # From font2:
    for u, g in cmap2.items():
        # Skip fallback uppercase I-Z
        if ord('I') <= u <= ord('Z') and g.islower():
            continue
        # Skip control characters that are already in font1
        if u in unified_cmap and u in (0x00, 0x0D, 0x20, 0xA0):
            continue
        unified_cmap[u] = g

    # Now apply unified_cmap to font1's cmap table
    # Update format 4 subtables, and format 0 subtable
    for subtable in font1['cmap'].tables:
        if subtable.format == 4:
            subtable.cmap = dict(unified_cmap)
        elif subtable.format == 0:
            # Format 0 only supports byte codes 0-255
            subtable.cmap = {u: g for u, g in unified_cmap.items() if u < 256}
        elif hasattr(subtable, 'cmap'):
            subtable.cmap = dict(unified_cmap)
            
    # 3. Update metrics and bounds
    # Head table
    font1['head'].yMin = min(font1['head'].yMin, font2['head'].yMin)
    font1['head'].yMax = max(font1['head'].yMax, font2['head'].yMax)
    
    # hhea table
    font1['hhea'].descender = min(font1['hhea'].descender, font2['hhea'].descender)
    font1['hhea'].ascender = max(font1['hhea'].ascender, font2['hhea'].ascender)
    
    # OS/2 table
    os2_1 = font1['OS/2']
    os2_2 = font2['OS/2']
    os2_1.usWinDescent = max(os2_1.usWinDescent, os2_2.usWinDescent, abs(font1['hhea'].descender))
    os2_1.usWinAscent = max(os2_1.usWinAscent, os2_2.usWinAscent, font1['hhea'].ascender)
    os2_1.ulUnicodeRange1 |= os2_2.ulUnicodeRange1
    os2_1.ulUnicodeRange2 |= os2_2.ulUnicodeRange2
    os2_1.ulUnicodeRange3 |= os2_2.ulUnicodeRange3
    os2_1.ulUnicodeRange4 |= os2_2.ulUnicodeRange4
    os2_1.ulCodePageRange1 |= os2_2.ulCodePageRange1
    os2_1.ulCodePageRange2 |= os2_2.ulCodePageRange2
    
    # Set proper first/last char index
    os2_1.usFirstCharIndex = min(unified_cmap.keys())
    os2_1.usLastCharIndex = max(unified_cmap.keys())
    
    # 4. Update font names
    # Name IDs: 1 = Family, 2 = Subfamily, 3 = Unique ID, 4 = Full Name, 6 = PostScript Name
    name_table = font1['name']
    subfamily = "Regular"
    full_name = f"{font_family_name} {subfamily}"
    ps_name = f"{font_family_name}-{subfamily}".replace(" ", "")
    
    for record in name_table.names:
        if record.nameID == 1:
            record.string = font_family_name
        elif record.nameID == 2:
            record.string = subfamily
        elif record.nameID == 4:
            record.string = full_name
        elif record.nameID == 6:
            record.string = ps_name
            
    # Recalculate maxp
    font1['maxp'].recalc(font1)
    
    # Recalculate hhea metrics
    font1['hhea'].recalc(font1)
    
    # Save TTF
    font1.save(output_ttf_path)
    print(f"Saved merged TTF to: {output_ttf_path}")
    
    # If OTF is also needed (Calligraphr provided both TTF and OTF with identical TrueType format)
    shutil.copyfile(output_ttf_path, output_otf_path)
    print(f"Saved merged OTF to: {output_otf_path}")
    
    return unified_cmap

if __name__ == "__main__":
    unified_cmap = merge_fonts(
        "C:/Users/Yonatan/Downloads/Myfont-Regular.ttf",
        "C:/Users/Yonatan/Downloads/I-Regular.ttf",
        "c:/Projects/פונט/Myfont-Combined.ttf",
        "c:/Projects/פונט/Myfont-Combined.otf"
    )
    print(f"Total unified characters: {len(unified_cmap)}")
