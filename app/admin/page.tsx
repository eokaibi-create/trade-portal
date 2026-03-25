'use client';

import { useEffect, useState } from 'react';
import { Package, Users, MessageSquare, Eye, TrendingUp, Loader2 } from 'lucide-react';
import { getProducts, getCustomers, getInquiries } from '@/lib/db';
import { getCurrentAdmin, AdminUser } from '@/lib/admin';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    inquiries: 0,
    newInquiries: 0,
    totalViews: 0
  });

  useEffect(() => {
    getCurrentAdmin((admin: AdminUser | null) => {
      if (admin) {
        loadStats();
      }
    });
  }, []);

  const loadStats = async () => {
    try {
      const [products, customers, inquiries] = await Promise.all([
        getProducts(),
        getCustomers(),
        getInquiries()
      ]);

      const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
      
      setStats({
        products: products.length,
        customers: customers.length,
        inquiries: inquiries.length,
        newInquiries: inquiries.filter(i => i.status === 'new').length,
        totalViews
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 size={40} style={{ color: '#c9a84c', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#0a1628' }}>
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Products</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#0a1628' }}>{stats.products}</p>
            </div>
            <div style={{ background: 'rgba(201, 168, 76, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Package size={24} style={{ color: '#c9a84c' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Customers</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#0a1628' }}>{stats.customers}</p>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Users size={24} style={{ color: '#3b82f6' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Inquiries</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#0a1628' }}>{stats.inquiries}</p>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <MessageSquare size={24} style={{ color: '#22c55e' }} />
            </div>
          </div>
        </div>

        <div style={{ background: stats.newInquiries > 0 ? '#fef3c7' : 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: stats.newInquiries > 0 ? '2px solid #f59e0b' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>New Inquiries</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: stats.newInquiries > 0 ? '#f59e0b' : '#0a1628' }}>{stats.newInquiries}</p>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '8px' }}>
              <TrendingUp size={24} style={{ color: '#f59e0b' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0a1628' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/admin/products" style={{ padding: '12px 20px', background: '#c9a84c', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
            + Add Product
          </a>
          <a href="/admin/categories" style={{ padding: '12px 20px', background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
            Manage Categories
          </a>
          <a href="/admin/customers" style={{ padding: '12px 20px', background: '#22c55e', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
            View Customers
          </a>
          <a href="/admin/inquiries" style={{ padding: '12px 20px', background: '#f59e0b', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
            Check Inquiries
          </a>
        </div>
      </div>
    </div>
  );
}
