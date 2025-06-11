import { Metadata } from "next";
import FeaturedProject from "@/components/featuredProject";
import Hero from "@/components/hero";
import LatestLog from "@/components/latestLog";
import Now from "@/components/now";

export const metadata: Metadata = {
  title: 'Abdushakur | Web Developer',
  description: 'I build modern, responsive web applications. Explore my featured projects, writings, and design work — let\'s create something amazing together.',
  keywords: ['Web Developer', 'Full Stack Developer', 'JavaScript', 'TypeScript', 'Web Applications', 'Portfolio'],
  alternates: {
    canonical: 'https://abdushakur.me/',
  },
  openGraph: {
    title: 'Abdushakur | Web Developer',
    description: 'I build modern, responsive web applications. Explore my featured projects, writings, and design work.',
    url: 'https://abdushakur.me/',
    type: 'website',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Abdushakur - Web Developer'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdushakur | Web Developer',
    description: 'I build modern, responsive web applications. Explore my featured projects and writings.',
    creator: '@abdushakurob',
    images: ['/og-preview.png'],
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Abdushakur | Web Developer',
    description: 'I build modern, responsive web applications. Explore my featured projects, writings, and design work — let\'s create something amazing together.',
    url: 'https://abdushakur.me/',
    mainEntity: {
      '@type': 'Person',
      name: 'Abdushakur',
      jobTitle: 'Web Developer',
      url: 'https://abdushakur.me/',
      sameAs: [
        'https://twitter.com/abdushakurob',
        'https://github.com/abdushakurob',
        'https://linkedin.com/in/abdushakurob'
      ],
      image: 'https://abdushakur.me/avatar.jpg',
      description: 'Frontend developer specializing in crafting modern web experiences with React and Next.js',
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance'
      },
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'UI Design', 'Web Development', 'Frontend Architecture', 'Web Accessibility', 'Performance Optimization'],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Frontend Developer',
        occupationLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'Remote'
          }
        },
        skills: 'React, Next.js, TypeScript, UI/UX Design, Performance Optimization',
        responsibilities: 'Developing accessible web applications, creating UI components, optimizing web performance'
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [{
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://abdushakur.me/'
      }]
    },
    specialty: 'Frontend Development with React & Next.js',
    significantLink: [
      'https://abdushakur.me/projects',
      'https://abdushakur.me/writings',
      'https://abdushakur.me/about'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen text-base-content p-4 sm:p-8 md:p-16 max-w-7xl mx-auto">
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