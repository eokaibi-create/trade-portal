'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { adminLogin, getCurrentAdmin, initializeAdmin } from '@/lib/admin';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAdmin();
    getCurrentAdmin((admin) => {
      if (admin) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await adminLogin(email, password);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2744 100%)'
      }}>
        <Loader2 size={40} style={{ color: '#c9a84c', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1628 0%, #0f2744 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0a1628', marginBottom: '8px' }}>
            ALOKAIBI Admin
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Sign in to manage your portal
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@alokaibi.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c9a84c'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#c9a84c'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #c9a84c 0%, #d4a855 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={20} />}
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#c9a84c', fontSize: '14px', textDecoration: 'none' }}>
            ← Back to Website
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
