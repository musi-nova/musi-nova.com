import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserCircle } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Menu, X } from 'lucide-react'; // Import icons for the burger menu

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile(); // Hook to detect mobile devices
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  if (isMobile) {
    return (
      <nav className="bg-gray-50 top-0 z-50">
        <div className="flex justify-between items-center h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="MusiNova Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Burger Menu */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-musinova-darkgray hover:text-musinova-green focus:outline-none transition-all duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 w-full bg-white shadow-md z-40">
            <div className="flex flex-col space-y-2 p-4">
              <Link
                to="/submit-to-playlists"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/submit-to-playlists') ? 'font-bold text-musinova-green' : ''
                }`}
                onClick={toggleMenu}
              >
                Playlist Submission
              </Link>
              <Link
                to="/playlist-checker"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/playlist-checker') ? 'font-bold text-musinova-green' : ''
                }`}
                onClick={toggleMenu}
              >
                Playlist Checker
              </Link>
              <Link
                to="/smart-url"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/smart-url') ? 'font-bold text-musinova-green' : ''
                }`}
                onClick={toggleMenu}
              >
                Smart URL
              </Link>
              <Link
                to="/help"
                className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                  isActive('/help') ? 'font-bold text-musinova-green' : ''
                }`}
                onClick={toggleMenu}
              >
                Help
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300"
                    onClick={toggleMenu}
                  >
                    Try Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="MusiNova Logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/submit-to-playlists"
              className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                isActive('/submit-to-playlists') ? 'font-bold text-musinova-green' : ''
              } text-sm`}
            >
              Playlist Submission
            </Link>
            <Link
              to="/playlist-checker"
              className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                isActive('/playlist-checker') ? 'font-bold text-musinova-green' : ''
              } text-sm`}
            >
              Playlist Checker
            </Link>
            <Link
              to="/smart-url"
              className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                isActive('/smart-url') ? 'font-bold text-musinova-green' : ''
              } text-sm`}
            >
              Smart URL
            </Link>
            <Link
              to="/pricing"
              className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                isActive('/pricing') ? 'font-bold text-musinova-green' : ''
              } text-sm`}
            >
              Pricing
            </Link>
            <Link
              to="/help"
              className={`text-musinova-darkgray hover:text-musinova-green px-3 py-2 rounded-md transition-all duration-300 ${
                isActive('/help') ? 'font-bold text-musinova-green' : ''
              } text-sm`}
            >
              Help
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="btn-outline hidden md:block text-sm py-1.5 px-4"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="btn-primary hidden md:block text-sm py-1.5 px-4"
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
                      className="flex items-center gap-2 text-sm"
                    >
                      <UserCircle size={20} />
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;