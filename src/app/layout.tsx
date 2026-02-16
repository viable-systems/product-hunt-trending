import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Hunt Trending',
  description: 'Product derived from radar signal: Product Hunt Trending Analysis. Source: agent.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
