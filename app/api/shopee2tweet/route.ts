import { NextRequest, NextResponse } from 'next/server';

// Storytelling style configurations
const styleConfigs = {
  casual: {
    tone: 'Curhat santai sama teman, kayak lagi ngobrolin berjam-jam',
    structure: 'Situasi → Experience → Insight → Call to Action',
    examples: [
      "Gue mau cerita sedikit... Dulu tuh Gue sering struggle sama [masalah], entah itu [detail masalah]. Coba berbagai produk hasilnya gitu-gitu aja sampe nemu ini. Dan honestly, ini beda banget dari yang pernah Gue coba sebelumnya. Bukan sponsored atau apa, tapi genuinely surprised dengan hasilnya. Buat yang pernah mengalami hal serupa, coba deh cek link di bawah. Siapa tau membantu juga buat kalian...",
    ],
    emoji: '💭',
    minLength: 500,
    maxLength: 1000
  },
  excited: {
    tone: 'Excited sharing, kayak nemu harta karun dan harus cerita ke semua orang',
    structure: 'Shocked Reaction → Backstory → The Discovery → FOMO + Call to Action',
    examples: [
      "GAIS. GUE HARUS BAGIIN INI. Denger-denger ya...\n\nJadi gini, Gue selama ini tuh [struggle cerita]. Udah coba ini-itu, hasilnya biasa aja. Nahkemarin itu scrolling-scroll, nemu produk ini. Awalnya skeptis because usually produk yang hype gini ratedebate. TAPI ENG ing.\n\nSeriously, ini game changer banget. [Detail pengalaman]. Buat yang lagi nyari solusi, trust me, coba dulu sebelum nyesal. Link ada di bawah, gas poll!",
    ],
    emoji: '🔥',
    minLength: 600,
    maxLength: 1200
  },
  professional: {
    tone: 'Professional review tapi tetap personal dan engaging',
    structure: 'Problem Statement → Research → Personal Testing → Recommendation',
    examples: [
      "Halo semua, hari ini Gue mau sharing tentang sesuatu yang mungkin berguna untuk kalian yang juga mengalami hal serupa.\n\nJadi background-nya: Gue selama ini mengalami [masalah]. Setelah research mendalam dan coba berbagai alternatif, Gue finally menemukan solusi yang worth it untuk di-review.\n\nDari sisi spesifikasi: [detail teknis]. Dari sisi pengalaman pakai: [pengalaman personal].\n\nOverall, untuk use case seperti ini, Gue rasa produk ini cukup recommendable. Bukan yang paling murah atau paling mahal, tapi value-nya oke.\n\nBuat yang tertarik, detail lengkap dan spesifikasi bisa dicek di link berikut:\n\n[Link produk]\n\nFeel free to ask kalau ada pertanyaan~",
    ],
    emoji: '📋',
    minLength: 600,
    maxLength: 1200
  },
  humor: {
    tone: 'Bercanda tapi tetap informatif, pake meme energy dan relatable struggle',
    structure: 'Relatable Struggle → Plot Twist → The Solution → Meme Energy CTA',
    examples: [
      "Okok ini cerita Gue yang mungkin lo pada bisa relate...\n\nDulu Gue: '[mimpi/masalah awal]'.udah trying so hard, [effort yang dilakukan]. Tapi hasilnya? Ya gitu deh, namanya juga hidup.\n\nSAMPE GITU.\n\nGue nemu ini dan dalam hati: \" Lah, ini啥情况? \".\n\nLong story short: [pengalaman dengan produk]. Dan Gue揞 like: okay, ini actually works.\n\nMoral of the story: Sometimes you just need to find the right thing.\n\nLink ada di bawah, no cap. Bye~",
    ],
    emoji: '😂',
    minLength: 500,
    maxLength: 1000
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

    const systemPrompt = `Kamu adalah content creator Indonesia yang ahli membuat KONTEN CURHATAN atau STORYTELLING yang engaging.

Tugas: Buat cerita panjang/curhat tentang produk ini yang TIDAK TERASA IKLAN sama sekali.

FORMAT YANG DIHARAPKAN:
- Bukan tweet pendek! Ini harus cerita/curhat panjang
- Gunakan format paragraph dengan line breaks untuk readability
- Struktur: ${config.structure}
- Tone: ${config.tone}
- Panjang: ${config.minLength}-${config.maxLength} karakter

STRUKTUR CERITA:
1. HOOK - Mulai dengan situasi atau relatable experience
2. BODY - Ceritain pengalaman, struggle, atau insight
3. NATURAL MENTION - Sisipkan produk sebagai "temuan" atau "solusi", bukan "IKLAN!"
4. CTA - Tutup dengan ajakan natural untuk cek link

PRINSIP:
1. Gunakan bahasa Indonesia yang NATURAL, kayak lagi chat/curhat sama teman
2. Campur Indonesian dan English/Chinese (code-switching) itu natural
3. Sertakan detail dan emotion yang believable
4. JANGAN sebut "IKLAN" atau "SPONSORED"
5. Link produk harus terintegrasi dalam cerita, bukan di akhir doang
6. Buat terasa seperti RECOMMENDATION dari teman, bukan copywriter

CONTOH GAYA "${userStyle.toUpperCase()}":
${config.examples.map(ex => `- "${ex}"`).join('\n')}

${promoCode ? `PENTING: Wajib sebutkan promo code ${promoCode} dengan cara natural dalam cerita.` : ''}

RESPONSE JSON:
{
  "thread": [
    {"text": "Paragraf pertama (hook/opening)"},
    {"text": "Paragraf kedua (body/detail)"},
    {"text": "Paragraf ketiga (closing + link + CTA)"}
  ],
  "hashtags": ["#Curhat", "#Pengalaman", "#Recommend", "#ShopeeIndonesia"]
}

PENTING: Return valid JSON only. Jangan ada markdown formatting atau text lain.`;

    console.log('Generating long-form storytelling for:', shopeeLink, 'style:', userStyle);

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
        max_tokens: 1500,
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

    // Parse the response
    let parsed: { thread: { text: string }[]; hashtags: string[] } | null = null;
    
    try {
      // Try to parse as JSON
      if (content.includes('[') && content.includes('thread')) {
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.error('Parse error:', e);
    }

    // Fallback to plain text format
    if (!parsed) {
      const paragraphs = content.split('\n\n').filter((p: string) => p.trim().length > 50);
      parsed = {
        thread: paragraphs.map((p: string) => ({ text: p.trim() })),
        hashtags: ['#Curhat', '#Pengalaman', '#Recommend', '#ShopeeIndonesia']
      };
    }

    return NextResponse.json({
      success: true,
      thread: parsed.thread,
      hashtags: parsed.hashtags,
      style: userStyle
    });

  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
}
