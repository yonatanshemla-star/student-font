import sys
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

# Create an image to test rendering
img = Image.new("RGB", (1200, 800), color=(255, 255, 255))
draw = ImageDraw.Draw(img)

font_path = "c:/Projects/פונט/Myfont-Combined.ttf"
font_large = ImageFont.truetype(font_path, 40)
font_medium = ImageFont.truetype(font_path, 28)

# Texts to render
draw.text((50, 40), "Myfont Combined - Preview", fill=(0, 0, 128), font=font_large)
draw.text((50, 110), "English Alphabet (Uppercase):", fill=(50, 50, 50), font=font_medium)
draw.text((50, 150), "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", fill=(0, 0, 0), font=font_large)

draw.text((50, 210), "English Alphabet (Lowercase):", fill=(50, 50, 50), font=font_medium)
draw.text((50, 250), "a b c d e f g h i j k l m n o p q r s t u v w x y z", fill=(0, 0, 0), font=font_large)

draw.text((50, 310), "Digits & Math / Punctuation:", fill=(50, 50, 50), font=font_medium)
draw.text((50, 350), "0 1 2 3 4 5 6 7 8 9   ! ? % + - = < > : ; / [ ] { }", fill=(0, 0, 0), font=font_large)

draw.text((50, 410), "Hebrew Alphabet (עברית):", fill=(50, 50, 50), font=font_medium)
# For RTL rendering in PIL without bidi or with simple string:
draw.text((50, 450), "א ב ג ד ה ו ז ח ט י כ ל מ נ ס ע פ צ ק ר ש ת ך ם ן ף ץ", fill=(0, 0, 0), font=font_large)

draw.text((50, 520), "Greek & Symbols:", fill=(50, 50, 50), font=font_medium)
draw.text((50, 560), "Δ Θ Λ Π Φ Ψ Ω   α β γ δ ε η θ λ μ π φ ψ ω   • ← ↑ → ↓", fill=(0, 0, 0), font=font_large)

draw.text((50, 630), "Mixed Sample Sentence:", fill=(50, 50, 50), font=font_medium)
draw.text((50, 670), "Hello World! 12345 + 67890 = Test {OK} -> שלום עולם", fill=(0, 0, 0), font=font_large)

preview_path = "c:/Projects/פונט/preview.png"
img.save(preview_path)
print(f"Saved preview image to {preview_path}")
