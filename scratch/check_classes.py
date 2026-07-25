import re

with open(r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\index.html', encoding='utf-8') as f:
    text = f.read()

classes = set()
for m in re.finditer(r'class="([^"]+)"', text):
    classes.update(m.group(1).split())

print("Classes in HTML:")
for c in sorted(classes):
    print(f"- {c}")
