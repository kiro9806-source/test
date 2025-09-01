'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

interface MainLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
}

export default function MainLayout({ children, showRightPanel = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
        {showRightPanel && <RightPanel />}
      </div>
    </div>
  );
}