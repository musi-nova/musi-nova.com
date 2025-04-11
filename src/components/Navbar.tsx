
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, UserCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return <nav className={`bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300 ${scrolled ? 'py-0' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'h-14' : 'h-20'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="MusiNova Logo" className={`transition-all duration-300 ${scrolled ? 'h-10 w-auto' : 'h-14 w-auto'}`} />
            </Link>
          </div>

          {!isMobile && <div className="hidden md:flex items-center space-x-4">
              <Link to="/playlist-checker" className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${isActive('/playlist-checker') ? 'font-bold text-musinova-green' : ''} ${scrolled ? 'text-sm' : 'text-base'}`}>
                Playlist Checker
              </Link>
              <Link to="/smart-url" className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${isActive('/smart-url') ? 'font-bold text-musinova-green' : ''} ${scrolled ? 'text-sm' : 'text-base'}`}>
                Smart URL
              </Link>
              <Link to="/blog" className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${isActive('/blog') ? 'font-bold text-musinova-green' : ''} ${scrolled ? 'text-sm' : 'text-base'}`}>
                Blog
              </Link>
              <Link to="/help" className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${isActive('/help') ? 'font-bold text-musinova-green' : ''} ${scrolled ? 'text-sm' : 'text-base'}`}>
                Help
              </Link>
            </div>}

          <div className="flex items-center space-x-2">
            {!isAuthenticated ? <>
                <Link to="/login">
                  <Button variant="outline" className={`btn-outline hidden md:block transition-all duration-300 ${scrolled ? 'text-sm py-1.5 px-4' : 'text-base'}`}>
                    Log In
                  </Button>
                </Link>
                <Link to="/try-for-free">
                  <Button className={`btn-primary hidden md:block transition-all duration-300 ${scrolled ? 'text-sm py-1.5 px-4' : 'text-base'}`}>Try Now</Button>
                </Link>
              </> : <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`flex items-center gap-2 transition-all duration-300 ${scrolled ? 'text-sm' : 'text-base'}`}>
                      <UserCircle size={scrolled ? 18 : 20} />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>}
            
            <div className="ml-2 md:hidden">
              <button onClick={toggleMenu} className={`p-2 rounded-md text-musinova-darkgray hover:text-musinova-green focus:outline-none transition-all duration-300`}>
                {isMenuOpen ? <X size={scrolled ? 22 : 24} /> : <Menu size={scrolled ? 22 : 24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle based on menu state */}
      {isMobile && isMenuOpen && <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            <Link to="/playlist-checker" className={`block px-3 py-2 rounded-md text-base font-medium text-musinova-darkgray hover:text-musinova-green hover:bg-gray-50 ${isActive('/playlist-checker') ? 'font-bold text-musinova-green' : ''}`}>
              Playlist Checker
            </Link>
            <Link to="/smart-url" className={`block px-3 py-2 rounded-md text-base font-medium text-musinova-darkgray hover:text-musinova-green hover:bg-gray-50 ${isActive('/smart-url') ? 'font-bold text-musinova-green' : ''}`}>
              Smart URL
            </Link>
            <Link to="/blog" className={`block px-3 py-2 rounded-md text-base font-medium text-musinova-darkgray hover:text-musinova-green hover:bg-gray-50 ${isActive('/blog') ? 'font-bold text-musinova-green' : ''}`}>
              Blog
            </Link>
            <Link to="/help" className={`block px-3 py-2 rounded-md text-base font-medium text-musinova-darkgray hover:text-musinova-green hover:bg-gray-50 ${isActive('/help') ? 'font-bold text-musinova-green' : ''}`}>
              Help
            </Link>
            
            {!isAuthenticated ? <div className="mt-4 px-3 flex flex-col gap-2">
                <Link to="/login">
                  <Button variant="outline" className="btn-outline w-full">Log In</Button>
                </Link>
                <Link to="/try-for-free">
                  <Button className="btn-primary w-full">Try For Free</Button>
                </Link>
              </div> : <div className="mt-4 px-3 flex flex-col gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" className="justify-start w-full">Dashboard</Button>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost" className="justify-start w-full">Settings</Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={handleLogout}>Log out</Button>
              </div>}
          </div>
        </div>}
    </nav>;
};

export default Navbar;
