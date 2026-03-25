export default function Home() {
  return (
    <main style={{ padding: '60px 40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>ALOKAIBI International Trading</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>B2B International Trade Portal</p>
      <a href="/admin" style={{ 
        display: 'inline-block', 
        padding: '16px 32px', 
        background: 'linear-gradient(135deg, #c9a84c, #d4a855)',
        color: '#0a1628',
        borderRadius: '8px',
        fontWeight: 'bold',
        textDecoration: 'none'
      }}>Enter Admin Panel →</a>
    </main>
  )
}
