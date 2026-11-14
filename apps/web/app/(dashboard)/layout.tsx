import { LayoutDashboard, LogOut, Package, Users, MessageSquare, Settings, Bell } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 print:hidden">
          <div className="text-slate-500 font-medium">ShopOps Copilot</div>
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-slate-900"><Bell size={20} /></button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">O</div>
              <span className="text-sm font-medium text-slate-700">owner@grozia.com</span>
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