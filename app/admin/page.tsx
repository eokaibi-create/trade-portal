'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;

  if (!user) {
    return (
      <main style={{ padding: 60, maxWidth: 400, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 30 }}>Admin Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #c9a84c', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #c9a84c', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
          />
          <button type="submit" style={{ padding: 14, background: '#c9a84c', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(239,68,68,0.2)', border: '1px solid #f87171', borderRadius: 8, color: '#fca5a5', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>Welcome, {user.email}</p>
      <p style={{ marginTop: 20, color: 'rgba(255,255,255,0.4)' }}>Admin features coming soon...</p>
    </main>
  );
}
