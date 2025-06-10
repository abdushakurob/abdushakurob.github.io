import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://abdushakur.me'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/projects',
          '/writings',
          '/build',
          '/feed.xml'
        ],
        disallow: [
          '/admin',
          '/api',
          '/admin/*',
          '/api/*',
          '*/preview',
          '*/drafts',
          '/private/*',
          '/*.json',  // Prevent crawling of JSON data files
          '/*?*',     // Prevent crawling of query parameters
        ],
      },
      // Specific directives for Googlebot
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
        ],
      },
      // Specific directives for Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
        ],
      },
      // Block AI crawlers
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
