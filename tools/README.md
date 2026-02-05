# Poetry Automation Tools

## 1. IDN Times Scraper

### Purpose
Scrape trending poetry topics from IDN Times.

### Implementation
```javascript
// Pseudo-code
const scrapeTrendingTopics = async () => {
  const response = await fetch('https://www.idntimes.com/poetry');
  const html = parse(response);
  // Extract trending topics
  return topics;
}
```

### Notes
- IDN Times poetry section: `https://www.idntimes.com/poetry`
- Look for trending/popular articles
- Extract themes and keywords

---

## 2. Poetry Generator (Groq/OpenRouter)

### Purpose
Generate original Indonesian poetry based on topics.

### Implementation
```javascript
const generatePoetry = async (topic, apiKey) => {
  const prompt = `Buat 3 puisi Indonesia tentang "${topic}". 
  Setiap puisi 4-8 baris. 
  Sertakan title dan 3 keywords untuk gambar.
  Format JSON.`;
  
  const response = await fetch('https://api.groq.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### Models
- Groq: `llama3-8b-8192` (fast, cheap)
- OpenRouter: `anthropic/claude-3-haiku`

---

## 3. Pexels Image Search

### Purpose
Find relevant images for poetry.

### Implementation
```javascript
const searchPexels = async (keywords, apiKey) => {
  const query = keywords.join(' ');
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=3`,
    { headers: { 'Authorization': apiKey } }
  );
  return response.photos;
}
```

### Notes
- Use first 3 keywords
- Get 3 images per poem
- Store image URLs for publishing

---

## 4. Google Sheets Integration

### Purpose
Store generated poetry for tracking.

### Implementation
```javascript
const saveToSheets = async (data, sheetId, credentials) => {
  // Use Google Sheets API
  // Append row with: date, topic, title, content, image_url, status
}
```

---

## 5. IDN Times Publisher (Playwright)

### Purpose
Automate publishing to IDN Times.

### Implementation
```javascript
const publishToIDNTimes = async (page, credentials, content) => {
  // Navigate to IDN Times
  await page.goto('https://www.idntimes.com/write/new');
  
  // Login if needed
  await page.fill('#email', credentials.email);
  await page.fill('#password', credentials.password);
  await page.click('button[type="submit"]');
  
  // Fill form
  await page.fill('input[title]', content.title);
  await page.fill('.editor', content.body);
  
  // Add featured image
  await page.setInputFiles('input[type="file"]', content.imagePath);
  
  // Publish
  await page.click('button.publish');
}
```

### Notes
- Need to handle login sessions
- May need to solve captcha
- Test with small content first
