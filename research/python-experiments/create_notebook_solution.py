import re
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
    <title>פתרון דף תרגילים מס' 1 - אותות ומערכות</title>
    <style>
        @font-face {{
            font-family: 'MyHandwriting';
            src: url('data:font/truetype;charset=utf-8;base64,{font_base64}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }}

        @page {{
            size: A4;
            margin: 0;
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            font-family: 'MyHandwriting', sans-serif;
            margin: 0;
            padding: 0;
            color: #162a45; /* צבע עט אחיד בלבד לכל המסמך */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}

        .notebook-page {{
            width: 210mm;
            height: 297mm;
            padding: 18mm 22mm 18mm 26mm;
            position: relative;
            background-color: #ffffff;
            /* משבצות מחברת חשבון 5 מ"מ עדינות */
            background-image: 
                linear-gradient(to right, rgba(70, 130, 200, 0.18) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(70, 130, 200, 0.18) 1px, transparent 1px);
            background-size: 5mm 5mm;
            page-break-after: always;
            overflow: hidden;
        }}

        /* קו שוליים אדום של מחברת מימין */
        .margin-line {{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 18mm;
            width: 1.5px;
            background-color: rgba(239, 68, 68, 0.38);
        }}

        /* חורי ניקוב משמאל */
        .holes {{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 7mm;
            width: 6mm;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }}
        .hole {{
            width: 5.5mm;
            height: 5.5mm;
            border-radius: 50%;
            background: #eef2f6;
            border: 1px solid #cbd5e1;
        }}

        .content {{
            position: relative;
            z-index: 2;
            margin-right: 2mm;
        }}

        .main-title {{
            font-size: 26px;
            margin-bottom: 20px;
        }}

        .question {{
            margin-bottom: 22px;
        }}

        .q-line {{
            font-size: 23px;
            margin-bottom: 6px;
        }}

        .q-eqn {{
            direction: ltr;
            display: inline-block;
            margin-right: 8px;
        }}

        .clause {{
            margin: 5px 0;
            font-size: 20px;
            line-height: 1.45;
        }}

        .math-expr {{
            direction: ltr;
            display: inline-block;
            font-size: 20px;
            padding: 0 2px;
        }}

        sup {{
            font-size: 14px;
            line-height: 0;
            position: relative;
            vertical-align: baseline;
            top: -0.45em;
        }}
    </style>
</head>
<body>

    <!-- עמוד 1 -->
    <div class="notebook-page">
        <div class="margin-line"></div>
        <div class="holes">
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
        </div>

        <div class="content">
            <div class="main-title">דף תרגילים 1</div>

            <!-- שאלה 1 -->
            <div class="question">
                <div class="q-line">1. נתון: <span class="q-eqn">y(t) = 7 • u(t)</span></div>
                <div class="clause">
                    א. לינארית: כן. עקרון הסופרפוזיציה מתקיים:
                    <span class="math-expr">y(t) = 7•(a•u1(t) + b•u2(t)) = a•y1(t) + b•y2(t)</span>
                </div>
                <div class="clause">
                    ב. סטציונרית: כן. הזזה בזמן נותנת <span class="math-expr">y'(t) = 7•u(t - τ) = y(t - τ)</span> לכל <span class="math-expr">τ</span>. אין תלות מפורשת ב-t.
                </div>
                <div class="clause">
                    ג. סיבתית: כן. המוצא ב-t תלוי אך ורק בערך הכניסה ברגע הנוכחי <span class="math-expr">u(t)</span>.
                </div>
            </div>

            <!-- שאלה 2 -->
            <div class="question">
                <div class="q-line">2. נתון: <span class="q-eqn">y(t) = 6 • u(t) + 4</span></div>
                <div class="clause">
                    א. לינארית: לא. עבור כניסת אפס <span class="math-expr">u(t) = 0</span> מקבלים <span class="math-expr">y(t) = 4 ≠ 0</span>.
                </div>
                <div class="clause">
                    ב. סטציונרית: כן. עבור <span class="math-expr">u(t - τ)</span> המוצא הוא <span class="math-expr">6•u(t - τ) + 4 = y(t - τ)</span>.
                </div>
                <div class="clause">
                    ג. סיבתית: כן. תלוי רק בהווה <span class="math-expr">u(t)</span>.
                </div>
            </div>

            <!-- שאלה 3 -->
            <div class="question">
                <div class="q-line">3. נתון: <span class="q-eqn">y(t) = t • u(t)</span></div>
                <div class="clause">
                    א. לינארית: כן. מתקיים <span class="math-expr">t•(a•u1 + b•u2) = a•(t•u1) + b•(t•u2) = a•y1 + b•y2</span>.
                </div>
                <div class="clause">
                    ב. סטציונרית: לא. הזזת כניסה נותנת <span class="math-expr">t•u(t - τ)</span>, בעוד שהזזת מוצא נותנת <span class="math-expr">(t - τ)•u(t - τ)</span>. הם לא שווים בגלל t.
                </div>
                <div class="clause">
                    ג. סיבתית: כן. המוצא בכל רגע מושפע רק מ- <span class="math-expr">u(t)</span>.
                </div>
            </div>
        </div>
    </div>

    <!-- עמוד 2 -->
    <div class="notebook-page">
        <div class="margin-line"></div>
        <div class="holes">
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
        </div>

        <div class="content">
            <!-- שאלה 4 -->
            <div class="question">
                <div class="q-line">4. נתון: <span class="q-eqn">y(t) = t<sup>3</sup> • u(t - 2) + 4</span></div>
                <div class="clause">
                    א. לינארית: לא. עבור כניסה 0 המוצא הוא <span class="math-expr">y(t) = 4 ≠ 0</span> (בגלל ה- 4+).
                </div>
                <div class="clause">
                    ב. סטציונרית: לא. המקדם <span class="math-expr">t<sup>3</sup></span> תלוי בזמן: <span class="math-expr">t<sup>3</sup>•u(t - τ - 2) + 4 ≠ (t - τ)<sup>3</sup>•u(t - τ - 2) + 4</span>.
                </div>
                <div class="clause">
                    ג. סיבתית: כן. התלות היא ב- <span class="math-expr">u(t - 2)</span>, שזה ערך עבר (<span class="math-expr">t - 2 &lt; t</span>).
                </div>
            </div>

            <!-- שאלה 5 -->
            <div class="question">
                <div class="q-line">5. נתון: <span class="q-eqn">y(t) = t • u''(t) + t<sup>2</sup> • u(t)</span></div>
                <div class="clause">
                    א. לינארית: כן. גזירה היא פעולה לינארית והמקדמים תלויים רק ב-t ולא ב-u.
                </div>
                <div class="clause">
                    ב. סטציונרית: לא. המקדמים <span class="math-expr">t</span> ו- <span class="math-expr">t<sup>2</sup></span> משתנים בזמן.
                </div>
                <div class="clause">
                    ג. סיבתית: לא. הנגזרת דורשת ערכים עתידיים מידיים בהגדרת הגבול.
                </div>
            </div>
        </div>
    </div>

</body>
</html>
"""

html_path = "c:/Projects/פונט/notebook_solution.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

cwd = os.getcwd()
html_file = os.path.join(cwd, "notebook_solution.html")
pdf_file = os.path.join(cwd, "notebook_solution.pdf")
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
print("Updated notebook_solution.pdf created in lazy student style!")
