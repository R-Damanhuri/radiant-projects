import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-400">📝 Poetry Automation</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:text-purple-400">Dashboard</Link>
            <Link href="/generate" className="hover:text-purple-400">Generate</Link>
            <Link href="/settings" className="hover:text-purple-400">Settings</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Poems" value="0" />
            <StatCard label="Published" value="0" />
            <StatCard label="Pending Review" value="0" />
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">🚀 Quick Actions</h2>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium">
                Generate New Poems
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium">
                Refresh from IDN Times
              </button>
            </div>
          </div>

          {/* Recent Poems */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Recent Generated Poems</h2>
            <p className="text-gray-400">No poems yet. Click "Generate New Poems" to start!</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>Powered by OpenClaw + Next.js + Playwright</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
      <p className="text-3xl font-bold text-purple-400">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}
