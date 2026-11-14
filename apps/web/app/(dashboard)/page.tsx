import { Package, AlertTriangle, TrendingDown } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Owner. Here is your shop at a glance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Package size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <p className="text-2xl font-bold text-slate-800">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg text-red-600"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Open Complaints</p>
            <p className="text-2xl font-bold text-slate-800">{complaints.open}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg text-orange-600"><TrendingDown size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Availability Issues</p>
            <p className="text-2xl font-bold text-slate-800">{complaints.availability}</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
        <h3 className="text-lg font-bold text-red-800">Sales Drop Detected</h3>
        <p className="text-red-700 mt-1">
          Our AI noticed a 40% drop in sales this week. {complaints.availability} customers complained about missing stock. 
          Use the Copilot to draft a Purchase Order.
        </p>
      </div>
    </div>
  )
}