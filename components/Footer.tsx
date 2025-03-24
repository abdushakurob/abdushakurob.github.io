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
    <footer className="border-t border-gray-300 dark:border-gray-700 py-16 mt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8">
          {/* Contact section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">Wanna Say Hi?</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Have a random idea, a project, or just feel like saying something? Go for it!
            </p>
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg shadow-md hover:bg-green-500 transition"
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
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Navigation
              </h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link href="/writings" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Writings
                </Link>
                <Link href="/projects" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Projects
                </Link>
                <Link href="/now" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Now
                </Link>
                <Link href="/about" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Resources
              </h4>
              <nav className="flex flex-col space-y-3">
                <Link href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Uses
                </Link>
                <Link href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Bookmarks
                </Link>
                <Link href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Newsletter
                </Link>
                <Link href="#" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  RSS Feed
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {currentYear} Abdushakur. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 md:mt-0">
            Designed and built ... eventually.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
