import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Hunt Trending Analyzer - AI-Powered Product Analysis',
  description: 'Get AI-powered trend analysis for any Product Hunt product. Paste a URL or description and receive actionable insights on market positioning, target audience, and growth potential.',
  openGraph: {
    title: 'Product Hunt Trending Analyzer',
    description: 'AI-powered tool for analyzing Product Hunt products and market trends',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Product Hunt Trending Analyzer',
    description: 'Get AI-powered trend analysis for any Product Hunt product',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
