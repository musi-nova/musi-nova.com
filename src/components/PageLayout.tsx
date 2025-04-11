
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TabsNav from '@/components/TabsNav';
import Sidebar from '@/components/Sidebar';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface TabItem {
  label: string;
  path: string;
  value: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  tabs?: TabItem[];
  className?: string;
  showSidebar?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  tabs, 
  className = '',
  showSidebar = false
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isDashboard = location.pathname === '/dashboard' || 
                      location.pathname === '/playlists' || 
                      location.pathname.includes('/settings') || 
                      location.pathname.includes('/dashboard/smart-url');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Navbar if not on dashboard */}
      {!isDashboard && <Navbar />}
      
      <div className="flex flex-grow">
        {/* Only show sidebar when needed and not expanded on mobile by default */}
        {showSidebar && <Sidebar />}
        
        <main className={`flex-grow ${className}`}>
          <div className={`mx-auto ${isMobile ? 'px-2 pt-16' : 'px-4'}`}>
            {tabs && <TabsNav tabs={tabs} className={`${isMobile ? 'mt-2' : 'mt-6'}`} />}
            {children}
          </div>
        </main>
      </div>
      
      {/* Only show Footer if not on dashboard */}
      {!isDashboard && <Footer />}
    </div>
  );
};

export default PageLayout;
