'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, X, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, Customer } from '@/lib/db';

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: '#dbeafe', text: '#1d4ed8' },
  contacted: { bg: '#fef3c7', text: '#b45309' },
  negotiating: { bg: '#fce7f3', text: '#be185d' },
  closed: { bg: '#d1fae5', text: '#047857' }
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: '', company: '', notes: '', status: 'new' as Customer['status']
  });

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (editing) {
        await updateCustomer(editing.id, form);
      } else {
        await addCustomer(form);
      }
      setShowModal(false);
      loadCustomers();
    } catch { alert('Error saving customer'); }
  };

  const handleEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, email: c.email, phone: c.phone || '', country: c.country || '', company: c.company || '', notes: c.notes || '', status: c.status });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', country: '', company: '', notes: '', status: 'new' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this customer?')) {
      await deleteCustomer(id);
      loadCustomers();
    }
  };

  const handleUpdateStatus = async (c: Customer, status: Customer['status']) => {
    await updateCustomer(c.id, { status });
    loadCustomers();
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#c9a84c' }} /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>Customers (CRM)</h1>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          <Plus size={20} /> Add Customer
        </button>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Customer</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Contact</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px' }}>
                  <p style={{ fontWeight: '600', color: '#0a1628' }}>{c.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{c.company}</p>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}><Mail size={14} />{c.email}</span>
                    {c.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}><Phone size={14} />{c.phone}</span>}
                    {c.country && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}><MapPin size={14} />{c.country}</span>}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <select value={c.status} onChange={(e) => handleUpdateStatus(c, e.target.value as Customer['status'])} style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: '500', background: statusColors[c.status].bg, color: statusColors[c.status].text, cursor: 'pointer' }}>
                    <option value="new">🆕 New</option>
                    <option value="contacted">📞 Contacted</option>
                    <option value="negotiating">💬 Negotiating</option>
                    <option value="closed">✅ Closed</option>
                  </select>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#3b82f6' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{editing ? 'Edit Customer' : 'Add Customer'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} /></div>
                <div><label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Country</label><input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} /></div>
              </div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Company</label><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Notes</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '14px', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
