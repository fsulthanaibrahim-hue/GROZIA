'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('quality');

  useEffect(() => {
    if (!document.cookie.includes('access_token=')) {
      router.push('/login');
      return;
    }
    fetchComplaints();
  }, [router]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints', { cache: 'no-store' });
      if (res.ok) setComplaints(await res.json());
    } catch (error) { console.error(error); }
  };

  const handleAddComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName, description: issue, category, product_id: null
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setCustomerName('');
        setIssue('');
        await fetchComplaints();
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-slate-400" /> Complaints
          </h1>
          <p className="text-slate-500 mt-1">Review customer issues.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Log Complaint
        </button>
      </header>

      <div className="space-y-4">
        {complaints.map((c: any) => (
          <div key={c.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className={`mt-1 p-2 rounded-full ${c.status === 'open' ? 'bg-red-100' : 'bg-green-100'}`}>
              {c.status === 'open' ? <AlertCircle className="text-red-600" size={24} /> : <CheckCircle2 className="text-green-600" size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{c.issue}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-500">Customer: <span className="font-medium">{c.customer}</span></p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">Log Complaint</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddComplaint} className="p-6 space-y-4">
              <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer Name" className="w-full px-4 py-2 border rounded-lg" />
              <input required type="text" value={issue} onChange={e => setIssue(e.target.value)} placeholder="Issue Description" className="w-full px-4 py-2 border rounded-lg" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="availability">Availability</option>
                <option value="quality">Quality</option>
                <option value="price">Price</option>
                <option value="service">Service</option>
              </select>
              <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg">
                {isLoading ? 'Saving...' : 'Save Complaint'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}