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

    // Focus on the canvas exactly at the Hero section coordinates
    console.log("Focusing canvas at Hero section (536, 250)...");
    await page.mouse.click(536, 250);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Zoom in using WebGL canvas WheelEvent centered at X=536, Y=250
    console.log("Zooming WebGL canvas centered at Hero (536, 250)...");
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas') || document.body;
      const zoomInEvent = new WheelEvent('wheel', {
        deltaY: -300,
        clientX: 536,
        clientY: 250,
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });
      // Fire it 5 times to zoom in significantly (approx 25% or 50% zoom)
      for (let i = 0; i < 5; i++) {
        canvas.dispatchEvent(zoomInEvent);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Press H to activate Hand tool for panning
    console.log("Selecting Hand tool (h)...");
    await page.keyboard.press('h');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const artifactsDir = 'C:\\Users\\Yasser\\.gemini\\antigravity\\brain\\8433bbcd-561c-4d52-bb5b-fc92c068f5ee';

    // Take screenshot 1: Hero (should be zoomed in to Frame 78's Hero section now!)
    console.log("Capturing Section 1 (Hero)...");
    await page.screenshot({ path: path.join(artifactsDir, 'figma_clean_1_hero.png') });

    // Drag 1
    console.log("Dragging down to Section 2 (About)...");
    await page.mouse.move(700, 600);
    await page.mouse.down();
    await page.mouse.move(700, 200, { steps: 35 });
    await page.mouse.up();
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.screenshot({ path: path.join(artifactsDir, 'figma_clean_2_about.png') });

    // Drag 2
    console.log("Dragging down to Section 3 (Carousels)...");
    await page.mouse.move(700, 600);
    await page.mouse.down();
    await page.mouse.move(700, 150, { steps: 35 });
    await page.mouse.up();
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.screenshot({ path: path.join(artifactsDir, 'figma_clean_3_carousels.png') });

    // Drag 3
    console.log("Dragging down to Section 4 (Registration Form)...");
    await page.mouse.move(700, 600);
    await page.mouse.down();
    await page.mouse.move(700, 100, { steps: 35 });
    await page.mouse.up();
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.screenshot({ path: path.join(artifactsDir, 'figma_clean_4_form.png') });

    // Drag 4
    console.log("Dragging down to Section 5 (FAQ & Footer)...");
    await page.mouse.move(700, 600);
    await page.mouse.down();
    await page.mouse.move(700, 50, { steps: 35 });
    await page.mouse.up();
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.screenshot({ path: path.join(artifactsDir, 'figma_clean_5_faq_footer.png') });

    console.log("Success! Screenshots saved.");
  } catch (err) {
    console.error("Execution error:", err);
  } finally {
    await browser.close();
  }
})();
