'use client';
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SocialIcons = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // Create intersection observer to detect when footer is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1 // Trigger when even 10% of footer is visible
      }
    );

    // Start observing the footer
    const footer = document.querySelector('footer');
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  return (
    <div className={`fixed hidden left-8 bottom-0 md:flex flex-col items-center gap-6 z-50 transition-opacity duration-300 ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
      {/* GitHub */}
      <Link href="https://github.com/AbdushakurOB" target="_blank" className="social-icon">
        <Github className="h-6 w-6 text-primary-600 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-all" />
      </Link>

      {/* Twitter */}
      <Link href="https://twitter.com/AbdushakurOB" target="_blank" className="social-icon">
        <Twitter className="h-6 w-6 text-primary-600 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-all" />
      </Link>

      {/* Linkedin */}
      <Link href="https://linkedin.com/in/AbdushakurOB" target="_blank" className="social-icon">
        <Linkedin className="h-6 w-6 text-primary-600 hover:text-accent-500 dark:text-accent-200 dark:hover:text-accent-300 transition-all" />
      </Link>

      <div className="w-px h-32 bg-primary-200 dark:bg-primary-700" />
    </div>
  );
};

export default SocialIcons;
