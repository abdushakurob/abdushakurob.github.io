export default function About() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <h1 className="text-4xl mt-4 font-bold text-green-600 mb-6">A Little More About This Site (and Me).</h1>

      {/* Why This Site Exists */}
      <h2 className="text-2xl font-semibold text-blue-500 mt-10 mb-4">Why This Site Exists</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        I used to overthink everything before I even started. Now, I just log the process (hopefully)  
        and let the public hold me accountable.  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        Right now, my portfolio is basically &quot;believe me, bro.&quot; So this site is part work,  
        part experiment, and part personal notebook that somehow ended up online.  
      </p>

      {/* How I Work */}
      <h2 className="text-2xl font-semibold text-blue-500 mt-10 mb-4">How I Work</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        I start things before I feel ready. If I wait for the perfect moment, it never happens.  
        So I build, break things, fix them, and learn along the way.  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        I like keeping things simple—whether it&apos;s design, code, or problem-solving.  
        Less noise, fewer distractions, just what&apos;s necessary.  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        Also, I write things down because I forget. That&apos;s basically what this site is.  
      </p>

      {/* What I Do */}
      <h2 className="text-2xl font-semibold text-blue-500 mt-10 mb-4">What I Do</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        Most of my time is split between web development and brand design—figuring out  
        how things work and how they should look.  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        But I also explore Web3, automation, and random stuff that catches my interest.  
      </p>

      {/* Skills */}
      <h2 className="text-2xl font-semibold text-blue-500 mt-10 mb-4">Skills &amp; Tools</h2>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div>
          <h3 className="text-lg font-semibold text-green-600">Web Development</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>HTML, CSS, JavaScript, Python (Intermediate)</li>
            <li>React.js, Next.js, Node.js/Express.js, Tailwind, Bootstrap, MongoDB</li>
            <li>FastAPI (a little)</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-600">Brand Visual Design</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>Paper &amp; Pen (first step always)</li>
            <li>Adobe Illustrator</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-600">Other Things I&apos;m Exploring</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>Sui Move &amp; Blockchain</li>
            <li>Web3 Concepts &amp; Decentralized Systems</li>
            <li>APIs, Automation &amp; AI Tools</li>
          </ul>
        </div>
      </div>

      {/* A Bit More About Me */}
      <h2 className="text-2xl font-semibold text-blue-500 mt-10 mb-4">A Bit More About Me</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        Outside of work, I&apos;m usually learning something, figuring things out,  
        or just getting lost in a random idea.  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        I like deep conversations about tech, design, and problem-solving,  
        but I also think most things are better when you don&apos;t take them too seriously.  
      </p>
    </div>
  );
}
