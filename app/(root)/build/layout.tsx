import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build | Abdushakur - Development Journey & Progress',
  description: 'Follow my development journey and progress on various tracks. See what I\'m currently building, learning, and experimenting with in real-time.',
  keywords: ['Build', 'Development Journey', 'Progress', 'Learning', 'Tracks', 'Work in Progress'],
  alternates: {
    canonical: '/build',
  },
  openGraph: {
    title: 'Build | Abdushakur - Development Journey & Progress',
    description: 'Follow my development journey and progress on various tracks.',
    url: 'https://abdushakur.me/build',
    type: 'website',
    images: ['/og-build.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build | Abdushakur',
    description: 'Follow my development journey and progress on various tracks.',
    images: ['/og-build.jpg'],
  },
};

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Build - Abdushakur',
    description: 'Follow my development journey and progress on various tracks.',
    url: 'https://abdushakur.me/build',
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
          name: 'Build',
          item: 'https://abdushakur.me/build'
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
      {children}
    </>
  );
}
