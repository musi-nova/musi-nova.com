import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, UserCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavbarProps {
  resizable?: boolean; // Add a prop to control resizing
}

const Navbar: React.FC<NavbarProps> = ({ resizable = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add scroll event listener only if resizable is true
  useEffect(() => {
    if (!resizable) return;

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
  }, [resizable]);

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

  return (
    <nav
      className={`bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300 ${
        resizable && scrolled ? 'py-0' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            resizable ? (scrolled ? 'h-14' : 'h-20') : 'h-14'
          }`}
        >
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="MusiNova Logo"
                className={`transition-all duration-300 ${
                  resizable ? (scrolled ? 'h-10 w-auto' : 'h-14 w-auto') : 'h-10 w-auto'
                }`}
              />
            </Link>
          </div>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/playlist-checker"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/playlist-checker') ? 'font-bold text-musinova-green' : ''
                } ${resizable ? (scrolled ? 'text-sm' : 'text-base') : 'text-sm'}`}
              >
                Playlist Checker
              </Link>
              {/* <Link
                to="/smart-url"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/smart-url') ? 'font-bold text-musinova-green' : ''
                } ${resizable ? (scrolled ? 'text-sm' : 'text-base') : 'text-sm'}`}
              >
                Smart URL
              </Link> */}
              {/* <Link
                to="/blog"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/blog') ? 'font-bold text-musinova-green' : ''
                } ${resizable ? (scrolled ? 'text-sm' : 'text-base') : 'text-sm'}`}
              >
                Blog
              </Link> */}
              <Link
                to="/help"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/help') ? 'font-bold text-musinova-green' : ''
                } ${resizable ? (scrolled ? 'text-sm' : 'text-base') : 'text-sm'}`}
              >
                Help
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className={`btn-outline hidden md:block transition-all duration-300 ${
                      resizable ? (scrolled ? 'text-sm py-1.5 px-4' : 'text-base') : 'text-sm py-1.5 px-4'
                    }`}
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className={`btn-primary hidden md:block transition-all duration-300 ${
                      resizable ? (scrolled ? 'text-sm py-1.5 px-4' : 'text-base') : 'text-sm py-1.5 px-4'
                    }`}
                  >
                    Try Now
                  </Button>
                </Link>
              </>
            ) : (
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        resizable ? (scrolled ? 'text-sm' : 'text-base') : 'text-sm'
                      }`}
                    >
                      <UserCircle size={resizable && scrolled ? 18 : 20} />
                      <span>{user?.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div className="ml-2 md:hidden">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-md text-musinova-darkgray hover:text-musinova-green focus:outline-none transition-all duration-300`}
              >
                {isMenuOpen ? <X size={resizable && scrolled ? 22 : 24} /> : <Menu size={resizable && scrolled ? 22 : 24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;