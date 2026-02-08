import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

interface ExtractResult {
  title: string;
  url: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { link } = body;

    console.log('Extracting via script:', link);

    // Spawn the extraction script
    const extraction = spawn('node', [
      '/home/ubuntu/.openclaw/workspace/radiant-projects/scripts/extract-content.js'
    ]);

    let stdout = '';
    let stderr = '';

    extraction.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    extraction.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const result = await new Promise<{success: boolean; data?: ExtractResult; error?: string}>((resolve) => {
      extraction.on('close', (code) => {
        if (code === 0 && stdout.includes('RESULT_JSON_START')) {
          try {
            const jsonMatch = stdout.match(/RESULT_JSON_START\n([\s\S]*?)\nRESULT_JSON_END/);
            if (jsonMatch) {
              const data = JSON.parse(jsonMatch[1]);
              resolve({ success: true, data });
            } else {
              resolve({ success: false, error: 'Failed to parse result JSON' });
            }
          } catch (e) {
            resolve({ success: false, error: 'Failed to parse result JSON' });
          }
        } else {
          resolve({ success: false, error: stderr || 'Extraction failed' });
        }
      });
      
      extraction.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      setTimeout(() => {
        extraction.kill();
        resolve({ success: false, error: 'Timeout' });
      }, 15000);
    });

    if (!result.success || !result.data) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to extract content'
      }, { status: 500 });
    }

    const { title, url, content: domContentRaw } = result.data;
    
    // Parse the new extraction format (main + price sections)
    let domContent = '';
    let priceContent = '';
    try {
      const parsed = JSON.parse(domContentRaw);
      domContent = parsed.main || '';
      priceContent = parsed.price || '';
    } catch {
      domContent = domContentRaw;
    }
    
    console.log('Extracted:', { title, domContentLength: domContent.length, priceContentLength: priceContent.length });

    // Extract info
    const priceMatch = priceContent.match(/Rp[\s\d\.]+/) || domContent.match(/Rp[\s\d\.]+/);
    const price = priceMatch ? priceMatch[0] : 'Check link';
    const name = title.split('|')[0].trim().split(' - ')[0] || 'Unknown Product';

    // Generate story with AI
    const aiPrompt = `Create an engaging social media story for this Shopee product.

PRODUCT NAME: ${name}
PRICE INFO: ${priceContent || price}
PRODUCT CONTENT:
${domContent.slice(0, 2000)}
URL: ${link}

TASK:
1. Write 4 paragraphs in casual Indonesian/English (Jaksel style)
2. Make it relatable and engaging
3. End with CTA + product link

Respond with ONLY valid JSON:
{
  "product": { "name": "${name}", "price": "${price}", "description": "" },
  "thread": ["Hook", "Discovery", "Details", "CTA with link"],
  "hashtags": ["#ShopeeFinds", "#RacunShopee"]
}`;

    console.log('Calling AI...');

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You create viral social media stories. Respond JSON only.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';

    let parsed: any = { product: { name, price }, thread: [], hashtags: ['#ShopeeFinds', '#RacunShopee'] };
    
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      else parsed.thread = aiContent.split('\n\n').filter((p: string) => p.trim().length > 20);
    } catch (e) {
      parsed.thread = [aiContent];
    }

    return NextResponse.json({
      success: true,
      product: parsed.product,
      thread: parsed.thread,
      hashtags: parsed.hashtags,
      extractedData: {
        name,
        price,
        url: link,
        title,
        contentPreview: `=== PRODUCT DETAIL ===\n${domContent.slice(0, 600)}\n\n=== CART CARD ===\n${priceContent}`,
        note: '✅ Full content extracted from browser'
      }
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to extract data' 
    }, { status: 500 });
  }
}
