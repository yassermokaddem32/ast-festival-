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
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  const aboutSec = await page.$('[id="about"]');
  if (aboutSec) {
    await aboutSec.scrollIntoView();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'mobile_about_test.png' });
    console.log('Saved mobile_about_test.png');
  }
  await browser.close();
})();
