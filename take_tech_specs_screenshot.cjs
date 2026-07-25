const fs = require('fs');
const path = require('path');
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
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Scroll to #tech-specs section
  const section = await page.$('#tech-specs');
  if (section) {
    await section.scrollIntoView();
    await new Promise(r => setTimeout(r, 1000));
    
    const artifactsDir = 'C:\\Users\\Yasser\\.gemini\\antigravity\\brain\\8433bbcd-561c-4d52-bb5b-fc92c068f5ee';
    await page.screenshot({ path: path.join(artifactsDir, 'tech_specs_background.png') });
    console.log('Successfully captured tech_specs_background.png');
  } else {
    console.error('Tech specs section not found!');
  }

  await browser.close();
})();
