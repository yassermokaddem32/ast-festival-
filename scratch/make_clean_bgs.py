import os
from PIL import Image

src_dir = r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\src\assets'

# 1. Overwrite background-with-pattern-glass-texture.png with original_bg_2.jpg
original_bg2 = Image.open(os.path.join(src_dir, 'original_bg_2.jpg'))
original_bg2.save(os.path.join(src_dir, 'background-with-pattern-glass-texture.png'), 'PNG')
print("Successfully overwrote background-with-pattern-glass-texture.png with clean original_bg_2")

# 2. Overwrite texture_grid.png with texture_grid.jpg
texture_grid = Image.open(os.path.join(src_dir, 'texture_grid.jpg'))
texture_grid.save(os.path.join(src_dir, 'texture_grid.png'), 'PNG')
print("Successfully overwrote texture_grid.png with clean texture_grid")
