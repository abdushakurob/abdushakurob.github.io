import { Metadata } from 'next';
import { use } from 'react';
import axios from 'axios';
import WritingDetail from './writing-detail';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://abdushakur.me';
    const { data } = await axios.get(`${baseUrl}/api/writings/${slug}`);
    const writing = data.writing;
    
    const title = `${writing.title} | Abdushakur's Blog`;
    const description = writing.excerpt || writing.content?.substring(0, 160) || `Read "${writing.title}" on Abdushakur's blog about web development and technology.`;
    const imageUrl = writing.coverImage || '/og-blog-default.jpg';
    const url = `https://abdushakur.me/writings/${slug}`;
    
    return {
      title,
      description,
      keywords: [...(writing.tags || []), 'Blog', 'Article', 'Web Development', 'Abdushakur'],
      authors: [{ name: 'Abdushakur', url: 'https://abdushakur.me' }],
      category: 'Technology',
      alternates: {
        canonical: `/writings/${slug}`,
      },
      openGraph: {
        title: writing.title,
        description,
        url,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: writing.title,
          },
        ],
        authors: ['Abdushakur'],
        publishedTime: writing.createdAt,
        modifiedTime: writing.updatedAt,
        tags: writing.tags || [],
        section: 'Technology',
      },
      twitter: {
        card: 'summary_large_image',
        title: writing.title,
        description,
        images: [imageUrl],
        creator: '@abdushakurob',
        site: '@abdushakurob',
      },
      robots: {
        index: writing.status === 'published',
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for writing:', error);
    return {
      title: 'Blog Post | Abdushakur',
      description: 'Read this blog post about web development and technology by Abdushakur.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <WritingDetail slug={slug} />;
}
