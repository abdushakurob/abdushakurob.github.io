'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface DocumentHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'profile' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'player' | 'app';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
  children?: React.ReactNode;
}

/**
 * Enhanced Head component with comprehensive SEO options
 */
export default function DocumentHead({
  title = 'Abdushakur | Web Developer',
  description = 'Web developer specializing in building modern, accessible web applications. View my portfolio and latest projects.',
  keywords = ['Web Developer', 'Full Stack Developer', 'JavaScript', 'TypeScript'],
  ogTitle,
  ogDescription,
  ogImage = '/og-preview.png',
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  noIndex = false,
  structuredData,
  children
}: DocumentHeadProps) {
  // Effect for dynamically injecting schema/structured data
  useEffect(() => {
    // Clean up any previously injected structured data
    const existingScripts = document.querySelectorAll('script[data-type="structured-data"]');
    existingScripts.forEach(script => document.head.removeChild(script));

    // Add structured data if provided
    if (structuredData) {
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      
      dataArray.forEach(data => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-type', 'structured-data');
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[data-type="structured-data"]');
      scripts.forEach(script => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      });
    };
  }, [structuredData]);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Robots Control */}
      <meta 
        name="robots" 
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} 
      />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `https://abdushakur.me${ogImage}`} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:site_name" content="Abdushakur" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@abdushakurob" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {(twitterImage || ogImage) && (
        <meta 
          name="twitter:image" 
          content={(twitterImage || ogImage).startsWith('http') 
            ? (twitterImage || ogImage)
            : `https://abdushakur.me${twitterImage || ogImage}`
          } 
        />
      )}

      {/* Additional head elements */}
      {children}
    </Head>
  );
}
