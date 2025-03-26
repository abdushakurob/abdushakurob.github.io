'use client';

import Link from 'next/link';
import { FileText, Home, BookOpen, Construction, LogOut, Settings, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

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
        
        <nav className="mt-6 flex flex-col h-[calc(100vh-100px)] justify-between">
          <ul className="space-y-1">
            <SidebarItem 
              href="/" 
              icon={<Home size={18} />} 
              text="Dashboard" 
              isActive={isActive('/')}
            />
            <SidebarItem 
              href="/projects" 
              icon={<FileText size={18} />} 
              text="Projects" 
              isActive={pathname.startsWith('/projects')}
            />
            <SidebarItem 
              href="/writings" 
              icon={<BookOpen size={18} />} 
              text="Writings" 
              isActive={pathname.startsWith('/writings')}
            />
            <SidebarItem 
              href="/build" 
              icon={<Construction size={18} />} 
              text="Build" 
              isActive={pathname.startsWith('/build')}
            />
            <SidebarItem 
              href="/profile" 
              icon={<User size={18} />} 
              text="Profile" 
              isActive={pathname.startsWith('/profile')}
            />
            <SidebarItem 
              href="/settings" 
              icon={<Settings size={18} />} 
              text="Settings" 
              isActive={pathname.startsWith('/settings')}
            />
          </ul>
          <ul className="mt-auto space-y-1">
            <li>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-gray-100 transition-colors"
              >
                <LogOut size={18} />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </li>
            <li>
              <Link 
                href="https://www.abdushakur.me"
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Home size={18} />
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

function SidebarItem({ 
  href, 
  icon, 
  text, 
  isActive 
}: { 
  href: string; 
  icon: React.ReactNode; 
  text: string;
  isActive: boolean;
}) {
  return (
    <li>
      <Link 
        href={href}
        className={`flex items-center gap-2 px-6 py-3 transition-colors ${
          isActive 
            ? 'bg-blue-50 text-blue-600 font-medium' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
} 