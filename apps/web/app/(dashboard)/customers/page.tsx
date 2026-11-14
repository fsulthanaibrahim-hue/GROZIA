'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Plus, X } from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  useEffect(() => {
    if (!document.cookie.includes('access_token=')) {
      router.push('/login');
      return;
    }
    fetchCustomers();
  }, [router]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers', { cache: 'no-store' });
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

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-slate-400" /> Credit Customers
          </h1>
          <p className="text-slate-500 mt-1">Track who owes you money.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Customer
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Credit Limit</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: any) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 font-semibold">₹{c.credit_limit}</td>
                <td className="p-4 text-right"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">ACTIVE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Customer Name" className="w-full px-4 py-2 border rounded-lg" />
              <input required type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} placeholder="Credit Limit" className="w-full px-4 py-2 border rounded-lg" />
              <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg">
                {isLoading ? 'Saving...' : 'Save Customer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}