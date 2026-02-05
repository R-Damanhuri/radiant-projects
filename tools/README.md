# Poetry Automation Tools

Automated poetry generation and image sourcing for IDN Times.

## Overview

This tools directory contains the automation system for:
1. Scraping trending poetry from IDN Times
2. Analyzing examples to learn patterns
3. Generating new poems based on comprehensive learning
4. Sourcing relevant images from Pexels

## Files

### Main Workflow
- **`poetry-workflow.js`** - Complete workflow orchestration

### Scraper  
- **`scraper-fiction.js`** - Scrapes "Trending in Poetry" section from IDN Times

## Usage

### Run Complete Workflow
```bash
node poetry-workflow.js
```

This will:
1. Scrape 5 trending poetry topics from IDN Times
2. Analyze all aspects (length, metaphors, structure, tone, themes)
3. Generate 3 new poems based on learning
4. Extract keywords from each poem
5. Search Pexels for relevant images

### Run Scraper Only
```bash
node scraper-fiction.js
```

## Workflow Details

### Step 1: Scrape Examples
- Target: `https://www.idntimes.com/fiction/poetry`
- Section: "Trending in Poetry" (identified by `data-cy="ds-title"`)
- Extracts: Titles, URLs from article cards

### Step 2: Comprehensive Analysis
Analyzes all aspects of scraped examples:
- **Length**: Baris rata-rata, pola panjang
- **Metaphors & Imagery**: Jenis metafora, gambaran visual
- **Vocabulary**: Tingkat kesulitan, gaya bahasa
- **Structure**: Rhyme scheme, alur, repetisi
- **Themes**: Cinta, kehilangan, alam, kehidupan
- **Tones**: Melankolis, tenang, reflektif
- **Patterns**: Unique IDN Times style

### Step 3: Generate Poems
Creates 3 new poems based on comprehensive learning, matching:
- Style (metafora, personifikasi, kontradiksi)
- Length (4-8 baris)
- Tone (melankolis, reflektif)
- Themes (kehilangan, alam, kehidupan)

### Step 4: Extract Keywords
For each poem, extracts representative keywords for image search.

### Step 5: Search Pexels
Searches Pexels API with keywords, returns 3 images per poem.

## Output

Each generated poem includes:
- Title
- Content (with line breaks)
- Style match notes
- Representative keywords
- Related images from Pexels

## Configuration

Required environment variables (in `.env`):
```
GROQ_API_KEY=your_groq_key
PEXELS_API_KEY=your_pexels_key
```

## Requirements

- Node.js
- Playwright (for scraping)
- dotenv (for config)

## Notes

- API keys must be obtained from Groq and Pexels
- Workflow typically takes 2-3 minutes to complete
- Images are sourced from Pexels (free for commercial use)
