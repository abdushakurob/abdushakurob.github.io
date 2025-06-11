'use client'
import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: <Github size={24} />, url: 'https://github.com/abdushakurOB' },
    { name: 'LinkedIn', icon: <Linkedin size={24} />, url: 'https://linkedin.com/in/abdushakurOB' },
    { name: 'Twitter', icon: <Twitter size={24} />, url: 'https://twitter.com/AbdushakurOB' },
    { name: 'Email', icon: <Mail size={24} />, url: 'mailto:me@abdushakur.me' },
  ];

  return (
    <footer className="border-t border-primary-200 dark:border-primary-700 py-16 mt-16 bg-surface-100 dark:bg-primary-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-8">
          {/* Contact section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary-600 dark:text-accent-300">Wanna Say Hi?</h3>
            <p className="text-primary-600 dark:text-accent-200 max-w-md">
              Have a random idea, a project, or just feel like saying something? Go for it!
            </p>
            <a
              href="mailto:me@abdushakur.me"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-500 hover:bg-primary-600 dark:bg-accent-500 dark:hover:bg-accent-600 rounded-lg shadow-md transition-all"
            >
              Reach Out
              <ArrowUpRight size={20} className="ml-2" />
            </a>

            <div className="flex space-x-5 mt-8">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-accent-200 hover:text-accent-500 dark:hover:text-accent-300 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-accent-300">
                Navigation
              </h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-sm text-primary-500 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-colors">
                  Home
                </Link>
                <Link href="/writings" className="text-sm text-primary-500 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-colors">
                  Writings
                </Link>
                <Link href="/projects" className="text-sm text-primary-500 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-colors">
                  Projects
                </Link>
                <Link href="/build" className="text-sm text-primary-500 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-colors">
                  Build in Public
                </Link>
                <Link href="/about" className="text-sm text-primary-500 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-colors">
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-200 dark:border-primary-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-500 dark:text-accent-200">
            © {currentYear} Abdushakur. All rights reserved.
          </p>
          <p className="text-sm text-primary-500 dark:text-accent-200 mt-2 md:mt-0">
            Designed and built ... eventually.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
