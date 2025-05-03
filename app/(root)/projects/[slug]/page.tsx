import { Metadata } from 'next';
import axios from 'axios';
import ProjectDetail from './project-detail';

// Metadata generation for the page (server-side)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await axios.get(`/api/projects/${params.slug}`);
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

// Server component that renders the client component
export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectDetail slug={params.slug} />;
}