import { Metadata } from 'next';
import { use } from 'react';
import axios from 'axios';
import ProjectDetail from './project-detail';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://abdushakur.me';
    const { data } = await axios.get(`${baseUrl}/api/projects/${slug}`);
    const project = data.project;
    
    const title = `${project.title} | Abdushakur`;
    const description = project.description || `Explore ${project.title}, a project by Abdushakur showcasing modern web development techniques.`;
    const imageUrl = project.coverImage || '/og-project-default.jpg';
    const url = `https://abdushakur.me/projects/${slug}`;
    
    return {
      title,
      description,
      keywords: [...(project.tags || []), 'Project', 'Web Development', 'Abdushakur'],
      authors: [{ name: 'Abdushakur', url: 'https://abdushakur.me' }],
      alternates: {
        canonical: `/projects/${slug}`,
      },
      openGraph: {
        title: project.title,
        description,
        url,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
        authors: ['Abdushakur'],
        publishedTime: project.createdAt,
        modifiedTime: project.updatedAt,
        tags: project.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description,
        images: [imageUrl],
        creator: '@abdushakurob',
      },
      robots: {
        index: project.status === 'published',
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for project:', error);
    return {
      title: 'Project | Abdushakur',
      description: 'Explore this project by Abdushakur showcasing modern web development techniques.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {  
  const { slug } = use(params);
  return <ProjectDetail slug={slug} />;
}