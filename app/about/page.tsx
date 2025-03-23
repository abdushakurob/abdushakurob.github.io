import React from 'react'

function About() {
  return (
    <div>
        {/* About Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Who I am</h2>
        <p>
        I dont really know how to introduce myself properly, but here’s my attempt: I’m Abdushakur. I love tech, design, and just figuring things out. Instead of keeping everything in my head, I document it here.
        </p>
      </section>

{/* Why it exist */}
        <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">Why this site exists</h2>
            <p>
            I used to overthink everything before I even started. Now, I just log the process—whether its designing a brand, fixing a stubborn API bug, or random thoughts on tech. Think of this site as my personal notebook that happens to be public.
            </p>
            </section>
       {/* Skills Section */}
       <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc list-inside">
          {/* <li>For Design: Sketching, Illustrator, CorelDraw</li> */}
          <li>For Web Dev: Next.js, Tailwind, Node.js</li>
          <li>Brand Design: Adobe Illustrator, Figma</li>
          <li>For Web3: Sui Move, Web3.js</li>
        </ul>
      </section>

      Email: me@abdushakur.me | @abdushakurOB
    </div>
  )
}

export default About