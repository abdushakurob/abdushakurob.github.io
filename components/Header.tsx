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

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 w-full",
      isScrolled ? "bg-tea-900/80 backdrop-blur-md border-b border-lapis-200/10 dark:bg-lapis-200/80 dark:border-tea-800/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <span className="text-emerald-DEFAULT dark:text-emerald-600">A</span>
          <span className="text-lapis-DEFAULT dark:text-tea-800">bdushakur</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className="text-sm font-medium text-lapis-400 hover:text-lapis-DEFAULT dark:text-tea-800 dark:hover:text-emerald-600 transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-DEFAULT dark:bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          id="mobile-menu-button"
          className="md:hidden text-lapis-DEFAULT dark:text-tea-800 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 flex flex-col items-center justify-center bg-tea-900/95 dark:bg-lapis-200/95 backdrop-blur-md transition-transform duration-300 md:hidden h-full w-full",
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-6 text-lapis-DEFAULT dark:text-tea-800"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Mobile Navigation Links */}
        <nav className="flex flex-col items-center space-y-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-xl font-medium text-lapis-DEFAULT hover:text-emerald-DEFAULT dark:text-tea-800 dark:hover:text-emerald-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
