import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

cwd = os.getcwd()
html_file = os.path.join(cwd, "sample_preview.html")
pdf_file = os.path.join(cwd, "Myfont_Sample.pdf")
url = f"file:///{html_file.replace(os.sep, '/')}"

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    f"--print-to-pdf={pdf_file}",
    url
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
print("Return code:", res.returncode)

if os.path.exists(pdf_file):
    print("PDF generated successfully! Size:", os.path.getsize(pdf_file))
else:
    print("PDF file not found at", pdf_file)
