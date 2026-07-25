import os
from PIL import Image

artifacts_dir = r'C:\Users\Yasser\.gemini\antigravity\brain\8433bbcd-561c-4d52-bb5b-fc92c068f5ee'

for f in ['original_bg_1.jpg', 'original_bg_2.jpg', 'texture_grid.jpg']:
    p = os.path.join(r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\src\assets', f)
    if os.path.exists(p):
        im = Image.open(p)
        im.resize((800, int(800 * im.height / im.width))).save(os.path.join(artifacts_dir, f + '_check.png'))
        print(f"Saved check for {f}")
