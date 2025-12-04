import React from 'react';
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
  MoreHorizontal 
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const Sidebar: React.FC = () => {
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

  return (
    <div className="w-50 h-screen bg-neutral-900 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-neutral-800">
        <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <h1 className="text-lg font-semibold">Acme Inc.</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Documents Section */}
        <div className="mt-8">
          <h2 className="px-3 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Documents
          </h2>
          <ul className="space-y-1">
            {documentItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;