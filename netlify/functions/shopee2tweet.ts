import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Storytelling style configurations
const styleConfigs: Record<string, { 
  tone: string; 
  structure: string;
  examples: string[];
  emoji: string;
}> = {
  casual: {
    tone: 'Curhat santai sama teman, kayak lagi nongkrong ngobrolin pengalaman',
    structure: 'Pengalaman personal + insight + solusi + link',
    examples: [
      "Gue tadi scrolling terus nemu ini, overall，总体不错 banget质量也很好👍 Langsung cek ya!",
      "Baru aja nyoba produk ini dan cukup impressed, worth it banget! Cek linknya ya!",
    ],
    emoji: '💭'
  },
  excited: {
    tone: 'Excited sharing, kayak nemu harta karun dan harus share',
    structure: 'Reaksi shocked + pengalaman + FOMO + link',
    examples: [
      "INI WAJIB PUNYA 😭产品质量真的很好，比我想象的要好！ BURUAN SEBELUM HABIS!",
      "GAK BOHONG inbox 这个产品太棒了，强烈推荐！性价比超高！",
    ],
    emoji: '🔥'
  },
  professional: {
    tone: 'Professional review tapi tetap personal dan trustworthy',
    structure: 'Problem statement + research + testing + recommendation',
    examples: [
      "Setelah mencoba produk ini, saya impressed dengan kualitasnya. Detail dan spesifikasi di link berikut.",
      "Rekomendasi hari ini untuk yang mencari solusi praktis. Based on personal testing, sangat worth it.",
    ],
    emoji: '📋'
  },
  humor: {
    tone: 'Bercanda tapi tetap informatif, pake meme energy',
    structure: 'Relatable struggle + plot twist + humor + link',
    examples: [
      "pengeluaran bulan ini: ❌, belanja produk ini: ✅ (tidak menyesal sama sekali) link di bio ya!",
      "Dulu Gue: 'mahal amat'. Setelah ini Gue: 'worth every rupiah' trust me bro 😅",
    ],
    emoji: '😂'
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

    const systemPrompt = `Kamu adalah ahli social media marketing Indonesia yang menciptakan KONTEN STORYTELLING yang NATURAL dan ENGAGING.

Tugas: Buat 1 post/storytelling yang terdengar seperti CURHATAN atau PENGALAMAN dari teman, BUKAN iklan.

STRUKTUR STORYTELLING:
1. Mulai dengan pengalaman atau situasi relatable (curhat/dongeng)
2. Sisipkan produk sebagai SOLUSI dari situasi tersebut
3. Cerita harus NATURAL, bukan "IKLAN!"
4. Link produk harus terintegrasi dalam cerita, bukan di akhir kalimat

PRINSIP:
1. Gunakan bahasa Indonesia yang casual dan natural
2. Sertakan pengalaman atau feeling pribadi
3. Maks 250 karakter (sisanya untuk hashtag)
4. ${config.tone}
5. ${promoCode ? `Wajib sertakan promo code ${promoCode} dengan cara natural.` : 'Tidak perlu promo code.'}
6. Akhiri dengan CTA natural

CONTOH GAYA "${userStyle.toUpperCase()}":
${config.examples.map(ex => `- "${ex}"`).join('\n')}

FORMAT RESPONSE JSON:
{"tweet": "Cerita 1 paragraf, natural, seperti curhat teman. Sisipkan link produk di tengah atau akhir cerita dengan natural.", "hashtags": ["#ShopeeIndonesia", "#BelanjaOnline", "#Curhat", "#Recommend"]}

JANGAN:
- Mulai dengan "Halo friends!" atau "Haii!"
- Terlalu salesy atau "BELI SEKARANG!"
- Taruh link di akhir doang tanpa konteks
- Gunakan emoji berlebihan di awal`;

    console.log('Generating storytelling tweet for:', shopeeLink, 'style:', userStyle);

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
        temperature: 0.85,
        max_tokens: 300,
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

    // Generate dynamic hashtags based on style
    const styleHashtags: Record<string, string[]> = {
      casual: ['#Curhat', '#Pengalaman', '#RealTalk'],
      excited: ['#WajibPunya', '#Hype', '#FOMO'],
      professional: ['#Review', '#Trusted', '#Rekomendasi'],
      humor: ['#WorthIt', '#TidakMenyesal', '#Relatable']
    };

    const hashtags = [
      '#ShopeeIndonesia',
      '#BelanjaOnline',
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
