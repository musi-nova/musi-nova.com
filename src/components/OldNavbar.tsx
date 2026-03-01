import React, { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { trackClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-black/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://www.musi-nova.com/logo.png"
            alt="MusiNova Logo"
            className="w-10 h-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-2xl font-display font-bold tracking-tighter">MusiNova</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:text-brand-accent transition-colors" onClick={() => trackClick('oldnav_playlist_submission')}>Playlist Submission</a>
          <a href="#" className="text-sm font-medium hover:text-brand-accent transition-colors" onClick={() => trackClick('oldnav_music_promotion')}>Music Promotion</a>
          <a href="#" className="text-sm font-medium hover:text-brand-accent transition-colors" onClick={() => trackClick('oldnav_case_studies')}>Case Studies</a>
          <a href="#" className="text-sm font-medium hover:text-brand-accent transition-colors" onClick={() => trackClick('oldnav_pricing')}>Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-semibold px-4 py-2" onClick={() => trackClick('oldnav_login')}>Log In</button>
          <button className="bg-brand-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all" onClick={() => trackClick('oldnav_get_started')}>Get Started</button>
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 flex flex-col gap-4 md:hidden"
        >
            <a href="#" className="text-lg font-medium" onClick={() => trackClick('oldnav_mobile_playlist_submission')}>Playlist Submission</a>
            <a href="#" className="text-lg font-medium" onClick={() => trackClick('oldnav_mobile_music_promotion')}>Music Promotion</a>
            <a href="#" className="text-lg font-medium" onClick={() => trackClick('oldnav_mobile_case_studies')}>Case Studies</a>
            <a href="#" className="text-lg font-medium" onClick={() => trackClick('oldnav_mobile_pricing')}>Pricing</a>
          <hr className="border-black/5" />
          <button className="w-full bg-brand-primary text-white py-4 rounded-xl font-semibold" onClick={() => trackClick('oldnav_mobile_get_started')}>Get Started</button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
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
      <nav className="bg-gray-50 sticky top-0 z-50 shadow-sm">
        <div className="flex justify-between items-center h-14 px-4">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
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
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="MusiNova Logo"
                className="h-10 w-auto"
              />
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
                    Sign Up
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