
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  HelpCircle, 
  Settings, 
  LogOut,
  Link2,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: <BarChart3 size={20} /> 
    },
    { 
      label: 'New Campaign', 
      path: '/campaigns/new', 
      icon: <FileText size={20} /> 
    },
    { 
      label: 'Smart URL', 
      path: '/dashboard/smart-url', 
      icon: <Link2 size={20} /> 
    },
    { 
      label: 'Playlist Checker', 
      path: '/playlist-checker', 
      icon: <CheckCircle size={20} /> 
    },
    { 
      label: 'Support', 
      path: '/help', 
      icon: <HelpCircle size={20} /> 
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    },
  ];

  const MobileTrigger = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="fixed top-4 left-4 z-50 md:hidden bg-musinova-green text-white"
      onClick={() => setIsOpen(true)}
    >
      <Menu size={20} />
    </Button>
  );

  const SidebarContent = () => (
    <div className="w-full h-full bg-musinova-green/90 text-white flex flex-col">
      <div className="p-4 flex-grow">
        {/* Logo at the top */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-2" onClick={() => isMobile && setIsOpen(false)}>
            <img 
              src="/logo.png" 
              alt="MusiNova Logo" 
              className="h-12 w-auto"
            />
          </Link>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`flex items-center p-3 rounded-md transition-colors hover:bg-white/10 ${
                    currentPath === item.path ? 'bg-white/20 font-medium' : ''
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Logout button at the bottom */}
      <div className="p-4 mt-auto border-t border-white/10">
        <Button
          onClick={() => logout()}
          className="flex items-center justify-center w-full p-3 rounded-md bg-musinova-brown text-white hover:bg-musinova-brown/90 transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  // For mobile, we'll use a Sheet component for a slide-out menu
  if (isMobile) {
    return (
      <>
        <MobileTrigger />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-50 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </Button>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // For desktop, we'll use the regular sidebar
  return (
    <div className="w-64 bg-musinova-green/90 text-white min-h-full flex flex-col">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
