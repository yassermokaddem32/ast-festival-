import os
from PIL import Image

grid_path = r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\src\assets\texture_grid.png'
im = Image.open(grid_path)
print("Image size:", im.size)

artifacts_dir = r'C:\Users\Yasser\.gemini\antigravity\brain\8433bbcd-561c-4d52-bb5b-fc92c068f5ee'
resized_path = os.path.join(artifacts_dir, 'grid_texture_check.png')
im.resize((800, int(800 * im.height / im.width))).save(resized_path)
print("Saved resized grid image to grid_texture_check.png")
