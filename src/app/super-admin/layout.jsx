'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Mail,
  ClipboardList,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function SuperAdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('sa_token');
    const adminData = localStorage.getItem('sa_admin');
    if (!token && pathname !== '/super-admin/login') {
      router.replace('/super-admin/login');
      return;
    }
    if (adminData) setAdmin(JSON.parse(adminData));
  }, [pathname]);

  if (pathname === '/super-admin/login') return <>{children}</>;

  const handleLogout = async () => {
    const token = localStorage.getItem('sa_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_refresh_token');
    localStorage.removeItem('sa_admin');
    router.replace('/super-admin/login');
  };

  const navItems = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/tenants', label: 'Tenants', icon: Building2 },
    { href: '/super-admin/email-credits', label: 'Email Credits', icon: Mail },
    { href: '/super-admin/audit-logs', label: 'Audit Logs', icon: ClipboardList },
    { href: '/super-admin/admins', label: 'Admins', icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-sm">
              N
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Nexora</div>
              <div className="text-xs text-red-400 font-medium">Super Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-red-600/20 text-red-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div className="p-4 border-t border-gray-800">
          {admin && (
            <div className="mb-3 px-3">
              <div className="text-xs text-white font-medium">
                {admin.firstName} {admin.lastName}
              </div>
              <div className="text-xs text-gray-500">{admin.email}</div>
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-900/50 text-red-400">
                {admin.role}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-950">{children}</main>
    </div>
  );
}
