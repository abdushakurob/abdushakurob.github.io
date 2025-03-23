'use client'
import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { CustomButton } from './ui/customButton';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com/yourusername' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/yourusername' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: 'https://twitter.com/yourusername' },
    { name: 'Email', icon: <Mail size={20} />, url: 'mailto:your.email@example.com' }
  ];

  return (
    <footer className="border-t border-border/40 py-16 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8">
          {/* Contact section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Get in touch</h3>
            <p className="text-muted-foreground max-w-md">
              Have a project in mind or just want to chat? Feel free to reach out!
            </p>
            <CustomButton 
              variant="primary" 
              size="md"
              icon={<ArrowUpRight size={18} />}
              iconPosition="right"
              onClick={() => window.location.href = 'mailto:your.email@example.com'}
            >
              Contact me
            </CustomButton>
            
            <div className="flex space-x-5 mt-8">
              {socialLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-accent transition-colors hover-lift"
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Navigation</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-sm hover:text-accent transition-colors">Home</Link>
                <Link href="/writings" className="text-sm hover:text-accent transition-colors">Writings</Link>
                <Link href="/projects" className="text-sm hover:text-accent transition-colors">Projects</Link>
                <Link href="/now" className="text-sm hover:text-accent transition-colors">Now</Link>
                <Link href="/about" className="text-sm hover:text-accent transition-colors">About</Link>
              </nav>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resources</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="#" className="text-sm hover:text-accent transition-colors">Uses</Link>
                <Link href="#" className="text-sm hover:text-accent transition-colors">Bookmarks</Link>
                <Link href="#" className="text-sm hover:text-accent transition-colors">Newsletter</Link>
                <Link href="#" className="text-sm hover:text-accent transition-colors">RSS Feed</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Abdushakur. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Designed and built with care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
