'use client';

import { useEffect, useState } from 'react';

interface SEOMetrics {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  readingTime?: number;
  wordCount?: number;
  isIndexable: boolean;
}

export function useSEOMetrics(content?: string): SEOMetrics {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    title: '',
    description: '',
    keywords: [],
    url: '',
    isIndexable: true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(', ') || [];
      const url = window.location.href;
      const robotsMeta = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
      const isIndexable = !robotsMeta.includes('noindex');

      let readingTime = 0;
      let wordCount = 0;

      if (content) {
        const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        wordCount = text.split(/\s+/).length;
        readingTime = Math.ceil(wordCount / 200); // Average reading speed
      }

      setMetrics({
        title,
        description,
        keywords,
        url,
        readingTime,
        wordCount,
        isIndexable,
      });
    }
  }, [content]);

  return metrics;
}

export function useSEOValidation() {
  const [validation, setValidation] = useState({
    titleLength: 0,
    descriptionLength: 0,
    hasH1: false,
    hasMetaDescription: false,
    hasCanonical: false,
    hasOpenGraph: false,
    hasTwitterCard: false,
    hasStructuredData: false,
    isValid: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      const h1 = document.querySelector('h1');
      const canonical = document.querySelector('link[rel="canonical"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const structuredData = document.querySelector('script[type="application/ld+json"]');

      const titleLength = title.length;
      const descriptionLength = metaDescription?.getAttribute('content')?.length || 0;
      const hasH1 = !!h1;
      const hasMetaDescription = !!metaDescription;
      const hasCanonical = !!canonical;
      const hasOpenGraph = !!ogTitle;
      const hasTwitterCard = !!twitterCard;
      const hasStructuredData = !!structuredData;

      const isValid = 
        titleLength > 0 && titleLength <= 60 &&
        descriptionLength > 0 && descriptionLength <= 160 &&
        hasH1 &&
        hasMetaDescription &&
        hasCanonical &&
        hasOpenGraph &&
        hasStructuredData;

      setValidation({
        titleLength,
        descriptionLength,
        hasH1,
        hasMetaDescription,
        hasCanonical,
        hasOpenGraph,
        hasTwitterCard,
        hasStructuredData,
        isValid,
      });
    }
  }, []);

  return validation;
}

export function generateBreadcrumbMarkup(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://abdushakur.me${item.url}`,
    })),
  };
}

export function generateArticleMarkup(data: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  tags?: string[];
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    author: {
      '@type': 'Person',
      name: data.author,
      url: 'https://abdushakur.me',
    },
    publisher: {
      '@type': 'Person',
      name: data.author,
      url: 'https://abdushakur.me',
    },
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    url: data.url,
    mainEntityOfPage: data.url,
    ...(data.image && {
      image: {
        '@type': 'ImageObject',
        url: data.image,
        width: 1200,
        height: 630,
      },
    }),
    ...(data.tags && {
      keywords: data.tags.join(', '),
    }),
  };
}

export function generateWebPageMarkup(data: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.name,
    description: data.description,
    url: data.url,
    mainEntity: {
      '@type': 'Person',
      name: 'Abdushakur',
      url: 'https://abdushakur.me',
    },
    ...(data.breadcrumbs && {
      breadcrumb: generateBreadcrumbMarkup(data.breadcrumbs),
    }),
  };
}
