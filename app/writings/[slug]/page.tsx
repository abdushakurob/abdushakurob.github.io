import { notFound } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// ✅ Define expected types
interface Writing {
  title: string;
  content: string;
  category: string;
  createdAt: string;
  slug: string;
}

// ✅ Ensure correct `params` typing
export default async function WritingPage({ params }: { params: { slug: string } }) {
  async function getWriting(slug: string): Promise<Writing | null> {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/writings/${slug}`);
      if (!res.data) return null;
      return res.data;
    } catch (error) {
      console.error("Failed to fetch writing:", error);
      return null;
    }
  }

  const writing = await getWriting(params.slug);
  if (!writing) return notFound();

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6 sm:px-12 md:px-24 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-4">{writing.title}</h1>
      <p className="text-gray-600">{writing.category} — {new Date(writing.createdAt).toDateString()}</p>
      <div className="mt-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: writing.content }} />

      <div className="mt-10">
        <Link href="/writings" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ← Back to Writings
        </Link>
      </div>
    </div>
  );
}
