'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Card, Skeleton } from './components/ui';
import { ToastProvider, showToast, copyToClipboard } from './components/toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function NarralinkPage() {
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
  const [history, setHistory] = useState<typeof result[]>([]);

  // Keyboard shortcuts
  const shortcuts = [
    {
      key: 'Enter',
      ctrl: true,
      action: () => handleSubmit({ preventDefault: () => {} } as any),
      description: 'Generate tweet'
    },
    {
      key: 'c',
      ctrl: true,
      action: () => result && handleCopy(),
      description: 'Copy result'
    },
    {
      key: 'Escape',
      action: () => {
        setResult(null);
        setError('');
      },
      description: 'Clear result'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  const handleCopy = async () => {
    if (result) {
      const fullText = result.tweet + '\n\n' + result.hashtags.join(' ');
      await copyToClipboard(fullText);
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
        throw new Error(data.error || 'Failed to generate tweet');
      }

      setResult(data);
      setHistory(prev => [...prev.slice(-4), data]); // Keep last 5 results
      showToast.success('Tweet generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      showToast.error('Generation failed');
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastProvider />
      
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ✨ Narralink
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
              Convert any link to natural, engaging social media posts with AI
            </p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex justify-center gap-3 text-sm"
            >
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full">
                🚀 Previously Shopee2Tweet
              </span>
            </motion.div>
            
            {/* Keyboard shortcuts hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 flex justify-center gap-4 text-xs text-gray-500"
            >
              <span>⌨️ <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Enter</kbd> Generate</span>
              <span>⌨️ <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+C</kbd> Copy</span>
              <span>⌨️ <kbd className="px-2 py-1 bg-gray-700 rounded">Esc</kbd> Clear</span>
            </motion.div>
          </motion.div>

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
                  {loading ? 'Generating...' : '✨ Generate Tweet'}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-medium mb-1">Generation Failed</p>
                    <p className="text-sm text-red-400/80">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skeleton Loading */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <Card>
                <Skeleton className="h-6 w-1/3 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="mt-4 flex gap-3">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Result */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="mt-8"
              >
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span>📝</span> Generated Tweet
                  </h2>
                  <div className="bg-gray-700/50 p-4 rounded-lg mb-4 whitespace-pre-wrap text-gray-200">
                    {result.tweet}
                    {'\n\n'}
                    <span className="text-purple-400">{result.hashtags.join(' ')}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCopy} className="flex-1">
                      📋 Copy Tweet
                    </Button>
                    <Button variant="secondary" onClick={handleSubmit} className="flex-1">
                      🔄 Regenerate
                    </Button>
                  </div>
                  {history.length > 1 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleUndo}
                      className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      ↩️ Undo (use previous result)
                    </motion.button>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            <div className="text-center p-4">
              <motion.div 
                className="text-3xl mb-2"
                whileHover={{ scale: 1.2 }}
              >
                ⚡
              </motion.div>
              <p className="text-sm text-gray-400">Fast Generation</p>
            </div>
            <div className="text-center p-4">
              <motion.div 
                className="text-3xl mb-2"
                whileHover={{ scale: 1.2 }}
              >
                🎯
              </motion.div>
              <p className="text-sm text-gray-400">Natural Sounding</p>
            </div>
            <div className="text-center p-4">
              <motion.div 
                className="text-3xl mb-2"
                whileHover={{ scale: 1.2 }}
              >
                💰
              </motion.div>
              <p className="text-sm text-gray-400">Affiliate Ready</p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>Powered by OpenClaw + Groq API + Next.js</p>
      </footer>
    </div>
  );
}
