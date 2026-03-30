'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Package, Loader2 } from 'lucide-react';
import { getProducts, getCategories, Product, Category } from '@/lib/db';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods.filter(p => p.status === 'active'));
      setCategories(cats.filter(c => c.visible));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || p.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '';

  return (
    <div style={{ background: '#0a1628', minHeight: '100vh', color: '#fff', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', color: '#c9a84c' }}>Products</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>Browse our product catalog</p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px' }} />
          </div>
          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}><Loader2 size={40} style={{ color: '#c9a84c', animation: 'spin 1s linear infinite' }} /></div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map(p => (
              <Link key={p.id} href={`/products/${p.id}`} style={{ background: '#0f2744', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(201, 168, 76, 0.2)', textDecoration: 'none' }}>
                <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                </div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '12px', color: '#c9a84c', marginBottom: '4px' }}>{getCatName(p.categoryId)}</p>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{p.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#c9a84c', fontWeight: '600', fontSize: '18px' }}>${p.price.toLocaleString()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>MOQ: {p.moq}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '60px' }}>No products found</p>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
