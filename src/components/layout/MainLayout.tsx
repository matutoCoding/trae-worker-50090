import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '@/store/useAppStore';

interface MainLayoutProps {
  children: ReactNode;
}

const pathToKeyMap: Record<string, string> = {
  '/': 'dashboard',
  '/ledger': 'ledger',
  '/monitor': 'monitor',
  '/pipeline': 'pipeline',
  '/inspection': 'inspection',
  '/safety': 'safety',
  '/emergency': 'emergency',
  '/statistics': 'statistics',
};

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  useEffect(() => {
    const key = pathToKeyMap[location.pathname] || 'dashboard';
    setCurrentPage(key);
  }, [location.pathname, setCurrentPage]);

  return (
    <div className="flex h-screen bg-navy-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
