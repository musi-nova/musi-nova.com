
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
    location.pathname.includes('/admin') ||
    location.pathname.includes('/dashboard/smart-url');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Navbar if not on dashboard and sidebar is not being shown */}
      {!isDashboard && !showSidebar && <Navbar />}

      <div className="flex flex-grow min-h-0">
        {/* Only show sidebar when needed and not expanded on mobile by default */}
        {showSidebar && (
          // Make the sidebar static/sticky and full-height while allowing the main area to scroll
          <div className="hidden md:block flex-none">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </div>
        )}

        {/* On mobile, Sidebar component handles its own trigger and sheet */}
        {showSidebar && isMobile && <Sidebar />}

        <main className={`flex-grow overflow-auto ${className}`}>
          <div className={`mx-auto ${isMobile ? 'px-2 pt-16' : 'px-4'}`}>
            {tabs && <TabsNav tabs={tabs} className={`${isMobile ? 'mt-2' : 'mt-6'}`} />}
            {children}
          </div>
        </main>
      </div>

      {/* Only show Footer if not on dashboard and sidebar is not being shown */}
      {!isDashboard && !showSidebar && <Footer />}
    </div>
  );
};

export default PageLayout;
