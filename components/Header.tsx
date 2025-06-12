'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest("#mobile-menu") &&
          !(event.target as HTMLElement).closest("#mobile-menu-button")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      window.scrollTo(0, 0);
    }
  }, [mobileMenuOpen]);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const navItems = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'Writings', path: '/writings' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
  ], []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 px-6 py-4 mb-16 transition-all duration-300 w-full",
      isScrolled ? "bg-background/80 dark:bg-primary-900/80 backdrop-blur-md border-b dark:border-primary-800" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <span className="dark:text-accent-300 text-primary-600">A</span>
          <span className="text-foreground dark:text-surface-light">bdushakur</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className="text-sm font-medium text-foreground/80 dark:text-surface-light/80 hover:text-foreground dark:hover:text-surface-light transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent dark:bg-accent-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          id="mobile-menu-button"
          className="md:hidden text-foreground dark:text-surface-light p-2 rounded-lg hover:bg-surface-light/10 dark:hover:bg-primary-800/50 active:bg-surface-light/20 dark:active:bg-primary-800 transform active:scale-95 transition-all focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className="relative w-6 h-6 mb-3">
            <div className={cn(
              "absolute inset-0 transform transition-all duration-300 ease-in-out",
              mobileMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
            )}>
              <Menu size={24} />
            </div>
            <div className={cn(
              "absolute inset-0 transform transition-all duration-300 ease-in-out",
              mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
            )}>
              <X size={24} />
            </div>
          </div>
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div className={cn(
          "absolute inset-0 bg-background/80 dark:bg-primary-950/90 backdrop-blur-lg transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100" : "opacity-0"
        )}/>
        
        {/* Menu Container */}
        <div className={cn(
          "absolute inset-y-0 right-0 w-full max-w-sm bg-surface-light dark:bg-primary-900 shadow-2xl transform transition-transform duration-500 ease-out flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-primary-800">
            <h2 className="text-lg font-semibold text-foreground dark:text-surface-light">Menu</h2>
            <button 
              className="p-2 text-foreground dark:text-surface-light hover:bg-surface-light/10 dark:hover:bg-primary-800/50 rounded-lg transform active:scale-95 transition-all"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-6 py-8">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className="group relative py-3 text-lg font-medium text-foreground dark:text-surface-light"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="relative z-10 transform transition-transform duration-200 group-hover:translate-x-2">
                    {item.name}
                  </span>
                  <span className="absolute inset-0 rounded-lg bg-surface-light/0 dark:bg-primary-800/0 transform transition-all duration-200 group-hover:bg-surface-light/10 dark:group-hover:bg-primary-800/50"/>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
