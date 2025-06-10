/**
 * Central SEO configuration for abdushakur.me
 * This file contains common SEO settings to maintain consistency across the site
 */

export const SeoConfig = {
  // Basic site information
  siteName: 'Abdushakur',
  siteUrl: 'https://abdushakur.me',
  
  // Default metadata
  defaults: {
    title: 'Abdushakur | Web Developer',
    description: 'Web developer specializing in building modern, accessible web applications. View my portfolio and latest projects.',
    keywords: ['Web Developer', 'Full Stack Developer', 'JavaScript', 'TypeScript', 'Web Applications', 'Portfolio'],
    ogImage: '/og-preview.png',
    twitterHandle: '@abdushakurob',
  },
  
  // Social profiles
  socialProfiles: {
    twitter: 'https://twitter.com/abdushakurob',
    github: 'https://github.com/abdushakurob',
    linkedin: 'https://linkedin.com/in/abdushakurob',
  },
  
  // Structured data common properties
  structuredData: {
    person: {
      name: 'Abdushakur',
      jobTitle: 'Web Developer',
      image: 'https://abdushakur.me/avatar.jpg',
      description: 'Web Developer specializing in modern web applications and full stack development',
    },
    website: {
      name: 'Abdushakur',
      alternateName: 'Abdushakur Portfolio',
      description: 'Personal portfolio and blog by Abdushakur - Web Developer',
      inLanguage: 'en-US',
    }
  },
  
  // Main navigation sections for sitemap and breadcrumbs
  mainSections: [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Writings', path: '/writings' },
    { name: 'Build', path: '/build' },
  ],
  
  // Open Graph defaults
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Abdushakur',
  },
  
  // Twitter card defaults
  twitter: {
    cardType: 'summary_large_image',
    site: '@abdushakurob',
  },
  
  // Analytics configuration
  analytics: {
    plausible: {
      domain: 'abdushakur.me',
      trackOutboundLinks: true,
    },
  }
};

/**
 * Generate page title with consistent formatting
 * @param title - Page-specific title
 * @returns Formatted title string
 */
export function formatPageTitle(title?: string): string {
  if (!title) return SeoConfig.defaults.title;
  if (title.includes('Abdushakur')) return title;
  
  return `${title} | Abdushakur`;
}

/**
 * Generate consistent canonicalUrl 
 * @param path - Path segment (without domain)
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const basePath = path.startsWith('/') ? path : `/${path}`;
  return `${SeoConfig.siteUrl}${basePath}`;
}

/**
 * Generate Open Graph image URL
 * @param imagePath - Optional specific image path 
 * @returns Full OG image URL
 */
export function getOgImageUrl(imagePath?: string): string {
  if (!imagePath) return `${SeoConfig.siteUrl}${SeoConfig.defaults.ogImage}`;
  if (imagePath.startsWith('http')) return imagePath;
  return `${SeoConfig.siteUrl}${imagePath}`;
}

/**
 * Format page meta description to proper length 
 * @param description - Original description
 * @returns Trimmed description within limits
 */
export function formatDescription(description?: string): string {
  if (!description) return SeoConfig.defaults.description;
  if (description.length <= 160) return description;
  
  // Trim to 157 chars and add ellipsis
  return `${description.substring(0, 157)}...`;
}
