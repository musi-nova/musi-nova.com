import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const GuestBanner = ({ onDismiss }: { onDismiss: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-yellow-800">Complete your account</h3>
        <p className="text-sm text-yellow-700 mt-1">It looks like you signed up as a guest. Please update your email, username and change your default password to secure your account.</p>
        <p className="text-sm text-yellow-700 mt-1">Guest accounts will be deleted after 14 days.</p>
        <div className="mt-3 flex gap-2">
          <Button className="bg-yellow-600 text-white" onClick={() => navigate('/settings')}>Update profile</Button>
          <Button variant="ghost" onClick={() => navigate('/settings')}>Change password</Button>
        </div>
      </div>

      <div>
        <Button variant="ghost" onClick={onDismiss}>Dismiss</Button>
      </div>
    </div>
  );
};

export default GuestBanner;
