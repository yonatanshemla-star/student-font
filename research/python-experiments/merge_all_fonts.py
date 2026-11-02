import sys
import shutil
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

def merge_math_font(base_font_path, math_font_path, out_ttf_path, out_otf_path):
    base_font = TTFont(base_font_path)
    math_font = TTFont(math_font_path)
    
    glyf_base = base_font['glyf']
    glyf_math = math_font['glyf']
    hmtx_base = base_font['hmtx']
    hmtx_math = math_font['hmtx']
    
    common_controls = {'.notdef', '.null', 'nonmarkingreturn', 'CR', 'space', 'nbsp'}
    new_glyph_order = list(base_font.getGlyphOrder())
    
    glyphs_to_add = [g for g in math_font.getGlyphOrder() if g not in common_controls]
    
    for gname in glyphs_to_add:
        glyph = glyf_math[gname]
        adv, lsb = hmtx_math[gname]
        
        # Calculate bounds
        glyph.recalcBounds(glyf_math)
        xMin = glyph.xMin
        xMax = glyph.xMax
        gw = xMax - xMin
        
        # Determine target side bearings
        if gname == 'comma':
            target_lsb = 2
            target_rsb = 8
        elif gname in ('tau', 'rho', 'sigma'):
            target_lsb = 4
            target_rsb = 4
        else:
            # Math operators, integrals, summation, notequal, etc.
            target_lsb = 4
            target_rsb = 4
            
        dx = target_lsb - xMin
        if dx != 0:
            glyph.coordinates += (dx, 0)
            glyph.recalcBounds(glyf_math)
            
        new_lsb = target_lsb
        new_adv = target_lsb + gw + target_rsb
        
        glyf_base[gname] = glyph
        hmtx_base[gname] = (new_adv, new_lsb)
        
        if gname not in new_glyph_order:
            new_glyph_order.append(gname)
            
    base_font.setGlyphOrder(new_glyph_order)
    
    # Update cmap
    cmap_base = base_font.getBestCmap()
    cmap_math = math_font.getBestCmap()
    
    unified_cmap = dict(cmap_base)
    for u, g in cmap_math.items():
        if u in (0x00, 0x0D, 0x20, 0xA0):
            continue
        unified_cmap[u] = g
        
    # Additional convenient mappings for standard math typing
    if 'asteriskmath' in glyf_base:
        unified_cmap[0x002A] = 'asteriskmath' # ASCII '*'
    if 'dotmath' in glyf_base:
        unified_cmap[0x00B7] = 'dotmath'      # Middle dot '·'
    if 'minus' in glyf_base:
        unified_cmap[0x2212] = 'minus'        # Unicode minus '−'
        
    # Apply unified cmap to all sub-tables
    for subtable in base_font['cmap'].tables:
        if subtable.format == 4:
            subtable.cmap = dict(unified_cmap)
        elif subtable.format == 0:
            subtable.cmap = {u: g for u, g in unified_cmap.items() if u < 256}
        elif hasattr(subtable, 'cmap'):
            subtable.cmap = dict(unified_cmap)
            
    # Update OS/2 unicode ranges (bit 38: Mathematical Operators 0x2200-0x22FF)
    os2 = base_font['OS/2']
    os2.ulUnicodeRange2 |= (1 << (38 - 32)) # Math operators
    os2.ulUnicodeRange1 |= (1 << 7)         # Greek
    os2.ulUnicodeRange1 |= (1 << 11)        # Hebrew
    
    # Recalculate maxp & hhea & head
    base_font['maxp'].recalc(base_font)
    base_font['hhea'].recalc(base_font)
    base_font['head'].xMin = min(g.xMin for g in glyf_base.glyphs.values() if hasattr(g, 'xMin'))
    base_font['head'].xMax = max(g.xMax for g in glyf_base.glyphs.values() if hasattr(g, 'xMax'))
    base_font['head'].yMin = min(g.yMin for g in glyf_base.glyphs.values() if hasattr(g, 'yMin'))
    base_font['head'].yMax = max(g.yMax for g in glyf_base.glyphs.values() if hasattr(g, 'yMax'))
    
    base_font.save(out_ttf_path)
    shutil.copyfile(out_ttf_path, out_otf_path)
    print("Merged and saved unified font!")
    print(f"Total glyphs: {len(base_font.getGlyphOrder())}")
    print(f"Total cmap characters: {len(unified_cmap)}")

if __name__ == "__main__":
    merge_math_font(
        "c:/Projects/פונט/Myfont-Combined.ttf",
        "C:/Users/Yonatan/Downloads/Myfontttt-Regular.ttf",
        "c:/Projects/פונט/Myfont-Combined.ttf",
        "c:/Projects/פונט/Myfont-Combined.otf"
    )
