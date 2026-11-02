from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

hmtx1 = font1['hmtx']
hmtx2 = font2['hmtx']

print("space f1:", hmtx1['space'], "f2:", hmtx2['space'])
print("nbsp f1:", hmtx1['nbsp'], "f2:", hmtx2['nbsp'])
print(".notdef f1:", hmtx1['.notdef'], "f2:", hmtx2['.notdef'])
