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

  // Select Maze Solver card and click it
  const mazeCard = await page.$('[data-competition-id="maze-solver"]');
  if (!mazeCard) {
    console.error('Maze Solver Card not found!');
    process.exit(1);
  }

  console.log('Clicking Maze Solver Card...');
  await mazeCard.click();
  await new Promise(r => setTimeout(r, 600));

  const modalTitle = await page.evaluate(() => {
    return document.getElementById('modal-title').textContent;
  });
  console.log('Opened Expanded Card Modal Title:', modalTitle);

  // Click Register Now in modal
  console.log('Clicking Register Now...');
  await page.evaluate(() => {
    document.getElementById('modal-register-btn').click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Check form selected values
  const formSelection = await page.evaluate(() => {
    return {
      division: document.getElementById('division-select').value,
      category: document.getElementById('category-select').value,
      members: document.querySelectorAll('#member-blocks-container .member-block').length
    };
  });
  console.log('Form state after redirection:', formSelection);

  await browser.close();
})();
