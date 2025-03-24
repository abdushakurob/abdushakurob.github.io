import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
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
    // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    <html lang="en" className="className={`${inter.variable} ${sourceSans3.variable}`}">
      <body>
        <Header/>
        {children}
        <SocialIcons/>
      <Footer/>
      </body>
    </html>
  );
}
