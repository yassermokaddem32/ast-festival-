const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log("Launching Microsoft Edge for local check...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    defaultViewport: { width: 1440, height: 900 }
  });

  try {
    const page = await browser.newPage();
    
    // Log console messages and errors
    page.on('pageerror', (err) => {
      console.error('BROWSER EXCEPTION:', err.toString());
    });
    page.on('console', (msg) => {
      console.log('BROWSER LOG:', msg.text());
    });

    console.log("Navigating to local site...");
    await page.goto('http://localhost:5173/', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    console.log("Waiting 3 seconds...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    const artifactsDir = 'C:\\Users\\Yasser\\.gemini\\antigravity\\brain\\8433bbcd-561c-4d52-bb5b-fc92c068f5ee';

    console.log("Clicking Robot Fighter competition card...");
    const card = await page.$('[data-competition-id="robot-fighter"]');
    if (card) {
      await card.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Capturing expanded card modal screenshot (modal_open.png)...");
      await page.screenshot({ path: path.join(artifactsDir, 'modal_open.png') });

      console.log("Clicking Register Now inside modal...");
      const regBtn = await page.$('#modal-register-btn');
      if (regBtn) {
        await regBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    console.log("Capturing full page screenshot (local_site.png)...");
    await page.screenshot({ path: path.join(artifactsDir, 'local_site.png'), fullPage: true });

    console.log("Ensuring modal is closed...");
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Scrolling to Old Events section...");
    const oldEventsSec = await page.$('#old-events');
    if (oldEventsSec) {
      await oldEventsSec.scrollIntoView();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Capturing Old Events section screenshot (old_events_real.png)...");
      await page.screenshot({ path: path.join(artifactsDir, 'old_events_real.png') });
    }

    console.log("Done.");
  } catch (err) {
    console.error("Execution error:", err);
  } finally {
    await browser.close();
  }
})();
