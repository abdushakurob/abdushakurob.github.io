import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/hero';
import LatestLog from '@/components/latestLog';
import Now from '@/components/now';
import FeaturedProject from '@/components/featuredProject';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-4 right-4 z-50">
      </div>
      
      <Header /> 
      
      <main className="flex-grow pt-16">
        <Hero />
        <LatestLog />
        <Now />
        <FeaturedProject />
      </main>
      
      <Footer />
    </div>
  );
};

