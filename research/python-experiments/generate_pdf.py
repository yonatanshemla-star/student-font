import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Convert sample_preview.html to PDF using Edge
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=Myfont_Sample.pdf",
    "sample_preview.html"
]

print("Running Edge to generate PDF...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)

if os.path.exists("Myfont_Sample.pdf"):
    print("PDF generated successfully! Size:", os.path.getsize("Myfont_Sample.pdf"))
else:
    print("PDF generation failed.")
