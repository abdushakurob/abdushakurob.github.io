'use client';

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  structuredData?: object;
  breadcrumbs?: Array<{ name: string; url: string }>;
  noIndex?: boolean;
  author?: string;
  canonicalUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  twitterSite?: string;
  ogLocale?: string;
  ogSiteName?: string;
}

export default function SEO({
  title,
  description,
  keywords = [],
  image = '/og-preview.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  structuredData,
  breadcrumbs = [],
  noIndex = false,
  author = 'Abdushakur',
  canonicalUrl,
  twitterCard = 'summary_large_image',
  twitterCreator = '@abdushakurob',
  twitterSite = '@abdushakurob',
  ogLocale = 'en_US',
  ogSiteName = 'Abdushakur',
}: SEOProps) {
  useEffect(() => {
    // Update document title if provided (keep it under 60 characters)
    if (title) {
      const finalTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
      document.title = finalTitle;
    }

    // Update meta description (keep it under 160 characters)
    if (description) {
      const finalDesc = description.length > 160 ? description.substring(0, 157) + '...' : description;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', finalDesc);
    }

    // Update keywords (avoid duplicate keywords)
    if (keywords.length > 0) {
      const uniqueKeywords = [...new Set(keywords)];
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', uniqueKeywords.join(', '));
    }

    // Update canonical URL - essential for SEO
    const finalUrl = canonicalUrl || (url ? `https://abdushakur.me${url}` : 'https://abdushakur.me');
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

    // Update robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute(
      'content',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    // Update Open Graph meta tags
    const baseURL = 'https://abdushakur.me';
    const ogTags = {
      'og:title': title || 'Abdushakur | Frontend Developer & UI Designer',
      'og:description': description || 'Creative frontend developer crafting modern web experiences with React & Next.js',
      'og:image': image ? (image.startsWith('http') ? image : `${baseURL}${image}`) : `${baseURL}/og-preview.png`,
      'og:url': url ? `${baseURL}${url}` : baseURL,
      'og:type': type,
      'og:site_name': ogSiteName,
      'og:locale': ogLocale,
    };
    
    if (publishedTime) {
      ogTags['article:published_time'] = publishedTime;
    }
    
    if (modifiedTime) {
      ogTags['article:modified_time'] = modifiedTime;
    }
    
    if (tags.length > 0) {
      ogTags['article:tag'] = tags.join(',');
    }
    
    if (author) {
      ogTags['article:author'] = author;
    }
    
    // Apply OG tags
    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content as string);
    });
    
    // Update Twitter Card meta tags
    const twitterTags = {
      'twitter:card': twitterCard,
      'twitter:site': twitterSite,
      'twitter:creator': twitterCreator,
      'twitter:title': title || 'Abdushakur | Frontend Developer & UI Designer',
      'twitter:description': description || 'Creative frontend developer crafting modern web experiences with React & Next.js',
      'twitter:image': image ? (image.startsWith('http') ? image : `${baseURL}${image}`) : `${baseURL}/og-preview.png`,
    };
    
    // Apply Twitter tags
    Object.entries(twitterTags).forEach(([name, content]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content as string);
    });

    // Add structured data
    const scripts = document.querySelectorAll('script[data-seo="dynamic"]');
    scripts.forEach(script => document.head.removeChild(script));
    
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      script.setAttribute('data-seo', 'dynamic');
      document.head.appendChild(script);
    }
    
    // Add default Person structured data if not provided
    if (!structuredData) {
      const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Abdushakur',
        'url': 'https://abdushakur.me',
        'image': 'https://abdushakur.me/avatar.jpg',
        'jobTitle': 'Frontend Developer & UI Designer',
        'sameAs': [
          'https://twitter.com/abdushakurob',
          'https://github.com/abdushakurob',
          'https://linkedin.com/in/abdushakurob'
        ],
        'description': 'Frontend developer specializing in crafting modern web experiences with React, Next.js, and TypeScript'
      };
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(personSchema);
      script.setAttribute('data-seo', 'dynamic');
      document.head.appendChild(script);
    }

    // Return cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[data-seo="dynamic"]');
      scripts.forEach(script => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      });
    };
  }, [
    title, 
    description, 
    keywords, 
    url, 
    image, 
    type, 
    publishedTime, 
    modifiedTime, 
    tags, 
    structuredData, 
    breadcrumbs, 
    noIndex, 
    author,
    canonicalUrl,
    twitterCard,
    twitterCreator,
    twitterSite,
    ogLocale,
    ogSiteName
  ]);

  // Generate breadcrumb structured data
  const breadcrumbData = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `https://abdushakur.me${breadcrumb.url}`,
    })),
  } : null;

  return (
    <>
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
      )}
    </>
  );
}