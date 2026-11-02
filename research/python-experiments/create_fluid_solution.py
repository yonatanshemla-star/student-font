import base64
import subprocess
import os
import sys
import re
from fontTools.ttLib import TTFont

sys.stdout.reconfigure(encoding='utf-8')

ttf_path = "c:/Projects/פונט/Myfont-Combined.ttf"
font = TTFont(ttf_path)
cmap = font.getBestCmap()

with open(ttf_path, "rb") as f:
    font_base64 = base64.b64encode(f.read()).decode("ascii")

html_content = f"""<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>תורת הזרימה 2 - גיליון 1 - אנליזה ממדית</title>
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
            color: #162a45; /* עט כחול אחיד לכל המסמך - ללא צבעים נוספים */
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

        /* קו שוליים אדום עדין של מחברת מימין */
        .margin-line {{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 18mm;
            width: 1.5px;
            background-color: rgba(239, 68, 68, 0.38);
        }}

        /* חורי ניקוב משמאל לקלסר */
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
            margin-bottom: 18px;
        }}

        .problem {{
            margin-bottom: 24px;
        }}

        .prob-title {{
            font-size: 23px;
            margin-bottom: 6px;
        }}

        .line {{
            font-size: 20px;
            line-height: 1.45;
            margin: 4px 0;
        }}

        .math-expr {{
            direction: ltr;
            display: inline-block;
            font-size: 20px;
            padding: 0 2px;
        }}

        .indent {{
            margin-right: 12px;
        }}

        sup {{
            font-size: 13px;
            line-height: 0;
            position: relative;
            vertical-align: baseline;
            top: -0.45em;
        }}

        sub {{
            font-size: 13px;
            line-height: 0;
            position: relative;
            vertical-align: baseline;
            bottom: -0.2em;
        }}
    </style>
</head>
<body>

    <!-- עמוד 1: שאלות 1 ו-2 -->
    <div class="notebook-page">
        <div class="margin-line"></div>
        <div class="holes">
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
        </div>

        <div class="content">
            <div class="main-title">תורת הזרימה 2 - גיליון 1 (אנליזה ממדית)</div>

            <!-- שאלה 1 -->
            <div class="problem">
                <div class="prob-title">שאלה 1: כוח עילוי על כנף (Wing Lift)</div>
                <div class="line">נתון שכוח העילוי L תלוי במהירות הזרימה V, זווית התקפה α, מיתר הכנף c, צפיפות הזורם ρ וצמיגות הזורם μ.</div>
                <div class="line">כלומר מתקיים קשר פונקציונלי: <span class="math-expr">L = f(V, α, c, ρ, μ)</span></div>
                
                <div class="line indent"><b>1. רישום ממדי המשתנים בבסיס [M, L, T]:</b></div>
                <div class="line indent">
                    כוח: <span class="math-expr">[L] = M•L•T<sup>-2</sup></span>, 
                    מהירות: <span class="math-expr">[V] = L•T<sup>-1</sup></span>, 
                    זווית התקפה: <span class="math-expr">[α] = 1</span> (חסרת ממד),
                </div>
                <div class="line indent">
                    אורך מיתר: <span class="math-expr">[c] = L</span>, 
                    צפיפות: <span class="math-expr">[ρ] = M•L<sup>-3</sup></span>, 
                    צמיגות: <span class="math-expr">[μ] = M•L<sup>-1</sup>•T<sup>-1</sup></span>
                </div>

                <div class="line indent"><b>2. מציאת מספר קבוצות פאי (משפט בקינגהאם):</b></div>
                <div class="line indent">
                    סך הכל n = 6 משתנים. מספר ממדים בסיסיים k = 3 (מסה, אורך, זמן).
                    <br>
                    לכן נקבל: <span class="math-expr">p = n - k = 6 - 3 = 3</span> קבוצות חסרות ממד.
                </div>

                <div class="line indent"><b>3. בחירת משתנים חוזרים:</b> נבחר את ρ, V, c (מכסים יחד מסה, אורך וזמן ובלתי תלויים).</div>

                <div class="line indent"><b>4. הרכבת קבוצות פאי:</b></div>
                <div class="line indent">
                    קבוצה ראשונה (עילוי): <span class="math-expr">Π1 = L / (ρ • V<sup>2</sup> • c<sup>2</sup>)</span> (זהו מקדם העילוי CL).
                </div>
                <div class="line indent">
                    קבוצה שנייה (זווית התקפה): מכיוון ש-α כבר חסרת ממד, מתקבל ישר <span class="math-expr">Π2 = α</span>.
                </div>
                <div class="line indent">
                    קבוצה שלישית (צמיגות): <span class="math-expr">Π3 = μ / (ρ • V • c)</span>, או בהיפוך: <span class="math-expr">Re = (ρ • V • c) / μ</span> (מספר ריינולדס).
                </div>

                <div class="line indent"><b>מסקנה:</b> הקשר הממדי חסר הממדים הוא: 
                    <span class="math-expr">L / (ρ • V<sup>2</sup> • c<sup>2</sup>) = f(α, Re)</span>,
                    כלומר מקדם העילוי תלוי רק בזווית ההתקפה ובמספר ריינולדס.
                </div>
            </div>

            <!-- שאלה 2 -->
            <div class="problem">
                <div class="prob-title">שאלה 2: בועת סבון (Soap Bubble)</div>
                <div class="line">נתון שהפרש הלחצים בתוך הבועה ΔP תלוי במתח הפנים σ וברדיוס הבועה R: <span class="math-expr">ΔP = f(σ, R)</span>.</div>
                
                <div class="line indent"><b>1. ניתוח ממדים:</b></div>
                <div class="line indent">
                    לחץ: <span class="math-expr">[ΔP] = M • L<sup>-1</sup> • T<sup>-2</sup></span>
                    <br>
                    מתח פנים (כוח לאורך): <span class="math-expr">[σ] = M • T<sup>-2</sup></span>
                    <br>
                    רדיוס: <span class="math-expr">[R] = L</span>
                </div>

                <div class="line indent"><b>2. מציאת הקשר הממדי:</b></div>
                <div class="line indent">
                    רואים מיד שחילוק מתח פנים ברדיוס נותן בדיוק ממד של לחץ:
                    <br>
                    <span class="math-expr">[σ / R] = (M • T<sup>-2</sup>) / L = M • L<sup>-1</sup> • T<sup>-2</sup> = [ΔP]</span>
                </div>
                <div class="line indent">
                    לכן הקבוצה חסרת הממד היחידה היא: <span class="math-expr">Π = (ΔP • R) / σ = const</span>,
                    ומכאן: <span class="math-expr">ΔP = C • (σ / R)</span> (כאשר C קבוע חסר ממד).
                </div>

                <div class="line indent"><b>3. מענה לשאלות:</b></div>
                <div class="line indent">
                    א. אם נכפיל את הרדיוס פי 2 (R → 2R): מכיוון ש-ΔP נמצא ביחס הפוך לרדיוס, הלחץ יקטן פי 2.
                </div>
                <div class="line indent">
                    ב. אם נכפיל את מתח הפנים פי 2 (σ → 2σ): מכיוון ש-ΔP נמצא ביחס ישר למתח הפנים, הלחץ יגדל פי 2.
                </div>
            </div>

        </div>
    </div>

    <!-- עמוד 2: שאלה 3 -->
    <div class="notebook-page">
        <div class="margin-line"></div>
        <div class="holes">
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
            <div class="hole"></div>
        </div>

        <div class="content">
            <!-- שאלה 3 -->
            <div class="problem">
                <div class="prob-title">שאלה 3: משאבה צנטריפוגלית (Centrifugal Pump)</div>
                <div class="line">ההספק הנכנס N למשאבה תלוי בספיקה הנפחית Q, קוטר המאיץ D, מהירות סיבוב ω, צפיפות ρ וצמיגות μ:</div>
                <div class="line"><span class="math-expr">N = f(Q, D, ω, ρ, μ)</span></div>

                <div class="line indent"><b>ממדי המשתנים:</b></div>
                <div class="line indent">
                    הספק: <span class="math-expr">[N] = M • L<sup>2</sup> • T<sup>-3</sup></span>, 
                    ספיקה: <span class="math-expr">[Q] = L<sup>3</sup> • T<sup>-1</sup></span>, 
                    קוטר: <span class="math-expr">[D] = L</span>,
                </div>
                <div class="line indent">
                    מהירות זוויתית: <span class="math-expr">[ω] = T<sup>-1</sup></span>, 
                    צפיפות: <span class="math-expr">[ρ] = M • L<sup>-3</sup></span>, 
                    צמיגות: <span class="math-expr">[μ] = M • L<sup>-1</sup> • T<sup>-1</sup></span>
                </div>
                <div class="line indent">
                    ישנם n = 6 משתנים ו-k = 3 ממדים בסיסיים. לכן נקבל <span class="math-expr">p = 6 - 3 = 3</span> קבוצות פאי.
                    <br>
                    נבחר כמשתנים חוזרים את: ρ, ω, D.
                </div>

                <div class="line" style="margin-top: 10px;"><b>סעיף א: מציאת הפרמטרים חסרי הממד</b></div>
                <div class="line indent">
                    1. מקדם הספק: <span class="math-expr">Π1 = N / (ρ • ω<sup>3</sup> • D<sup>5</sup>)</span> (נבדוק: <span class="math-expr">(M•L<sup>-3</sup>)•(T<sup>-3</sup>)•(L<sup>5</sup>) = M•L<sup>2</sup>•T<sup>-3</sup> = [N]</span>).
                </div>
                <div class="line indent">
                    2. מקדם ספיקה: <span class="math-expr">Π2 = Q / (ω • D<sup>3</sup>)</span> (נבדוק: <span class="math-expr">(T<sup>-1</sup>)•(L<sup>3</sup>) = L<sup>3</sup>•T<sup>-1</sup> = [Q]</span>).
                </div>
                <div class="line indent">
                    3. מספר ריינולדס של המשאבה: <span class="math-expr">Π3 = (ρ • ω • D<sup>2</sup>) / μ = Re</span>.
                </div>
                <div class="line indent">
                    הקשר חסר הממד הוא: <span class="math-expr">N / (ρ • ω<sup>3</sup> • D<sup>5</sup>) = f( Q / (ω • D<sup>3</sup>) , (ρ • ω • D<sup>2</sup>) / μ )</span>
                </div>

                <div class="line" style="margin-top: 10px;"><b>סעיף ב: החלפת ההספק N בעליית הלחץ הסגולית ΔP/ρ</b></div>
                <div class="line indent">
                    ממדי עליית הלחץ הסגולית: <span class="math-expr">[ΔP / ρ] = (M•L<sup>-1</sup>•T<sup>-2</sup>) / (M•L<sup>-3</sup>) = L<sup>2</sup> • T<sup>-2</sup></span>.
                </div>
                <div class="line indent">
                    נרכיב קבוצה חסרת ממד חדשה יחד עם המשתנים החוזרים ω ו-D:
                    <br>
                    <span class="math-expr">[ω<sup>2</sup> • D<sup>2</sup>] = (T<sup>-2</sup>) • (L<sup>2</sup>) = L<sup>2</sup> • T<sup>-2</sup> = [ΔP / ρ]</span>
                </div>
                <div class="line indent">
                    לכן מקדם עומד הלחץ חסר הממד הוא: <span class="math-expr">Π_head = ΔP / (ρ • ω<sup>2</sup> • D<sup>2</sup>)</span>.
                </div>
                <div class="line indent">
                    והקשר חסר הממדים המתקבל: 
                    <span class="math-expr">ΔP / (ρ • ω<sup>2</sup> • D<sup>2</sup>) = g( Q / (ω • D<sup>3</sup>) , (ρ • ω • D<sup>2</sup>) / μ )</span>
                </div>

                <div class="line" style="margin-top: 10px;"><b>סעיף ג: כאשר הצמיגות זניחה (Inviscid Flow)</b></div>
                <div class="line indent">
                    אם הצמיגות זניחה (μ זניחה או Re גדול מאוד), הצמיגות יוצאת ממאגר המשתנים המשפיעים.
                    <br>
                    קבוצת ריינולדס נושרת מהקשר, והמשוואות תלויות אך ורק במקדם הספיקה:
                </div>
                <div class="line indent">
                    <span class="math-expr">N / (ρ • ω<sup>3</sup> • D<sup>5</sup>) = f( Q / (ω • D<sup>3</sup>) )</span>
                </div>
                <div class="line indent">
                    וכן עבור עליית הלחץ: <span class="math-expr">ΔP / (ρ • ω<sup>2</sup> • D<sup>2</sup>) = g( Q / (ω • D<sup>3</sup>) )</span>.
                </div>
            </div>

        </div>
    </div>

</body>
</html>
"""

# Verify all characters in HTML visible text exist in font cmap
body = re.search(r'<body>(.*?)</body>', html_content, re.DOTALL).group(1)
body_text = re.sub(r'<[^>]+>', '', body)
missing = set(ch for ch in body_text if ord(ch) not in cmap and ord(ch) not in (10, 13, 9, 32))
if missing:
    print("WARNING: Missing characters in body text:", missing)
else:
    print("SUCCESS: All body text characters are 100% present in the font!")

html_path = "c:/Projects/פונט/fluid_solution.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

cwd = os.getcwd()
html_file = os.path.join(cwd, "fluid_solution.html")
pdf_file = os.path.join(cwd, "fluid_solution.pdf")
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
print("Generated fluid_solution.pdf successfully!")
