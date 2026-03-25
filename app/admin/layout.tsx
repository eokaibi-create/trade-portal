'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Layers, Users, MessageSquare, FileText, BarChart3, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { getCurrentAdmin, AdminUser } from '@/lib/admin';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏢</span>
          <span className={styles.logoText}>ALOKAIBI</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className={styles.navItem}>
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/categories" className={styles.navItem}>
            <Layers size={20} />
            <span>Categories</span>
          </Link>
          <Link href="/admin/customers" className={styles.navItem}>
            <Users size={20} />
            <span>Customers</span>
          </Link>
          <Link href="/admin/inquiries" className={styles.navItem}>
            <MessageSquare size={20} />
            <span>Inquiries</span>
          </Link>
          <Link href="/admin/content" className={styles.navItem}>
            <FileText size={20} />
            <span>Content</span>
          </Link>
          <Link href="/admin/analytics" className={styles.navItem}>
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
