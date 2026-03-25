'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Star, ToggleLeft, ToggleRight, Loader2, X, Image } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories, Product, Category } from '@/lib/db';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: 0,
    moq: 1,
    oemAvailable: false,
    status: 'active' as 'active' | 'inactive',
    images: [''],
    specifications: {} as Record<string, string>
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (editing) {
        await updateProduct(editing.id, form);
      } else {
        await addProduct(form);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      description: product.description,
      price: product.price,
      moq: product.moq,
      oemAvailable: product.oemAvailable,
      status: product.status,
      images: product.images,
      specifications: product.specifications
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      price: 0,
      moq: 1,
      oemAvailable: false,
      status: 'active',
      images: [''],
      specifications: {}
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleToggleStatus = async (product: Product) => {
    await updateProduct(product.id, { status: product.status === 'active' ? 'inactive' : 'active' });
    loadData();
  };

  const handleToggleFeatured = async (product: Product) => {
    const specs = { ...product.specifications, featured: product.specifications.featured ? '' : 'true' };
    await updateProduct(product.id, { specifications: specs });
    loadData();
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={40} style={{ color: '#c9a84c', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>Products</h1>
        <button onClick={handleAdd} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 20px', background: '#c9a84c', color: 'white',
          border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
        }}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 16px 14px 48px',
            border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px'
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Product</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Category</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Price</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>MOQ</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={20} style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: '600', color: '#0a1628' }}>{product.name}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{product.description?.substring(0, 50)}...</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#374151', fontSize: '14px' }}>{getCategoryName(product.categoryId)}</td>
                <td style={{ padding: '16px', color: '#374151', fontWeight: '600' }}>${product.price.toLocaleString()}</td>
                <td style={{ padding: '16px', color: '#374151' }}>{product.moq}</td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => handleToggleStatus(product)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0
                    }}
                  >
                    {product.status === 'active' ? (
                      <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '500' }}>● Active</span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '500' }}>○ Inactive</span>
                    )}
                  </button>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#3b82f6' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Category *</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Price (USD)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>MOQ</label>
                  <input type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: parseInt(e.target.value) || 1 })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Image URL</label>
                <input type="text" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} placeholder="https://..." />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" id="oem" checked={form.oemAvailable} onChange={(e) => setForm({ ...form, oemAvailable: e.target.checked })} />
                <label htmlFor="oem">OEM Available</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 1, padding: '14px', background: '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
