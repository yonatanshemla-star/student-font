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
            color: #1a2a44; /* עט כחול קלאסי */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}

        .notebook-page {{
            width: 210mm;
            height: 297mm;
            padding: 15mm 20mm 15mm 22mm;
            position: relative;
            background-color: #ffffff;
            /* משבצות מחברת חשבון 5 מ"מ */
            background-image: 
                linear-gradient(to right, rgba(90, 140, 200, 0.22) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(90, 140, 200, 0.22) 1px, transparent 1px);
            background-size: 6mm 6mm;
            page-break-after: always;
            overflow: hidden;
        }}

        /* קו שוליים אדום של מחברת ישראלית מימין */
        .margin-line {{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 18mm;
            width: 1.5px;
            background-color: rgba(239, 68, 68, 0.45);
        }}

        /* קו ניקוב שמאלי של דפי קלסר */
        .holes {{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 7mm;
            width: 4mm;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }}
        .hole {{
            width: 5mm;
            height: 5mm;
            border-radius: 50%;
            background: #e2e8f0;
            border: 1px solid #cbd5e1;
        }}

        .content {{
            position: relative;
            z-index: 2;
            margin-right: 5mm; /* מיושר אחרי קו השוליים */
        }}

        .page-header {{
            text-align: center;
            border-bottom: 2px solid #1a2a44;
            padding-bottom: 4px;
            margin-bottom: 12px;
        }}

        .page-title {{
            font-size: 26px;
            font-weight: bold;
            color: #0d2342;
        }}

        .student-details {{
            display: flex;
            justify-content: space-between;
            font-size: 19px;
            margin-top: 4px;
            color: #243b55;
        }}

        .question {{
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px dashed rgba(90, 140, 200, 0.35);
        }}

        .q-title {{
            font-size: 21px;
            font-weight: bold;
            color: #0b1d3a;
            margin-bottom: 3px;
        }}

        .q-math {{
            direction: ltr;
            text-align: right;
            font-size: 22px;
            margin: 3px 0 5px 0;
            color: #002244;
            font-weight: bold;
        }}

        .sub-clause {{
            margin: 3px 0;
            font-size: 19px;
            line-height: 1.35;
        }}

        .tag-yes {{
            color: #047857; /* ירוק סימון */
            font-weight: bold;
        }}

        .tag-no {{
            color: #b91c1c; /* אדום סימון */
            font-weight: bold;
        }}

        .explanation {{
            color: #2c3e50;
            font-size: 18px;
        }}

        .math-inline {{
            direction: ltr;
            display: inline-block;
            font-size: 19px;
        }}

        sup {{
            font-size: 13px;
            line-height: 0;
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
            <div class="page-header">
                <div class="page-title">דף תרגילים מס' 1 - אותות ומערכות</div>
                <div class="student-details">
                    <div>קורס: מבוא למערכות לינאריות</div>
                    <div>נושא: סיווג תכונות מערכת</div>
                    <div>תאריך: 01/11/2026</div>
                </div>
            </div>

            <!-- שאלה 1 -->
            <div class="question">
                <div class="q-title">שאלה 1:</div>
                <div class="q-math">y(t) = 7 • u(t)</div>
                <div class="sub-clause">
                    <b>א. לינארית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">עבור <span class="math-inline">u(t) = a•u1(t) + b•u2(t)</span> מתקיים: <span class="math-inline">y(t) = 7(a•u1 + b•u2) = a•y1(t) + b•y2(t)</span>. מתקיים עקרון הסופרפוזיציה.</span>
                </div>
                <div class="sub-clause">
                    <b>ב. סטציונרית (קבועה בזמן):</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">הזזת כניסה: <span class="math-inline">u(t - τ)</span> נותנת מוצא <span class="math-inline">7•u(t - τ)</span> השווה במדויק ל- <span class="math-inline">y(t - τ)</span>. אין תלות מפורשת בזמן t.</span>
                </div>
                <div class="sub-clause">
                    <b>ג. סיבתית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">המוצא בזמן t תלוי אך ורק בערך הכניסה ברגע הנוכחי t (ללא ערכים עתידיים).</span>
                </div>
            </div>

            <!-- שאלה 2 -->
            <div class="question">
                <div class="q-title">שאלה 2:</div>
                <div class="q-math">y(t) = 6 • u(t) + 4</div>
                <div class="sub-clause">
                    <b>א. לינארית:</b> <span class="tag-no">לא לינארית.</span>
                    <span class="explanation">עבור כניסת אפס <span class="math-inline">u(t) = 0</span> המוצא הוא <span class="math-inline">y(t) = 4 ≠ 0</span>. תנאי הכרחי ללינאריות אינו מתקיים.</span>
                </div>
                <div class="sub-clause">
                    <b>ב. סטציונרית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">עבור <span class="math-inline">u(t - τ)</span> המוצא <span class="math-inline">6•u(t - τ) + 4</span> זהה ל- <span class="math-inline">y(t - τ)</span>. הקשר אינו משתנה בזמן.</span>
                </div>
                <div class="sub-clause">
                    <b>ג. סיבתית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">המוצא תלוי רק בכניסה בהווה <span class="math-inline">u(t)</span>.</span>
                </div>
            </div>

            <!-- שאלה 3 -->
            <div class="question">
                <div class="q-title">שאלה 3:</div>
                <div class="q-math">y(t) = t • u(t)</div>
                <div class="sub-clause">
                    <b>א. לינארית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation"><span class="math-inline">t•(a•u1 + b•u2) = a•(t•u1) + b•(t•u2) = a•y1 + b•y2</span>. המערכת לינארית.</span>
                </div>
                <div class="sub-clause">
                    <b>ב. סטציונרית:</b> <span class="tag-no">לא סטציונרית (משתנה בזמן).</span>
                    <span class="explanation">הזזת כניסה נותנת <span class="math-inline">t•u(t - τ)</span>, בעוד ש- <span class="math-inline">y(t - τ) = (t - τ)•u(t - τ)</span>. הם אינם שווים בגלל המקדם t.</span>
                </div>
                <div class="sub-clause">
                    <b>ג. סיבתית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">לכל רגע t, ערך המוצא תלוי רק ב- <span class="math-inline">u(t)</span> (מוכפל בקבוע t).</span>
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
                <div class="q-title">שאלה 4:</div>
                <div class="q-math">y(t) = t<sup>3</sup> • u(t - 2) + 4</div>
                <div class="sub-clause">
                    <b>א. לינארית:</b> <span class="tag-no">לא לינארית.</span>
                    <span class="explanation">בשל האיבר החופשי <span class="math-inline">+4</span>. עבור כניסת אפס <span class="math-inline">u=0</span> מתקבל <span class="math-inline">y(t)=4 ≠ 0</span>.</span>
                </div>
                <div class="sub-clause">
                    <b>ב. סטציונרית:</b> <span class="tag-no">לא סטציונרית.</span>
                    <span class="explanation">המקדם <span class="math-inline">t<sup>3</sup></span> תלוי מפורשות בזמן: <span class="math-inline">t<sup>3</sup>•u(t - τ - 2) + 4 ≠ (t - τ)<sup>3</sup>•u(t - τ - 2) + 4</span>.</span>
                </div>
                <div class="sub-clause">
                    <b>ג. סיבתית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">המוצא ברגע t תלוי בכניסה ברגע <span class="math-inline">t - 2</span>. מכיוון ש- <span class="math-inline">t - 2 &lt; t</span>, זו תלות בערך עבר בלבד!</span>
                </div>
            </div>

            <!-- שאלה 5 -->
            <div class="question">
                <div class="q-title">שאלה 5:</div>
                <div class="q-math">y(t) = t • u''(t) + t<sup>2</sup> • u(t)</div>
                <div class="sub-clause">
                    <b>א. לינארית:</b> <span class="tag-yes">כן.</span>
                    <span class="explanation">נגזרת היא פעולה לינארית: <span class="math-inline">(a•u1 + b•u2)'' = a•u1'' + b•u2''</span>. לכן סופרפוזיציה מתקיימת במלואה.</span>
                </div>
                <div class="sub-clause">
                    <b>ב. סטציונרית:</b> <span class="tag-no">לא סטציונרית.</span>
                    <span class="explanation">המקדמים <span class="math-inline">t</span> ו- <span class="math-inline">t<sup>2</sup></span> משתנים בזמן ולכן המערכת אינה קבועה בזמן.</span>
                </div>
                <div class="sub-clause">
                    <b>ג. סיבתית:</b> <span class="tag-no">לא סיבתית (במובן מתמטי קפדני).</span>
                    <span class="explanation">הנגזרת <span class="math-inline">u''(t)</span> מוגדרת פורמלית כגבול הדורש ערכים עתידיים מידיים <span class="math-inline">t + Δt</span>. (הערה: אם מניחים שהאות ידוע מראש או גזירה לאחור, יש הרואים בה סיבתית).</span>
                </div>
            </div>

            <!-- טבלת סיכום מחברת -->
            <div style="margin-top: 20px; border: 1.5px solid #1a2a44; border-radius: 4px; overflow: hidden; background: rgba(255,255,255,0.9);">
                <div style="background: #1a2a44; color: white; padding: 6px 12px; font-size: 19px; font-weight: bold; text-align: center;">
                    טבלת ריכוז תשובות סופיות:
                </div>
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 18px;">
                    <thead>
                        <tr style="background: rgba(90, 140, 200, 0.15); border-bottom: 1px solid #1a2a44;">
                            <th style="padding: 6px; border-left: 1px solid #1a2a44;">שאלה</th>
                            <th style="padding: 6px; border-left: 1px solid #1a2a44;">משוואת המערכת</th>
                            <th style="padding: 6px; border-left: 1px solid #1a2a44;">לינארית</th>
                            <th style="padding: 6px; border-left: 1px solid #1a2a44;">סטציונרית</th>
                            <th style="padding: 6px;">סיבתית</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(90,140,200,0.3);">
                            <td style="padding: 5px; border-left: 1px solid #1a2a44;">1</td>
                            <td style="direction: ltr; padding: 5px; border-left: 1px solid #1a2a44;">y = 7•u</td>
                            <td style="color: #047857; font-weight: bold; border-left: 1px solid #1a2a44;">כן</td>
                            <td style="color: #047857; font-weight: bold; border-left: 1px solid #1a2a44;">כן</td>
                            <td style="color: #047857; font-weight: bold;">כן</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(90,140,200,0.3);">
                            <td style="padding: 5px; border-left: 1px solid #1a2a44;">2</td>
                            <td style="direction: ltr; padding: 5px; border-left: 1px solid #1a2a44;">y = 6•u + 4</td>
                            <td style="color: #b91c1c; font-weight: bold; border-left: 1px solid #1a2a44;">לא</td>
                            <td style="color: #047857; font-weight: bold; border-left: 1px solid #1a2a44;">כן</td>
                            <td style="color: #047857; font-weight: bold;">כן</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(90,140,200,0.3);">
                            <td style="padding: 5px; border-left: 1px solid #1a2a44;">3</td>
                            <td style="direction: ltr; padding: 5px; border-left: 1px solid #1a2a44;">y = t•u</td>
                            <td style="color: #047857; font-weight: bold; border-left: 1px solid #1a2a44;">כן</td>
                            <td style="color: #b91c1c; font-weight: bold; border-left: 1px solid #1a2a44;">לא</td>
                            <td style="color: #047857; font-weight: bold;">כן</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(90,140,200,0.3);">
                            <td style="padding: 5px; border-left: 1px solid #1a2a44;">4</td>
                            <td style="direction: ltr; padding: 5px; border-left: 1px solid #1a2a44;">y = t<sup>3</sup>•u(t-2) + 4</td>
                            <td style="color: #b91c1c; font-weight: bold; border-left: 1px solid #1a2a44;">לא</td>
                            <td style="color: #b91c1c; font-weight: bold; border-left: 1px solid #1a2a44;">לא</td>
                            <td style="color: #047857; font-weight: bold;">כן</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px; border-left: 1px solid #1a2a44;">5</td>
                            <td style="direction: ltr; padding: 5px; border-left: 1px solid #1a2a44;">y = t•u'' + t<sup>2</sup>•u</td>
                            <td style="color: #047857; font-weight: bold; border-left: 1px solid #1a2a44;">כן</td>
                            <td style="color: #b91c1c; font-weight: bold; border-left: 1px solid #1a2a44;">לא</td>
                            <td style="color: #b91c1c; font-weight: bold;">לא</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>

</body>
</html>
"""

html_path = "c:/Projects/פונט/notebook_solution.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved HTML to", html_path)

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

res = subprocess.run(cmd, capture_output=True, text=True)
if os.path.exists(pdf_file):
    print("Notebook PDF generated successfully! Size:", os.path.getsize(pdf_file))
else:
    print("Notebook PDF generation failed.")
