import sys
import shutil
import base64
import os
import subprocess
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

def tighten_font(input_path, output_ttf_path, output_otf_path,
                 hebrew_sb=4,
                 latin_sb=6,
                 digit_sb=8,
                 math_sb=4,
                 space_width=150):
    
    font = TTFont(input_path)
    glyf = font['glyf']
    hmtx = font['hmtx']
    
    common_controls = {'.notdef', '.null', 'nonmarkingreturn', 'CR', 'space', 'nbsp'}
    
    for gname in font.getGlyphOrder():
        if gname in common_controls:
            continue
            
        glyph = glyf[gname]
        if glyph.numberOfContours <= 0:
            continue
            
        glyph.recalcBounds(glyf)
        xMin = glyph.xMin
        xMax = glyph.xMax
        gw = xMax - xMin
        
        # Determine target side bearings
        target_lsb = latin_sb
        target_rsb = latin_sb
        
        # Hebrew letters
        if gname.startswith('afii576') or gname in ('uni05c6',):
            target_lsb = hebrew_sb
            target_rsb = hebrew_sb
        # Digits
        elif gname in ('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'):
            target_lsb = digit_sb
            target_rsb = digit_sb
        # Math symbols & brackets
        elif gname in ('plus', 'hyphen', 'equal', 'less', 'greater', 'slash', 'bullet', 
                       'parenleft', 'parenright', 'bracketleft', 'bracketright', 'braceleft', 'braceright'):
            target_lsb = math_sb
            target_rsb = math_sb
        # Greek letters
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
    
    font.save(output_ttf_path)
    shutil.copyfile(output_ttf_path, output_otf_path)
    print("Saved tightened font to:", output_ttf_path)

if __name__ == "__main__":
    tighten_font(
        "c:/Projects/פונט/Myfont-Combined.ttf",
        "c:/Projects/פונט/Myfont-Combined.ttf",
        "c:/Projects/פונט/Myfont-Combined.otf",
        hebrew_sb=4,
        latin_sb=6,
        digit_sb=8,
        math_sb=4,
        space_width=150
    )
