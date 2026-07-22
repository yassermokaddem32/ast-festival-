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
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Let's check categories options for senior
  const seniorCats = await page.evaluate(() => {
    const divSelect = document.getElementById('division-select');
    const catSelect = document.getElementById('category-select');
    if (!divSelect || !catSelect) return [];

    divSelect.value = 'senior';
    divSelect.dispatchEvent(new Event('change'));

    return Array.from(catSelect.options).map(o => ({ value: o.value, text: o.textContent }));
  });

  console.log('Senior Categories Options:', seniorCats);

  // Let's verify number of member blocks created for drone
  const droneMemberBlocksCount = await page.evaluate(() => {
    const divSelect = document.getElementById('division-select');
    const catSelect = document.getElementById('category-select');
    
    divSelect.value = 'senior';
    divSelect.dispatchEvent(new Event('change'));
    
    catSelect.value = 'drone';
    catSelect.dispatchEvent(new Event('change'));
    
    const blocks = document.querySelectorAll('#member-blocks-container .member-block');
    return blocks.length;
  });

  console.log('Member blocks for Drone:', droneMemberBlocksCount);

  // Let's verify number of member blocks created for innovation
  const innovationMemberBlocksCount = await page.evaluate(() => {
    const divSelect = document.getElementById('division-select');
    const catSelect = document.getElementById('category-select');
    
    divSelect.value = 'senior';
    divSelect.dispatchEvent(new Event('change'));
    
    catSelect.value = 'innovation';
    catSelect.dispatchEvent(new Event('change'));
    
    const blocks = document.querySelectorAll('#member-blocks-container .member-block');
    return blocks.length;
  });

  console.log('Member blocks for Innovation:', innovationMemberBlocksCount);

  await browser.close();
})();
