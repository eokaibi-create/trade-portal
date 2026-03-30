'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Package, Handshake, Truck, Loader2, Send } from 'lucide-react';
import { getProducts, getCategories, Product, Category, addInquiry } from '@/lib/db';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [inquiryForm, setInquiryForm] = useState({
    name: '', email: '', phone: '', country: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prods.filter(p => p.status === 'active').slice(0, 6));
      setCategories(cats.filter(c => c.visible).slice(0, 4));
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setLoading(false);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addInquiry({
        customerId: null,
        customerName: inquiryForm.name,
        customerEmail: inquiryForm.email,
        customerPhone: inquiryForm.phone,
        customerCountry: inquiryForm.country,
        productId: null,
        productName: '',
        message: inquiryForm.message,
        status: 'new'
      });
      setSubmitted(true);
      setInquiryForm({ name: '', email: '', phone: '', country: '', message: '' });
    } catch (e) {
      alert('Failed to submit inquiry');
    }
    setSubmitting(false);
  };

  const services = [
    { icon: <Globe size={32} />, titleEn: 'Global Trade', titleZh: '全球贸易', descEn: 'Connecting markets worldwide with efficient supply chain solutions.', descZh: '连接全球市场，提供高效的供应链解决方案。' },
    { icon: <Package size={32} />, titleEn: 'Product Sourcing', titleZh: '产品采购', descEn: 'Quality products from verified manufacturers.', descZh: '来自认证制造商的优质产品。' },
    { icon: <Handshake size={32} />, titleEn: 'Business Partnership', titleZh: '商业合作', descEn: 'Long-term partnerships built on trust.', descZh: '建立在信任基础上的长期合作伙伴关系。' },
    { icon: <Truck size={32} />, titleEn: 'Logistics Support', titleZh: '物流支持', descEn: 'End-to-end logistics coordination.', descZh: '端到端的物流协调。' }
  ];

  return (
    <div style={{ background: '#0a1628', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10, 22, 40, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: '700', color: '#c9a84c', textDecoration: 'none' }}>
            ALOKAIBI
          </Link>
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="#services" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>{lang === 'en' ? 'Services' : '服务'}</Link>
            <Link href="#products" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>{lang === 'en' ? 'Products' : '产品'}</Link>
            <Link href="#contact" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>{lang === 'en' ? 'Contact' : '联系'}</Link>
            <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} style={{ background: 'rgba(201, 168, 76, 0.2)', border: '1px solid #c9a84c', color: '#c9a84c', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
              {lang === 'en' ? '中文' : 'EN'}
            </button>
            <Link href="/admin" style={{ color: '#c9a84c', textDecoration: 'none', fontSize: '14px' }}>Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '160px 24px 100px', textAlign: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0f2744 100%)' }}>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '700', marginBottom: '24px', color: '#fff' }}>
          {lang === 'en' ? 'Connecting Businesses Across Borders' : '连接全球商业'}
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          {lang === 'en' 
            ? 'Your trusted partner for international B2B trade. Premium products, reliable suppliers, and seamless transactions.'
            : '您值得信赖的国际B2B贸易伙伴。优质产品、可靠供应商、无缝交易。'}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>
            {lang === 'en' ? 'Get Started' : '立即开始'} <ArrowRight size={20} />
          </a>
          <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
            {lang === 'en' ? 'View Products' : '查看产品'}
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '80px 24px', background: '#0a1628' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px', color: '#c9a84c' }}>
            {lang === 'en' ? 'Our Services' : '我们的服务'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {services.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201, 168, 76, 0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center', transition: 'all 0.3s' }}>
                <div style={{ color: '#c9a84c', marginBottom: '16px' }}>{s.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{lang === 'en' ? s.titleEn : s.titleZh}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6' }}>{lang === 'en' ? s.descEn : s.descZh}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '80px 24px', background: '#0f2744' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px', color: '#c9a84c' }}>
            {lang === 'en' ? 'Featured Products' : '精选产品'}
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}><Loader2 size={40} style={{ color: '#c9a84c', animation: 'spin 1s linear infinite' }} /></div>
          ) : products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {products.map((p) => (
                <div key={p.id} style={{ background: '#0a1628', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
                  <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{p.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#c9a84c', fontWeight: '600' }}>${p.price.toLocaleString()}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>MOQ: {p.moq}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>{lang === 'en' ? 'No products available' : '暂无产品'}</p>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'transparent', color: '#c9a84c', borderRadius: '8px', textDecoration: 'none', border: '1px solid #c9a84c' }}>
              {lang === 'en' ? 'View All Products' : '查看全部产品'} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '80px 24px', background: '#0a1628' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '16px', color: '#c9a84c' }}>
            {lang === 'en' ? 'Get In Touch' : '联系我们'}
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>
            {lang === 'en' ? 'Send us an inquiry and we will get back to you soon.' : '发送询盘，我们会尽快回复您。'}
          </p>
          
          {submitted ? (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: '#22c55e', fontSize: '18px', fontWeight: '600' }}>✅ {lang === 'en' ? 'Thank you! We will contact you soon.' : '谢谢！我们会尽快联系您。'}</p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201, 168, 76, 0.2)', borderRadius: '16px', padding: '32px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <input type="text" placeholder={lang === 'en' ? 'Your Name *' : '您的姓名 *'} value={inquiryForm.name} onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})} required style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px' }} />
                <input type="email" placeholder={lang === 'en' ? 'Email Address *' : '电子邮箱 *'} value={inquiryForm.email} onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})} required style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input type="text" placeholder={lang === 'en' ? 'Phone' : '电话'} value={inquiryForm.phone} onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px' }} />
                  <input type="text" placeholder={lang === 'en' ? 'Country' : '国家'} value={inquiryForm.country} onChange={(e) => setInquiryForm({...inquiryForm, country: e.target.value})} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px' }} />
                </div>
                <textarea placeholder={lang === 'en' ? 'Your Message *' : '您的留言 *'} value={inquiryForm.message} onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})} required rows={4} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '16px', resize: 'vertical' }} />
                <button type="submit" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
                  {lang === 'en' ? 'Send Inquiry' : '发送询盘'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', background: '#070d18', borderTop: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            © 2026 ALOKAIBI International Trading. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
