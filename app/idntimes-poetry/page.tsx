'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AutomationRun {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  poemsGenerated: number;
  imagesDownloaded: number;
  error?: string;
}

export default function IDNTimesPoetry() {
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [history, setHistory] = useState<AutomationRun[]>([
    {
      id: '1',
      timestamp: '2026-02-05 08:15:00',
      status: 'success',
      poemsGenerated: 3,
      imagesDownloaded: 9
    },
    {
      id: '2',
      timestamp: '2026-02-04 08:10:00',
      status: 'success',
      poemsGenerated: 3,
      imagesDownloaded: 9
    },
    {
      id: '3',
      timestamp: '2026-02-03 08:05:00',
      status: 'failed',
      poemsGenerated: 0,
      imagesDownloaded: 0,
      error: 'Network timeout'
    }
  ]);

  const handleRunAutomation = async () => {
    setIsAutomationRunning(true);
    // Simulate running
    setTimeout(() => {
      setIsAutomationRunning(false);
      setHistory([
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: 'success',
          poemsGenerated: 3,
          imagesDownloaded: 9
        },
        ...history
      ]);
    }, 3000);
  };

  const handleSchedule = () => {
    alert(`Automation scheduled daily at ${scheduleTime}`);
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
            <Link href="/narralink" className="hover:text-purple-400">
              Narralink
            </Link>
            <Link href="/idntimes-poetry" className="text-purple-400">
              IDN Times Poetry
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              📝 IDN Times <span className="text-purple-400">Poetry</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Full automation for poetry content on IDN Times
            </p>
          </div>

          {/* Status Banner */}
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚫</span>
              <div>
                <p className="font-semibold text-yellow-300">Account Blocked</p>
                <p className="text-sm text-gray-400">
                  IDN Times account is flagged. Contact CS to restore before publishing.
                </p>
              </div>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Run Automation */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">🚀 Run Automation</h2>
              <p className="text-gray-400 mb-4 text-sm">
                Execute full workflow: scrape → analyze → generate → download images
              </p>
              <button
                onClick={handleRunAutomation}
                disabled={isAutomationRunning}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                {isAutomationRunning ? '⏳ Running...' : '▶️ Run Now'}
              </button>
            </div>

            {/* Schedule */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">📅 Schedule Daily</h2>
              <p className="text-gray-400 mb-4 text-sm">
                Set time for automatic daily execution
              </p>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleSchedule}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Runs" value={history.length.toString()} />
            <StatCard label="Success" value={history.filter(h => h.status === 'success').length.toString()} />
            <StatCard label="Failed" value={history.filter(h => h.status === 'failed').length.toString()} />
            <StatCard label="Poems" value={history.reduce((acc, h) => acc + h.poemsGenerated, 0).toString()} />
          </div>

          {/* History */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📜 Run History</h2>
            <div className="space-y-3">
              {history.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      run.status === 'success' ? 'bg-green-900 text-green-300' :
                      run.status === 'failed' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {run.status.toUpperCase()}
                    </span>
                    <span className="text-gray-400">{run.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📝 {run.poemsGenerated} poems</span>
                    <span>🖼️ {run.imagesDownloaded} images</span>
                    {run.error && <span className="text-red-400">❌ {run.error}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Info */}
          <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🔄 Workflow Pipeline</h2>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <WorkflowStep num="1" label="Scrape" />
              <span className="text-gray-500">→</span>
              <WorkflowStep num="2" label="Analyze" />
              <span className="text-gray-500">→</span>
              <WorkflowStep num="3" label="Generate" />
              <span className="text-gray-500">→</span>
              <WorkflowStep num="4" label="Images" />
              <span className="text-gray-500">→</span>
              <WorkflowStep num="5" label="Publish" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>Powered by OpenClaw + Playwright + Groq API</p>
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

function WorkflowStep({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg">
      <span className="w-6 h-6 flex items-center justify-center bg-purple-600 rounded-full text-xs font-bold">
        {num}
      </span>
      <span>{label}</span>
    </div>
  );
}
