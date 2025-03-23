import React from 'react';
import { ArrowRight } from 'lucide-react';
import Head from "next/head";

const Hero: React.FC = () => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent -z-10"></div>
        
        {/* Floating circles decoration */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-green-600/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block animate-fade-in">
            {/* <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-600/10 text-accent">
              Hey there! I&apos;m
            </span> */}
            <p className="text-lg font-medium text-green-500 dark:text-green-400">
            Hey there! I&apos;m
          </p>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight md:leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
              Abdushakur
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Welcome to my little corner on the internet where I throw things—ideas, half-baked prjects, weird thoughts, and whatever else I&apos;m figuring out. Some things will make sense, most won&apos;t. Either way, you&apos;re free to look around.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a
              href="#projects"
              className="px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-600/90 transition"
            >
              Stuff I&apos;ve Built
            </a>
            <a
              href="#about"
              className="px-6 py-3 text-lg font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-600/10 transition"
            >
              Who Am I Again?
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
