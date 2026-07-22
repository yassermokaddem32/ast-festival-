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

  // Trigger modal display in browser JS context
  await page.evaluate(() => {
    const modal = document.getElementById('reg-result-modal');
    if (modal) {
      modal.classList.add('open');
    }
  });

  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'clean_success_modal.png' });
  console.log('Saved clean_success_modal.png');

  await browser.close();
})();
