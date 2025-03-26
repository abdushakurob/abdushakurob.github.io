import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialIcons from '@/components/socialIcons';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Abdushakur",
  description: "My Corner on the web",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <SocialIcons />
    </>
  );
}

