import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

const defaultTracks = [''];

const CreateCampaign: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // try to read plan amount passed via navigation state
    const planAmountFromState = (location.state as any)?.planAmount as number | undefined;
    const [planAmount] = useState<number>(planAmountFromState || 197);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailProviders, setEmailProviders] = useState<string[] | null>(null);
    const [tracks, setTracks] = useState<string[]>(defaultTracks);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signInLoading, setSignInLoading] = useState(false);
    const { toast } = useToast();
    const { isAuthenticated, user, login, loginAnonymously, loginWithGoogle, loginWithMicrosoft, checkEmailExists } = useAuth();
    const { trackPageView, trackFormSubmit, trackClick, logEvent } = useAnalytics();

    React.useEffect(() => {
        void trackPageView('/campaign/new', { component: 'CreateCampaign' });
    }, [trackPageView]);

    // Auto-check email existence
    React.useEffect(() => {
        if (isAuthenticated || !validateEmail(email)) {
            setShowPasswordField(false);
            setIsCheckingEmail(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsCheckingEmail(true);
            try {
                const res = await checkEmailExists(email);
                if (res.exists) {
                    setShowPasswordField(true);
                    setEmailProviders(res.providers || []);
                } else {
                    setShowPasswordField(false);
                    setEmailProviders(null);
                }
            } finally {
                setIsCheckingEmail(false);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [email, isAuthenticated, checkEmailExists]);

    React.useEffect(() => {
        if (isAuthenticated && user?.email) {
            setEmail(user.email);
        }
    }, [isAuthenticated, user]);

    const extractTrackId = (url: string): string | null => {
        try {
            const regex = /track\/([a-zA-Z0-9]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        } catch (err) {
            return null;
        }
    };

    const updateTrack = (index: number, value: string) => {
        setTracks((prev) => prev.map((t, i) => (i === index ? value : t)));
    };

    const addTrack = () => setTracks((prev) => [...prev, '']);
    const removeTrack = (index: number) => setTracks((prev) => prev.filter((_, i) => i !== index));

    const validateEmail = (e: string) => {
        // simple email regex
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        void trackFormSubmit('create_campaign', { component: 'CreateCampaign', planAmount, tracks_count: tracks.length, email_provided: !!email });
        // ensure at least one non-empty track first
        const sanitizedTracks = tracks.map((t) => t.trim()).filter(Boolean);
        if (sanitizedTracks.length === 0) {
            alert('Please add at least one track URL.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Ensure guest user exists if not authenticated.
            if (!isAuthenticated) {
                // If we are already showing the password field, try to login
                if (showPasswordField) {
                    try {
                        await login(email, password);
                    } catch (err: any) {
                        toast({
                            title: 'Login failed',
                            description: 'Please check your password and try again.',
                            variant: 'destructive',
                        });
                        setIsSubmitting(false);
                        return;
                    }
                } else {
                    // Final check if email exists (in case they clicked submit before debounce finished)
                    const res = await checkEmailExists(email);
                    if (res.exists) {
                        setShowPasswordField(true);
                        setEmailProviders(res.providers || []);
                        // If provider suggests social login only, show a helpful toast
                        toast({
                            title: 'Account already exists',
                            description: 'Please sign in using the method associated with this account (password or social login).',
                        });
                        setIsSubmitting(false);
                        return;
                    }

                    // If email doesn't exist, proceed with anonymous login
                    try {
                        const pending = { email, tracks: sanitizedTracks, planAmount, createdAt: new Date().toISOString() };
                        const { ensureGuestUser } = await import('@/lib/guestUser');
                        const res = await ensureGuestUser(loginAnonymously, email, 'pendingCampaign', pending);
                        if (!res.success) {
                            // If the backend signaled account already exists, show a helpful message
                            const reason = (res as any).reason || null;
                            if (reason && typeof reason === 'string' && reason.toLowerCase().includes('account exists')) {
                                toast({
                                    title: 'Account already exists',
                                    description: (
                                        <span>
                                            An account with this email already exists. Please <Link to="/login" className="underline font-bold">log in</Link> to continue.
                                        </span>
                                    ) as any,
                                    variant: 'destructive',
                                });
                            } else {
                                toast({ title: 'Error', description: 'Failed to create a guest account. Please try again.', variant: 'destructive' });
                            }
                            setIsSubmitting(false);
                            return;
                        }
                    } catch (e: any) {
                        console.error('ensureGuestUser failed', e);
                        const msg = e?.message || String(e);
                        if (msg.toLowerCase().includes('account exists')) {
                            toast({
                                title: 'Account already exists',
                                description: (
                                    <span>
                                        An account with this email already exists. Please <Link to="/login" className="underline font-bold">log in</Link> to continue.
                                    </span>
                                ) as any,
                                variant: 'destructive',
                            });
                        } else {
                            toast({ title: 'Error', description: 'Failed to create a guest account. Please try again.', variant: 'destructive' });
                        }
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            // Create playlist via backend using track IDs
            const trackIds = sanitizedTracks.map((t) => extractTrackId(t)).filter(Boolean) as string[];
            const playlistBody: any = {
                name: `MusiNova Playlist ${Date.now()}`,
                description: 'Playlist created for campaign',
                public: true,
            };
            if (trackIds.length) playlistBody.trackIds = trackIds;

            const createPlaylistRes = await apiFetch('spotify/musinova/playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playlistBody),
            });

            if (!createPlaylistRes.ok) {
                throw new Error(`Failed to create playlist: ${createPlaylistRes.statusText}`);
            }
            const playlistData = await createPlaylistRes.json();
            const playlistId = playlistData.playlist_id || playlistData.id || null;
            if (!playlistId) {
                throw new Error('Playlist API did not return a playlist_id');
            }

            // Build campaign payload and create campaign via backend
            const campaignName = `Campaign ${new Date().toISOString()}`;
            const campaignData: any = {
                campaignName,
                playlistId,
                tracks: sanitizedTracks,
                email, // Include the email collected in the form
                createdAt: new Date().toISOString(),
                userId: user?.id || null,
                teamId: user?.team_id || null,
            };

            const createCampaignRes = await apiFetch('user/campaign/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(campaignData),
            });

            if (!createCampaignRes.ok) {
                throw new Error(`Failed to create campaign: ${createCampaignRes.statusText}`);
            }

            const campaignResult = await createCampaignRes.json();
            const campaignId = campaignResult.id || campaignResult.campaign_id || null;
            // Log campaign created (non-blocking)
            void logEvent({ event_type: 'campaign_created', properties: { campaign_id: campaignId, plan_amount: planAmount, playlist_id: playlistId, component: 'CreateCampaign' } });
            if (!campaignId) {
                throw new Error('Campaign API did not return campaign id');
            }

            // Prepare selectedCampaign for Stripe payload
            const selectedCampaign = {
                campaignId,
                name: campaignName,
                playlistId,
            };

            // persist pendingCampaign briefly in case needed
            localStorage.setItem('pendingCampaign', JSON.stringify({ ...campaignResult }));

            const breakdown = (() => {
                const amount = planAmount;
                const musiNovaFee = amount <= 100 ? parseFloat((amount * 0.45).toFixed(2)) : parseFloat((amount * 0.35).toFixed(2));
                const adSpend = amount <= 100 ? parseFloat((amount * 0.55).toFixed(2)) : parseFloat((amount * 0.65).toFixed(2));
                return { musiNovaFee, adSpend, totalCharge: amount };
            })();

            // Build direct payment payload
            const payload = {
                paymentType: 'one-time',
                oneTimeAmount: planAmount,
                oneTimeDuration: 30,
                selectedCampaign,
                breakdown,
            };

            // Persist the prepared campaign and redirect to Stripe
            try {
                localStorage.setItem('pendingCampaign', JSON.stringify({ ...campaignResult }));
                // Directly create credits checkout session and redirect
                const creditsPayload = {
                    paymentType: 'credits',
                    creditsAmount: planAmount,
                    campaignId: campaignId,
                    campaignName: campaignName,
                };

                const response = await apiFetch('stripe/create-checkout-session/credits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(creditsPayload),
                });

                if (!response.ok) throw new Error('Failed to create checkout session');
                const { url } = await response.json();
                // Track checkout started
                void logEvent({ event_type: 'checkout_started', properties: { campaign_id: campaignId, amount: planAmount, method: 'stripe', component: 'CreateCampaign' } });
                window.location.href = url;
            } catch (err) {
                console.error('Failed to create checkout session', err);
                toast({ title: 'Error', description: 'Failed to start payment. Please try again.', variant: 'destructive' });
                navigate('/pricing');
            }
        } catch (err) {
            console.error('Payment setup error', err);
            toast({ title: 'Error', description: 'There was an issue preparing your campaign for payment. Please try again.', variant: 'destructive' });
            navigate('/pricing');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="bg-white shadow-sm rounded-lg p-4 md:p-6 relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                            <h1 className="text-2xl font-bold">Create Campaign</h1>
                            <div className="md:absolute md:top-4 md:right-4">
                                <Badge className="uppercase px-3 py-1 text-sm md:text-base font-semibold">${planAmount}</Badge>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md mb-4 text-sm text-gray-700">
                            <p>Please list all your songs that you want in the playlist.</p>
                            <p className="mt-2 font-medium">List them from most to least important</p>
                            <p className="mt-2 text-sm">All your songs are important to us of course, but the higher they are ranked the more streams they will get.</p>
                            <p className="mt-2">We blend your music with established tracks from your genre to provide clear genre context, helping Spotify's recommendation systems identify the right audience and surface your music to listeners with similar tastes.</p>
                        </div>


                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tracks to include <span className="text-red-500">*</span></label>
                                <div className="space-y-2">
                                    {tracks.map((t, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input placeholder="https://open.spotify.com/track/..." value={t} onChange={(e) => updateTrack(i, e.target.value)} className="flex-1" />
                                            <Button type="button" variant="outline" size="sm" onClick={() => removeTrack(i)} disabled={tracks.length === 1} className="px-2 md:px-4">
                                                <span className="hidden md:inline">Remove</span>
                                                <span className="md:hidden">X</span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <Button type="button" onClick={addTrack}>+ Add another track</Button>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
                                    {isCheckingEmail && (
                                        <span className="text-xs text-gray-400 animate-pulse">Checking account...</span>
                                    )}
                                </div>
                                <Input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (showPasswordField) setShowPasswordField(false);
                                    }} 
                                    placeholder="you@example.com" 
                                    readOnly={isAuthenticated}
                                    className={isAuthenticated ? "bg-gray-100 cursor-not-allowed" : ""}
                                />
                                <p className="text-xs text-gray-500 mt-2">We use your email to keep you up to date on how your campaign is going and to send important notifications about the campaign.</p>
                            </div>

                            {showPasswordField && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                    {/* Show password field if the provider list includes password or if providers are unknown */}
                                    {(emailProviders === null || emailProviders.includes('password')) && (
                                    <>
                                        <p className="text-xs text-musinova-blue">
                                            Welcome back! Please enter your password to continue with your existing account.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium">Password <span className="text-red-500">*</span></label>
                                            <Link to="/forgotten-password" title="Forgot password?" className="text-xs text-musinova-blue hover:underline">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Input 
                                            type="password" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            placeholder="••••••••" 
                                            autoFocus
                                        />
                                        <div className="flex justify-end mt-2">
                                            <Button
                                                type="button"
                                                onClick={async () => {
                                                    if (!password) {
                                                        toast({ title: 'Enter password', description: 'Please enter your password to sign in.', variant: 'destructive' });
                                                        return;
                                                    }
                                                    try {
                                                        setSignInLoading(true);
                                                        await login(email, password);
                                                        toast({ title: 'Signed in', description: 'Welcome back!' });
                                                        setShowPasswordField(false);
                                                    } catch (err) {
                                                        console.error('Login failed', err);
                                                        toast({ title: 'Login failed', description: 'Please check your password and try again.', variant: 'destructive' });
                                                    } finally {
                                                        setSignInLoading(false);
                                                    }
                                                }}
                                                disabled={signInLoading}
                                            >
                                                {signInLoading ? 'Signing in...' : 'Sign in'}
                                            </Button>
                                        </div>

                                    </>
                                    )}

                                    {/* If providers include social methods, show those buttons */}
                                    {emailProviders && (emailProviders.includes('google.com') || emailProviders.includes('microsoft.com')) && (
                                    <>
                                        <div className="relative py-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-gray-200"></span>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {emailProviders.includes('google.com') && (
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={async () => {
                                                    try {
                                                        await loginWithGoogle();
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                                className="w-full"
                                            >
                                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                                Google
                                            </Button>
                                            )}

                                            {emailProviders.includes('microsoft.com') && (
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={async () => {
                                                    try {
                                                        await loginWithMicrosoft();
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                                className="w-full"
                                            >
                                                <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                                                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                                    <path fill="#f35325" d="M1 1h10v10H1z" />
                                                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                                                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                                                </svg>
                                                Microsoft
                                            </Button>
                                            )}
                                        </div>
                                    </>
                                    )}
                                </div>
                            )}

                            {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900">Order Summary</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Campaign Plan</span>
                                    <span className="font-medium">${planAmount}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Estimated Ad Spend ({planAmount <= 100 ? '55%' : '65%'})</span>
                                    <span>${(planAmount * (planAmount <= 100 ? 0.55 : 0.65)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>MusiNova Service Fee ({planAmount <= 100 ? '45%' : '35%'})</span>
                                    <span>${(planAmount * (planAmount <= 100 ? 0.45 : 0.35)).toFixed(2)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${planAmount}</span>
                                </div>
                            </div> */}

                            <div className="flex justify-between">
                                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                                    <ArrowLeft size={16} className="mr-2" /> Back
                                </Button>

                                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : (
                                        <>
                                            Continue to Payment <ArrowRight size={16} className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateCampaign;
