import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block px-4 py-1 mb-6 text-sm text-purple-300 bg-purple-900/30 rounded-full border border-purple-700">
          🚀 Radiant Projects
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Projects
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Two AI-powered projects for Indonesian market automation
        </p>
      </header>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Narralink */}
          <Link href="/narralink" className="group">
            <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400">
                Narralink
              </h2>
              <p className="text-gray-400 mb-4">
                Convert any link (Shopee, etc.) to natural, engaging social media posts with AI
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full">
                  ✅ Live
                </span>
                <span className="text-gray-500">Next.js + Netlify Functions</span>
              </div>
            </div>
          </Link>

          {/* IDN Times Poetry */}
          <Link href="/idntimes-poetry" className="group">
            <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400">
                IDN Times Poetry
              </h2>
              <p className="text-gray-400 mb-4">
                Full automation: scrape trending poetry → generate new content → schedule publish
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
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
