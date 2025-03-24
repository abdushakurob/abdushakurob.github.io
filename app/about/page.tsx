export default function About() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-primary mb-6">A little more about this site (and me).</h1>

      {/* Why This Site Exists */}
      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">Why This Site Exists</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        I used to overthink everything before I even started. Now, I just log the process (hopefully)  
        and make the public my <strong>accountability buddy</strong>.
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        Also, my current <strong>portfolio proof is “believe me, bro.”</strong>  
        Think of this site as my personal notebook that somehow <strong>escaped into the public.</strong>  
      </p>

      {/* How I Think */}
      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">How I Think</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        I believe in <strong>starting first, figuring things out later.</strong> No endless planning, no waiting for the perfect moment—just ship, break, fix, and repeat.  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        Simplicity beats complexity. Whether it’s design, code, or communication, I try to remove the unnecessary and focus on <strong>what actually matters.</strong>  
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mt-4">
        Also, I’m a strong believer in <strong>documentation over memory.</strong> That’s why this site exists—it helps me keep track of what I’ve learned, built, and broken.  
      </p>

      {/* What I Do */}
      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">What I Do</h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        My focus is split between <strong>web development</strong> and <strong>brand design</strong>—  
        two areas where <strong>function and aesthetics</strong> meet.  
      </p>

      {/* Skills */}
      <h2 className="text-2xl font-semibold text-secondary mt-10 mb-4">Skills & Tools</h2>
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Web Development</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>HTML, CSS, JavaScript, Python (Intermediate)</li>
            <li>React.js, Next.js, Tailwind, Bootstrap</li>
            <li>FastAPI (a little)</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary">Brand Visual Design</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>Paper & Pen (first step always)</li>
            <li>Adobe Illustrator</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary">Other Things I'm Exploring</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>Sui Move & Blockchain</li>
            <li>Web3 Concepts & Decentralized Systems</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
