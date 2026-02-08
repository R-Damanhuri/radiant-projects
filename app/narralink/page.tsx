'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input, Card } from '../components/ui';

interface Product {
  name: string;
  price: string;
  description: string;
}

interface ScrapeResult {
  success: boolean;
  error?: string;
  product: Product;
  thread: string[];
  hashtags: string[];
  extractedData?: {
    name: string;
    price: string;
    url: string;
    title: string;
    note: string;
  };
  note?: string;
}

export default function NarralinkPage() {
  const [link, setLink] = useState('');
  const [launchLoading, setLaunchLoading] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  
  // Results state
  const [product, setProduct] = useState<Product | null>(null);
  const [thread, setThread] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLaunchBrowser = async () => {
    try {
      setLaunchLoading(true);
      showToast('Launching browser...', 'success');
      
      const res = await fetch('/narralink/api/launch-browser', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        showToast('Browser launched!', 'success');
        window.open('http://vm-4-121-ubuntu.tailc895df.ts.net:8081/vnc.html', '_blank');
      } else {
        showToast('Failed: ' + data.error, 'error');
      }
    } catch (error) {
      showToast('Error launching browser', 'error');
    } finally {
      setLaunchLoading(false);
    }
  };

  const handleOpenLink = async () => {
    if (!link.trim()) {
      showToast('Please enter a link first', 'error');
      return;
    }
    
    try {
      setOpenLoading(true);
      showToast('Opening link...', 'success');
      
      const res = await fetch('/narralink/api/open-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link.trim() })
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast('Link opened!', 'success');
        window.open('http://vm-4-121-ubuntu.tailc895df.ts.net:8081/vnc.html', '_blank');
      } else {
        showToast('Failed: ' + data.error, 'error');
      }
    } catch (error) {
      showToast('Error opening link', 'error');
    } finally {
      setOpenLoading(false);
    }
  };

  const handleScrapeAndGenerate = async () => {
    if (!link.trim()) {
      showToast('Please enter a link first', 'error');
      return;
    }
    
    try {
      setScrapeLoading(true);
      showToast('Extracting & generating...', 'success');
      
      const res = await fetch('/narralink/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: link.trim() })
      });
      
      const data: ScrapeResult = await res.json();
      
      if (data.success) {
        setProduct(data.product);
        setThread(data.thread);
        setHashtags(data.hashtags);
        setExtractedData(data.extractedData || {
          name: data.product.name,
          price: data.product.price,
          url: link,
          title: data.product.name,
          note: data.note || 'Extracted from browser'
        });
        setShowResults(true);
        showToast('Story generated!', 'success');
      } else {
        showToast('Failed: ' + data.error, 'error');
      }
    } catch (error) {
      showToast('Error generating story', 'error');
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleCopyThread = async () => {
    const fullText = thread.join('\n\n') + '\n\n' + hashtags.join(' ');
    try {
      await navigator.clipboard.writeText(fullText);
      showToast('Copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
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
            <Link href="/narralink" className="text-purple-400">Narralink</Link>
            <Link href="/idntimes-poetry" className="hover:text-purple-400">IDN Times Poetry</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ✨ Narralink
            </h1>
            <p className="text-gray-400 text-lg">
              Open Shopee links & generate stories
            </p>
          </div>

          {/* Link Input */}
          <Card className="mb-6">
            <Input
              label="🔗 Shopee Link"
              icon="📎"
              type="url"
              placeholder="https://shopee.co.id/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Card>

          {/* Actions */}
          <Card className="mb-6 space-y-4">
            <Button 
              onClick={handleLaunchBrowser} 
              loading={launchLoading}
              className="w-full bg-green-600 hover:bg-green-500"
            >
              🌐 Launch Browser
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleOpenLink}
                loading={openLoading}
              >
                🔗 Open Link
              </Button>
              
              <Button 
                onClick={handleScrapeAndGenerate}
                loading={scrapeLoading}
                className="bg-purple-600 hover:bg-purple-500"
              >
                ✨ Scrape & Generate
              </Button>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="mb-6 bg-gray-800/30">
            <div className="p-4 text-sm text-gray-400 space-y-2">
              <p>1. Klik <strong>"Launch Browser"</strong> → Login & solve captcha di noVNC</p>
              <p>2. Atau masukin link → Klik <strong>"Open Link"</strong></p>
              <p>3. Setelah puzzle solved, klik <strong>"✨ Scrape & Generate"</strong></p>
              <p className="text-yellow-400">
                💡 Tips: Solve captcha dulu di noVNC sebelum scrape!
              </p>
            </div>
          </Card>

          {/* Results */}
          {showResults && product && extractedData && (
            <Card className="animate-fade-in mb-6">
              <h2 className="text-xl font-bold mb-4">📦 Extracted from Browser</h2>
              
              {/* Raw Extracted Data */}
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-purple-400 font-semibold mb-2">📌 Name:</p>
                    <p className="text-white">{extractedData.name}</p>
                  </div>
                  <div>
                    <p className="text-purple-400 font-semibold mb-2">💰 Price:</p>
                    <p className="text-green-400 font-bold">{extractedData.price}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-purple-400 font-semibold mb-2">🔗 URL (dari browser):</p>
                    <p className="text-white text-sm break-all">{extractedData.url}</p>
                  </div>
                </div>
                
                {/* Content Preview */}
                {extractedData.contentPreview && (
                  <div className="mt-4">
                    <p className="text-purple-400 font-semibold mb-2">📝 Extracted Content Preview:</p>
                    <div className="bg-gray-900/50 p-3 rounded-lg text-gray-300 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                      {extractedData.contentPreview}
                    </div>
                  </div>
                )}
                
                <p className="text-green-400 text-sm mt-3">✅ {extractedData.note}</p>
              </div>
            </Card>
          )}

          {/* Generated Story */}
          {showResults && product && (
            <Card className="animate-fade-in">
              <h2 className="text-xl font-bold mb-4">✨ Generated Story</h2>
              
              {/* Thread */}
              <div className="space-y-3 mb-4">
                {thread.map((paragraph, i) => (
                  <div key={i} className="bg-gray-800/30 p-3 rounded-lg text-gray-200 whitespace-pre-wrap">
                    {paragraph}
                  </div>
                ))}
              </div>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {hashtags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-600/30 rounded-full text-purple-300 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleCopyThread} className="flex-1">
                  📋 Copy Thread
                </Button>
                <Button 
                  onClick={handleScrapeAndGenerate}
                  loading={scrapeLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-500"
                >
                  🔄 Regenerate
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>Powered by OpenClaw + Next.js</p>
      </footer>
    </div>
  );
}
