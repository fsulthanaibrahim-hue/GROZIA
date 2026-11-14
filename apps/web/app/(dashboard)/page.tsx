'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [role, setRole] = useState('User');
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState({ open: 0, availability: 0 });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('access_token='));
    if (tokenCookie) {
      try {
        const token = tokenCookie.split('=')[1];
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role || 'User');
      } catch (e) { console.error(e); }
    }

    const fetchData = async () => {
      try {
        const [prodRes, compRes, custRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/complaints'),
          fetch('/api/customers')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (compRes.ok) setComplaints(await compRes.json());
        if (custRes.ok) setCustomers(await custRes.json());
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  if (role === 'Owner') {
    return (
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Good to see you, Owner</h1>
          <p className="text-slate-500 mt-1">Here is your shop's full overview.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Package size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Products</p>
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
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><Users size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Credit Customers</p>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#14211F] text-white p-8 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Sales are down 40% this week</h3>
            <p className="text-slate-300 mt-1 max-w-xl">{complaints.availability} customers said items were out of stock.</p>
          </div>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold">Draft a purchase order</button>
        </div>
      </div>
    );
  }

  if (role === 'Store Manager') {
    return (
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Good to see you, Store Manager</h1>
          <p className="text-slate-500 mt-1">Here is your stock and complaint overview.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl shadow-sm mb-6">
          <h3 className="text-lg font-bold text-orange-800">Out-of-stock Alert</h3>
          <p className="text-orange-700 mt-1">{complaints.availability} customers complained about missing stock.</p>
          <Link href="/products" className="inline-block mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">Go to Inventory</Link>
        </div>
      </div>
    );
  }

  if (role === 'Accountant') {
    return (
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Good to see you, Accountant</h1>
          <p className="text-slate-500 mt-1">Here is your financial overview.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><Users size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Credit Customers</p>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Credit</p>
              <p className="text-2xl font-bold text-slate-800">₹{customers.reduce((sum: number, c: any) => sum + (Number(c.credit_limit) || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm">
          <h3 className="text-lg font-bold text-blue-800">Financial Overview</h3>
          <p className="text-blue-700 mt-1">Manage your customers and invoices.</p>
          <Link href="/customers" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Go to Customers</Link>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}