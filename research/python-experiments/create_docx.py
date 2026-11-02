import sys
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')

def set_run_font(run, font_name="Myfont", size_pt=20, color=RGBColor(20, 20, 20), bold=False):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.color.rgb = color
    run.bold = bold
    
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)
    rFonts.set(qn('w:eastAsia'), font_name)

doc = docx.Document()

sections = doc.sections
for s in sections:
    s.top_margin = Inches(0.8)
    s.bottom_margin = Inches(0.8)
    s.left_margin = Inches(0.8)
    s.right_margin = Inches(0.8)

# Header Title
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_after = Pt(2)
r_title = p_title.add_run("Myfont - כתב יד אישי (ריווח הדוק ומדויק)")
set_run_font(r_title, font_name="Myfont", size_pt=26, color=RGBColor(15, 23, 42), bold=True)

# Subtitle
p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_sub.paragraph_format.space_after = Pt(16)
r_sub = p_sub.add_run("האותיות קרובות וזורמות בטבעיות, ומשוואות מתמטיות קומפקטיות וברורות")
set_run_font(r_sub, font_name="Myfont", size_pt=15, color=RGBColor(100, 116, 139))

# Section 1: Hebrew Header
p_h_h = doc.add_paragraph()
p_h_h.paragraph_format.bidi = True
p_h_h.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p_h_h.paragraph_format.space_before = Pt(12)
p_h_h.paragraph_format.space_after = Pt(4)
r_h_h = p_h_h.add_run("פסקה בעברית (אותיות צמודות וזורמות):")
r_h_h.font.name = "Arial"
r_h_h.font.size = Pt(12)
r_h_h.font.color.rgb = RGBColor(71, 85, 105)
r_h_h.bold = True

# Section 1: Hebrew Body
p_h = doc.add_paragraph()
p_h.paragraph_format.bidi = True
p_h.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p_h.paragraph_format.space_after = Pt(16)
r_h = p_h.add_run(
    "זהו מבחן אמיתי לפונט כתב היד החדש שלי. כל האותיות בעברית נכתבו על ידי, נסרקו ואוחדו בהצלחה לפונט אחד שלם. "
    "עכשיו כשהאותיות קרובות זו לזו, המילים מתחברות בצורה טבעית ממש כמו כתב יד אותנטי על דף. "
    "שילוב האותיות הסופיות ך, ם, ן, ף, ץ ורווחי המילים נראים מעולה."
)
set_run_font(r_h, font_name="Myfont", size_pt=20)

# Section 2: English Header
p_e_h = doc.add_paragraph()
p_e_h.paragraph_format.bidi = False
p_e_h.alignment = WD_ALIGN_PARAGRAPH.LEFT
p_e_h.paragraph_format.space_before = Pt(12)
p_e_h.paragraph_format.space_after = Pt(4)
r_e_h = p_e_h.add_run("English Paragraph (Handwriting):")
r_e_h.font.name = "Arial"
r_e_h.font.size = Pt(12)
r_e_h.font.color.rgb = RGBColor(71, 85, 105)
r_e_h.bold = True

# Section 2: English Body
p_e = doc.add_paragraph()
p_e.paragraph_format.bidi = False
p_e.alignment = WD_ALIGN_PARAGRAPH.LEFT
p_e.paragraph_format.space_after = Pt(16)
r_e = p_e.add_run(
    "The quick brown fox jumps over the lazy dog! Now we have full support for both uppercase and lowercase letters, "
    "from A to Z and from a to z. Handwriting fonts bring warmth, personality, and human touch to digital documents and creative designs."
)
set_run_font(r_e, font_name="Myfont", size_pt=20)

# Section 3: Math Header
p_m_h = doc.add_paragraph()
p_m_h.paragraph_format.bidi = True
p_m_h.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p_m_h.paragraph_format.space_before = Pt(12)
p_m_h.paragraph_format.space_after = Pt(4)
r_m_h = p_m_h.add_run("תרגיל ומשוואות מתמטיות (יוונית, ספרות ופעולות חשבון):")
r_m_h.font.name = "Arial"
r_m_h.font.size = Pt(12)
r_m_h.font.color.rgb = RGBColor(71, 85, 105)
r_m_h.bold = True

# Section 3: Math Body
math_lines = [
    "f(x) = α•x + β•y - γ/2",
    "Δ = b - 4•a•c = 25 - 4•1•6 = 1",
    "θ = 2•π/3  ->  cos(θ) + sin(θ)",
    "E = m•c/2 + [λ•ω]•{1+3} = 100",
    "(x+y)•(x-y) = x-y  (x>0, y<10)"
]

for line in math_lines:
    p_m = doc.add_paragraph()
    p_m.paragraph_format.bidi = False
    p_m.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_m.paragraph_format.space_after = Pt(6)
    r_m = p_m.add_run(line)
    set_run_font(r_m, font_name="Myfont", size_pt=21, color=RGBColor(30, 58, 138))

docx_path = "c:/Projects/פונט/Myfont_Sample.docx"
doc.save(docx_path)
print("Saved DOCX to", docx_path)
