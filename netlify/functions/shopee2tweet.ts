import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { shopeeLink, productName, style, promoCode } = JSON.parse(event.body || "{}");

    if (!shopeeLink) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Shopee link is required" })
      };
    }

    const stylePrompts: Record<string, string> = {
      casual: 'Teman yang rekomendasiin dengan santai.',
      excited: 'Sangat antusias dan excited!',
      professional: 'Profesional tapi tetap friendly.',
      humor: 'Lucu dan entertaining, pake joke ringan.'
    };

    const userStyle = style || 'casual';
    const systemPrompt = `Kamu ahli social media marketing Indonesia.
Buatkan 1 tweet dari link Shopee yang NATURAL dan ENGAGING.
- Maks 280 karakter
- Bahasa Indonesia smooth
- ${promoCode ? `Sertakan promo ${promoCode} dengan natural.` : 'Tidak perlu promo.'}
- Gaya: ${stylePrompts[userStyle] || stylePrompts.casual}
Respons JSON: {"tweet": "tweet tanpa hashtag"}`;

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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Groq API error: ${response.status}` })
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    let tweet = content.trim();

    // Try to extract JSON
    try {
      if (tweet.startsWith('{')) {
        const parsed = JSON.parse(tweet);
        tweet = parsed.tweet || tweet;
      }
    } catch (e) {}

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        tweet: tweet,
        hashtags: ['#ShopeeIndonesia', '#BelanjaOnline', '#Recommend']
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Failed' })
    };
  }
};

export { handler };
