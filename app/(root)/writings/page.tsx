import { Metadata } from 'next';
import WritingList from './writing-list';

export const metadata: Metadata = {
  title: 'Blog | Abdushakur - Web Development Articles & Insights',
  description: 'Read my latest articles, tutorials, and thoughts on web development, design, technology, and the developer journey. Learn about React, Next.js, TypeScript, and modern web development practices.',
  keywords: ['Blog', 'Articles', 'Web Development', 'Tutorials', 'React', 'Next.js', 'TypeScript', 'Programming'],
  alternates: {
    canonical: '/writings',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: 'Blog | Abdushakur - Web Development Articles & Insights',
    description: 'Read my latest articles, tutorials, and thoughts on web development, design, and technology.',
    url: 'https://abdushakur.me/writings',
    type: 'website',
    images: ['/og-blog.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Abdushakur',
    description: 'Articles, tutorials, and thoughts on web development and technology.',
    images: ['/og-blog.jpg'],
  },
};

export default function WritingsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Abdushakur\'s Blog',
    description: 'Articles, tutorials, and thoughts on web development, design, and technology.',
    url: 'https://abdushakur.me/writings',
    author: {
      '@type': 'Person',
      name: 'Abdushakur',
      url: 'https://abdushakur.me'
    },
    publisher: {
      '@type': 'Person',
      name: 'Abdushakur',
      url: 'https://abdushakur.me'
    },
    inLanguage: 'en-US',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://abdushakur.me'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://abdushakur.me/writings'
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WritingList />
    </>
  );
}
