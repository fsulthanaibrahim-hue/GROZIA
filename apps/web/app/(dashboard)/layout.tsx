'use client';

import { LayoutDashboard, LogOut, Package, Users, MessageSquare, Settings, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { canAccessRoute } from '@/lib/permissions';
import { UserContext } from '@/lib/user-context';

const FOCUS_LIGHT = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B705]';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPages, setUserPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      // The only /api/me call. Child pages read this data from UserContext.
      const res = await fetch('/api/me', { credentials: 'include' });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      setUserEmail(data.email);
      setUserRole(data.role);
      setUserPages(data.pages ?? []);
      setLoading(false);
    };
    init();
  }, []);

  // The access_token cookie is HttpOnly, so only the server can delete it.
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } finally {
      window.location.href = '/login';
    }
  };

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/products', label: 'Inventory', icon: Package, show: canAccessRoute(userPages, '/products') },
    { href: '/customers', label: 'Customers', icon: Users, show: canAccessRoute(userPages, '/customers') },
    { href: '/complaints', label: 'Complaints', icon: MessageSquare, show: canAccessRoute(userPages, '/complaints') },
    { href: '/settings', label: 'Settings', icon: Settings, show: canAccessRoute(userPages, '/settings') },
  ].filter(l => l.show);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  const allowed = canAccessRoute(userPages, pathname ?? '');

  useEffect(() => {
    if (!loading && !allowed) router.replace('/403');
  }, [loading, allowed, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EAEFE7] text-[#17261F]">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-[#EAEFE7] text-[#17261F]"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@400;500;600&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif; }
      `}</style>

      <aside className="flex w-16 shrink-0 flex-col bg-[#17261F] text-[#EAEFE7]/75 md:w-60 print:hidden">
        <div className="font-display flex h-16 items-center justify-center border-b border-white/10 text-2xl font-extrabold text-[#EAEFE7] md:justify-start md:px-6">
          <span className="md:hidden">G</span>
          <span className="hidden md:inline">Grozia</span>
        </div>

        <nav aria-label="Main" className="flex-1 space-y-1 p-2 md:p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-center gap-3 rounded-md border-l-4 py-2.5 transition-colors md:justify-start md:px-3 ${FOCUS_LIGHT} ${
                  active
                    ? 'border-[#F2B705] bg-white/10 font-semibold text-[#EAEFE7]'
                    : 'border-transparent hover:bg-white/5 hover:text-[#EAEFE7]'
                }`}
              >
                <Icon size={20} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-2 md:p-3">
          <button
            onClick={handleLogout}
            title="Log out"
            className={`flex w-full items-center justify-center gap-3 rounded-md border-l-4 border-transparent py-2.5 transition-colors hover:bg-white/5 hover:text-[#FF9C8A] md:justify-start md:px-3 ${FOCUS_LIGHT}`}
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#17261F]/15 bg-white px-4 sm:px-8 print:hidden">
          <div className="font-display text-lg font-semibold">ShopOps Copilot</div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              aria-label="Notifications"
              className="rounded p-1 text-[#17261F]/55 hover:text-[#17261F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17261F]"
            >
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#17261F] text-sm font-bold text-[#EAEFE7]"
              >
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden max-w-[14rem] truncate text-sm font-medium sm:inline">
                {userEmail}
              </span>
              {userRole && (
                <span className="rounded bg-[#F2B705]/30 px-2 py-0.5 text-xs font-semibold text-[#5C4500]">
                  {userRole}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <UserContext.Provider value={{ email: userEmail, role: userRole, pages: userPages }}>
            {allowed ? children : null}
          </UserContext.Provider>
        </main>
      </div>
    </div>
  );
}