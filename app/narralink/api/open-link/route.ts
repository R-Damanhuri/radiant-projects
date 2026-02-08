import { NextResponse } from 'next/server';
import { spawn, execSync } from 'child_process';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Launching browser with URL:', url);

    const PROFILE_PATH = '/home/ubuntu/.browser-profiles/shopee';
    const DEBUG_PORT = 9222;
    const XvFB_DISPLAY = ':99';

    const fs = require('fs');
    if (!fs.existsSync(PROFILE_PATH)) {
      fs.mkdirSync(PROFILE_PATH, { recursive: true });
    }

    // Kill any existing Chrome
    try {
      execSync('pkill -9 chrome || true', { encoding: 'utf8' });
    } catch (e) {}
    
    await new Promise(r => setTimeout(r, 1000));

    // Launch new Chrome with the URL
    const chromeArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      '--window-size=1920,1080',
      `--user-data-dir=${PROFILE_PATH}`,
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-translate',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-sync',
      url  // Directly open this URL
    ];

    spawn('/usr/bin/google-chrome', chromeArgs, {
      env: { ...process.env, DISPLAY: XvFB_DISPLAY },
      detached: true,
      stdio: 'ignore'
    });

    // Wait for browser to start
    let started = false;
    for (let i = 0; i < 15; i++) {
      try {
        const response = await fetch(`http://localhost:${DEBUG_PORT}/json`);
        if (response.ok) {
          const tabs = await response.json();
          if (tabs && tabs.length > 0) {
            started = true;
            break;
          }
        }
      } catch (e) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    if (started) {
      return NextResponse.json({
        success: true,
        message: 'Browser launched with URL!',
        url: 'http://vm-4-121-ubuntu.tailc895df.ts.net:8081/vnc.html',
        note: '✅ Browser opened! Check noVNC.'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Browser failed to start'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
