'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card, Skeleton } from '../components/ui';

// NarralinkPage - AI-powered narrative content generator
// Converts links to engaging storytelling/curhat content

interface ThreadItem {
  text: string;
}

interface StoryResult {
  thread: ThreadItem[];
  hashtags: string[];
  style: string;
}

export default function NarralinkPage() {
  const [formData, setFormData] = useState({
    shopeeLink: '',
    productName: '',
    style: 'casual',
    promoCode: ''
  });
  const [result, setResult] = useState<StoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<StoryResult[]>([]);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  // Show toast notification
  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = async () => {
    if (result) {
      const fullText = result.thread.map(t => t.text).join('\n\n') + '\n\n' + result.hashtags.join(' ');
      try {
        await navigator.clipboard.writeText(fullText);
        showToastMessage('Copied to clipboard!', 'success');
      } catch {
        showToastMessage('Failed to copy', 'error');
      }
    }
  };

  const handleCopyParagraph = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToastMessage('Paragraph copied!', 'success');
    } catch {
      showToastMessage('Failed to copy', 'error');
    }
  };

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
        throw new Error(data.error || 'Failed to generate story');
      }

      setResult(data);
      setHistory(prev => [...prev.slice(-4), data]);
      showToastMessage('Story generated successfully!', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      showToastMessage('Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 2] || null;
      setResult(previous);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const getStyleEmoji = (style: string) => {
    const emojis: Record<string, string> = {
      casual: '💭',
      excited: '🔥',
      professional: '📋',
      humor: '😂'
    };
    return emojis[style] || '📝';
  };

  const getTotalLength = () => {
    if (!result) return 0;
    return result.thread.reduce((acc, t) => acc + t.text.length, 0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg animate-toast-in z-50 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
        </div>
      )}
      
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
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ✨ Narralink
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
              Convert any link to natural, engaging storytelling content
            </p>
            <div className="mt-4 flex justify-center gap-3 text-sm animate-fade-in-delayed">
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full">
                🚀 Previously Shopee2Tweet
              </span>
            </div>
            
            {/* Keyboard shortcuts hint */}
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500 animate-fade-in-delayed-2">
              <span>⌨️ <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Enter</kbd> Generate</span>
              <span>⌨️ <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+C</kbd> Copy All</span>
              <span>⌨️ <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> Clear</span>
            </div>
          </div>

          {/* Input Form */}
          <div className="animate-slide-up">
            <Card className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Link to Convert"
                  icon="📎"
                  type="url"
                  required
                  placeholder="https://shopee.co.id/... or any link"
                  value={formData.shopeeLink}
                  onChange={(e) => setFormData({...formData, shopeeLink: e.target.value})}
                />

                <Input
                  label="Product/Content Name (optional)"
                  icon="📝"
                  type="text"
                  placeholder="Kaos Polos Premium Cotton"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
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

                <Input
                  label="Promo Code (optional)"
                  icon="🎫"
                  type="text"
                  placeholder="DISKON10"
                  value={formData.promoCode}
                  onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                />

                <Button type="submit" loading={loading} className="w-full">
                  {loading ? 'Generating Story...' : '✨ Generate Story'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 animate-fade-in">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-medium mb-1">Generation Failed</p>
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skeleton Loading */}
          {loading && (
            <div className="mt-8 animate-fade-in space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Skeleton className="h-8 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Result - Thread Format */}
          {result && (
            <div className="mt-8 animate-scale-in">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>{getStyleEmoji(result.style)}</span> Your Story
                  </h2>
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded capitalize">
                    {result.style} style
                  </span>
                </div>

                {/* Thread Content */}
                <div className="space-y-4 mb-4">
                  {result.thread.map((item, index) => (
                    <div key={index} className="relative">
                      <div className="bg-gray-700/50 p-4 rounded-lg text-gray-200 whitespace-pre-wrap">
                        {item.text}
                      </div>
                      <button
                        onClick={() => handleCopyParagraph(item.text)}
                        className="absolute top-2 right-2 text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy paragraph"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="bg-gray-700/30 p-3 rounded-lg mb-4">
                  <p className="text-purple-400 text-sm">{result.hashtags.join(' ')}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400 px-1 mb-4">
                  <span>{result.thread.length} paragraphs</span>
                  <span>{getTotalLength()} total characters</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={handleCopy} className="flex-1">
                    📋 Copy All
                  </Button>
                  <Button variant="secondary" onClick={handleSubmit} className="flex-1">
                    🔄 Regenerate
                  </Button>
                </div>
                {history.length > 1 && (
                  <button
                    onClick={handleUndo}
                    className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    ↩️ Undo (use previous result)
                  </button>
                )}
              </Card>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 animate-fade-in-delayed-3">
            <div className="text-center p-4">
              <div className="text-3xl mb-2 hover:scale-125 transition-transform duration-300">📖</div>
              <p className="text-sm text-gray-400">Storytelling</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2 hover:scale-125 transition-transform duration-300">💭</div>
              <p className="text-sm text-gray-400">Natural & Personal</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2 hover:scale-125 transition-transform duration-300">🎯</div>
              <p className="text-sm text-gray-400">Thread Ready</p>
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
