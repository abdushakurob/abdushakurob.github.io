import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 sm:p-20">
      {/* Header Section */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Abdushakur Ob</h1>
        <p className="text-lg">Web Developer & Brand Designer</p>
      </header>

      {/* About Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p>
          I am a passionate web developer and brand designer with a keen eye
          for creating visually stunning and functional designs. I love
          exploring the intersection of technology and creativity.
        </p>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc list-inside">
          <li>Frontend Development: React, Next.js, Tailwind CSS</li>
          <li>Backend Development: Node.js, Express</li>
          <li>Brand Design: Adobe Illustrator, Figma</li>
        </ul>
      </section>

      {/* Portfolio Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-4 border rounded-lg bg-secondary">
            <h3 className="font-bold">Project 1</h3>
            <p>A web application built with React and Tailwind CSS.</p>
          </div>
          <div className="p-4 border rounded-lg bg-secondary">
            <h3 className="font-bold">Project 2</h3>
            <p>A branding project for a startup using Figma.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p>
          Feel free to reach out to me at{" "}
          <a
            href="mailto:abdushakur@example.com"
            className="text-primary underline"
          >
            abdushakur@example.com
          </a>
        </p>
      </section>
    </div>
  );
}
