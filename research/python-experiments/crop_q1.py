from PIL import Image

# Crop the question 1 section from notebook_page_1.png
img = Image.open("c:/Projects/פונט/notebook_page_1.png")
# Let's crop question 1 area
# Page is 2 * 210mm ~ 1654 x 2339
w, h = img.size
q1_crop = img.crop((int(w * 0.1), int(h * 0.1), int(w * 0.95), int(h * 0.35)))
q1_crop.save("c:/Projects/פונט/q1_crop.png")
print("Saved q1_crop.png")
