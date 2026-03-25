'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Download, Trash2, Mail, MapPin, Package, Phone } from 'lucide-react';
import { getInquiries, updateInquiry, deleteInquiry, Inquiry } from '@/lib/db';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const filtered = inquiries.filter(i =>
    i.customerName.toLowerCase().includes(search.toLowerCase()) ||
    i.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
    i.productName?.toLowerCase().includes(search.toLowerCase()) ||
    i.message?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = async (id: string, status: Inquiry['status']) => {
    await updateInquiry(id, { status });
    loadInquiries();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this inquiry?')) {
      await deleteInquiry(id);
      loadInquiries();
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Country', 'Product', 'Message', 'Status'];
    const rows = inquiries.map(i => [
      i.createdAt instanceof Date ? i.createdAt.toLocaleDateString() : String(i.createdAt),
      i.customerName,
      i.customerEmail,
      i.customerPhone || '',
      i.customerCountry || '',
      i.productName || '',
      i.message?.replace(/,/g, ';') || '',
      i.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    new: { bg: '#fef3c7', text: '#b45309' },
    reviewed: { bg: '#dbeafe', text: '#1d4ed8' },
    replied: { bg: '#d1fae5', text: '#047857' }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#c9a84c' }} /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>Inquiries</h1>
        <button onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          <Download size={20} /> Export CSV
        </button>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input type="text" placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filtered.map((inquiry) => (
          <div key={inquiry.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0a1628', marginBottom: '4px' }}>{inquiry.customerName}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  {inquiry.createdAt instanceof Date ? inquiry.createdAt.toLocaleDateString() : String(inquiry.createdAt)}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select value={inquiry.status} onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value as Inquiry['status'])} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: '500', background: statusColors[inquiry.status].bg, color: statusColors[inquiry.status].text, cursor: 'pointer' }}>
                  <option value="new">🆕 New</option>
                  <option value="reviewed">👁️ Reviewed</option>
                  <option value="replied">✅ Replied</option>
                </select>
                <button onClick={() => handleDelete(inquiry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444' }}><Trash2 size={18} /></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '14px' }}>
                <Mail size={16} style={{ color: '#6b7280' }} />
                <a href={`mailto:${inquiry.customerEmail}`} style={{ color: '#3b82f6' }}>{inquiry.customerEmail}</a>
              </div>
              {inquiry.customerPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '14px' }}>
                  <Phone size={16} style={{ color: '#6b7280' }} />
                  {inquiry.customerPhone}
                </div>
              )}
              {inquiry.customerCountry && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '14px' }}>
                  <MapPin size={16} style={{ color: '#6b7280' }} />
                  {inquiry.customerCountry}
                </div>
              )}
              {inquiry.productName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '14px' }}>
                  <Package size={16} style={{ color: '#6b7280' }} />
                  {inquiry.productName}
                </div>
              )}
            </div>

            <div style={{ padding: '16px', background: '#fefce8', borderRadius: '8px', borderLeft: '4px solid #ca8a04' }}>
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{inquiry.message}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>No inquiries found</div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
