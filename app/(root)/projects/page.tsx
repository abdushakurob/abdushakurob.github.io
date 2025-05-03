import { Metadata } from 'next';
import ProjectList from './project-list';

export const metadata: Metadata = {
  title: 'Projects | Abdul Shakur',
  description: 'A collection of things I\'ve built, designed, or experimented with. Some are finished, some are ongoing, and some are just ideas I started exploring.',
  openGraph: {
    title: 'Projects | Abdul Shakur',
    description: 'A collection of things I\'ve built, designed, or experimented with.',
    type: 'website',
  },
};

export default function ProjectsPage() {
  return <ProjectList />;
}
