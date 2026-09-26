import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
};

export const metadata: Metadata = {
  title: 'India Global Access Index | Data-Driven International Mobility Ranking',
  description:
    'Discover which Indian city provides the easiest physical and visa access to the rest of the world based on direct routes, visa regulations, and destination weights.',
  keywords: [
    'India Global Access Index',
    'Indian passport mobility',
    'Direct international flights from India',
    'Airport connectivity index',
    'Visa free countries for Indian passport',
  ],
  authors: [{ name: 'Global Mobility & Aviation Analytics' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-950 text-slate-100 min-h-screen antialiased selection:bg-brand-500/30 selection:text-brand-300">
        {children}
      </body>
    </html>
  );
}
