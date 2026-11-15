'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]';

export default function SettingsPage() {
  const router = useRouter();
  const [agentEnabled, setAgentEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // ✅ Use /api/me for authentication
      const me = await fetch('/api/me');
      if (me.status === 401) {
        router.push('/home');
        return;
      }
      setLoading(false);
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAEFE7] text-[#17261F]">
        <p className="font-medium">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#EAEFE7] px-4 py-8 text-[#17261F] sm:px-8 sm:py-12"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif; }
        @media (prefers-reduced-motion: reduce) { .switch-knob { transition: none !important; } }
      `}</style>

      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="font-display flex items-center gap-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            <Settings className="h-9 w-9 text-[#17261F]/40" strokeWidth={1.75} />
            Settings
          </h1>
          <p className="mt-2 text-[#17261F]/65">Manage your shop preferences and AI agent.</p>
        </header>

        <div className="overflow-hidden rounded-lg border border-[#17261F]/15 bg-white">
          <div className="flex items-center justify-between gap-6 px-5 py-5 sm:px-6">
            <div>
              <h2 id="agent-label" className="font-display text-lg font-semibold">
                AI agent
              </h2>
              <p id="agent-desc" className="mt-0.5 text-sm text-[#17261F]/65">
                {agentEnabled
                  ? 'The AI copilot is on and can help with your shop.'
                  : 'The AI copilot is off. Turn it on to get help with your shop.'}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={agentEnabled}
              aria-labelledby="agent-label"
              aria-describedby="agent-desc"
              onClick={() => setAgentEnabled(v => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                agentEnabled ? 'bg-[#3E8E5A]' : 'bg-[#17261F]/25'
              } ${FOCUS}`}
            >
              <span
                className={`switch-knob absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  agentEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}