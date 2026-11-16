'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Plus, X, Pencil, Trash2 } from 'lucide-react';

const CATEGORY_STYLES: Record<string, string> = {
  Dairy: 'bg-sky-100 text-sky-900',
  Bakery: 'bg-orange-100 text-orange-900',
  Beverages: 'bg-teal-100 text-teal-900',
  Snacks: 'bg-rose-100 text-rose-900',
  Produce: 'bg-lime-100 text-lime-900',
};

const CATEGORIES = ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Produce'];

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number | string;
  reorder_level?: number;
  supplier_id?: number | null;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Which product is being edited? null = "Add" mode
  const [editingId, setEditingId] = useState<number | null>(null);

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const init = async () => {
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
    } catch (error) {
      console.error(error);
    }
  };

  // ---- Open modal helpers ----
  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCategory('Dairy');
    setPrice('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setPrice(String(p.price));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName('');
    setPrice('');
  };

  // ---- Create / Update ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name,
        category,
        price: parseFloat(price),
        reorder_level: 10,
        supplier_id: null,
      };

      const res = await fetch(
        editingId ? `/api/products/${editingId}` : '/api/products',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        closeModal();
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Delete ----
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteId(null);
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  // ---- Search: name + category + id ----
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const haystack = `${p.name} ${p.category} ${p.id}`.toLowerCase();
      return haystack.includes(q);
    });
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
            onClick={openAddModal}
            className={`flex items-center gap-2 rounded-md bg-[#17261F] px-5 py-2.5 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] ${FOCUS}`}
          >
            <Plus size={18} strokeWidth={2.5} /> Add product
          </button>
        </header>

        <div className="overflow-hidden rounded-lg border border-[#17261F]/15 bg-white">
          {/* ---- Search bar ---- */}
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

          {/* Result count when searching */}
          {query && (
            <div className="border-b border-[#17261F]/10 px-4 py-2 text-xs text-[#17261F]/60">
              {visible.length} {visible.length === 1 ? 'result' : 'results'} for "{query}"
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-[#17261F]/15 text-sm text-[#17261F]/60">
                  <th className="hidden w-20 px-4 py-3 font-medium sm:table-cell">ID</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="w-24 px-4 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#17261F]/10 last:border-b-0 hover:bg-[#F6F9F4]"
                  >
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {confirmDeleteId === p.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                              className={`rounded bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60 ${FOCUS}`}
                            >
                              {deletingId === p.id ? 'Deleting…' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={deletingId === p.id}
                              className={`rounded px-2.5 py-1.5 text-xs font-semibold text-[#17261F]/70 hover:bg-[#EAEFE7] ${FOCUS}`}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(p)}
                              aria-label={`Edit ${p.name}`}
                              className={`rounded p-2 text-[#17261F]/60 hover:bg-[#EAEFE7] hover:text-[#17261F] ${FOCUS}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(p.id)}
                              aria-label={`Delete ${p.name}`}
                              className={`rounded p-2 text-[#17261F]/60 hover:bg-rose-50 hover:text-rose-600 ${FOCUS}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
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
                  <p className="mt-1 text-sm text-[#17261F]/60">
                    Add your first product to start your inventory.
                  </p>
                  <button
                    onClick={openAddModal}
                    className={`mt-5 rounded-md bg-[#17261F] px-4 py-2 text-sm font-semibold text-[#EAEFE7] ${FOCUS}`}
                  >
                    Add product
                  </button>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-semibold">
                    Nothing matches "{query}"
                  </p>
                  <p className="mt-1 text-sm text-[#17261F]/60">
                    Try a different name, category, or ID.
                  </p>
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

      {/* ---- Add / Edit modal ---- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17261F]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <div className="modal-in w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#17261F]/15 px-6 py-5">
              <h2 id="product-modal-title" className="font-display text-2xl font-extrabold">
                {editingId ? 'Edit product' : 'Add product'}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close"
                className={`rounded p-1 text-[#17261F]/60 hover:bg-[#EAEFE7] hover:text-[#17261F] ${FOCUS}`}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label htmlFor="p-name" className="mb-1.5 block text-sm font-semibold">
                  Product name
                </label>
                <input
                  id="p-name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <div>
                <label htmlFor="p-cat" className="mb-1.5 block text-sm font-semibold">
                  Category
                </label>
                <select
                  id="p-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 bg-white px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="p-price" className="mb-1.5 block text-sm font-semibold">
                  Price (₹)
                </label>
                <input
                  id="p-price"
                  required
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 tabular-nums outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className={`w-full rounded-md bg-[#17261F] py-3 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] disabled:opacity-60 ${FOCUS}`}
              >
                {isLoading
                  ? 'Saving…'
                  : editingId
                  ? 'Save changes'
                  : 'Save product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}