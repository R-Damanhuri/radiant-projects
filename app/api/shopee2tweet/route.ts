import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { shopeeLink, productName, style, promoCode } = await request.json();

    if (!shopeeLink) {
      return NextResponse.json(
        { error: 'Shopee link is required' },
        { status: 400 }
      );
    }

    // Build the prompt based on style
    const stylePrompts = {
      casual: 'Teman yang rekomendasiin dengan santai, kayak chat biasa.',
      excited: 'Sangat antusias dan excited, kayak nemu barang keren banget!',
      professional: 'Profesional tapi tetap friendly.',
      humor: 'Lucu dan entertaining, pake joke ringan.'
    };

    const userStyle = style || 'casual';
    const systemPrompt = `Kamu adalah ahli social media marketing Indonesia.
Buatkan 1 tweet dari link Shopee yang NATURAL dan ENGAGING.

Karakteristik:
- Tidak terasa kayak iklan keras
- Bahasa Indonesia yang smooth
- Maks 280 karakter
- ${promoCode ? `Sertakan promo code ${promoCode} dengan natural.` : 'Tidak perlu promo code.'}
- ${stylePrompts[userStyle as keyof typeof stylePrompts] || stylePrompts.casual}

Format response JSON saja:
{"tweet": "tweet yang dihasilkan tanpa hashtag"}`;

    console.log('Generating tweet for:', shopeeLink);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Link: ${shopeeLink}. Product: ${productName || 'dari Shopee'}` }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Extract tweet and hashtags
    let tweet = content.trim();
    
    // Remove JSON wrapper if present
    try {
      if (tweet.startsWith('{')) {
        const parsed = JSON.parse(tweet);
        tweet = parsed.tweet || tweet;
      }
    } catch (e) {
      // Not JSON, use as is
    }

    // Generate hashtags based on content
    const hashtags = [
      '#ShopeeIndonesia',
      '#BelanjaOnline',
      '#Recommend'
    ];

    return NextResponse.json({
      success: true,
      tweet: tweet,
      hashtags: hashtags
    });

  } catch (error) {
    console.error('Error generating tweet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate tweet' },
      { status: 500 }
    );
  }
}
