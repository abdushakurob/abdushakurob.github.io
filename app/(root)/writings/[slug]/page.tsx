import { Metadata } from 'next';
import axios from 'axios';
import WritingDetail from './writing-detail';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await axios.get(`/api/writings/${params.slug}`);
    const writing = res.data.writing;
    
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

export default function WritingPage({ params }: { params: { slug: string } }) {
  return <WritingDetail slug={params.slug} />;
}
