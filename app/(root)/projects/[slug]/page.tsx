import { Metadata } from 'next';
import { use } from 'react';
import axios from 'axios';
import ProjectDetail from './project-detail';

// Metadata generation for the page (server-side)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await axios.get(`/api/projects/${slug}`);
    const project = res.data.project;
    
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