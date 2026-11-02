import base64
import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_base64_font(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")

f_orig = get_base64_font("c:/Projects/פונט/Myfont-Combined.ttf")
f_tight = get_base64_font("c:/Projects/פונט/test_tight.ttf")
f_very_tight = get_base64_font("c:/Projects/פונט/test_very_tight.ttf")
f_ultra = get_base64_font("c:/Projects/פונט/test_ultra_tight.ttf")

html_content = f"""<!DOCTYPE html>
<html lang="he">
<head>
    <meta charset="UTF-8">
    <title>השוואת מרווחים בפונט</title>
    <style>
        @font-face {{
            font-family: 'FontOrig';
            src: url('data:font/truetype;charset=utf-8;base64,{f_orig}') format('truetype');
        }}
        @font-face {{
            font-family: 'FontTight';
            src: url('data:font/truetype;charset=utf-8;base64,{f_tight}') format('truetype');
        }}
        @font-face {{
            font-family: 'FontVeryTight';
            src: url('data:font/truetype;charset=utf-8;base64,{f_very_tight}') format('truetype');
        }}
        @font-face {{
            font-family: 'FontUltra';
            src: url('data:font/truetype;charset=utf-8;base64,{f_ultra}') format('truetype');
        }}

        body {{
            font-family: sans-serif;
            margin: 20px;
            background: #f0f2f5;
        }}

        .card {{
            background: #fff;
            padding: 16px 20px;
            margin-bottom: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }}

        .card-title {{
            font-size: 18px;
            font-weight: bold;
            color: #1e3a8a;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 12px;
        }}

        .sample-hebrew {{
            font-size: 28px;
            direction: rtl;
            text-align: right;
            margin-bottom: 10px;
        }}

        .sample-math {{
            font-size: 26px;
            direction: ltr;
            text-align: left;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 4px;
        }}

        .f-orig {{ font-family: 'FontOrig', sans-serif; }}
        .f-tight {{ font-family: 'FontTight', sans-serif; }}
        .f-very-tight {{ font-family: 'FontVeryTight', sans-serif; }}
        .f-ultra {{ font-family: 'FontUltra', sans-serif; }}
    </style>
</head>
<body>

    <div class="card">
        <div class="card-title">1. מקורי (Calligraphr ברירת מחדל - מרווח מאוד)</div>
        <div class="sample-hebrew f-orig">זהו מבחן אמיתי לפונט כתב היד שלי. עכשיו כל האותיות בעברית נכתבו.</div>
        <div class="sample-math f-orig">f(x) = α • x + β • y - γ / 2  |  Δ = b - 4 • a • c = 1</div>
    </div>

    <div class="card">
        <div class="card-title">2. צמוד מתון (Tight - מרווח ~ 20 יחידות)</div>
        <div class="sample-hebrew f-tight">זהו מבחן אמיתי לפונט כתב היד שלי. עכשיו כל האותיות בעברית נכתבו.</div>
        <div class="sample-math f-tight">f(x) = α • x + β • y - γ / 2  |  Δ = b - 4 • a • c = 1</div>
    </div>

    <div class="card">
        <div class="card-title">3. צמוד מאוד - מומלץ (Very Tight - על סף נגיעה, מרווח ~ 10 יחידות)</div>
        <div class="sample-hebrew f-very-tight">זהו מבחן אמיתי לפונט כתב היד שלי. עכשיו כל האותיות בעברית נכתבו.</div>
        <div class="sample-math f-very-tight">f(x) = α • x + β • y - γ / 2  |  Δ = b - 4 • a • c = 1</div>
    </div>

    <div class="card">
        <div class="card-title">4. צמוד במיוחד (Ultra Tight - מרווח ~ 4 יחידות)</div>
        <div class="sample-hebrew f-ultra">זהו מבחן אמיתי לפונט כתב היד שלי. עכשיו כל האותיות בעברית נכתבו.</div>
        <div class="sample-math f-ultra">f(x) = α • x + β • y - γ / 2  |  Δ = b - 4 • a • c = 1</div>
    </div>

</body>
</html>
"""

html_path = "c:/Projects/פונט/compare_spacings.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

pdf_path = "c:/Projects/פונט/compare_spacings.pdf"
cwd = os.getcwd()
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{os.path.join(cwd, 'compare_spacings.html').replace(os.sep, '/')}"
]
subprocess.run(cmd, capture_output=True, text=True)

import pypdfium2 as pdfium
pdf = pdfium.PdfDocument(pdf_path)
page = pdf[0]
image = page.render(scale=2).to_pil()
image.save("c:/Projects/פונט/compare_spacings.png")
print("Saved compare_spacings.png!")
