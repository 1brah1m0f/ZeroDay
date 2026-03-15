import type { Metadata } from 'next';
import '@/styles/base.module.css';
import '@/styles/components.module.css';
import '@/styles/utilities.module.css';

export const metadata: Metadata = {
  title: 'ComTech — Azərbaycanın ictimai platforması',
  description: 'Elanlar paylaş, qruplara qoşul, forumda müzakirə et — birlikdə daha güclüyük.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className="min-h-screen bg-surface-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
