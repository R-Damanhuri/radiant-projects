import { NextResponse } from 'next/server';
import { spawn, execSync } from 'child_process';

export async function POST() {
  try {
    console.log('Launching Shopee browser...');

    const PROFILE_PATH = '/home/ubuntu/.browser-profiles/shopee';
    const DEBUG_PORT = 9222;
    const XvFB_DISPLAY = ':99';

    const fs = require('fs');
    if (!fs.existsSync(PROFILE_PATH)) {
      fs.mkdirSync(PROFILE_PATH, { recursive: true });
    }

    // Check if browser is already running
    let browserRunning = false;
    try {
      const response = await fetch(`http://localhost:${DEBUG_PORT}/json`);
      if (response.ok) {
        const tabs = await response.json();
        browserRunning = tabs && Array.isArray(tabs);
      }
    } catch (e) {
      browserRunning = false;
    }

    if (browserRunning) {
      // Open new tab with login page
      try {
        const newTabResponse = await fetch(`http://localhost:${DEBUG_PORT}/json/new?url=${encodeURIComponent('https://shopee.co.id/buyer/login')}`);
        const newTab = await newTabResponse.json();
        
        return NextResponse.json({
          success: true,
          message: 'New tab opened!',
          url: 'http://vm-4-121-ubuntu.tailc895df.ts.net:8081/vnc.html',
          note: '✅ New tab opened for login!'
        });
      } catch (e: any) {
        return NextResponse.json({
          success: true,
          message: 'Browser already running!',
          url: 'http://vm-4-121-ubuntu.tailc895df.ts.net:8081/vnc.html',
          note: '✅ Browser is running. Check noVNC!'
        });
      }
    }

    // Kill any existing chrome
    try {
      execSync('pkill -9 chrome || true', { encoding: 'utf8' });
    } catch (e) {}
    
    await new Promise(r => setTimeout(r, 1000));

    // Launch new browser
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
      'https://shopee.co.id/buyer/login'
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
        const response = await fetch(`http://localhost:${DEBUG_PORT}/json`, );
        if (response.ok) {
          started = true;
          break;
        }
      } catch (e) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    if (started) {
      return NextResponse.json({
        success: true,
        message: 'Browser launched!',
        url: 'http://vm-4-121-ubuntu.tailc895df.ts.net:8081/vnc.html',
        note: '✅ Browser launched! Login di noVNC.'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Browser failed to start'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
