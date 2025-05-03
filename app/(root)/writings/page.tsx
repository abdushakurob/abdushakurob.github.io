import { Metadata } from 'next';
import WritingList from './writing-list';

export const metadata: Metadata = {
  title: 'Blog | Abdul Shakur',
  description: 'Articles, tutorials, and thoughts on web development, design, and technology.',
  openGraph: {
    title: 'Blog | Abdul Shakur',
    description: 'Articles, tutorials, and thoughts on web development, design, and technology.',
    type: 'website',
  },
};

export default function WritingsPage() {
  return <WritingList />;
}
