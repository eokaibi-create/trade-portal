'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, GripVertical } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory, Category } from '@/lib/db';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', parentId: null as string | null, order: 0, visible: true });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateCategory(editing.id, form);
      } else {
        await addCategory(form);
      }
      setShowModal(false);
      loadCategories();
    } catch { alert('Error saving category'); }
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, parentId: cat.parentId, order: cat.order, visible: cat.visible });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: '', parentId: null, order: categories.length + 1, visible: true });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  const handleToggleVisible = async (cat: Category) => {
    await updateCategory(cat.id, { visible: !cat.visible });
    loadCategories();
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#c9a84c' }} /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>Categories</h1>
        <button onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Order</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Visibility</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px', color: '#6b7280' }}><GripVertical size={16} /></td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#0a1628' }}>{cat.name}</td>
                <td style={{ padding: '16px' }}>
                  <button onClick={() => handleToggleVisible(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: cat.visible ? '#22c55e' : '#9ca3af' }}>
                    {cat.visible ? '● Visible' : '○ Hidden'}
                  </button>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#3b82f6' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Category Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Sort Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" id="visible" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
                <label htmlFor="visible">Visible on website</label>
              </div>
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
