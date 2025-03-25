import Link from 'next/link';
import { FileText, Home, BookOpen, Construction, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Home size={20} />
            <span>Portfolio Admin</span>
          </Link>
        </div>
        
        <nav className="mt-6">
          <ul>
            <SidebarItem href="/admin" icon={<Home size={18} />} text="Dashboard" />
            <SidebarItem href="/admin/projects" icon={<FileText size={18} />} text="Projects" />
            <SidebarItem href="/admin/writings" icon={<BookOpen size={18} />} text="Writings" />
            <SidebarItem href="/admin/build" icon={<Construction size={18} />} text="Build" />
            <li className="mt-auto">
              <Link 
                href="/"
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={18} />
                <span>Back to Site</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium md:hidden">Portfolio Admin</h1>
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                  <Home size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <li>
      <Link 
        href={href}
        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100"
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
} 