'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    window.location.replace('/sppu/index.html');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#0d111a',
        color: '#f8fafc',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem', color: '#38bdf8' }}>
          Savitribai Phule Pune University
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1rem' }}>
          Opening Live Scopus Intelligence Dashboard...
        </p>
        <a
          href="/sppu/index.html"
          style={{
            display: 'inline-block',
            padding: '0.625rem 1.25rem',
            background: '#0284c7',
            color: '#fff',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Open Dashboard Directly &rarr;
        </a>
      </div>
    </div>
  );
}
