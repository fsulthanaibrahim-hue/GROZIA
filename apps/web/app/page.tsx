'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#14211F] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-12 py-6 border-b border-slate-700">
        <div className="text-2xl font-bold tracking-widest">GROZIA</div>
        <Link
          href="/login"
          className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#14211F] transition-colors hover:bg-slate-100"
        >
          Login
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold leading-tight">
          Run your shop with an AI Copilot
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-300">
          GROZIA brings your sales, stock, complaints and policies into one place. Ask it anything, and it answers with real data — safely, and with your approval.
        </p>
        <Link
          href="/login"
          className="mt-10 rounded-lg bg-white px-8 py-4 text-base font-semibold text-[#14211F] transition-colors hover:bg-slate-100"
        >
          Get Started →
        </Link>
      </main>

      {/* Footer */}
      <footer className="px-12 py-6 text-sm text-slate-500 text-center border-t border-slate-700">
        © 2026 GROZIA · ShopOps Copilot
      </footer>
    </div>
  );
}