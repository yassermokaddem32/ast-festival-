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

  // Take screenshot of #about
  const aboutSec = await page.$('#about');
  if (aboutSec) {
    await aboutSec.scrollIntoView();
    await new Promise(r => setTimeout(r, 1000));
    
    const artifactsDir = 'C:\\Users\\Yasser\\.gemini\\antigravity\\brain\\8433bbcd-561c-4d52-bb5b-fc92c068f5ee';
    await page.screenshot({ path: path.join(artifactsDir, 'figma_about_background.png') });
    console.log('Captured figma_about_background.png');
  }

  // Take screenshot of #tech-specs
  const techSec = await page.$('#tech-specs');
  if (techSec) {
    await techSec.scrollIntoView();
    await new Promise(r => setTimeout(r, 1000));
    
    const artifactsDir = 'C:\\Users\\Yasser\\.gemini\\antigravity\\brain\\8433bbcd-561c-4d52-bb5b-fc92c068f5ee';
    await page.screenshot({ path: path.join(artifactsDir, 'figma_tech_specs.png') });
    console.log('Captured figma_tech_specs.png');
  }

  await browser.close();
})();
