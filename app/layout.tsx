import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { satoshi, plusJakarta, jetbrainsMono } from './fonts';
import { createStaticSitemapData } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'Abdushakur - Web Developer & Designer',
    template: '%s | Abdushakur'
  },
  description: 'Abdushakur is a passionate web developer and designer who creates modern, user-friendly applications. Explore my projects, read my blog posts about web development, and follow my journey in building digital solutions.',
  keywords: ['Abdushakur', 'Web Developer', 'Designer', 'Frontend Developer', 'React', 'Next.js', 'TypeScript', 'Portfolio', 'Blog'],
  authors: [{ name: 'Abdushakur', url: 'https://abdushakur.me' }],
  creator: 'Abdushakur',
  publisher: 'Abdushakur',
  metadataBase: new URL('https://abdushakur.me'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: 'Abdushakur - Web Developer & Designer',
    description: 'Abdushakur is a passionate web developer and designer who creates modern, user-friendly applications. Explore my projects, read my blog posts about web development, and follow my journey in building digital solutions.',
    url: 'https://abdushakur.me',
    siteName: 'Abdushakur',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Abdushakur - Web Developer & Designer',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdushakur - Web Developer & Designer',
    description: 'Abdushakur is a passionate web developer and designer who creates modern, user-friendly applications.',
    creator: '@abdushakurob',
    site: '@abdushakurob',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/site.webmanifest',
  category: 'technology',
  classification: 'Business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdushakur',
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
    description: 'Web Developer and Designer specializing in modern web applications, React, Next.js, and TypeScript',
    knowsAbout: ['Web Development', 'Frontend Development', 'React', 'Next.js', 'TypeScript', 'UI/UX Design'],
    alumniOf: 'Software Engineering',
    email: 'mailto:hello@abdushakur.me',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Remote',
      addressCountry: 'Worldwide'
    }
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Abdushakur',
    alternateName: 'Abdushakur Portfolio',
    url: 'https://abdushakur.me',
    description: 'Personal portfolio and blog by Abdushakur - Web Developer and Designer',
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Person',
      name: 'Abdushakur'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://abdushakur.me/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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

