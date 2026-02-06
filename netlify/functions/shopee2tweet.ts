import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Style configurations with distinct personalities
const styleConfigs: Record<string, { 
  tone: string; 
  examples: string[];
  cta: string;
}> = {
  casual: {
    tone: 'santai dan hangat, kayak rekomendasi dari teman dekat',
    examples: [
      "gue tadi checkout ini，总体不错 banget质量也很好👍",
      "cuma mau bilang produk ini worth it banget, sudah coba dan legit",
    ],
    cta: 'Langsung cek ya!'
  },
  excited: {
    tone: 'sangat antusias dan excited, kayak nemu harta karun',
    examples: [
      "INI WAJIB PUNYA 😭产品质量真的很好，比我想象的要好！",
      "GAK BOHONG inbox 这个产品太棒了，强烈推荐！性价比超高！",
    ],
    cta: 'Buruan sebelum habis!'
  },
  professional: {
    tone: 'profesional tapi tetap friendly, informatif',
    examples: [
      "Rekomendasi produk berkualitas dengan harga kompetitif. Sudah review dan layak dipertimbangkan.",
      "Produk ini menawarkan value yang baik. Detail produk sudah dicek dan recommended.",
    ],
    cta: 'Cek detail di link berikut.'
  },
  humor: {
    tone: 'lucu dan witty, pake joke ringan yang relatable',
    examples: [
      "pengeluaran bulan ini: ❌, belanja produk ini: ✅ (tidak menyesal sama sekali)",
      "kata钱不是万能的 tapi produk ini worth every rupiah, trust me",
    ],
    cta: 'Jangan lewatkan!'
  }
};

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

    const userStyle = style || 'casual';
    const config = styleConfigs[userStyle] || styleConfigs.casual;

    const systemPrompt = `Kamu adalah ahli social media marketing Indonesia yang menciptakan tweet yang NATURAL, ENGAGING, dan TIDAK TERASA IKLAN.

Tugas: Buat 1 tweet rekomendasi produk yang terdengar seperti rekomendasi tulus dari teman, bukan iklan продавца.

PRINSIP:
1. Gunakan bahasa Indonesia yang casual dan natural
2. Sertakan pengalaman atau feeling pribadi (已买, 推荐, 值得)
3. Campur Indonesian dan English/Chinese (code-switching natural)
4. Maks 250 karakter (sisanya untuk hashtag)
5. ${config.tone}
6. ${promoCode ? `Wajib sertakan promo code ${promoCode} dengan cara natural.` : 'Tidak perlu promo code.'}
7. Akhiri dengan CTA yang ${config.cta.toLowerCase().replace('.', '')}

CONTOH GAYA "${userStyle.toUpperCase()}":
${config.examples.map(ex => `- "${ex}"`).join('\n')}

FORMAT RESPONSE JSON:
{"tweet": "tweet dalam 1 paragraf, natural, tidak diawali emoji berlebihan", "hashtags": ["#ShopeeIndonesia", "#BelanjaOnline", "#ProdukBagus", "#Recommend"]}

JANGAN:
- Gunakan emoji berlebihan di awal kalimat
- Mulai dengan "Halo friends!" atau "Haii!"
- Terlalu salesy atau iklan keras
- Gunakan hashtag di dalam tweet (taruh di luar)`;

    console.log('Generating tweet for:', shopeeLink, 'style:', userStyle);

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
          { role: 'user', content: `Produk: ${productName || 'dari Shopee'}\nLink: ${shopeeLink}` }
        ],
        temperature: 0.8,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
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

    // Generate dynamic hashtags based on product name and style
    const productKeywords = productName 
      ? productName.toLowerCase().split(' ').slice(0, 2).map((w: string) => `#${w.replace(/[^a-z]/g, '')}`)
      : [];
    
    const styleHashtags: Record<string, string[]> = {
      casual: ['#OOTD', '#DailyRecommend', '#KopiCurat'],
      excited: ['#WajibPunya', '#Hype', '#BestFind'],
      professional: ['#ProductReview', '#QualityCheck', '#TrustedSeller'],
      humor: ['#WorthIt', '#TidakMenyesal', '#BudgetFriendly']
    };

    const hashtags = [
      '#ShopeeIndonesia',
      '#BelanjaOnline',
      ...productKeywords.slice(0, 2),
      ...(styleHashtags[userStyle] || styleHashtags.casual).slice(0, 2)
    ];

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        tweet: tweet,
        hashtags: [...new Set(hashtags)]
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Failed' })
    };
  }
};

export { handler };
