import { Metadata } from 'next';
import Link from 'next/link';

// import { Metadata } from 'next';
// import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Abdushakur',
  description: "The page you are looking for does not exist. Explore other pages on Abdushakur's website including projects, blog posts, and more.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
    url: 'https://abdushakur.me/404',
    mainEntity: {
      '@type': 'Person',
      name: 'Abdushakur',
      url: 'https://abdushakur.me'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-base-100 text-base-content flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full bg-primary text-primary-content py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/projects"
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center"
              >
                View Projects
              </Link>
              <Link 
                href="/writings"
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
