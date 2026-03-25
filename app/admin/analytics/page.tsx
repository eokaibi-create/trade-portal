'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, Package, Users, MessageSquare, Loader2 } from 'lucide-react';
import { getProducts, getCustomers, getInquiries } from '@/lib/db';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    products: [] as any[],
    customers: [] as any[],
    inquiries: [] as any[]
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [products, customers, inquiries] = await Promise.all([
        getProducts(),
        getCustomers(),
        getInquiries()
      ]);
      setData({ products, customers, inquiries });
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const getTopProducts = () => {
    return [...data.products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  };

  const getInquiriesByStatus = () => {
    const counts: Record<string, number> = { new: 0, reviewed: 0, replied: 0 };
    data.inquiries.forEach(i => {
      const status = i.status as string;
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  };

  const getCustomersByStatus = () => {
    const counts: Record<string, number> = { new: 0, contacted: 0, negotiating: 0, closed: 0 };
    data.customers.forEach(c => {
      const status = c.status as string;
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  };

  const maxViews = Math.max(...data.products.map(p => p.views || 0), 1);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#c9a84c' }} /></div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#0a1628' }}>
        Analytics & Statistics
      </h1>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(201, 168, 76, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Package size={24} style={{ color: '#c9a84c' }} />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Products</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>{data.products.length}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Users size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Customers</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>{data.customers.length}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <MessageSquare size={24} style={{ color: '#22c55e' }} />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Inquiries</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>{data.inquiries.length}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Eye size={24} style={{ color: '#a855f7' }} />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Views</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>
                {data.products.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Top Products */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#0a1628', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: '#c9a84c' }} /> Top Products by Views
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {getTopProducts().map((product, index) => (
              <div key={product.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>{index + 1}. {product.name}</span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{product.views || 0} views</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ 
                    background: 'linear-gradient(90deg, #c9a84c 0%, #d4a855 100%)', 
                    height: '100%', 
                    width: `${((product.views || 0) / maxViews) * 100}%`,
                    borderRadius: '4px',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            ))}
            {getTopProducts().length === 0 && (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No product data yet</p>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Inquiries by Status */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#0a1628' }}>
              Inquiries by Status
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(getInquiriesByStatus()).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#374151', fontSize: '14px', textTransform: 'capitalize' }}>{status}</span>
                  <span style={{ background: status === 'new' ? '#fef3c7' : status === 'reviewed' ? '#dbeafe' : '#d1fae5', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', color: status === 'new' ? '#b45309' : status === 'reviewed' ? '#1d4ed8' : '#047857' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customers by Status */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#0a1628' }}>
              Customers by Status
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(getCustomersByStatus()).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#374151', fontSize: '14px', textTransform: 'capitalize' }}>{status}</span>
                  <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
