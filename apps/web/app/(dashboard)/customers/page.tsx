'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Plus, X } from 'lucide-react';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  useEffect(() => {
    const init = async () => {
      // ✅ Check authentication (with credentials)
      const me = await fetch('/api/me', { credentials: 'include' });
      if (me.status === 401) {
        router.push('/login'); // 👈 Fixed: Changed from /home to /login
        return;
      }
      await fetchCustomers();
    };
    init();
  }, [router]);

  const fetchCustomers = async () => {
    try {
      // 👈 Added credentials: 'include'
      const res = await fetch('/api/customers', { 
        cache: 'no-store',
        credentials: 'include' 
      });
      if (res.ok) setCustomers(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 👈 Added credentials
        body: JSON.stringify({ name, credit_limit: parseFloat(creditLimit) }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setName('');
        setCreditLimit('');
        await fetchCustomers();
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c: any) => c.name.toLowerCase().includes(q));
  }, [customers, query]);

  return (
    <div
      className="min-h-screen bg-[#EAEFE7] px-4 py-8 text-[#17261F] sm:px-8 sm:py-12"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif; }
        @keyframes modal-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .modal-in { animation: modal-in 160ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .modal-in { animation: none; } }
      `}</style>

      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              <Users className="h-9 w-9 text-[#17261F]/40" strokeWidth={1.75} />
              Credit customers
            </h1>
            <p className="mt-2 text-[#17261F]/65">
              {customers.length === 0
                ? 'Customers who buy on credit will be listed here.'
                : `${customers.length} ${customers.length === 1 ? 'customer' : 'customers'} buying on credit`}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 rounded-md bg-[#17261F] px-5 py-2.5 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] ${FOCUS}`}
          >
            <Plus size={18} strokeWidth={2.5} /> Add customer
          </button>
        </header>

        <div className="overflow-hidden rounded-lg border border-[#17261F]/15 bg-white">
          <label className="flex items-center gap-3 border-b border-[#17261F]/15 px-4 py-3 focus-within:bg-[#F6F9F4]">
            <Search size={18} className="text-[#17261F]/45" />
            <span className="sr-only">Search customers</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#17261F]/45"
            />
          </label>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="border-b border-[#17261F]/15 text-sm text-[#17261F]/60">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 text-right font-medium">Credit limit</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c: any) => (
                  <tr key={c.id} className="border-b border-[#17261F]/10 last:border-b-0 hover:bg-[#F6F9F4]">
                    <td className="px-4 py-3.5 font-semibold">{c.name}</td>
                    <td className="font-display px-4 py-3.5 text-right text-base font-extrabold tabular-nums">
                      ₹{Number(c.credit_limit).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="rounded bg-[#3E8E5A]/12 px-2.5 py-1 text-xs font-semibold text-[#25673D]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visible.length === 0 && (
            <div className="px-4 py-14 text-center">
              {customers.length === 0 ? (
                <>
                  <p className="font-display text-xl font-semibold">No credit customers yet</p>
                  <p className="mt-1 text-sm text-[#17261F]/60">Add a customer and set how much they can owe you.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`mt-5 rounded-md bg-[#17261F] px-4 py-2 text-sm font-semibold text-[#EAEFE7] ${FOCUS}`}
                  >
                    Add customer
                  </button>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-semibold">Nobody named "{query}"</p>
                  <p className="mt-1 text-sm text-[#17261F]/60">Check the spelling or try a shorter name.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17261F]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-customer-title"
        >
          <div className="modal-in w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#17261F]/15 px-6 py-5">
              <h2 id="add-customer-title" className="font-display text-2xl font-extrabold">
                Add customer
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className={`rounded p-1 text-[#17261F]/60 hover:bg-[#EAEFE7] hover:text-[#17261F] ${FOCUS}`}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-5 p-6">
              <div>
                <label htmlFor="cu-name" className="mb-1.5 block text-sm font-semibold">Customer name</label>
                <input
                  id="cu-name"
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <div>
                <label htmlFor="cu-limit" className="mb-1.5 block text-sm font-semibold">Credit limit (₹)</label>
                <input
                  id="cu-limit"
                  required
                  type="number"
                  value={creditLimit}
                  onChange={e => setCreditLimit(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 tabular-nums outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className={`w-full rounded-md bg-[#17261F] py-3 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] disabled:opacity-60 ${FOCUS}`}
              >
                {isLoading ? 'Saving…' : 'Save customer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}