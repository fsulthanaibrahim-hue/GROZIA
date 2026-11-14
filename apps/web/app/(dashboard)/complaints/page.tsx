'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [customerName, setCustomerName] = useState('');
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('quality');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }
  };

  const handleAddComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          description: issue,
          category: category,
          product_id: 1, // Using ID 1 for simplicity (in a real app, you'd pick a product)
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setCustomerName('');
        setIssue('');
        await fetchComplaints();
      } else {
        alert("Failed to add complaint.");
      }
    } catch (error) {
      console.error("Error adding complaint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-slate-400" /> Customer Complaints
          </h1>
          <p className="text-slate-500 mt-1">Review and reply to customer issues.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Log Complaint
        </button>
      </header>

      <div className="space-y-4">
        {complaints.map((c: any) => (
          <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`mt-1 p-2 rounded-full ${c.status === 'open' ? 'bg-red-100' : 'bg-green-100'}`}>
              {c.status === 'open' 
                ? <AlertCircle className="text-red-600" size={24} /> 
                : <CheckCircle2 className="text-green-600" size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800">{c.issue}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                  c.status === 'open' ? 'bg-red-100 text-red-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-500">
                Customer: <span className="font-medium text-slate-700">{c.customer}</span> 
                <span className="mx-2">•</span> 
                Product: <span className="font-medium text-slate-700">{c.product}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Log a Complaint</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddComplaint} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800" placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Description</label>
                <input required type="text" value={issue} onChange={e => setIssue(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800" placeholder="e.g. Product was expired" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white">
                  <option value="availability">Availability</option>
                  <option value="quality">Quality</option>
                  <option value="price">Price</option>
                  <option value="service">Service</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="pt-4">
                <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50">
                  {isLoading ? 'Saving...' : 'Save Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}