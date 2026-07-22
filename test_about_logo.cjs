const fs = require('fs');
const puppeteer = require('puppeteer-core');

(async () => {
  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let executablePath = edgePaths.find(p => fs.existsSync(p));
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Scroll to About section
  await page.evaluate(() => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView();
    }
  });

  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'about_logo_centered.png' });
  console.log('Saved about_logo_centered.png');

  await browser.close();
})();
