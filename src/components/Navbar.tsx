import React, { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuth } from '@/hooks/use-auth';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isAuthenticated } = useAuth();
  const { trackClick } = useAnalytics();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-black/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="MusiNova Logo"
            className="w-10 h-10 object-contain"
            referrerPolicy="no-referrer"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/campaigns/new"
            className="text-sm font-medium hover:text-brand-accent transition-colors"
            onClick={() => trackClick('nav_music_promotion', { label: 'Music Promotion', location: 'navbar' })}
          >
            Music Promotion
          </a>
          <a
            href="/submissions"
            className="text-sm font-medium hover:text-brand-accent transition-colors"
            onClick={() => trackClick('nav_playlist_submission', { label: 'Playlist Submission', location: 'navbar' })}
          >
            Playlist Submission
          </a>
          {/* <a href="/case-studies" className="text-sm font-medium hover:text-brand-accent transition-colors">Case Studies</a> */}
          <a
            href="/pricing"
            className="text-sm font-medium hover:text-brand-accent transition-colors"
            onClick={() => trackClick('nav_pricing', { label: 'Pricing', location: 'navbar' })}
          >
            Pricing
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="bg-musinova-green text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
              onClick={() => trackClick('nav_dashboard', { label: 'Dashboard', location: 'navbar' })}
            >
              Dashboard
            </a>
          ) : (
            <>
              <a href="/login" className="text-sm font-semibold px-4 py-2" onClick={() => trackClick('nav_login', { label: 'Log In', location: 'navbar' })}>Log In</a>
              <a
                href="/campaigns/new"
                className="bg-musinova-green text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
                onClick={() => trackClick('nav_get_started', { label: 'Get Started', location: 'navbar' })}
              >
                Get Started
              </a>
            </>
          )}
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
          <hr className="border-black/5" />
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="w-full inline-flex items-center justify-center bg-brand-primary text-white py-4 rounded-xl font-semibold"
              onClick={() => trackClick('nav_mobile_dashboard', { label: 'Dashboard', location: 'navbar_mobile' })}
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/campaigns/new"
              className="w-full inline-flex items-center justify-center bg-brand-primary text-white py-4 rounded-xl font-semibold"
              onClick={() => trackClick('nav_mobile_get_started', { label: 'Get Started', location: 'navbar_mobile' })}
            >
              Get Started
            </a>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;