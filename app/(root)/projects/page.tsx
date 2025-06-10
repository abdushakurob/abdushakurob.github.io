import { Metadata } from 'next';
import ProjectList from './project-list';

export const metadata: Metadata = {
  title: 'Projects | Abdushakur - Web Development Portfolio',
  description: 'Explore my collection of web development projects, experiments, and creative works. From React applications to design prototypes, discover what I\'ve built, designed, and learned along the way.',
  keywords: ['Projects', 'Portfolio', 'Web Development', 'React', 'Next.js', 'JavaScript', 'TypeScript', 'UI/UX'],
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects | Abdushakur - Web Development Portfolio',
    description: 'Explore my collection of web development projects, experiments, and creative works.',
    url: 'https://abdushakur.me/projects',
    type: 'website',
    images: ['/og-projects.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Abdushakur',
    description: 'Explore my collection of web development projects and experiments.',
    images: ['/og-projects.jpg'],
  },
};

export default function ProjectsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects - Abdushakur',
    description: 'Explore my collection of web development projects, experiments, and creative works.',
    url: 'https://abdushakur.me/projects',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Abdushakur\'s Projects',
      description: 'A collection of web development projects and experiments'
    },
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
          name: 'Projects',
          item: 'https://abdushakur.me/projects'
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
      <ProjectList />
    </>
  );
}
