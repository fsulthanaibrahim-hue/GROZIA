'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]';

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [issue, setIssue] = useState('');
  const [category, setCategory] = useState('quality');

  // One call on load. Authentication is already checked by the dashboard layout,
  // and the API itself returns 401/403 if the session or page assignment is missing.
  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints', {
        cache: 'no-store',
        credentials: 'include',
      });
      if (res.ok) setComplaints(await res.json());
      else if (res.status === 401) window.location.href = '/login';
      else if (res.status === 403) router.replace('/403');
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
    setCustomerName('');
    setIssue('');
    setCategory('quality');
  };

  const handleAddComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customer_name: customerName.trim(),
          description: issue.trim(),
          category,
          product_id: null,
        }),
      });
      if (res.ok) {
        closeModal();
        await fetchComplaints();
      } else if (res.status === 403) {
        setFormError('You do not have permission to log complaints.');
      } else if (res.status === 422) {
        setFormError('Please check the details and try again.');
      } else {
        setFormError('Could not save the complaint. Try again.');
      }
    } catch (error) {
      console.error(error);
      setFormError('Could not save the complaint. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCount = complaints.filter((c: any) => c.status === 'open').length;

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

      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              <MessageSquare className="h-9 w-9 text-[#17261F]/40" strokeWidth={1.75} />
              Complaints
            </h1>
            <p className="mt-2 text-[#17261F]/65">
              {complaints.length === 0
                ? 'Customer issues you log will be listed here.'
                : openCount === 0
                  ? 'All complaints are resolved.'
                  : `${openCount} open out of ${complaints.length}`}
            </p>
          </div>
          <button
            onClick={openModal}
            className={`flex items-center gap-2 rounded-md bg-[#17261F] px-5 py-2.5 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] ${FOCUS}`}
          >
            <Plus size={18} strokeWidth={2.5} /> Log complaint
          </button>
        </header>

        {complaints.length === 0 ? (
          <div className="rounded-lg border border-[#17261F]/15 bg-white px-4 py-14 text-center">
            <p className="font-display text-xl font-semibold">No complaints logged</p>
            <p className="mt-1 text-sm text-[#17261F]/60">When a customer reports a problem, log it here to track it.</p>
            <button
              onClick={openModal}
              className={`mt-5 rounded-md bg-[#17261F] px-4 py-2 text-sm font-semibold text-[#EAEFE7] ${FOCUS}`}
            >
              Log complaint
            </button>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-lg border border-[#17261F]/15 bg-white">
            {complaints.map((c: any) => {
              const isOpen = c.status === 'open';
              return (
                <li
                  key={c.id}
                  className={`flex items-start gap-4 border-b border-[#17261F]/10 border-l-4 py-5 pl-4 pr-5 last:border-b-0 sm:pl-5 ${
                    isOpen ? 'border-l-[#C8321E]' : 'border-l-[#3E8E5A]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isOpen ? (
                      <AlertCircle className="text-[#C8321E]" size={22} />
                    ) : (
                      <CheckCircle2 className="text-[#3E8E5A]" size={22} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5">
                      <h3 className="font-display text-lg font-semibold leading-snug">{c.issue}</h3>
                      <span
                        className={`shrink-0 rounded px-2.5 py-1 text-xs font-semibold ${
                          isOpen ? 'bg-[#C8321E]/10 text-[#9E2414]' : 'bg-[#3E8E5A]/12 text-[#25673D]'
                        }`}
                      >
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#17261F]/65">
                      Reported by <span className="font-semibold text-[#17261F]">{c.customer}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17261F]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="log-complaint-title"
        >
          <div className="modal-in w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#17261F]/15 px-6 py-5">
              <h2 id="log-complaint-title" className="font-display text-2xl font-extrabold">
                Log complaint
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close"
                className={`rounded p-1 text-[#17261F]/60 hover:bg-[#EAEFE7] hover:text-[#17261F] ${FOCUS}`}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddComplaint} className="space-y-5 p-6">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">Customer name</label>
                <input
                  id="c-name"
                  required
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <div>
                <label htmlFor="c-issue" className="mb-1.5 block text-sm font-semibold">What went wrong?</label>
                <input
                  id="c-issue"
                  required
                  type="text"
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                />
              </div>
              <div>
                <label htmlFor="c-cat" className="mb-1.5 block text-sm font-semibold">Type of issue</label>
                <select
                  id="c-cat"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-md border border-[#17261F]/25 bg-white px-3.5 py-2.5 outline-none focus:border-[#17261F] focus:ring-2 focus:ring-[#F2B705]"
                >
                  <option value="availability">Availability</option>
                  <option value="quality">Quality</option>
                  <option value="price">Price</option>
                  <option value="service">Service</option>
                </select>
              </div>

              {formError && (
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {formError}
                </p>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className={`w-full rounded-md bg-[#17261F] py-3 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] disabled:opacity-60 ${FOCUS}`}
              >
                {isLoading ? 'Saving…' : 'Save complaint'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}