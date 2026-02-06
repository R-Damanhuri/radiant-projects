'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Shopee2Tweet() {
  const [formData, setFormData] = useState({
    shopeeLink: '',
    productName: '',
    style: 'casual',
    promoCode: ''
  });
  const [result, setResult] = useState<{
    tweet: string;
    hashtags: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/.netlify/functions/shopee2tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate tweet');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.tweet + '\n\n' + result.hashtags.join(' '));
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-400">
            🚀 Radiant Projects
          </Link>
          <nav className="flex gap-4">
            <Link href="/narralink" className="text-purple-400">
              Narralink
            </Link>
            <Link href="/idntimes-poetry" className="hover:text-purple-400">
              IDN Times Poetry
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ✨ Narralink
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
              Convert any link to natural, engaging social media posts with AI
            </p>
            <div className="mt-4 flex justify-center gap-3 text-sm">
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full">
                🚀 Previously Shopee2Tweet
              </span>
            </div>
          </div>

          {/* Input Form */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Shopee Link */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  📎 Link to Convert
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://shopee.co.id/... or any link"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  value={formData.shopeeLink}
                  onChange={(e) => setFormData({...formData, shopeeLink: e.target.value})}
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  📝 Product/Content Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="Kaos Polos Premium Cotton"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  🎨 Writing Style
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                  value={formData.style}
                  onChange={(e) => setFormData({...formData, style: e.target.value})}
                >
                  <option value="casual">Casual & Friendly 🗣️</option>
                  <option value="excited">Excited & Enthusiastic 🎉</option>
                  <option value="professional">Professional & Clean 💼</option>
                  <option value="humor">Humorous & Witty 😄</option>
                </select>
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  🎫 Promo Code (optional)
                </label>
                <input
                  type="text"
                  placeholder="DISKON10"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  value={formData.promoCode}
                  onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                />
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  '✨ Generate Tweet'
                )}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              ❌ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 bg-gray-800/80 rounded-xl p-6 border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📝</span> Generated Tweet
              </h2>
              <div className="bg-gray-700/50 p-4 rounded-lg mb-4 whitespace-pre-wrap text-gray-200">
                {result.tweet}
                {'\n\n'}
                <span className="text-purple-400">{result.hashtags.join(' ')}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>📋</span> Copy Tweet
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all duration-200"
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm text-gray-400">Fast Generation</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm text-gray-400">Natural Sounding</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm text-gray-400">Affiliate Ready</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>Powered by OpenClaw + Groq API + Next.js</p>
      </footer>
    </div>
  );
}
