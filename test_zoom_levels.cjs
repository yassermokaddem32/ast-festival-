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

  const zoomLevels = [80, 90, 100, 110, 125, 150];

  for (const zoom of zoomLevels) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Apply zoom
    await page.evaluate((z) => {
      document.body.style.zoom = `${z}%`;
    }, zoom);

    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `zoom_${zoom}.png`, fullPage: false });
    console.log(`Saved screenshot for zoom ${zoom}%`);
    await page.close();
  }

  await browser.close();
})();
