"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";

interface Writing {
  title: string;
  content: string;
  category: string;
  createdAt: string;
  slug: string;
}

async function getWriting(slug: string): Promise<Writing | null> {
  try {
    const res = await axios.get(`/api/writings/${slug}`);
    return res.data.writing; // Assuming the API returns { writing: Writing }
  } catch (error) {
    console.error("Failed to fetch writing:", error);
    return null;
  }
}

async function getRelatedPosts(category: string, currentSlug: string): Promise<Writing[]> {
  try {
    const res = await axios.get(`/api/writings`);
    const allPosts = res.data;
    return allPosts.filter((post: Writing) => post.category === category && post.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
}

export default async function WritingPage({ 
  params 
}: { 
  params: { 
    slug: string 
  } 
}) {
  const writing = await getWriting(params.slug);
  if (!writing) return notFound();

  const relatedPosts = await getRelatedPosts(writing.category, writing.slug);

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      
      {/* Post Content */}
      <h1 className="text-4xl font-bold text-green-600 mb-4">{writing.title}</h1>
      <p className="text-gray-600">{writing.category} — {new Date(writing.createdAt).toDateString()}</p>
      <div className="mt-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: writing.content }} />

      {/* Back to Writings Button */}
      <div className="mt-10">
        <Link href="/writings">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">← Back to Writings</button>
        </Link>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Related Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div key={post.slug} className="border p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-600">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.category} — {new Date(post.createdAt).toDateString()}</p>
                <Link href={`/writings/${post.slug}`} className="text-blue-500 mt-2 block">Read More →</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}