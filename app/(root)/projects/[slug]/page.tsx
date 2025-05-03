import { Metadata } from 'next';
import { use } from 'react';
import ProjectDetail from './project-detail';

// Metadata generation for the page (server-side)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    const { project } = await res.json();
    
    return {
      title: `${project.title} | Abdul Shakur`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.coverImage ? [project.coverImage] : [],
        type: 'article',
        authors: ['Abdul Shakur'],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: project.coverImage ? [project.coverImage] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Project | Abdul Shakur',
      description: 'Project details',
    };
  }
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {  
  const { slug } = use(params);
  return <ProjectDetail slug={slug} />;
}