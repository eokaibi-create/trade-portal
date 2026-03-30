'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Search, Filter, ChevronLeft, ChevronRight, Mail, X } from 'lucide-react';
import { getProducts, getCategories, Product, Category, addInquiry } from '@/lib/db';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const productsPerPage = 12;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
    setProducts(productsData.filter(p => p.status === 'active'));
    setCategories(categoriesData.filter(c => c.visible));
    setLoading(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleInquiry = (product: Product) => {
    setSelectedProduct(product);
    setShowInquiryModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await addInquiry({
        customerId: null,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerCountry: formData.country,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        message: formData.message,
        status: 'new'
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowInquiryModal(false);
        setFormData({ name: '', email: '', phone: '', country: '', message: '' });
      }, 2000);
    } catch { alert('Error submitting inquiry'); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a1628' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(201, 168, 76, 0.3)', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a1628', color: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: 'rgba(10, 22, 40, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <span style={{ fontSize: '28px' }}>🏢</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#c9a84c' }}>ALOKAIBI</span>
          </Link>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>← Back to Home</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(201, 168, 76, 0.1) 0%, transparent 100%)' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '16px', color: '#c9a84c' }}>Our Products</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto' }}>Browse our extensive catalog of quality products from verified suppliers</p>
      </section>

      {/* Filters */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '14px 16px 14px 48px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px', cursor: 'pointer', minWidth: '180px' }}
            >
              <option value="" style={{ background: '#0a1628' }}>All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} style={{ background: '#0a1628' }}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
        {paginatedProducts.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {paginatedProducts.map((product) => (
                <div key={product.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s' }}>
                  <div style={{ height: '220px', background: 'rgba(201, 168, 76, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={64} style={{ color: 'rgba(201, 168, 76, 0.3)' }} />
                    )}
                    {product.oemAvailable && (
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#c9a84c', color: '#0a1628', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>OEM</span>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>{product.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ color: '#c9a84c', fontWeight: '600', fontSize: '15px' }}>MOQ: {product.moq}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>${product.price}</span>
                    </div>
                    <button onClick={() => handleInquiry(product)} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                      Send Inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '10px 16px', background: currentPage === page ? '#c9a84c' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: currentPage === page ? '#0a1628' : '#fff', fontWeight: '600', cursor: 'pointer' }}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.5)' }}>
            <Package size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div style={{ background: '#0a1628', border: '1px solid rgba(201, 168, 76, 0.3)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', position: 'relative' }}>
            <button onClick={() => setShowInquiryModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
              <X size={24} />
            </button>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Mail size={32} style={{ color: '#22c55e' }} />
                </div>
                <p style={{ fontSize: '20px', fontWeight: '600', color: '#22c55e' }}>Inquiry Sent!</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>We'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#c9a84c' }}>Inquire About</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>{selectedProduct?.name}</p>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Country</label>
                      <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Message *</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Please specify quantity, requirements..." style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', resize: 'vertical' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    Send Inquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
