'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Plus, X } from 'lucide-react';

const CATEGORY_STYLES: Record<string, string> = {
  Dairy: 'bg-sky-100 text-sky-900',
  Bakery: 'bg-orange-100 text-orange-900',
  Beverages: 'bg-teal-100 text-teal-900',
  Snacks: 'bg-rose-100 text-rose-900',
  Produce: 'bg-lime-100 text-lime-900',
};

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const init = async () => {
      // ✅ Use /api/me to check authentication (server reads the httpOnly cookie)
      const me = await fetch('/api/me');
      if (me.status === 401) {
        router.push('/home');
        return;
      }
      await fetchProducts();
    };
    init();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) setProducts(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, category, price: parseFloat(price),
          reorder_level: 10, supplier_id: null
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setName('');
        setPrice('');
        await fetchProducts();
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  // Search logic (kept from the updated version)
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p: any) =>
      `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(q)
    );
  }, [products, query]);

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

      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              <Package className="h-9 w-9 text-[#17261F]/40" strokeWidth={1.75} />
              Inventory
            </h1>
            <p className="mt-2 text-[#17261F]/65">
              {products.length === 0
                ? 'Products you add will be listed here.'
                : `${products.length} ${products.length === 1 ? 'product' : 'products'} in your shop`}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 rounded-md bg-[#17261F] px-5 py-2.5 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] ${FOCUS}`}
          >
            <Plus size={18} strokeWidth={2.5} /> Add product
          </button>
        </header>

        <div className="overflow-hidden rounded-lg border border-[#17261F]/15 bg-white">
          {/* Search Bar */}
          <div className="flex items-center gap-3 border-b border-[#17261F]/15 px-4 py-3 focus-within:bg-[#F6F9F4]">
            <Search size={18} className="text-[#17261F]/45 shrink-0" />
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or ID"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#17261F]/45"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className={`rounded p-1 text-[#17261F]/50 hover:bg-[#EAEFE7] hover:text-[#17261F] ${FOCUS}`}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Result Count */}
          {query && (
            <div className="border-b border-[#17261F]/10 px-4 py-2 text-xs text-[#17261F]/60">
              {visible.length} {visible.length === 1 ? 'result' : 'results'} for "{query}"
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-[#17261F]/15 text-sm text-[#17261F]/60">
                  <th className="hidden w-20 px-4 py-3 font-medium sm:table-cell">ID</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p: any) => (
                  <tr key={p.id} className="border-b border-[#17261F]/10 last:border-b-0 hover:bg-[#F6F9F4]">
                    <td className="hidden px-4 py-3.5 text-sm tabular-nums text-[#17261F]/45 sm:table-cell">
                      #{p.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-4 py-3.5 font-semibold">{p.name}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded px-2.5 py-1 text-xs font-semibold ${
                          CATEGORY_STYLES[p.category] ?? 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-display inline-block bg-[#F2B705] py-1 pl-4 pr-3 text-base font-extrabold tabular-nums [clip-path:polygon(10px_0,100%_0,100%_100%,10px_100%,0_50%)]">
                        ₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visible.length === 0 && (
            <div className="px-4 py-14 text-center">
              {products.length === 0 ? (
                <>
                  <p className="font-display text-xl font-semibold">No products yet</p>
                  <p className="mt-1 text-sm text-[#17261F]/60">Add your first product to start your inventory.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`mt-5 rounded-md bg-[#17261F] px-4 py-2 text-sm font-semibold text-[#EAEFE7] ${FOCUS}`}
                  >
                    Add product
                  </button>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-semibold">Nothing matches "{query}"</p>
                  <p className="mt-1 text-sm text-[#17261F]/60">Try a different name, category, or ID.</p>
                  <button
                    onClick={() => setQuery('')}
                    className={`mt-5 rounded-md border border-[#17261F]/25 px-4 py-2 text-sm font-semibold hover:bg-[#EAEFE7] ${FOCUS}`}
                  >
                    Clear search
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17261F]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-product-title"
        >
          <div className="modal-in w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#17261F]/15 px-6 py-5">
              <h2 id="add-product-title" className="font-display text-2xl font-extrabold">
                Add product
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className={`rounded p-1 text-[#17261F]/60 hover:bg-[#EAEFE7] hover:text-[#17261F] ${FOCUS}`}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-5 p-6">
              <div>
                <label htmlFor="p-name" className="mb-1.5 block text-sm font-semibold">Product name</label>
                <input
                  id="p-name"
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <div>
                <label htmlFor="p-cat" className="mb-1.5 block text-sm font-semibold">Category</label>
                <select
                  id="p-cat"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 bg-white px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                >
                  <option>Dairy</option>
                  <option>Bakery</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Produce</option>
                </select>
              </div>
              <div>
                <label htmlFor="p-price" className="mb-1.5 block text-sm font-semibold">Price (₹)</label>
                <input
                  id="p-price"
                  required
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 tabular-nums outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className={`w-full rounded-md bg-[#17261F] py-3 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] disabled:opacity-60 ${FOCUS}`}
              >
                {isLoading ? 'Saving…' : 'Save product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}