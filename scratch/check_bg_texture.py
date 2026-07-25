import os
from PIL import Image

bg_path = r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\src\assets\background-with-pattern-glass-texture.png'
im = Image.open(bg_path)
print("Image size:", im.size)

# let's save a resized version (e.g. 800x600) to artifacts to view it!
artifacts_dir = r'C:\Users\Yasser\.gemini\antigravity\brain\8433bbcd-561c-4d52-bb5b-fc92c068f5ee'
resized_path = os.path.join(artifacts_dir, 'bg_texture_check.png')
im.resize((800, int(800 * im.height / im.width))).save(resized_path)
print("Saved resized background image to bg_texture_check.png")
