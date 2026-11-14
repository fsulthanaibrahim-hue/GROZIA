'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Clear any old cookie when the login page loads
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const params = new URLSearchParams({ email, password });
      const res = await fetch(`/api/login?${params.toString()}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Invalid credentials');
      
      // Force a full reload to ensure the cookie is sent
      window.location.href = '/';
    } catch {
      setError('Email or password is incorrect.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      <aside className="hidden w-5/12 flex-col justify-between bg-[#14211F] p-12 text-white md:flex">
        <p className="text-2xl font-semibold tracking-tight">Grozia</p>
        <div className="max-w-sm">
          <p className="text-3xl font-semibold leading-snug tracking-tight">
            Stock, complaints and your AI Copilot in one place.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Sign in to see how your shop is doing this week.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-base text-slate-600">Use your shop account.</p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                placeholder="owner@grozia.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-teal-700 focus:outline focus:outline-2 focus:outline-teal-700"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-base focus:border-teal-700 focus:outline focus:outline-2 focus:outline-teal-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#14211F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f332f] disabled:opacity-60"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}