import os
from PIL import Image

assets_dir = r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\src\assets'
for f in os.listdir(assets_dir):
    if f.endswith(('.png', '.jpg', '.jpeg')):
        p = os.path.join(assets_dir, f)
        try:
            im = Image.open(p)
            print(f"{f}: size={im.size}")
        except Exception as e:
            print(f"Error opening {f}: {e}")
