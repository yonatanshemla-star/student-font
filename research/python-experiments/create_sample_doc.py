import base64
import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

ttf_path = "c:/Projects/פונט/Myfont-Combined.ttf"
with open(ttf_path, "rb") as f:
    font_base64 = base64.b64encode(f.read()).decode("ascii")

html_content = f"""<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>דוגמת פונט כתב יד - Myfont</title>
    <style>
        @font-face {{
            font-family: 'MyHandwriting';
            src: url('data:font/truetype;charset=utf-8;base64,{font_base64}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }}

        @page {{
            size: A4;
            margin: 14mm 16mm;
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            font-family: 'MyHandwriting', sans-serif;
            font-size: 24px;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }}

        .header {{
            text-align: center;
            border-bottom: 2px dashed #cbd5e1;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }}

        .title {{
            font-size: 34px;
            color: #0f172a;
            margin-bottom: 4px;
        }}

        .subtitle {{
            font-size: 18px;
            color: #64748b;
        }}

        .section {{
            margin-bottom: 20px;
            padding: 14px 20px;
            border-radius: 8px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            page-break-inside: avoid;
        }}

        .section-title {{
            font-size: 18px;
            color: #334155;
            margin-bottom: 8px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-weight: 600;
        }}

        .hebrew {{
            direction: rtl;
            text-align: right;
            font-size: 27px;
            line-height: 1.65;
        }}

        .english {{
            direction: ltr;
            text-align: left;
            font-size: 25px;
            line-height: 1.55;
        }}

        .math-box {{
            direction: ltr;
            text-align: center;
            font-size: 27px;
            background: #f8fafc;
            padding: 14px 20px;
            border-radius: 6px;
            border: 1px dashed #cbd5e1;
        }}
        
        .math-line {{
            margin: 8px 0;
        }}

        .math-line span.hl {{
            color: #1e40af;
        }}
    </style>
</head>
<body>

    <div class="header">
        <div class="title">Myfont - כתב יד אישי (ריווח הדוק ומדויק)</div>
        <div class="subtitle">האותיות קרובות וזורמות בטבעיות, ומשוואות מתמטיות קומפקטיות וברורות</div>
    </div>

    <!-- פסקה בעברית -->
    <div class="section">
        <div class="section-title" dir="rtl">פסקה בעברית (אותיות צמודות וזורמות):</div>
        <div class="hebrew" dir="rtl">
            זהו מבחן אמיתי לפונט כתב היד החדש שלי. כל האותיות בעברית נכתבו על ידי, נסרקו ואוחדו בהצלחה לפונט אחד שלם. עכשיו כשהאותיות קרובות זו לזו, המילים מתחברות בצורה טבעית ממש כמו כתב יד אותנטי על דף. שילוב האותיות הסופיות ך, ם, ן, ף, ץ ורווחי המילים נראים מעולה.
        </div>
    </div>

    <!-- פסקה באנגלית -->
    <div class="section">
        <div class="section-title" dir="ltr">English Paragraph (Handwriting):</div>
        <div class="english" dir="ltr">
            The quick brown fox jumps over the lazy dog! Now we have full support for both uppercase and lowercase letters, from A to Z and from a to z. Handwriting fonts bring warmth, personality, and human touch to digital documents and creative designs.
        </div>
    </div>

    <!-- תרגיל ומשוואות מתמטיות -->
    <div class="section">
        <div class="section-title" dir="rtl">תרגיל ומשוואות מתמטיות (יוונית, ספרות ופעולות חשבון ללא רווחי ענק):</div>
        <div class="math-box">
            <div class="math-line"><span class="hl">f(x)</span> = α•x + β•y - γ/2</div>
            <div class="math-line"><span class="hl">Δ</span> = b - 4•a•c = 25 - 4•1•6 = 1</div>
            <div class="math-line"><span class="hl">θ</span> = 2•π/3  ->  cos(θ) + sin(θ)</div>
            <div class="math-line"><span class="hl">E</span> = m•c/2 + [λ•ω]•{{1+3}} = 100</div>
            <div class="math-line">(x+y)•(x-y) = x-y  (x>0, y<10)</div>
        </div>
    </div>

</body>
</html>
"""

html_path = "c:/Projects/פונט/sample_preview.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

cwd = os.getcwd()
html_file = os.path.join(cwd, "sample_preview.html")
pdf_file = os.path.join(cwd, "Myfont_Sample.pdf")
url = f"file:///{html_file.replace(os.sep, '/')}"

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_file}",
    url
]

subprocess.run(cmd, capture_output=True, text=True)
print("Updated PDF created successfully!")
