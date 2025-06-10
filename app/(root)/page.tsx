import { Metadata } from "next";
import FeaturedProject from "@/components/featuredProject";
import Hero from "@/components/hero";
import LatestLog from "@/components/latestLog";
import Now from "@/components/now";

export const metadata: Metadata = {
  title: 'Abdushakur - Web Developer & Designer | Portfolio & Blog',
  description: 'Welcome to Abdushakur\'s portfolio and blog. Discover my latest projects, read insightful articles about web development, and follow my journey as a web developer and designer.',
  keywords: ['Abdushakur', 'Portfolio', 'Web Developer', 'Blog', 'Projects', 'React', 'Next.js', 'Frontend'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Abdushakur - Web Developer & Designer | Portfolio & Blog',
    description: 'Welcome to Abdushakur\'s portfolio and blog. Discover my latest projects, read insightful articles about web development, and follow my journey as a web developer and designer.',
    url: 'https://abdushakur.me',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdushakur - Web Developer & Designer | Portfolio & Blog',
    description: 'Welcome to Abdushakur\'s portfolio and blog. Discover my latest projects and articles.',
    images: ['/og-image.jpg'],
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Abdushakur - Home',
    description: 'Welcome to Abdushakur\'s portfolio and blog. Discover my latest projects, read insightful articles about web development, and follow my journey as a web developer and designer.',
    url: 'https://abdushakur.me',
    mainEntity: {
      '@type': 'Person',
      name: 'Abdushakur',
      jobTitle: 'Web Developer & Designer',
      url: 'https://abdushakur.me'
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [{
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://abdushakur.me'
      }]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-base-100 text-base-content p-4 sm:p-8 md:p-16 max-w-7xl mx-auto">
      {/* Header Section */}
      <Hero/>

    {/* <div className="grid md:grid-cols-2 gap-8"> */}
      {/* Latest Logs */}
      <LatestLog/>
      {/* Now Section */}
      <Now/>
    {/* Featured Projects */}
      <FeaturedProject/>
    </div>
    </>
  );
}