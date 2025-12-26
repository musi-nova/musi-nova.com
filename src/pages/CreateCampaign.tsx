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

const defaultTracks = [''];

const CreateCampaign: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // try to read plan amount passed via navigation state
    const planAmountFromState = (location.state as any)?.planAmount as number | undefined;
    const [planAmount] = useState<number>(planAmountFromState || 197);

    const [email, setEmail] = useState('');
    const [tracks, setTracks] = useState<string[]>(defaultTracks);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { isAuthenticated, user, login, register } = useAuth();

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
            // Ensure guest user exists if not authenticated. Try to create a user with the provided email.
            if (!isAuthenticated) {
                const guestPassword = (import.meta as any).env?.VITE_MN_GUEST_DEFAULT_PASSWORD || 'changeme1234';
                const userName = (email && email.split('@')[0]) || `guest_${Date.now()}`;
                const genericUser = {
                    name: userName,
                    email,
                    password: guestPassword,
                    created_at: new Date().toISOString(),
                    super_user: false,
                    plan_1_user: true,
                    plan_2_user: false,
                    plan_3_user: false,
                };

                try {
                    await apiFetch('user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(genericUser),
                    });

                    // login the newly created guest using provided email + guest password
                    try {
                        await login(email, guestPassword);
                    } catch (err) {
                        console.warn('Created guest user but failed to login automatically', err);
                    }
                } catch (err: any) {
                    if (err.message.includes('400')) {
                        toast({
                            title: 'Account already exists',
                            description: (
                                <span>
                                    An account with this email already exists. Please{' '}
                                    <Link to="/login" className="underline font-bold">
                                        log in
                                    </Link>{' '}
                                    to continue.
                                </span>
                            ),
                            variant: 'destructive',
                        });
                        setIsSubmitting(false);
                        return;
                    }

                    // creation failed for other reasons: try to login with guest password as a fallback
                    try {
                        await login(email, guestPassword);
                    } catch (loginErr) {
                        // final fallback: use ensureGuestUser which will persist pending data and redirect
                        console.warn('Failed to create/login with provided email, falling back to generic guest', loginErr);
                        try {
                            const pending = { email, tracks: sanitizedTracks, planAmount, createdAt: new Date().toISOString() };
                            const { ensureGuestUser } = await import('@/lib/guestUser');
                            const res = await ensureGuestUser(login, register, 'pendingCampaign', pending);
                            if (!res.success) {
                                toast({ title: 'Error', description: 'Failed to create a guest account. Please try again.', variant: 'destructive' });
                                return;
                            }
                            // ensureGuestUser will redirect — stop further processing
                            return;
                        } catch (e) {
                            console.error('Fallback ensureGuestUser failed', e);
                            toast({ title: 'Error', description: 'Failed to create a guest account. Please try again.', variant: 'destructive' });
                            return;
                        }
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

            // Build credits-style payload expected by stripe/create-checkout-session/credits
            const payload = {
                paymentType: 'credits',
                creditsAmount: planAmount,
                selectedCampaign,
                breakdown,
            };

            // Use the credits flow page: persist the prepared campaign and route user to /payment-credits
            try {
                localStorage.setItem('pendingCampaign', JSON.stringify({ ...campaignResult }));
                // Directly create checkout session for credits and redirect
                const creditsResp = await apiFetch('stripe/create-checkout-session/credits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!creditsResp.ok) throw new Error('Failed to create credits checkout session');
                const { url } = await creditsResp.json();
                window.location.href = url;
            } catch (err) {
                console.error('Failed to create credits checkout session', err);
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
                            <p className="mt-2 text-sm">(All your songs are important to us of course, but the higher they are ranked the more streams they will get)</p>
                            <p className="mt-2">We will blend your songs in with popular music within your genre, so people will love the playlist, and your music will be discovered as a result.</p>
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
                                <label className="block text-sm font-medium mb-2">Email <span className="text-red-500">*</span></label>
                                <Input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="you@example.com" 
                                    readOnly={isAuthenticated}
                                    className={isAuthenticated ? "bg-gray-100 cursor-not-allowed" : ""}
                                />
                                <p className="text-xs text-gray-500 mt-2">We use your email to keep you up to date on how your campaign is going and to send important notifications about the campaign.</p>
                            </div>

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
