from PIL import Image

img = Image.open("c:/Projects/פונט/notebook_page_1.png")
w, h = img.size
# Crop around clause א
# x from 0.4 to 0.95, y from 0.12 to 0.22
crop = img.crop((int(w * 0.4), int(h * 0.12), int(w * 0.95), int(h * 0.22)))
crop.save("c:/Projects/פונט/clause_a_crop.png")
print("Saved clause_a_crop.png")
