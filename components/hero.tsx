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

      <section className="relative overflow-hidden py-24 md:py-32 px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        {/* Background gradients and floating orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-6 font-sans">
          <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400 animate-fade-in">
            Hey there! I&apos;m
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Abdushakur
            </span>
          </h1>

          <p className="text-xl text-gray-800 dark:text-gray-300 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Welcome to my little corner of the internet where I throw things—ideas, half-baked projects, weird thoughts, and whatever else I&apos;m figuring out. Some things will make sense, most won&apos;t. Either way, feel free to look around.
          </p>

          <div className="flex justify-center flex-wrap gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md hover:brightness-110 transform hover:scale-105 transition-all"
            >
              Stuff I&apos;ve Built
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-600 dark:border-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transform hover:scale-105 transition-all"
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
