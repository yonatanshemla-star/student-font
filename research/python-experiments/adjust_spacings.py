import sys
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

def adjust_font_spacing(src_font_path, dst_font_path, 
                        hebrew_sb=8, 
                        latin_sb=10, 
                        digit_sb=12, 
                        math_sb=6, 
                        space_width=160):
    font = TTFont(src_font_path)
    glyf = font['glyf']
    hmtx = font['hmtx']
    
    common_controls = {'.notdef', '.null', 'nonmarkingreturn', 'CR', 'space', 'nbsp'}
    
    for gname in font.getGlyphOrder():
        if gname in common_controls:
            continue
            
        glyph = glyf[gname]
        if glyph.numberOfContours <= 0:
            continue
            
        adv, old_lsb = hmtx[gname]
        glyph.recalcBounds(glyf)
        xMin = glyph.xMin
        xMax = glyph.xMax
        gw = xMax - xMin
        
        # Determine target side bearings
        target_lsb = latin_sb
        target_rsb = latin_sb
        
        # Check if Hebrew
        if gname.startswith('afii576') or gname in ('uni05c6',):
            target_lsb = hebrew_sb
            target_rsb = hebrew_sb
        # Check if digit
        elif gname in ('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'):
            target_lsb = digit_sb
            target_rsb = digit_sb
        # Check if math / operator
        elif gname in ('plus', 'hyphen', 'equal', 'less', 'greater', 'slash', 'bullet', 
                       'parenleft', 'parenright', 'bracketleft', 'bracketright', 'braceleft', 'braceright'):
            target_lsb = math_sb
            target_rsb = math_sb
        # Check if Greek
        elif gname in ('alpha', 'beta', 'gamma', 'delta', 'epsilon', 'eta', 'theta', 'lambda', 
                       'mu', 'pi', 'phi', 'psi', 'omega', 'Delta', 'Theta', 'Lambda', 'Pi', 
                       'Phi', 'Psi', 'Omega', 'uni03fb'):
            target_lsb = math_sb
            target_rsb = math_sb
            
        # Shift glyph coordinates so that new xMin == target_lsb
        dx = target_lsb - xMin
        if dx != 0:
            glyph.coordinates += (dx, 0)
            glyph.recalcBounds(glyf)
            
        # New metrics
        new_lsb = target_lsb
        new_adv = target_lsb + gw + target_rsb
        hmtx[gname] = (new_adv, new_lsb)
        
    # Adjust space width
    if 'space' in hmtx.metrics:
        hmtx['space'] = (space_width, 0)
    if 'nbsp' in hmtx.metrics:
        hmtx['nbsp'] = (space_width, 0)
        
    font['hhea'].recalc(font)
    font['head'].xMin = min(g.xMin for g in glyf.glyphs.values() if hasattr(g, 'xMin'))
    font['head'].xMax = max(g.xMax for g in glyf.glyphs.values() if hasattr(g, 'xMax'))
    font.save(dst_font_path)

# 1. Medium Tight (SB ~ 12)
adjust_font_spacing("c:/Projects/פונט/Myfont-Combined.ttf", "c:/Projects/פונט/test_tight.ttf", 
                    hebrew_sb=10, latin_sb=12, digit_sb=14, math_sb=8, space_width=170)

# 2. Very Tight (SB ~ 6, letters almost touching!)
adjust_font_spacing("c:/Projects/פונט/Myfont-Combined.ttf", "c:/Projects/פונט/test_very_tight.ttf", 
                    hebrew_sb=5, latin_sb=8, digit_sb=10, math_sb=4, space_width=150)

# 3. Ultra Tight / Touching (SB ~ 2, letters touching/almost touching)
adjust_font_spacing("c:/Projects/פונט/Myfont-Combined.ttf", "c:/Projects/פונט/test_ultra_tight.ttf", 
                    hebrew_sb=2, latin_sb=4, digit_sb=6, math_sb=2, space_width=130)

print("Generated all 3 test fonts!")
