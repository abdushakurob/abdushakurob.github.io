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
  author = 'Abdul Shakur'
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
    name: 'Abdul Shakur - Website Sitemap',
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
