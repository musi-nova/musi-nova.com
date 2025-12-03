import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CreditsBanner = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    // TODO for now set to dismissed as I need to implement the actual registration flow still
    localStorage.setItem('creditsBannerDismissed', '1');
    const dismissed = localStorage.getItem('creditsBannerDismissed');
    if (dismissed) return; // don't show if previously dismissed

    const t = setTimeout(() => {
      setVisible(true);
    }, 60 * 1000); // 60 seconds

    return () => clearTimeout(t);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
      <div className="bg-white border shadow-lg rounded-xl px-6 py-4 flex items-center gap-4 max-w-3xl w-full mx-4">
        <div className="flex-1">
          <div className="font-semibold">Claim 5 free credits</div>
          <div className="text-sm text-gray-600">Sign up now and get 5 free credits to kickstart your first campaign.</div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => { localStorage.setItem('creditsBannerDismissed', '1'); navigate('/register'); }} className="bg-musinova-green text-white">Sign up</Button>
          <Button variant="ghost" onClick={() => { setVisible(false); localStorage.setItem('creditsBannerDismissed', '1'); }}>Dismiss</Button>
        </div>
      </div>
    </div>
  );
};

export default CreditsBanner;
