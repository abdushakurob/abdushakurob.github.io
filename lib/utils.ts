import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface StructuredDataProps {
  type: 'BlogPosting' | 'Article' | 'Project';
  title: string;
  description: string;
  coverImage?: string;
  datePublished: string;
  dateModified: string;
  slug: string;
  tags?: string[];
  author?: string;
}

export function generateStructuredData({
  type,
  title,
  description,
  coverImage,
  datePublished,
  dateModified,
  slug,
  tags = [],
  author = 'Abdushakur'
}: StructuredDataProps) {
  const baseUrl = 'https://abdushakur.me';
  const url = `${baseUrl}/${type === 'BlogPosting' ? 'writings' : 'projects'}/${slug}`;

  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
      url: baseUrl
    },
    datePublished,
    dateModified,
    url,
    ...(coverImage && {
      image: {
        '@type': 'ImageObject',
        url: coverImage
      }
    }),
    keywords: tags.join(', '),
    publisher: {
      '@type': 'Person',
      name: author,
      url: baseUrl
    }
  };

  if (type === 'Project') {
    return {
      ...baseData,
      '@type': 'CreativeWork',
      genre: 'Software Development'
    };
  }

  return baseData;
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://abdushakur.me${item.item}`
    }))
  };
}

interface SitemapPage {
  name: string;
  url: string;
  lastModified?: string;
}

export function generateSitemapData(pages: SitemapPage[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description: 'Site Navigation',
    name: 'Abdushakur - Website Sitemap',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: pages.length,
    itemListElement: pages.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.name,
      url: `https://abdushakur.me${page.url}`,
      ...(page.lastModified && {
        dateModified: page.lastModified
      })
    }))
  };
}

// Utility for creating sitemap entries with static lastModified dates
export function createStaticSitemapData() {
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: 'Blog', url: '/writings' },
    { name: 'About', url: '/about' },
    { name: 'Build', url: '/build' }
  ];

  return generateSitemapData(pages);
}

// SEO utility functions
export function generatePageTitle(title: string, siteName = 'Abdushakur'): string {
  return title === siteName ? title : `${title} | ${siteName}`;
}

export function truncateText(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function extractTextFromHTML(html: string): string {
  // Remove HTML tags and extract plain text
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function generateKeywords(tags: string[] = [], additionalKeywords: string[] = []): string[] {
  const baseKeywords = ['Abdushakur', 'Web Developer', 'Designer'];
  return [...baseKeywords, ...tags, ...additionalKeywords];
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = extractTextFromHTML(content);
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function generateCanonicalUrl(path: string, baseUrl = 'https://abdushakur.me'): string {
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
}

export function generateOGImageUrl(title: string, type: 'blog' | 'project' | 'page' = 'page'): string {
  const encodedTitle = encodeURIComponent(title);
  return `/api/og?title=${encodedTitle}&type=${type}`;
}

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
}

export function generateComprehensiveMetadata(
  seoData: SEOData,
  path: string
): {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  openGraph: any;
  twitter: any;
  alternates: any;
} {
  const baseUrl = 'https://abdushakur.me';
  const canonical = generateCanonicalUrl(path, baseUrl);
  const ogImage = seoData.image || generateOGImageUrl(seoData.title);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords || generateKeywords(),
    canonical,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: canonical,
      type: seoData.type || 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ],
      siteName: 'Abdushakur',
      locale: 'en_US',
      ...(seoData.type === 'article' && {
        publishedTime: seoData.publishedTime,
        modifiedTime: seoData.modifiedTime,
        authors: ['Abdushakur'],
        tags: seoData.tags || [],
        section: seoData.section || 'Technology',
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: [ogImage],
      creator: '@abdushakurob',
      site: '@abdushakurob',
    },
    alternates: {
      canonical,
      types: {
        'application/rss+xml': '/feed.xml',
      },
    },
  };
}
