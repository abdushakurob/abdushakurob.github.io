import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialIcons from "@/components/socialIcons";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const clashDisplay = localFont({
  src: "../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
})

const jetBrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
})

const PlusJakartaSans = localFont({
  src: "../public/fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-plus-jakarta-sans",
})

const satoshi = localFont({
  src: "../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
})

export const metadata: Metadata = {
  title: "Abdushakur",
  description: "My Corner on the web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" className={`${PlusJakartaSans.variable}${jetBrainsMono.variable} ${clashDisplay.variable} ${satoshi.variable} ${inter.variable} ${sourceSans3.variable}`}>
      <head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Header/>
        {children}
        <SocialIcons/>
      <Footer/>
      </body>
    </html>
  );
}

