import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block px-4 py-1 mb-6 text-sm text-purple-300 bg-purple-900/30 rounded-full border border-purple-700">
          Coming Soon
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Something Big is Brewing
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          We're building something exciting. Be the first to know when we launch.
        </p>
        <form className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Notify Me
          </button>
        </form>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon="⚡"
            title="Fast & Efficient"
            description="Built with modern technology for optimal performance and user experience."
          />
          <FeatureCard
            icon="🎯"
            title="Purpose-Driven"
            description="Designed to solve real problems with thoughtful attention to detail."
          />
          <FeatureCard
            icon="🔒"
            title="Secure by Design"
            description="Your privacy and security are our top priorities from day one."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 text-center text-gray-500">
        <p>© 2026 Future Project. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Powered by Next.js + Tailwind CSS + OpenClaw
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
