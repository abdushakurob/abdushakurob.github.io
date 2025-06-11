import React from 'react';
import { ArrowRight } from 'lucide-react';
import Head from "next/head";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <section className="py-24 md:py-32 px-6 relative overflow-hidden font-display">
        {/* Gradient Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-300/10 via-accent-300/10 to-transparent -z-10" />

        {/* Floating Circles Decoration */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block animate-fade-in">
            <p className="text-lg font-medium text-primary-500 dark:text-accent-400">
              Hey there! I&apos;m
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 dark:from-primary-300 dark:to-accent-300">
              Abdushakur
            </span>
          </h1>

          <p className="text-xl text-text-base dark:text-surface-light leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Welcome to my little corner on the internet where I throw things—ideas, half-baked projects, weird thoughts, and whatever else I&apos;m figuring out. Some things will make sense, most won&apos;t. Either way, you&apos;re free to look around.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/projects"
              className="px-6 py-3 text-lg font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Stuff I&apos;ve Built
            </Link>

            <Link
              href="/about"
              className="px-6 py-3 text-lg font-medium text-primary-500 dark:text-accent-300 border-2 border-primary-500 dark:border-accent-300 rounded-lg hover:bg-surface-light/40 dark:hover:bg-primary-800/30 transform hover:scale-[1.02] transition-all"
            >
              What&apos;s This All About?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
