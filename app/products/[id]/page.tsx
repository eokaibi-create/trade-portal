'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2, Send } from 'lucide-react';
import { getProducts, getCategories, Product, Category, addInquiry } from '@/lib/db';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', country: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { loadProduct(); }, [params.id]);

  const loadProduct = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      const p = prods.find(p => p.id === params.id);
      if (p) {
        setProduct(p);
        const c = cats.find(c => c.id === p.categoryId);
        setCategory(c || null);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    try {
      await addInquiry({
        customerId: null,
        customerName: inquiryForm.name,
        customerEmail: inquiryForm.email,
        customerPhone: inquiryForm.phone,
        customerCountry: inquiryForm.country,
        productId: product.id,
        productName: product.name,
        message: inquiryForm.message,
        status: 'new'
      });
      setSubmitted(true);
      setInquiryForm({ name: '', email: '', phone: '', country: '', message: '' });
    } catch (e) { alert('Failed to send inquiry'); }
    setSubmitting(false);
  };

  if (loading) {
    return <div style={{ background: '#0a1628', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={40} style={{ color: '#c9a84c', animation: 'spin 1s linear infinite' }} /></div>;
  }

  if (!product) {
    return (
      <div style={{ background: '#0a1628', minHeight: '100vh', color: '#fff', padding: '120px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Product not found</h1>
        <Link href="/products" style={{ color: '#c9a84c' }}>← Back to Products</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a1628', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 60px' }}>
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '32px' }}>
          <ArrowLeft size={20} /> Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          {/* Images */}
          <div>
            <div style={{ background: '#0f2744', borderRadius: '16px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden' }}>
              {product.images?.[0] ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={80} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.images.slice(1, 5).map((img, i) => (
                  <div key={i} style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#0f2744' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {category && <p style={{ color: '#c9a84c', fontSize: '14px', marginBottom: '8px' }}>{category.name}</p>}
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{product.name}</h1>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Price</p><p style={{ fontSize: '28px', fontWeight: '700', color: '#c9a84c' }}>${product.price.toLocaleString()}</p></div>
              <div><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>MOQ</p><p style={{ fontSize: '20px', fontWeight: '600' }}>{product.moq} units</p></div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '32px' }}>{product.description}</p>

            {/* Inquiry Form */}
            <div style={{ background: '#0f2744', borderRadius: '16px', padding: '24px', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Send Inquiry</h3>
              {submitted ? (
                <p style={{ color: '#22c55e', textAlign: 'center', padding: '20px' }}>✅ Thank you! We will contact you soon.</p>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
                  <input type="text" placeholder="Your Name *" value={inquiryForm.name} onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})} required style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                  <input type="email" placeholder="Email *" value={inquiryForm.email} onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})} required style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input type="text" placeholder="Phone" value={inquiryForm.phone} onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                    <input type="text" placeholder="Country" value={inquiryForm.country} onChange={(e) => setInquiryForm({...inquiryForm, country: e.target.value})} style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <textarea placeholder="Your Message *" value={inquiryForm.message} onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})} required rows={3} style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', resize: 'vertical' }} />
                  <button type="submit" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />} Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
