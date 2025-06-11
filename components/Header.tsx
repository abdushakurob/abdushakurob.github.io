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
      isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">          <span className="text-primary">A</span>
          <span className="text-foreground">bdushakur</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          id="mobile-menu-button"
          className="md:hidden text-foreground focus:outline-none"
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
          "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-transform duration-300 md:hidden h-full w-full",
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        )}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-6 text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={30} />
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col items-center space-y-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className="text-2xl font-medium text-foreground hover:text-accent transition-colors py-2"
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
