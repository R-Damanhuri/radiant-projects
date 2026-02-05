# IDN Times Publisher Automation

## Purpose
One-click publish to IDN Times using Playwright.

## Setup
```bash
npm install playwright
npx playwright install chromium
```

## Script
```javascript
const { chromium } = require('playwright');

async function publishPoetry(config, content) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to IDN Times
    await page.goto('https://www.idntimes.com/write/new');
    
    // Login if not authenticated
    if (await page.isVisible('#email')) {
      await page.fill('#email', config.email);
      await page.fill('#password', config.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }
    
    // Fill title
    await page.fill('input[title="Judul"]', content.title);
    
    // Fill content (rich text editor)
    await page.click('.editor');
    await page.keyboard.type(content.body);
    
    // Add featured image
    if (content.imagePath) {
      const fileInput = await page.$('input[type="file"]');
      await fileInput.setInputFiles(content.imagePath);
    }
    
    // Set category (Poetry)
    await page.selectOption('select[name="category"]', 'poetry');
    
    // Add tags
    await page.fill('input[name="tags"]', content.tags.join(', '));
    
    // Preview
    await page.click('button:has-text("Preview")');
    await page.waitForTimeout(2000);
    
    // Publish
    await page.click('button:has-text("Publish")');
    await page.waitForTimeout(3000);
    
    console.log('✅ Published successfully!');
    return { success: true, url: page.url() };
    
  } catch (error) {
    console.error('❌ Publish failed:', error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// Usage
const config = {
  email: process.env.IDN_TIMES_EMAIL,
  password: process.env.IDN_TIMES_PASSWORD
};

const content = {
  title: 'Bayangan di Malam',
  body: 'Dalam keheningan malam\nBayangan bertemu dirinya\nKesepian berbisik lembut...',
  imagePath: './images/poem-1.jpg',
  tags: ['malam', 'puisi', 'kesepian']
};

publishPoetry(config, content);
```

## Running
```bash
node publish.js
```

## Notes
- Run in headless mode for automation
- May need to handle captcha manually
- Test with draft first before publishing
- Save session to avoid re-login
