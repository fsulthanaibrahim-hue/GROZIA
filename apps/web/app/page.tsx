'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Package, Users, MessageSquare, Settings, Plus, X } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<string | false>(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Dairy');
  const [formPrice, setFormPrice] = useState('');
  const [formComplaint, setFormComplaint] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch('/api/me');
        if (userRes.status === 401) {
          window.location.href = '/login';
          return;
        }
        const userData = await userRes.json();
        setUserEmail(userData.email);
        setUserRole(userData.role);

        const [p, c, co] = await Promise.all([
          fetch('/api/products').then(r => r.ok ? r.json() : []),
          fetch('/api/customers').then(r => r.ok ? r.json() : []),
          fetch('/api/complaints').then(r => r.ok ? r.json() : [])
        ]);
        setProducts(Array.isArray(p) ? p : []);
        setCustomers(Array.isArray(c) ? c : []);
        setComplaints(Array.isArray(co) ? co : []);
      } catch (e) {
        console.error(e);
        window.location.href = '/login';
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const fetchAll = async () => {
    try {
      const [p, c, co] = await Promise.all([
        fetch('/api/products').then(r => r.ok ? r.json() : []),
        fetch('/api/customers').then(r => r.ok ? r.json() : []),
        fetch('/api/complaints').then(r => r.ok ? r.json() : [])
      ]);
      setProducts(Array.isArray(p) ? p : []);
      setCustomers(Array.isArray(c) ? c : []);
      setComplaints(Array.isArray(co) ? co : []);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formName, category: formCategory, price: parseFloat(formPrice), reorder_level: 10, supplier_id: null })
    });
    setIsModalOpen(false);
    setFormName('');
    setFormPrice('');
    fetchAll();
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formName, credit_limit: parseFloat(formPrice) })
    });
    setIsModalOpen(false);
    setFormName('');
    setFormPrice('');
    fetchAll();
  };

  const handleAddComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_name: formName, description: formComplaint, category: formCategory, product_id: null })
    });
    setIsModalOpen(false);
    setFormName('');
    setFormComplaint('');
    fetchAll();
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 text-2xl font-bold text-white tracking-widest border-b border-slate-800">GROZIA</div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActivePage('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 ${activePage === 'dashboard' ? 'bg-slate-800 text-white' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          {(userRole === 'Owner' || userRole === 'Store Manager') && (
            <button onClick={() => setActivePage('products')} className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 ${activePage === 'products' ? 'bg-slate-800 text-white' : ''}`}>
              <Package size={20} /> Inventory
            </button>
          )}
          {(userRole === 'Owner' || userRole === 'Accountant') && (
            <button onClick={() => setActivePage('customers')} className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 ${activePage === 'customers' ? 'bg-slate-800 text-white' : ''}`}>
              <Users size={20} /> Customers
            </button>
          )}
          {(userRole === 'Owner' || userRole === 'Store Manager') && (
            <button onClick={() => setActivePage('complaints')} className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 ${activePage === 'complaints' ? 'bg-slate-800 text-white' : ''}`}>
              <MessageSquare size={20} /> Complaints
            </button>
          )}
          <button onClick={() => setActivePage('settings')} className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 ${activePage === 'settings' ? 'bg-slate-800 text-white' : ''}`}>
            <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 hover:text-red-400">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
          <div className="text-slate-500 font-medium">ShopOps Copilot</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">{userEmail.charAt(0).toUpperCase()}</div>
            <span>{userEmail}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">{userRole}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {/* Dashboard */}
          {activePage === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-8">Good to see you, {userRole}</h1>
              <div className="grid grid-cols-3 gap-6">
                {(userRole === 'Owner' || userRole === 'Store Manager') && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Package size={24} /></div>
                    <div><p className="text-sm text-slate-500">Products</p><p className="text-2xl font-bold">{products.length}</p></div>
                  </div>
                )}
                {(userRole === 'Owner' || userRole === 'Store Manager') && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg text-red-600"><MessageSquare size={24} /></div>
                    <div><p className="text-sm text-slate-500">Complaints</p><p className="text-2xl font-bold">{complaints.length}</p></div>
                  </div>
                )}
                {(userRole === 'Owner' || userRole === 'Accountant') && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600"><Users size={24} /></div>
                    <div><p className="text-sm text-slate-500">Customers</p><p className="text-2xl font-bold">{customers.length}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inventory */}
          {activePage === 'products' && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <button onClick={() => setIsModalOpen('product')} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Add Product</button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 border-b"><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th></tr></thead>
                  <tbody>
                    {products.map((p: any) => (
                      <tr key={p.id} className="border-b"><td className="p-4">#{p.id}</td><td className="p-4">{p.name}</td><td className="p-4">{p.category}</td><td className="p-4">₹{p.price}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers */}
          {activePage === 'customers' && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl font-bold">Customers</h1>
                <button onClick={() => setIsModalOpen('customer')} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Add Customer</button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 border-b"><th className="p-4">Name</th><th className="p-4">Credit Limit</th></tr></thead>
                  <tbody>
                    {customers.map((c: any) => (
                      <tr key={c.id} className="border-b"><td className="p-4">{c.name}</td><td className="p-4">₹{c.credit_limit}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complaints */}
          {activePage === 'complaints' && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl font-bold">Complaints</h1>
                <button onClick={() => setIsModalOpen('complaint')} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Log Complaint</button>
              </div>
              <div className="space-y-4">
                {complaints.map((c: any) => (
                  <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold">{c.issue}</h3>
                    <p className="text-slate-500">Customer: {c.customer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activePage === 'settings' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Settings</h1>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold">AI Agent (AGENT_ENABLED)</h3>
                <p className="text-sm text-slate-500">Turn the AI Copilot on or off.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {isModalOpen === 'product' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Add Product</h2><button onClick={() => setIsModalOpen(false)}><X /></button></div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input required placeholder="Name" value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2 border rounded" />
              <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full p-2 border rounded"><option>Dairy</option><option>Bakery</option><option>Beverages</option><option>Snacks</option><option>Produce</option></select>
              <input required type="number" placeholder="Price" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full p-2 border rounded" />
              <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded">Save</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen === 'customer' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Add Customer</h2><button onClick={() => setIsModalOpen(false)}><X /></button></div>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input required placeholder="Name" value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2 border rounded" />
              <input required type="number" placeholder="Credit Limit" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full p-2 border rounded" />
              <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded">Save</button>
            </form>
          </div>
        </div>
      )}

      {isModalOpen === 'complaint' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Log Complaint</h2><button onClick={() => setIsModalOpen(false)}><X /></button></div>
            <form onSubmit={handleAddComplaint} className="space-y-4">
              <input required placeholder="Customer Name" value={formName} onChange={e => setFormName(e.target.value)} className="w-full p-2 border rounded" />
              <input required placeholder="Issue" value={formComplaint} onChange={e => setFormComplaint(e.target.value)} className="w-full p-2 border rounded" />
              <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full p-2 border rounded"><option>availability</option><option>quality</option><option>price</option><option>service</option></select>
              <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}