import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    BarChart3,
    CheckCircle,
    FileText,
    HelpCircle,
    Link2,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./SidebarTopupBtn.css";
import { Button } from './ui/button';
import { Sheet, SheetContent } from './ui/sheet';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { logout, getUser } = useAuth(); // Use the new getUser function
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    // Get the user from localStorage
    const user = getUser();

    // Redirect to /login if no user is found
    if (!user) {
      console.error('No user found in localStorage');
      return;
    }

    // Set the team ID from the user data
    if (user.team_id) {
      setTeamId(user.team_id);
    } else {
      console.error('No team ID found for the user');
      logout(); // Log out the user if no team ID is found
      navigate('/login');
    }
  }, [getUser, navigate, logout]);

  // Fetch user credits and show in sidebar. 404 => 0 credits.
  useEffect(() => {
    let cancelled = false;
    const fetchCredits = async () => {
      try {
        const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;
        const url = `${baseUrl}team/credits`;
        const accessToken = localStorage.getItem('access_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

        const res = await fetch(url, { method: 'GET', headers });
        if (cancelled) return;

        if (res.status === 401) {
          // mirror apiFetch behavior for unauthorized
          localStorage.removeItem('access_token');
          localStorage.removeItem('musinova_user');
          window.location.href = '/login';
          return;
        }

        if (res.status === 404) {
          setCredits(0);
          return;
        }

        if (!res.ok) {
          console.error('Failed fetching credits', await res.text());
          setCredits(0);
          return;
        }

        const data = await res.json();
        const value = typeof data === 'number' ? data : (data?.credits ?? 0);
        setCredits(Number(value) || 0);
      } catch (err) {
        console.error('Error fetching credits', err);
        if (!cancelled) setCredits(0);
      }
    };

    fetchCredits();
    return () => { cancelled = true; };
  }, []);

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
    // {
    //   label: 'Submissions',
    //   path: '/submissions',
    //   icon: <FileText size={20} />
    // },
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

  // Conditionally add the Admin menu item
  if (teamId === '3d19423e-d150-4819-9a63-20714899f425') {
    menuItems.push({
      label: 'Submissions',
      path: '/submissions',
      icon: <FileText size={20} />, // Replace with a more appropriate icon if needed
    });
  }

  // Conditionally add the Admin menu item
  // if (teamId === '3d19423e-d150-4819-9a63-20714899f425') {
  //   menuItems.push({
  //     label: 'Admin',
  //     path: '/admin',
  //     icon: <ShieldCheck size={20} />, // Replace with a more appropriate icon if needed
  //   });
  // }

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
        <div className="mb-4 flex justify-center">
          <Link to="/" className="flex items-center gap-2" onClick={() => isMobile && setIsOpen(false)}>
            <img 
              src="/logo.png" 
              alt="MusiNova Logo" 
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Top Up / Subscribe button - prominent and above nav */}
        <div className="mb-6 flex justify-center">
          <Link to="/payment" onClick={() => isMobile && setIsOpen(false)} className="w-full">
            <Button
              className="w-full py-3 px-4 rounded-xl bg-musinova-brown text-white font-bold text-lg shadow-lg border-2 border-musinova-brown hover:bg-white hover:text-musinova-brown transition-all flex items-center gap-2 sidebar-topup-btn"
              style={{ boxShadow: '0 0 0 2px #8B5A2B, 0 2px 8px 0 rgba(0,0,0,0.08)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Top Up / Subscribe</span>
            </Button>
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

      {/* Credits display and Logout button at the bottom */}
      <div className="p-4 mt-auto border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/80">Credits</div>
            <div className="text-lg font-bold">{credits === null ? '—' : `${credits} credits`}</div>
          </div>
          <div>
            <Link to="/payment-credits" className="text-sm text-white/90 underline" onClick={() => isMobile && setIsOpen(false)}>
              Buy
            </Link>
          </div>
        </div>

        <div>
          <Button
            onClick={() => logout()}
            className="flex items-center justify-center w-full p-3 rounded-md bg-musinova-brown text-white hover:bg-musinova-brown/90 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            <span>Logout</span>
          </Button>
        </div>
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