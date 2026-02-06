'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, FeatureCard } from './components/ui';
import { ToastProvider } from './components/toast';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <ToastProvider />
      
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1 mb-6 text-sm text-purple-300 bg-purple-900/30 rounded-full border border-purple-700 animate-pulse">
            🚀 Radiant Projects
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            AI Projects
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Two AI-powered projects for Indonesian market automation
          </p>
        </motion.div>
      </header>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Narralink */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/narralink" className="group block">
              <motion.div
                className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(168, 85, 247, 0.25)' }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  ✨
                </motion.div>
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
              </motion.div>
            </Link>
          </motion.div>

          {/* IDN Times Poetry */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/idntimes-poetry" className="group block">
              <motion.div
                className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(168, 85, 247, 0.25)' }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  📝
                </motion.div>
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
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
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
        </motion.div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Trusted by Developers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="text-center h-full">
                <div className="text-purple-400 text-4xl mb-3">🚀</div>
                <p className="text-gray-300 italic mb-4">"Narralink helped me save hours creating social media content. Game changer!"</p>
                <p className="text-sm text-gray-500">— Indonesian Developer</p>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="text-center h-full">
                <div className="text-purple-400 text-4xl mb-3">⚡</div>
                <p className="text-gray-300 italic mb-4">"The automation pipeline is incredibly smooth. Poetry workflow just works."</p>
                <p className="text-sm text-gray-500">— Content Creator</p>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="text-center h-full">
                <div className="text-purple-400 text-4xl mb-3">🎯</div>
                <p className="text-gray-300 italic mb-4">"Finally, AI tools built with Indonesian context in mind. Great job!"</p>
                <p className="text-sm text-gray-500">— Tech Enthusiast</p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
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
