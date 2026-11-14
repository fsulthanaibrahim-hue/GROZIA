'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Plus, X } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (!document.cookie.includes('access_token=')) {
      router.push('/login');
      return;
    }
    fetchProducts();
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

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-slate-400" /> Inventory
          </h1>
          <p className="text-slate-500 mt-1">Manage your shop's products.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search products..." className="bg-transparent border-none outline-none w-full text-sm" />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Product Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-400">#{p.id.toString().padStart(3, '0')}</td>
                <td className="p-4 font-medium text-slate-800">{p.name}</td>
                <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">{p.category}</span></td>
                <td className="p-4 text-slate-800 font-semibold">₹{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Dairy</option><option>Bakery</option><option>Beverages</option><option>Snacks</option><option>Produce</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg">
                {isLoading ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}