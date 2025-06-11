import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-midnight-green-500 dark:text-parchment-500">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Projects" 
          description="Manage your portfolio projects"
          href="/admin/projects"
          count="View all projects"
        />
        
        <DashboardCard 
          title="Writings" 
          description="Manage your blog posts and articles"
          href="/admin/writings"
          count="View all writings"
        />
        
        <DashboardCard 
          title="Build" 
          description="Manage your build content and tracking"
          href="/admin/build"
          count="View all build content"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, href, count }: { 
  title: string;
  description: string;
  href: string;
  count: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="border border-tea-green-300 dark:border-midnight-green-400 p-6 rounded-lg hover:shadow-md transition-shadow bg-tea-green-300/50 dark:bg-midnight-green-400/50">
        <h2 className="text-xl font-semibold mb-2 text-sea-green-500 dark:text-sea-green-400">{title}</h2>
        <p className="text-midnight-green-400 dark:text-tea-green-400 mb-4">{description}</p>
        <span className="text-sea-green-500 dark:text-sea-green-400 font-medium hover:text-sea-green-600 dark:hover:text-sea-green-300 transition-colors">{count} →</span>
      </div>
    </Link>
  );
}