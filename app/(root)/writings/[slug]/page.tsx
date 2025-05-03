import { Metadata } from 'next';
import { use } from 'react';
import WritingDetail from './writing-detail';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/writings/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch writing');
    const { writing } = await res.json();
    
    return {
      title: `${writing.title} | Blog by Abdul Shakur`,
      description: writing.excerpt || writing.content.substring(0, 160),
      openGraph: {
        title: writing.title,
        description: writing.excerpt || writing.content.substring(0, 160),
        type: 'article',
        authors: ['Abdul Shakur'],
        publishedTime: writing.createdAt,
        modifiedTime: writing.updatedAt,
        images: writing.coverImage ? [writing.coverImage] : [],
        tags: writing.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: writing.title,
        description: writing.excerpt || writing.content.substring(0, 160),
        images: writing.coverImage ? [writing.coverImage] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post | Abdul Shakur',
      description: 'Blog post details',
    };
  }
}

export default function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <WritingDetail slug={slug} />;
}
