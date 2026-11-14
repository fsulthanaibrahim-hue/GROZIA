import { LayoutDashboard, LogOut, Package, Users, MessageSquare, Settings, Bell, AlertTriangle, TrendingDown } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  try {
    const [productsRes, complaintsRes] = await Promise.all([
      fetch('http://api:8000/api/products', { cache: 'no-store' }),
      fetch('http://api:8000/api/complaints', { cache: 'no-store' })
    ]);
    const products = productsRes.ok ? await productsRes.json() : [];
    const complaints = complaintsRes.ok ? await complaintsRes.json() : { open: 0, availability: 0 };
    return { products, complaints };
  } catch { return { products: [], complaints: { open: 0, availability: 0 } }; }
}

export default async function Dashboard() {
  const { products, complaints } = await getDashboardData();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col print:hidden">
        <div className="p-6 text-2xl font-bold text-white tracking-widest border-b border-slate-800">
          GROZIA
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Package size={20} /> Inventory
          </Link>
          <Link href="/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Users size={20} /> Customers
          </Link>
          <Link href="/complaints" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <MessageSquare size={20} /> Complaints
          </Link>
          <Link href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={20} /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/login" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <div className="text-slate-500 font-medium">ShopOps Copilot</div>
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-slate-500" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">O</div>
              <span className="text-sm font-medium text-slate-700">owner@grozia.com</span>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-6xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Good to see you, Owner</h1>
            <p className="text-slate-500 mt-1">Here is how the shop is doing this week.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Package size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Products in catalog</p>
                <p className="text-2xl font-bold text-slate-800">{products.length}</p>
                <p className="text-xs text-slate-400 mt-1">Items you currently sell</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg text-red-600"><AlertTriangle size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Open complaints</p>
                <p className="text-2xl font-bold text-slate-800">{complaints.open}</p>
                <p className="text-xs text-slate-400 mt-1">Waiting for your reply</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg text-orange-600"><TrendingDown size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Out-of-stock complaints</p>
                <p className="text-2xl font-bold text-slate-800">{complaints.availability}</p>
                <p className="text-xs text-slate-400 mt-1">Customers who could not buy</p>
              </div>
            </div>
          </div>

          <div className="bg-[#14211F] text-white p-8 rounded-xl shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Sales are down 40% this week</h3>
              <p className="text-slate-300 mt-1 max-w-xl">
                {complaints.availability} customers said items were out of stock. Restocking those products is the quickest way to recover sales.
              </p>
            </div>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 shrink-0">
              Draft a purchase order
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}