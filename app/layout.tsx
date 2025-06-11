import type { Metadata } from 'next';
import React, { useEffect } from 'react';
import './globals.css';
import { satoshi, plusJakarta, jetbrainsMono } from './fonts';
import { createStaticSitemapData } from '@/lib/utils';
import PlausibleAnalytics from '@/components/PlausibleAnalytics';

export const metadata: Metadata = {
  title: {
    default: 'Abdushakur | Web Developer',
    template: '%s | Abdushakur'
  },
  description: 'Web developer specializing in building modern, accessible web applications. View my portfolio and latest projects.',
  keywords: ['Web Developer', 'Full Stack Developer', 'JavaScript', 'TypeScript', 'Portfolio'],
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
    title: 'Abdushakur | Web Developer',
    description: 'Web developer specializing in building modern, accessible web applications. Explore my projects, read my blog posts about web development, and follow my journey in building digital solutions.',
    url: 'https://abdushakur.me',
    siteName: 'Abdushakur',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Abdushakur - Frontend Developer & UI Designer Portfolio',
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
    title: 'Abdushakur | Web Developer',
    description: 'Web developer specializing in building modern, accessible web applications.',
    creator: '@abdushakurob',
    site: '@abdushakurob',
    images: ['/og-preview.png'],
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
    jobTitle: 'Web Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    description: 'Web Developer specializing in modern web applications and full stack development',
    knowsAbout: ['Web Development', 'Full Stack Development', 'JavaScript', 'TypeScript'],
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
    description: 'Personal portfolio and blog by Abdushakur - Web Developer',
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
    },
    about: {
      '@type': 'Thing',
      name: 'Web Development',
      description: 'Professional web development services'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Tech Companies, Startups, Businesses'
    },
    keywords: 'Web development, JavaScript, TypeScript, portfolio'
  };

  const sitemapData = createStaticSitemapData();
  // _app.tsx or layout.tsx
useEffect(() => {
  document.documentElement.setAttribute('data-theme', 'light'); // or 'dark'
}, []);


  return (
    <html 
      lang="en" 
      className={`${satoshi.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#18181b" />
        <meta name="color-scheme" content="light" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#18181b" />
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
      <body className="font-satoshi antialiased">
        {children}
        {/* Privacy-friendly analytics */}
        {process.env.NODE_ENV === 'production' && 
          <PlausibleAnalytics domain="abdushakur.me" trackOutboundLinks={true} />
        }
      </body>
    </html>
  );
}

