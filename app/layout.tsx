import type { Metadata } from 'next';
import './globals.css';
import { satoshi, plusJakarta, jetbrainsMono } from './fonts';
import { createStaticSitemapData } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'Abdul Shakur',
    template: '%s | Abdul Shakur'
  },
  description: 'Personal portfolio and blog by Abdul Shakur - Web Developer and Designer',
  metadataBase: new URL('https://abdushakur.me'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Abdul Shakur',
    description: 'Personal portfolio and blog by Abdul Shakur - Web Developer and Designer',
    url: 'https://abdushakur.me',
    siteName: 'Abdul Shakur',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdul Shakur',
    description: 'Personal portfolio and blog by Abdul Shakur - Web Developer and Designer',
    creator: '@abdushakurob',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdul Shakur',
    url: 'https://abdushakur.me',
    image: 'https://abdushakur.me/avatar.jpg',
    sameAs: [
      'https://twitter.com/abdushakurob',
      'https://github.com/abdushakurob',
      'https://linkedin.com/in/abdushakurob'
    ],
    jobTitle: 'Web Developer & Designer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    description: 'Web Developer and Designer specializing in modern web applications'
  };

  const sitemapData = createStaticSitemapData();

  return (
    <html 
      lang="en" 
      className={`${satoshi.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitemapData) }}
        />
      </head>
      <body className="font-satoshi antialiased">{children}</body>
    </html>
  );
}

