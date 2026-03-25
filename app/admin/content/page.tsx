'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { updateContent } from '@/lib/db';

export default function ContentPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    homeHeroTitle: { en: 'Connecting Businesses Across Borders', zh: '连接全球贸易' },
    homeHeroDesc: { 
      en: 'Your trusted partner for international B2B trade. Premium products, reliable suppliers, and seamless transactions.', 
      zh: '您值得信赖的国际B2B贸易伙伴。优质产品、可靠供应商、无缝交易。' 
    },
    aboutTitle: { en: 'About ALOKAIBI', zh: '关于阿洛卡比' },
    aboutContent: { 
      en: 'ALOKAIBI INTERNATIONAL TRADING LIMITED is a leading B2B trading company...', 
      zh: '阿洛卡比国际贸易有限公司是一家领先的B2B贸易公司...' 
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateContent('home', { titleEn: form.homeHeroTitle.en, titleZh: form.homeHeroTitle.zh });
      await updateContent('home-desc', { contentEn: form.homeHeroDesc.en, contentZh: form.homeHeroDesc.zh });
      await updateContent('about', { titleEn: form.aboutTitle.en, titleZh: form.aboutTitle.zh, contentEn: form.aboutContent.en, contentZh: form.aboutContent.zh });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Error saving content');
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0a1628' }}>Content Management (CMS)</h1>
        <button 
          onClick={handleSave} 
          disabled={loading}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
            background: saved ? '#22c55e' : '#c9a84c', color: 'white', 
            border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Home Hero */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#0a1628' }}>Home - Hero Section</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Title (English)</label>
            <input 
              type="text" 
              value={form.homeHeroTitle.en} 
              onChange={(e) => setForm({ ...form, homeHeroTitle: { ...form.homeHeroTitle, en: e.target.value } })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Title (中文)</label>
            <input 
              type="text" 
              value={form.homeHeroTitle.zh} 
              onChange={(e) => setForm({ ...form, homeHeroTitle: { ...form.homeHeroTitle, zh: e.target.value } })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Description (English)</label>
          <textarea 
            value={form.homeHeroDesc.en} 
            onChange={(e) => setForm({ ...form, homeHeroDesc: { ...form.homeHeroDesc, en: e.target.value } })}
            rows={3}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Description (中文)</label>
          <textarea 
            value={form.homeHeroDesc.zh} 
            onChange={(e) => setForm({ ...form, homeHeroDesc: { ...form.homeHeroDesc, zh: e.target.value } })}
            rows={3}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* About */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#0a1628' }}>About Page</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Title (English)</label>
            <input 
              type="text" 
              value={form.aboutTitle.en} 
              onChange={(e) => setForm({ ...form, aboutTitle: { ...form.aboutTitle, en: e.target.value } })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Title (中文)</label>
            <input 
              type="text" 
              value={form.aboutTitle.zh} 
              onChange={(e) => setForm({ ...form, aboutTitle: { ...form.aboutTitle, zh: e.target.value } })}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Content (English)</label>
          <textarea 
            value={form.aboutContent.en} 
            onChange={(e) => setForm({ ...form, aboutContent: { ...form.aboutContent, en: e.target.value } })}
            rows={5}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Content (中文)</label>
          <textarea 
            value={form.aboutContent.zh} 
            onChange={(e) => setForm({ ...form, aboutContent: { ...form.aboutContent, zh: e.target.value } })}
            rows={5}
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
