'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Gauge, 
  GitBranch, 
  BarChart3, 
  FolderKanban, 
  Users, 
  Database, 
  FileText, 
  FileEdit, 
  MoreHorizontal,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const ResponsiveNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Gauge, label: 'Dashboard', href: '/dashboard' },
    { icon: GitBranch, label: 'Lifecycle', href: '/lifecycle' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: FolderKanban, label: 'Projects', href: '/projects' },
    { icon: Users, label: 'Team', href: '/team' },
  ];

  const documentItems: NavItem[] = [
    { icon: Database, label: 'Data Library', href: '/data-library' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: FileEdit, label: 'Word Assistant', href: '/word-assistant' },
    { icon: MoreHorizontal, label: 'More', href: '/more' },
  ];

  const NavContent = () => (
    <>
      <ul className="space-y-1">
        {mainNavItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h2 className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Documents
        </h2>
        <ul className="space-y-1">
          {documentItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <div className="w-64 h-screen bg-neutral-900 text-white flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-neutral-800">
          <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h1 className="text-lg font-semibold">Acme Inc.</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4">
          <NavContent />
        </nav>
      </div>
    );
  }

  // Mobile Navigation
  return (
    <>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-neutral-900 text-white border-b border-neutral-800 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <h1 className="text-lg font-semibold">Acme Inc.</h1>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-neutral-900 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-16 px-3 pb-4 h-full overflow-y-auto">
          <nav>
            <NavContent />
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ResponsiveNavbar;