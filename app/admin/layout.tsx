'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, Layers, Users, MessageSquare, FileText, BarChart3, LogOut, LayoutDashboard } from 'lucide-react';
import { getCurrentAdmin, AdminUser } from '@/lib/admin';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = getCurrentAdmin((admin: AdminUser | null) => {
      if (!admin) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const { adminLogout } = await import('@/lib/admin');
    await adminLogout();
    router.push('/login');
  };

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { href: '/admin/categories', icon: <Layers size={20} />, label: 'Categories' },
    { href: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
    { href: '/admin/inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries' },
    { href: '/admin/content', icon: <FileText size={20} />, label: 'Content' },
    { href: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏢</span>
          <span className={styles.logoText}>ALOKAIBI</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
