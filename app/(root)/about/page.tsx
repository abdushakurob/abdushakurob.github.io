import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Abdushakur - Web Developer & Designer',
  description: 'Learn more about Abdushakur, a passionate web developer and designer. Discover my journey, work philosophy, and approach to creating digital solutions.',
  keywords: ['About', 'Abdushakur', 'Web Developer', 'Designer', 'Biography', 'Background'],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About | Abdushakur - Web Developer & Designer',
    description: 'Learn more about Abdushakur, a passionate web developer and designer.',
    url: 'https://abdushakur.me/about',
    type: 'profile',
    images: ['/og-about.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Abdushakur',
    description: 'Learn more about Abdushakur, web developer and designer.',
    images: ['/og-about.jpg'],
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-parchment-500 dark:bg-midnight-green-500 text-midnight-green-500 dark:text-parchment-500 px-6 sm:px-12 md:px-24 py-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <h1 className="text-4xl mt-4 font-bold text-sea-green-500 dark:text-sea-green-400 mb-6">
        A Little More About This Site (and Me).
      </h1>

      {/* Why This Site Exists */}
      <h2 className="text-2xl font-semibold text-midnight-green-500 dark:text-parchment-500 mt-10 mb-4">Why This Site Exists</h2>
      <p className="text-lg text-midnight-green-400 dark:text-tea-green-400 leading-relaxed">
        I used to overthink everything before I even started. Now, I just log the process (hopefully)  
        and let the public hold me accountable.  
      </p>
      <p className="text-lg text-midnight-green-400 dark:text-tea-green-400 leading-relaxed mt-4">
        Right now, my portfolio is basically &quot;believe me, bro.&quot; So this site is part work,  
        part experiment, and part personal notebook that somehow ended up online.  
      </p>

      {/* How I Work */}
      <h2 className="text-2xl font-semibold text-midnight-green-500 dark:text-parchment-500 mt-10 mb-4">How I Work</h2>
      <p className="text-lg text-midnight-green-400 dark:text-tea-green-400 leading-relaxed">
        I start things before I feel ready. If I wait for the perfect moment, it never happens.  
        So I build, break things, fix them, and learn along the way.  
      </p>
      <p className="text-lg text-midnight-green-400 dark:text-tea-green-400 leading-relaxed mt-4">
        I like keeping things simple—whether it&apos;s design, code, or problem-solving.  
        Less noise, fewer distractions, just what&apos;s necessary.
      </p>

      {/* Stack & Tools */}
      <h2 className="text-2xl font-semibold text-midnight-green-500 dark:text-parchment-500 mt-10 mb-6">Stack & Tools</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-sea-green-500 dark:text-sea-green-400">For Building Stuff</h3>
          <ul className="list-disc pl-5 text-midnight-green-400 dark:text-tea-green-400 space-y-2 mt-2">
            <li>HTML, CSS, JavaScript, Python (Intermediate)</li>
            <li>React.js, Next.js, Node.js/Express.js, Tailwind, Bootstrap, MongoDB</li>
            <li>FastAPI (a little)</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sea-green-500 dark:text-sea-green-400">Brand Visual Design</h3>
          <ul className="list-disc pl-5 text-midnight-green-400 dark:text-tea-green-400 space-y-2 mt-2">
            <li>Paper &amp; Pen (first step always)</li>
            <li>Adobe Illustrator</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-sea-green-500 dark:text-sea-green-400">Other Things I&apos;m Exploring</h3>
          <ul className="list-disc pl-5 text-midnight-green-400 dark:text-tea-green-400 space-y-2 mt-2">
            <li>Sui Move &amp; Blockchain</li>
            <li>Web3 Concepts &amp; Decentralized Systems</li>
            <li>Machine Learning &amp; AI</li>
          </ul>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-12 p-6 bg-parchment-600 dark:bg-midnight-green-400 rounded-lg border border-tea-green-300 dark:border-midnight-green-300">
        <h2 className="text-xl font-semibold text-midnight-green-500 dark:text-parchment-500 mb-4">Want to Chat?</h2>
        <p className="text-midnight-green-400 dark:text-tea-green-400">
          Got a project idea or just want to say hi? Feel free to reach out through {' '}
          <a 
            href="mailto:me@abdushakur.me" 
            className="text-sea-green-500 dark:text-sea-green-400 hover:underline"
          >
            email
          </a>
          {' '} or {' '}
          <a 
            href="https://twitter.com/abdushakurob" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sea-green-500 dark:text-sea-green-400 hover:underline"
          >
            Twitter
          </a>.
        </p>
      </div>
    </div>
  );
}
