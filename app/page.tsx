import FeaturedProject from "@/components/featuredProject";
import Hero from "@/components/hero";
import LatestLog from "@/components/latestLog";
import Now from "@/components/now";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 sm:p-8 md:p-16 max-w-7xl mx-auto">
      {/* Header Section */}
      <Hero/>
      <div className="font-body text-3xl text-red-500">
  If this text is in **Source Sans 3**, fonts are working!
</div>

<div className="font-sans text-3xl text-blue-500">
  If this text is in **Inter**, fonts are working!
</div>

    {/* <div className="grid md:grid-cols-2 gap-8"> */}
      {/* Latest Logs */}
      <LatestLog/>
      {/* Now Section */}
      <Now/>
    {/* Featured Projects */}
      <FeaturedProject/>
    </div>
  );
}