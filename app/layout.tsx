import type { Metadata } from 'next';
import './globals.css';
import { satoshi, plusJakarta, jetbrainsMono } from './fonts';

export const metadata: Metadata = {
  title: 'Abdul Shakur',
  description: 'Personal portfolio website of Abdul Shakur',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${satoshi.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-satoshi antialiased">{children}</body>
    </html>
  );
}

