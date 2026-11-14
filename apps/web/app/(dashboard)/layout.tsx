'use client';

import { LayoutDashboard, LogOut, Package, Users, MessageSquare, Settings, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState('Loading...');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('access_token='));

    if (tokenCookie) {
      try {
        const token = tokenCookie.split('=')[1];
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.sub || 'User');
        setUserRole(payload.role || 'User');
      } catch (e) {
        console.error("Failed to decode token", e);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const canSeeInventory = userRole === 'Owner' || userRole === 'Store Manager';
  const canSeeCustomers = userRole === 'Owner' || userRole === 'Accountant';
  const canSeeComplaints = userRole === 'Owner' || userRole === 'Store Manager';

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col print:hidden">
        <div className="p-6 text-2xl font-bold text-white tracking-widest border-b border-slate-800">
          GROZIA
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* ⚠️ Notice these are <a> tags, NOT <Link> */}
          <a href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          
          {canSeeInventory && (
            <a href="/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Package size={20} /> Inventory
            </a>
          )}
          
          {canSeeCustomers && (
            <a href="/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Users size={20} /> Customers
            </a>
          )}
          
          {canSeeComplaints && (
            <a href="/complaints" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <MessageSquare size={20} /> Complaints
            </a>
          )}
          
          <a href="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={20} /> Settings
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 print:hidden">
          <div className="text-slate-500 font-medium">ShopOps Copilot</div>
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-slate-900"><Bell size={20} /></button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{userEmail}</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">{userRole}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}