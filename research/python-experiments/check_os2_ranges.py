from fontTools.ttLib import TTFont

font1 = TTFont("C:/Users/Yonatan/Downloads/Myfont-Regular.ttf")
font2 = TTFont("C:/Users/Yonatan/Downloads/I-Regular.ttf")

os2_1 = font1['OS/2']
os2_2 = font2['OS/2']

print("f1 unicode ranges:", bin(os2_1.ulUnicodeRange1), bin(os2_1.ulUnicodeRange2), bin(os2_1.ulUnicodeRange3), bin(os2_1.ulUnicodeRange4))
print("f2 unicode ranges:", bin(os2_2.ulUnicodeRange1), bin(os2_2.ulUnicodeRange2), bin(os2_2.ulUnicodeRange3), bin(os2_2.ulUnicodeRange4))

print("f1 codepage ranges:", bin(os2_1.ulCodePageRange1), bin(os2_1.ulCodePageRange2))
print("f2 codepage ranges:", bin(os2_2.ulCodePageRange1), bin(os2_2.ulCodePageRange2))

