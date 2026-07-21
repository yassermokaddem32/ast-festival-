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

  const viewports = [
    { width: 1366, height: 768, name: 'desktop_1366' },
    { width: 1440, height: 900, name: 'desktop_1440' },
    { width: 1920, height: 1080, name: 'desktop_1920' },
    { width: 2560, height: 1440, name: 'desktop_2560' }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `${vp.name}.png`, fullPage: false });
    console.log(`Saved screenshot for ${vp.name}`);
    await page.close();
  }

  await browser.close();
})();
