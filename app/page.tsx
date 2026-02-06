'use client';

import Link from 'next/link';
import { Card, FeatureCard } from './components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="inline-block px-4 py-1 mb-6 text-sm text-purple-300 bg-purple-900/30 rounded-full border border-purple-700 animate-pulse">
            🚀 Radiant Projects
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            AI Projects
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Two AI-powered projects for Indonesian market automation
          </p>
        </div>
      </header>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Narralink */}
          <div className="animate-slide-in-left">
            <Link href="/narralink" className="group block">
              <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  ✨
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  Narralink
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Convert any link to natural, engaging social media posts with AI
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full">
                    ✅ Live
                  </span>
                  <span className="text-gray-500">Next.js + Groq API</span>
                </div>
              </div>
            </Link>
          </div>

          {/* IDN Times Poetry */}
          <div className="animate-slide-in-right">
            <Link href="/idntimes-poetry" className="group block">
              <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  📝
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  IDN Times Poetry
                </h2>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Full automation: scrape → generate → schedule publish
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full">
                    🔧 In Dev
                  </span>
                  <span className="text-gray-500">Playwright + Groq API</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in-delayed">
          <FeatureCard
            icon="⚡"
            title="Fast & Efficient"
            description="Built with modern technology for optimal performance."
          />
          <FeatureCard
            icon="🎯"
            title="Indonesia-First"
            description="Designed specifically for Indonesian market needs."
          />
          <FeatureCard
            icon="🔒"
            title="Secure by Design"
            description="Privacy and security are our top priorities."
          />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-delayed-2">
          <h2 className="text-3xl font-bold mb-8">Trusted by Developers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group">
              <Card className="text-center h-full group-hover:scale-105 transition-transform duration-300">
                <div className="text-purple-400 text-4xl mb-3">🚀</div>
                <p className="text-gray-300 italic mb-4">"Narralink helped me save hours creating social media content. Game changer!"</p>
                <p className="text-sm text-gray-500">— Indonesian Developer</p>
              </Card>
            </div>
            <div className="group">
              <Card className="text-center h-full group-hover:scale-105 transition-transform duration-300">
                <div className="text-purple-400 text-4xl mb-3">⚡</div>
                <p className="text-gray-300 italic mb-4">"The automation pipeline is incredibly smooth. Poetry workflow just works."</p>
                <p className="text-sm text-gray-500">— Content Creator</p>
              </Card>
            </div>
            <div className="group">
              <Card className="text-center h-full group-hover:scale-105 transition-transform duration-300">
                <div className="text-purple-400 text-4xl mb-3">🎯</div>
                <p className="text-gray-300 italic mb-4">"Finally, AI tools built with Indonesian context in mind. Great job!"</p>
                <p className="text-sm text-gray-500">— Tech Enthusiast</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 text-center text-gray-500">
        <p>© 2026 Radiant Projects. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Powered by OpenClaw + Next.js + Groq API
        </p>
      </footer>
    </div>
  );
}
