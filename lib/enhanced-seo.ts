import { Metadata } from 'next';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  canonical?: string;
  noIndex?: boolean;
  locale?: string;
  siteName?: string;
}

/**
 * Generate standardized SEO metadata for Next.js pages
 * @param {SeoProps} props - SEO properties
 * @returns {Metadata} - Next.js Metadata object
 */
export function generateMetadata({
  title = 'Abdushakur | Web Developer',
  description = 'Web developer specializing in building modern, accessible web applications. View my portfolio and latest projects.',
  keywords = ['Web Developer', 'Full Stack Developer', 'JavaScript', 'TypeScript'],
  image = '/og-preview.png',
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  canonical,
  noIndex = false,
  locale = 'en_US',
  siteName = 'Abdushakur',
}: SeoProps): Metadata {
  // Ensure title is not too long
  const finalTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Ensure description is not too long
  const finalDesc = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // Create the metadata object
  const metadata: Metadata = {
    title: finalTitle,
    description: finalDesc,
    keywords: keywords,
    authors: [{ name: 'Abdushakur', url: 'https://abdushakur.me' }],
    creator: 'Abdushakur',
    publisher: 'Abdushakur',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    alternates: {
      canonical: canonical || `https://abdushakur.me${url}`,
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: `https://abdushakur.me${url}`,
      siteName: siteName,
      locale: locale,
      type,
      images: [
        {
          url: image.startsWith('http') ? image : `https://abdushakur.me${image}`,
          width: 1200,
          height: 630,
          alt: `${title} | Abdushakur`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
      creator: '@abdushakurob',
      site: '@abdushakurob',
      images: [image.startsWith('http') ? image : `https://abdushakur.me${image}`],
    },
  };
  
  // Add article-specific metadata if type is 'article'
  if (type === 'article') {
    if (publishedTime) {
      // @ts-ignore - Type issues with Next.js metadata
      metadata.openGraph.publishedTime = publishedTime;
    }
    
    if (modifiedTime) {
      // @ts-ignore - Type issues with Next.js metadata
      metadata.openGraph.modifiedTime = modifiedTime;
    }
    
    if (tags && tags.length > 0) {
      // @ts-ignore - Type issues with Next.js metadata
      metadata.openGraph.tags = tags;
    }
  }
  
  return metadata;
}

/**
 * Generate schema.org JSON-LD data for a person
 * @param customData - Optional custom data to merge
 * @returns JSON-LD person object
 */
export function generatePersonSchema(customData = {}) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abdushakur',
    url: 'https://abdushakur.me',
    image: 'https://abdushakur.me/avatar.jpg',
    sameAs: [
      'https://twitter.com/abdushakurob',
      'https://github.com/abdushakurob',
      'https://linkedin.com/in/abdushakurob'
    ],    jobTitle: 'Web Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    description: 'Web Developer specializing in modern web applications and full stack development',
    knowsAbout: ['Web Development', 'Full Stack Development', 'JavaScript', 'TypeScript'],
    alumniOf: 'Software Engineering',
    email: 'mailto:hello@abdushakur.me',
  };
  
  // Merge with custom data
  return { ...baseSchema, ...customData };
}

/**
 * Generate schema.org JSON-LD data for a webpage
 * @param customData - Optional custom data to merge
 * @returns JSON-LD webpage object
 */
export function generateWebPageSchema(customData = {}) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Abdushakur | Web Developer',
    description: 'Web developer specializing in building modern, accessible web applications.',
    url: 'https://abdushakur.me/',
    mainEntity: generatePersonSchema(),
  };
  
  // Merge with custom data
  return { ...baseSchema, ...customData };
}

/**
 * Generate schema.org JSON-LD data for an article
 * @param article - Article data
 * @returns JSON-LD article object
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Abdushakur',
      url: 'https://abdushakur.me'
    },
    publisher: {
      '@type': 'Person',
      name: 'Abdushakur',
      logo: {
        '@type': 'ImageObject',
        url: 'https://abdushakur.me/avatar.jpg'
      }
    },
    url: article.url,
    mainEntityOfPage: article.url,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    keywords: article.tags ? article.tags.join(', ') : undefined
  };
}

/**
 * Generate breadcrumb schema markup
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
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
