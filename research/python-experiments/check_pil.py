from PIL import Image

# Let's see if PIL is available
try:
    import PIL
    print("PIL installed")
except ImportError:
    print("PIL not installed")
