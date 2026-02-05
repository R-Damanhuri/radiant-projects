# Future Project - Poetry Automation for IDN Times

## Overview
Automated poetry content generation and publishing system for IDN Times writers. This project includes a landing page and a powerful poetry automation dashboard.

## Project Structure

```
future-project/
├── README.md              # This file
├── app/                   # Landing page (Next.js)
├── dashboard/             # Poetry automation dashboard (Next.js)
├── agents/                # OpenClaw agent configurations
├── tools/                 # API integration documentation
├── automation/            # Playwright publish scripts
├── .env.example           # Environment variables template
└── test.js                # Test script
```

## Landing Page
- **Location:** `/app/page.tsx`
- **URL:** https://clever-pony-efe026.netlify.app/
- **Status:** ✅ Live

## Poetry Automation Dashboard
- **Location:** `/dashboard/`
- **Purpose:** Generate and publish poetry to IDN Times
- **Status:** 🚧 Setup in progress

## Poetry Automation Workflow

```
1. Scrape trending poetry topics from IDN Times
2. Generate original poetry using AI (Groq/OpenRouter)
3. Fetch relevant images from Pexels API
4. Store in Google Sheets for tracking
5. Dashboard review with one-click publish
6. Browser automation posts to IDN Times
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Landing Page | Next.js + Tailwind CSS |
| Dashboard | Next.js |
| AI Agents | OpenClaw |
| Content Generation | Groq / OpenRouter |
| Images | Pexels API |
| Browser Automation | Playwright |
| Deployment | Netlify |

## Getting Started

### 1. Setup Environment
```bash
cp .env.example .env
# Fill in your API keys
```

### 2. Install Dependencies (for dashboard)
```bash
cd dashboard
npm install
npm run dev
```

### 3. Test Poetry Generation
```bash
node test.js
```

### 4. Configure API Keys

Required:
- `GROQ_API_KEY` - For AI poetry generation
- `PEXELS_API_KEY` - For image sourcing
- `IDN_TIMES_EMAIL` - Account for publishing
- `IDN_TIMES_PASSWORD` - Account password

Optional:
- `OPENROUTER_API_KEY` - Alternative AI provider
- `GOOGLE_SHEETS_ID` - For data tracking

## Files Description

| File/Folder | Purpose |
|-------------|---------|
| `agents/poetry-generator.md` | OpenClaw agent config for poetry generation |
| `tools/README.md` | API integration documentation |
| `automation/publish.js` | Playwright script for IDN Times publishing |
| `dashboard/app/page.tsx` | Dashboard UI for review & publish |
| `app/page.tsx` | Landing page (already deployed) |

## Deployment

### Landing Page
- Already deployed to Netlify
- URL: https://clever-pony-efe026.netlify.app/

### Dashboard
- Deploy from `/dashboard` folder
- Or deploy separately to Vercel/Netlify

## Status

| Component | Status |
|-----------|--------|
| Landing Page | ✅ Live |
| Project Structure | ✅ Done |
| Dashboard UI | ✅ Basic Ready |
| Publish Automation | ✅ Script Ready |
| API Integrations | 📝 Need API Keys |

## Next Steps

1. Get API keys (Groq, Pexels)
2. Configure `.env` file
3. Test poetry generation
4. Test publish automation
5. Go live!

## License

MIT
