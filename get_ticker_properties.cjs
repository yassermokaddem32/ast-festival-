const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log("Launching Microsoft Edge...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: false,
    defaultViewport: { width: 1440, height: 900 }
  });

  try {
    const page = await browser.newPage();
    console.log("Navigating to Figma...");
    try {
      await page.goto('https://www.figma.com/design/8iy7d1gC7DRP35wNW7WnKc/Untitled?node-id=0-1&t=rCLjEvZHbBjLtaEQ-1', {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });
    } catch (e) {
      console.log("Navigation timeout or error, proceeding anyway:", e.message);
    }

    console.log("Waiting 20 seconds for Figma canvas/WebGL to load...");
    await new Promise(resolve => setTimeout(resolve, 20000));

    // Remove overlays
    console.log("Injecting styles to hide overlay elements...");
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
        div[class*="banner"], 
        div[class*="promo"], 
        div[class*="login"], 
        div[class*="overlay"],
        [data-testid*="login"],
        [data-testid*="banner"],
        iframe { 
          display: none !important; 
        }
      `;
      document.head.appendChild(style);
    }).catch(err => console.log("Overlay removal error:", err.message));

    // Zoom back out to fit everything (Shift + 1)
    console.log("Focusing canvas...");
    await page.mouse.click(720, 500);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Pressing Shift + 1 (Zoom to fit)...");
    await page.keyboard.down('Shift');
    await page.keyboard.press('Digit1');
    await page.keyboard.up('Shift');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Select the Move tool (v)
    console.log("Selecting Move tool (v)...");
    await page.keyboard.press('v');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Click on the ticker strip of Frame 78
    // In figma_zoom_all, the ticker in Frame 78 is at X = 536, Y = 320 approx
    console.log("Clicking on ticker strip in Frame 78 at X=536, Y=320...");
    await page.mouse.click(536, 320);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Let's dump all text in the right sidebar panel to find the CSS properties!
    console.log("Extracting text from right sidebar panel...");
    const sidebarText = await page.evaluate(() => {
      // Figma's right panel has classes containing 'properties_panel' or 'raw_components' or layout panel selectors
      const rightPanel = document.querySelector('div[class*="properties_panel"]');
      if (rightPanel) {
        return rightPanel.innerText;
      }
      // If not found, look at the rightmost 300px area
      const panels = Array.from(document.querySelectorAll('div, section, aside')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.x > 1100 && rect.width > 200 && rect.height > 500;
      });
      return panels.map(p => p.innerText).join('\n---\n');
    });

    console.log("Sidebar properties panel text:\n", sidebarText);

    const artifactsDir = 'C:\\Users\\Yasser\\.gemini\\antigravity\\brain\\8433bbcd-561c-4d52-bb5b-fc92c068f5ee';
    console.log("Capturing screen with properties panel...");
    await page.screenshot({ path: path.join(artifactsDir, 'figma_ticker_inspect.png') });

    console.log("Done.");
  } catch (err) {
    console.error("Execution error:", err);
  } finally {
    await browser.close();
  }
})();
