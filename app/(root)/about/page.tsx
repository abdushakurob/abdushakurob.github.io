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
          A Little More About This Site (and Me)
        </h1>
        <p className="text-xl text-primary-600/80 dark:text-accent-200 max-w-2xl mx-auto">
          Part portfolio, part experiment, and part personal notebook that somehow ended up online.
        </p>
      </div>

      {/* About Content */}
      <div className="space-y-12">
        {/* Personal Philosophy */}
        <section className="prose prose-lg max-w-none dark:prose-invert
          prose-headings:text-primary-600 dark:prose-headings:text-accent-300
          prose-p:text-primary-500 dark:prose-p:text-accent-200/90
          prose-a:text-accent-600 dark:prose-a:text-accent-300 hover:prose-a:text-accent-700 dark:hover:prose-a:text-accent-200
          prose-strong:text-primary-600 dark:prose-strong:text-accent-300">
          <h2>Why This Site Exists</h2>
          <p>
            I used to overthink everything before I even started. Now, I just log the process and let
            the public hold me accountable. I start things before I feel ready—because if I wait for
            the perfect moment, it never happens. So I build, break things, fix them, and learn along
            the way.
          </p>
          <p>
            I like keeping things simple—whether it's design, code, or problem-solving. Less noise,
            fewer distractions, just what's necessary. Also, I write things down because I forget.
            That's basically what this site is.
          </p>
        </section>

        {/* Professional Focus */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            What I Do
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-primary-500 dark:text-accent-200/90">
              Most of my time is split between web development and brand design—figuring out how
              things work and how they should look. I specialize in building modern web applications,
              but I also explore Web3, automation, and random stuff that catches my interest.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            Skills & Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Web Development */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary-500 dark:text-accent-200">
                Web Development
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Python', 'FastAPI'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Design */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary-500 dark:text-accent-200">
                Brand Visual Design
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Adobe Illustrator', 'Paper & Pen', 'UI/UX'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-rich-400 text-primary-600 dark:text-accent-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Exploring */}
            <div className="space-y-4">
              <h3 className="font-semibold text-primary-500 dark:text-accent-200">
                Currently Exploring
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Sui Move', 'Web3', 'Blockchain', 'AI Tools', 'Automation'].map((skill) => (
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

        {/* Personal Touch */}
        <section className="prose prose-lg max-w-none dark:prose-invert mt-8">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            A Bit More About Me
          </h2>
          <p className="text-primary-500 dark:text-accent-200/90">
            Outside of work, I'm usually learning something, figuring things out, or just getting
            lost in a random idea. I like deep conversations about tech, design, and problem-solving,
            but I also think most things are better when you don't take them too seriously.
          </p>
        </section>

        {/* Get in Touch */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-accent-300">
            Let&apos;s Connect
          </h2>
          <p className="text-primary-500 dark:text-accent-200/90 max-w-2xl mx-auto">
            Always up for interesting conversations and collaborations. Whether you want to discuss
            a project, share ideas, or just say hi—feel free to reach out.
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
