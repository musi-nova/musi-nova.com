import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png"; // Update the path to your logo file
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

// helper to detect guest user by name
const looksLikeGuestUser = (u: any) => {
  if (!u) return false;
  // backend may return 'name' or 'name'
  const name = u.name || u.name || '';
  return name === 'Guest User';
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const { trackPageView, trackClick, logEvent } = useAnalytics();

  React.useEffect(() => {
    void trackPageView('/payment/success', { component: 'PaymentSuccess' });
    void logEvent({ event_type: 'payment_success', properties: { component: 'PaymentSuccess' } });
  }, [trackPageView, logEvent]);

  const handleRedirect = () => {
    navigate('/dashboard');
  };

  // Read stored user once
  let storedUser: any = null;
  try {
    const s = localStorage.getItem('musinova_user');
    storedUser = s ? JSON.parse(s) : null;
  } catch (e) {
    storedUser = null;
  }

  const isGuest = looksLikeGuestUser(storedUser);
  const guestEmail = storedUser?.email || storedUser?.user_email || '';

  const resendSetupEmail = async () => {
    if (!guestEmail) {
      toast({ title: 'No email found', description: 'Please head to the login page and request a password reset manually.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    setIsResending(true);
    try {
      const res = await apiFetch('forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guestEmail }),
      });
      if (!res.ok) throw new Error('Failed to send email');
      toast({ title: 'Email sent', description: `A password setup email has been sent to ${guestEmail}.` });
    } catch (err: any) {
      console.error('Resend failed', err);
      toast({ title: 'Error', description: err?.message || 'Could not resend email. Please try again later.', variant: 'destructive' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-green-100 to-green-50">
      <img src={logo} alt="Logo" className="w-24 h-24 mb-6 animate-bounce" />
      <h1 className="text-4xl font-extrabold text-green-700 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-800 mb-4 text-center">Thank you for your payment. Your transaction was successful, and your account has been updated.</p>

      {isGuest && (
        <div className="mb-6 w-full max-w-4xl">
          <div className="p-6 rounded-lg bg-white shadow-md border border-green-100 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-musinova-navy mb-2">Finish setting your password</h2>
            <p className="text-sm text-gray-700 mb-4">
              We've sent a follow-up email{guestEmail ? <> to <strong>{guestEmail}</strong></> : ''} with instructions to set your password and access your account. Please check your inbox (and spam folder).
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resendSetupEmail} className="bg-musinova-green text-white" disabled={isResending}>
                {isResending ? 'Sending...' : 'Resend setup email'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>Go to login</Button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => { void trackClick('go_to_dashboard', { component: 'PaymentSuccess' }); handleRedirect(); }} className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition transform hover:scale-105">
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;