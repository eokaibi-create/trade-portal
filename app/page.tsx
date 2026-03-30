'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Package, Handshake, Truck, Mail, Phone, MapPin, Send, ChevronRight, Menu, X } from 'lucide-react';
import { getProducts, Product, addInquiry } from '@/lib/db';

export default function Home() {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [products, setProducts] = useState<Product[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', country: '', company: '', product: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data.filter(p => p.status === 'active').slice(0, 8));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addInquiry({
        customerId: null,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerCountry: formData.country,
        productId: null,
        productName: formData.product,
        message: formData.message,
        status: 'new'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', country: '', company: '', product: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert('Error submitting inquiry');
    }
    setSubmitting(false);
  };

  const t = {
    en: {
      nav: { home: 'Home', products: 'Products', about: 'About', contact: 'Contact' },
      hero: { title: 'Connecting Businesses Across Borders', subtitle: 'Your trusted partner for international B2B trade. Premium products, reliable suppliers, and seamless transactions.', cta: 'Explore Products', cta2: 'Contact Us' },
      services: { title: 'Our Services', items: [
        { icon: Globe, title: 'Global Trade', desc: 'Access markets worldwide with our extensive network of suppliers and buyers across 50+ countries.' },
        { icon: Package, title: 'Product Sourcing', desc: 'Find the perfect products for your business. We handle quality control, negotiation, and logistics.' },
        { icon: Handshake, title: 'Business Partnership', desc: 'Build long-term relationships with verified suppliers. We facilitate trust and transparency.' },
        { icon: Truck, title: 'Logistics Support', desc: 'End-to-end shipping solutions. From factory to your warehouse, we handle it all.' }
      ]},
      products: { title: 'Featured Products', viewAll: 'View All Products', inquire: 'Inquire Now' },
      contact: { title: 'Get In Touch', subtitle: 'Send us your inquiry and we\'ll get back to you within 24 hours', name: 'Your Name', email: 'Email Address', phone: 'Phone Number', country: 'Country', company: 'Company Name', product: 'Product Interest', message: 'Your Message', send: 'Send Inquiry', sending: 'Sending...', sent: 'Inquiry Sent Successfully!' },
      footer: { company: 'ALOKAIBI INTERNATIONAL TRADING LIMITED', desc: 'Your trusted partner for international B2B trade', rights: 'All rights reserved.' }
    },
    zh: {
      nav: { home: '首页', products: '产品', about: '关于我们', contact: '联系我们' },
      hero: { title: '连接全球贸易', subtitle: '您值得信赖的国际B2B贸易伙伴。优质产品、可靠供应商、无缝交易。', cta: '浏览产品', cta2: '联系我们' },
      services: { title: '我们的服务', items: [
        { icon: Globe, title: '全球贸易', desc: '通过我们遍布50多个国家的供应商和买家网络,开拓全球市场。' },
        { icon: Package, title: '产品采购', desc: '为您的企业寻找完美产品。我们负责质量控制、谈判和物流。' },
        { icon: Handshake, title: '商业合作', desc: '与经过验证的供应商建立长期合作关系。我们促进信任和透明度。' },
        { icon: Truck, title: '物流支持', desc: '端到端运输解决方案。从工厂到您的仓库,我们全程处理。' }
      ]},
      products: { title: '精选产品', viewAll: '查看所有产品', inquire: '立即询盘' },
      contact: { title: '联系我们', subtitle: '发送您的询盘,我们将在24小时内回复', name: '您的姓名', email: '邮箱地址', phone: '电话号码', country: '国家', company: '公司名称', product: '感兴趣的产品', message: '您的留言', send: '发送询盘', sending: '发送中...', sent: '询盘发送成功!' },
      footer: { company: '阿洛卡比国际贸易有限公司', desc: '您值得信赖的国际B2B贸易伙伴', rights: '版权所有。' }
    }
  }[lang];

  return (
    <div style={{ background: '#0a1628', color: 'white', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(10, 22, 40, 0.95)', backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <span style={{ fontSize: '32px' }}>🏢</span>
            <span style={{ fontSize: '22px', fontWeight: '700', color: '#c9a84c' }}>ALOKAIBI</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '32px' }} className="nav-links">
              <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500', opacity: 0.9, transition: 'opacity 0.2s' }}>{t.nav.home}</Link>
              <Link href="/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500', opacity: 0.9, transition: 'opacity 0.2s' }}>{t.nav.products}</Link>
              <Link href="#contact" style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: '500', opacity: 0.9, transition: 'opacity 0.2s' }}>{t.nav.contact}</Link>
            </div>

            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '8px' }}>
              <button onClick={() => setLang('en')} style={{ padding: '6px 14px', background: lang === 'en' ? '#c9a84c' : 'transparent', border: 'none', borderRadius: '6px', color: lang === 'en' ? '#0a1628' : '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>EN</button>
              <button onClick={() => setLang('zh')} style={{ padding: '6px 14px', background: lang === 'zh' ? '#c9a84c' : 'transparent', border: 'none', borderRadius: '6px', color: lang === 'zh' ? '#0a1628' : '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>中文</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} className="mobile-menu-btn">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '70px', minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201, 168, 76, 0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: '800', marginBottom: '24px', background: 'linear-gradient(135deg, #fff 0%, #c9a84c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {t.hero.title}
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            {t.hero.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', borderRadius: '8px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', transition: 'transform 0.2s' }}>
              {t.hero.cta} <ChevronRight size={20} />
            </Link>
            <Link href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'transparent', border: '2px solid #c9a84c', color: '#c9a84c', borderRadius: '8px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s' }}>
              {t.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '60px', color: '#c9a84c' }}>{t.services.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {t.services.items.map((service, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201, 168, 76, 0.2)', borderRadius: '16px', padding: '40px 32px', transition: 'all 0.3s' }}>
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2), rgba(201, 168, 76, 0.1))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <service.icon size={32} style={{ color: '#c9a84c' }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px', color: '#fff' }}>{service.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '700', color: '#c9a84c' }}>{t.products.title}</h2>
            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#c9a84c', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>
              {t.products.viewAll} <ChevronRight size={20} />
            </Link>
          </div>
          
          {products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', transition: 'all 0.3s' }}>
                  <div style={{ height: '200px', background: 'rgba(201, 168, 76, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={48} style={{ color: 'rgba(201, 168, 76, 0.3)' }} />
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>{product.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#c9a84c', fontWeight: '600' }}>MOQ: {product.moq}</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={14} /> {t.products.inquire}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>
              <Package size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>No products available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '16px', color: '#c9a84c' }}>{t.contact.title}</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '48px' }}>{t.contact.subtitle}</p>
          
          {submitted ? (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
              <Send size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#22c55e' }}>{t.contact.sent}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.name} *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.email} *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.phone}</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.country}</label>
                  <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.company}</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.product}</label>
                  <input type="text" value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>{t.contact.message} *</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px', resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={submitting} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #c9a84c, #d4a855)', color: '#0a1628', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                {submitting ? t.contact.sending : t.contact.send}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(201, 168, 76, 0.2)', padding: '60px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '32px' }}>🏢</span>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#c9a84c' }}>ALOKAIBI</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{t.footer.desc}</p>
            </div>
            <div>
              <h4 style={{ color: '#c9a84c', fontWeight: '600', marginBottom: '20px', fontSize: '16px' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>{t.nav.home}</Link>
                <Link href="/products" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>{t.nav.products}</Link>
                <Link href="#contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>{t.nav.contact}</Link>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#c9a84c', fontWeight: '600', marginBottom: '20px', fontSize: '16px' }}>Contact Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  <Mail size={16} /> info@newway2trade.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  <Phone size={16} /> +60 12-345-6789
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  <MapPin size={16} /> Malaysia
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>© {new Date().getFullYear()} {t.footer.company}. {t.footer.rights}</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        a:hover { opacity: 0.8 }
        input:focus, textarea:focus { outline: none; border-color: #c9a84c !important; }
      `}</style>
    </div>
  );
}
