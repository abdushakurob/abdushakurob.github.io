import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About | Abdushakur - Full Stack Developer',
  description: 'Learn more about my journey, skills, and experience as a Full Stack Developer. Discover my approach to web development and technology.',
  keywords: ['About', 'Full Stack Developer', 'Web Development', 'Skills', 'Experience'],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About | Abdushakur - Full Stack Developer',
    description: 'Learn more about my journey, skills, and experience as a Full Stack Developer.',
    url: 'https://abdushakur.me/about',
    type: 'website',
    images: ['/og-about.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-500 dark:text-accent-300 mb-4">
          About Me
        </h1>
        <p className="text-xl text-primary-600/80 dark:text-accent-200 max-w-2xl mx-auto">
          Full Stack Developer passionate about creating intuitive and impactful web experiences.
        </p>
      </div>

      {/* About Content */}
      <div className="space-y-12">
        {/* Professional Summary */}
        <section className="prose prose-lg max-w-none dark:prose-invert
          prose-headings:text-primary-600 dark:prose-headings:text-accent-300
          prose-p:text-primary-500 dark:prose-p:text-accent-200/90
          prose-a:text-accent-600 dark:prose-a:text-accent-300 hover:prose-a:text-accent-700 dark:hover:prose-a:text-accent-200
          prose-strong:text-primary-600 dark:prose-strong:text-accent-300">
          <p>
            I specialize in building modern web applications using React, Next.js, and TypeScript.
            With a strong foundation in both frontend and backend development, I create scalable
            solutions that prioritize user experience and performance.
          </p>
        </section>

        {/* Skills Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Frontend */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary-500 dark:text-accent-200">
                Frontend Development
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary-500 dark:text-accent-200">
                Backend Development
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'Express', 'MongoDB', 'PostgreSQL'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            Experience
          </h2>
          <div className="space-y-8">
            <div className="p-6 bg-surface-light dark:bg-rich-500 rounded-xl border border-primary-200 dark:border-primary-700">
              <h3 className="text-xl font-semibold text-primary-600 dark:text-accent-300 mb-2">
                Full Stack Developer
              </h3>
              <p className="text-primary-500 dark:text-accent-200/90 mb-4">
                Working on various web development projects, focusing on creating performant and
                accessible applications using modern technologies.
              </p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'Node.js', 'TypeScript'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Get in Touch */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            Let&apos;s Connect
          </h2>
          <p className="text-primary-500 dark:text-accent-200/90 max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and collaborations. Feel free to reach out
            if you&apos;d like to discuss a project or just want to connect.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="mailto:contact@abdushakur.me"
              className="inline-flex items-center px-6 py-3 text-lg font-medium bg-accent-500 hover:bg-accent-600 dark:bg-accent-600 dark:hover:bg-accent-500 text-white rounded-lg transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 text-lg font-medium border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-accent-300 hover:bg-primary-50 dark:hover:bg-rich-400 rounded-lg transition-colors"
            >
              View Projects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
