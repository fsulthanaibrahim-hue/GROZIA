'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#EAEFE7] px-4 py-8 text-[#17261F] sm:px-8 sm:py-12"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif; }
      `}</style>
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-2 text-[#17261F]/65">{subtitle}</p>
    </header>
  );
}

type Stat = { label: string; value: React.ReactNode; icon: React.ReactNode };

function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <dl
      className={`mb-6 grid overflow-hidden rounded-lg border border-[#17261F]/15 bg-white divide-y divide-[#17261F]/15 md:divide-x md:divide-y-0 ${
        stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
      }`}
    >
      {stats.map(s => (
        <div key={s.label} className="px-6 py-6">
          <dt className="flex items-center gap-2 text-sm font-medium text-[#17261F]/65">
            {s.icon}
            {s.label}
          </dt>
          <dd className="font-display mt-2 text-5xl font-extrabold tabular-nums">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Callout({
  title,
  children,
  barClass,
  action,
}: {
  title: string;
  children: React.ReactNode;
  barClass: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border border-[#17261F]/15 border-l-4 bg-white p-6 ${barClass}`}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-1 max-w-xl text-[#17261F]/70">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const primaryLink = `inline-block rounded-md bg-[#17261F] px-5 py-2.5 font-semibold text-[#EAEFE7] transition-colors hover:bg-[#25392F] ${FOCUS}`;

export default function Dashboard() {
  const [role, setRole] = useState('User');
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState({ open: 0, availability: 0 });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Get the user's role from /api/me (server reads the httpOnly cookie)
        const meRes = await fetch('/api/me');
        if (meRes.status === 401) {
          window.location.href = '/home';
          return;
        }
        const meData = await meRes.json();
        setRole(meData.role || 'User');

        // 2. Fetch dashboard data
        const [prodRes, compRes, custRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/complaints'),
          fetch('/api/customers')
        ]);
        if (prodRes.ok) setProducts(await prodRes.json());
        if (compRes.ok) setComplaints(await compRes.json());
        if (custRes.ok) setCustomers(await custRes.json());
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  const iconClass = 'text-[#17261F]/45';
  const alertIcon = <AlertTriangle size={18} className="text-[#C8321E]" />;

  if (role === 'Owner') {
    return (
      <Shell>
        <Header title="Good to see you, Owner" subtitle="Here is your shop’s full overview." />
        <StatStrip
          stats={[
            { label: 'Products', value: products.length, icon: <Package size={18} className={iconClass} /> },
            { label: 'Open complaints', value: complaints.open, icon: alertIcon },
            { label: 'Credit customers', value: customers.length, icon: <Users size={18} className={iconClass} /> },
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg bg-[#17261F] p-6 text-[#EAEFE7] sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">Sales are down 40% this week</h2>
            <p className="mt-1 max-w-xl text-[#EAEFE7]/75">
              {complaints.availability} customers said items were out of stock.
            </p>
          </div>
          <button
            className="rounded-md bg-[#F2B705] px-5 py-2.5 font-semibold text-[#17261F] transition-colors hover:bg-[#FFC91F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B705]"
          >
            Draft a purchase order
          </button>
        </div>
      </Shell>
    );
  }

  if (role === 'Store Manager') {
    return (
      <Shell>
        <Header title="Good to see you, Store Manager" subtitle="Here is your stock and complaint overview." />
        <StatStrip
          stats={[
            { label: 'Total products', value: products.length, icon: <Package size={18} className={iconClass} /> },
            { label: 'Open complaints', value: complaints.open, icon: alertIcon },
          ]}
        />
        <Callout
          title="Out-of-stock alert"
          barClass="border-l-[#D9822B]"
          action={<Link href="/products" className={primaryLink}>Go to inventory</Link>}
        >
          {complaints.availability} customers complained about missing stock.
        </Callout>
      </Shell>
    );
  }

  if (role === 'Accountant') {
    const totalCredit = customers.reduce((sum: number, c: any) => sum + (Number(c.credit_limit) || 0), 0);
    return (
      <Shell>
        <Header title="Good to see you, Accountant" subtitle="Here is your financial overview." />
        <StatStrip
          stats={[
            { label: 'Credit customers', value: customers.length, icon: <Users size={18} className={iconClass} /> },
            {
              label: 'Total credit',
              value: `₹${totalCredit.toLocaleString('en-IN')}`,
              icon: <DollarSign size={18} className={iconClass} />,
            },
          ]}
        />
        <Callout
          title="Financial overview"
          barClass="border-l-[#17261F]"
          action={<Link href="/customers" className={primaryLink}>Go to customers</Link>}
        >
          Manage your customers and invoices.
        </Callout>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-[#17261F]/65">Loading…</p>
    </Shell>
  );
}