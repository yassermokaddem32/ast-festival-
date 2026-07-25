import re

with open(r'c:\Users\Yasser\OneDrive\Desktop\ast fastival\src\style.css', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'url\([^\)]+\)', content)
print("URLs in CSS:")
for url in sorted(set(urls)):
    print(f"- {url}")
