import { NextRequest, NextResponse } from 'next/server';

// Style configurations with distinct personalities
const styleConfigs = {
  casual: {
    tone: 'santai dan hangat, kayak rekomendasi dari teman dekat',
    examples: [
      "gue tadi checkout ini,总体不错 banget质量也很好👍",
      "cuma mau bilang produk ini worth it banget, sudah coba dan legit",
    ],
    emoji: '🛒',
    cta: 'Langsung cek ya!'
  },
  excited: {
    tone: 'sangat antusias dan excited, kayak nemu harta karun',
    examples: [
      "INI WAJIB PUNYA 😭产品质量真的很好，比我想象的要好！",
      "GAK BOHONG inbox 这个产品太棒了，强烈推荐！性价比超高！",
    ],
    emoji: '🎉',
    cta: 'Buruan sebelum habis!'
  },
  professional: {
    tone: 'profesional tapi tetap friendly, informatif',
    examples: [
      "Rekomendasi produk berkualitas dengan harga kompetitif. Sudah review dan layak dipertimbangkan.",
      "Produk ini menawarkan value yang baik. Detail produk sudah dicek dan recommended.",
    ],
    emoji: '⭐',
    cta: ' Cek detail di link berikut.'
  },
  humor: {
    tone: 'lucu dan witty, pake joke ringan yang relateable',
    examples: [
      "pengeluaran bulan ini: ❌, belanja produk ini: ✅ (tidak menyesal sama sekali)",
      "kata钱不是万能的 tapi produk ini worth every rupiah, trust me",
    ],
    emoji: '😂',
    cta: 'Jangan lewatkan!'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { shopeeLink, productName, style, promoCode } = await request.json();

    if (!shopeeLink) {
      return NextResponse.json(
        { error: 'Shopee link is required' },
        { status: 400 }
      );
    }

    const userStyle = style || 'casual';
    const config = styleConfigs[userStyle as keyof typeof styleConfigs] || styleConfigs.casual;

    // Build hashtag section
    const hashtagSection = promoCode 
      ? `\n\nPromo: Gunakan kode ${promoCode} untuk diskon! 🎁`
      : '';

    const systemPrompt = `Kamu adalah ahli social media marketing Indonesia yang menciptakan tweet yang NATURAL, ENGAGING, dan TIDAK TERASA IKLAN.

Tugas: Buat 1 tweet rekomendasi produk yang terdengar seperti rekomendasi tulus dari teman, bukan iklan продавца.

PRINSIP:
1. Gunakan bahasa Indonesia yang casual dan natural
2. Sertakan pengalaman atau feeling pribadi ( 已买, 推荐, 值得)
3. Campur Indonesian dan English/Chinese (code-switching natural)
4. Maks 250 karakter (sisanya untuk hashtag)
5. ${config.tone}
6. ${promoCode ? `Wajib sertakan promo code ${promoCode} dengan cara natural.` : 'Tidak perlu promo code.'}
7. Akhiri dengan CTA yang ${config.cta.toLowerCase().replace('.', '')}

CONTOH GAYA "${style?.toUpperCase() || 'CASUAL'}":
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
        temperature: 0.8, // Slightly higher for more variety
        max_tokens: 250,
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

    // Generate dynamic hashtags based on product name and style
    const productKeywords = productName 
      ? productName.toLowerCase().split(' ').slice(0, 2).map((w: string) => `#${w.replace(/[^a-z]/g, '')}`)
      : [];
    
    const styleHashtags = {
      casual: ['#OOTD', '#DailyRecommend', '#KopiCurat'],
      excited: ['#WajibPunya', '#Hype', '#BestFind'],
      professional: ['#ProductReview', '#QualityCheck', '#TrustedSeller'],
      humor: ['#WorthIt', '#TidakMenyesal', '#BudgetFriendly']
    };

    const hashtags = [
      '#ShopeeIndonesia',
      '#BelanjaOnline',
      ...productKeywords.slice(0, 2),
      ...(styleHashtags[userStyle as keyof typeof styleHashtags] || styleHashtags.casual).slice(0, 2)
    ];

    return NextResponse.json({
      success: true,
      tweet: tweet,
      hashtags: [...new Set(hashtags)] // Remove duplicates
    });

  } catch (error) {
    console.error('Error generating tweet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate tweet' },
      { status: 500 }
    );
  }
}
