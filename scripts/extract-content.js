#!/usr/bin/env node

const http = require('http');
const WebSocket = require('ws');

async function main() {
  const DEBUG_PORT = 9222;
  
  console.log('Extracting from browser...');
  
  // 1. Get tab info via HTTP
  const tabsRes = await fetch(`http://localhost:${DEBUG_PORT}/json`);
  const tabs = await tabsRes.json();
  
  const targetTab = tabs.find((t) => 
    t.type === 'page' && t.url && t.url.includes('shopee')
  );
  
  if (!targetTab) {
    console.error('No Shopee page found');
    process.exit(1);
  }
  
  const title = targetTab.title || '';
  const url = targetTab.url || '';
  
  console.log('Target:', title);
  
  // 2. Connect via WebSocket
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  
  ws.on('open', () => {
    console.log('WS connected');
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 2,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            // Main product detail class
            const main = document.querySelector('.product-detail.page-product__detail');
            // Price section class
            const price = document.querySelector('.flex.flex-auto.YTDXQ0');
            // Extract both
            const result = {
              main: main ? main.innerText.slice(0, 3000) : 'NOT_FOUND',
              price: price ? price.innerText.slice(0, 1000) : 'NOT_FOUND'
            };
            return JSON.stringify(result);
          })()`,
          returnByValue: true
        }
      }));
    }, 500);
  });
  
  let gotContent = false;
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.result?.result?.value && msg.result.result.value !== 'NOT_FOUND' && !gotContent) {
      gotContent = true;
      // Return structured data
      const result = {
        title: title,
        url: url,
        content: msg.result.result.value.trim()
      };
      console.log('RESULT_JSON_START');
      console.log(JSON.stringify(result));
      console.log('RESULT_JSON_END');
      ws.close();
      process.exit(0);
    }
  });
  
  ws.on('error', (err) => {
    console.error('WS Error:', err.message);
    process.exit(1);
  });
  
  setTimeout(() => {
    if (!gotContent) {
      console.error('Timeout');
      process.exit(1);
    }
  }, 10000);
}

main().catch(console.error);
