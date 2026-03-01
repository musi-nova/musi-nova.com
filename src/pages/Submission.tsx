import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import './DashboardTopupBtn.css';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useForm } from 'react-hook-form';
import UserSubmissionsList from '@/components/UserSubmissionsList';
import LazyImage from '@/components/LazyImage';
import SubmitToPlaylistDialog from '@/components/SubmitToPlaylistDialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

type Submission = {
    id: string;
    playlist_id: string;
    playlist_name: string;
    playlist_url?: string;
    genres: string[];
    moods: string[];
    instrumental: boolean;
    image_url?: string;
    credit_amount?: number;
    created_at?: string;
    submissions?: any[];
};

const SubmissionPage = () => {
    const { isAuthenticated, loginAnonymously } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'playlists' | 'submissions'>('playlists');
    const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
    const [subsLoading, setSubsLoading] = useState(false);
    const [subsError, setSubsError] = useState<string | null>(null);
    // Filters for playlists view
    const [filterName, setFilterName] = useState('');
    const [filterGenres, setFilterGenres] = useState<string[]>([]);
    const [filterMoods, setFilterMoods] = useState<string[]>([]);
    const [filterInstrumental, setFilterInstrumental] = useState<null | boolean>(null);
    const [filterMaxCredits, setFilterMaxCredits] = useState<number | null>(null);

    const uniqueGenres = React.useMemo(() => {
        const set = new Set<string>();
        items.forEach((it) => it.genres?.forEach((g: string) => set.add(g)));
        return Array.from(set).sort();
    }, [items]);

    const uniqueMoods = React.useMemo(() => {
        const set = new Set<string>();
        items.forEach((it) => it.moods?.forEach((m: string) => set.add(m)));
        return Array.from(set).sort();
    }, [items]);

    const toggleGenre = (g: string, checked?: boolean) => {
        setFilterGenres((prev) => {
            const exists = prev.includes(g);
            if (checked === undefined) checked = !exists;
            if (checked && !exists) return [...prev, g];
            if (!checked && exists) return prev.filter(x => x !== g);
            return prev;
        });
    };

    const toggleMood = (m: string, checked?: boolean) => {
        setFilterMoods((prev) => {
            const exists = prev.includes(m);
            if (checked === undefined) checked = !exists;
            if (checked && !exists) return [...prev, m];
            if (!checked && exists) return prev.filter(x => x !== m);
            return prev;
        });
    };
    const [activePlaylist, setActivePlaylist] = useState<Submission | null>(null);
    const { toast } = useToast();

    const schema = z.object({
        message: z.string().min(1, 'Message is required'),
        trackId: z.string().min(1, 'Track ID is required').refine((val) => {
            if (!val) return false;
            const raw = val.trim();
            const looksLikeId = /^[a-zA-Z0-9]+$/.test(raw);
            const containsTrack = /track/i.test(raw);
            return containsTrack || looksLikeId;
        }, { message: 'Please provide a valid Spotify track URL (must include "track") or a valid track ID.' }),
        playlistId: z.string().min(1),
    });

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            message: '',
            trackId: '',
            playlistId: '',
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const extractTrackId = (url: string): string | null => {
        try {
            // Match URLs like https://open.spotify.com/track/ID
            const urlMatch = url.match(/track\/([a-zA-Z0-9]+)/);
            if (urlMatch) return urlMatch[1];

            // Match spotify:track:ID
            const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
            if (uriMatch) return uriMatch[1];

            // If it looks like an ID already, return it
            if (/^[a-zA-Z0-9]+$/.test(url)) return url;

            return null;
        } catch (err) {
            console.error('Error extracting track id', err);
            return null;
        }
    };

    useEffect(() => {
        const fetchMusiNovaPlaylists = async () => {
            try {
                const res = await apiFetch('musi-nova-playlists');
                if (!res.ok) throw new Error('Failed to fetch playlists');
                const data = await res.json();
                setItems(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Error fetching playlists');
            } finally {
                setLoading(false);
            }
        };

        fetchMusiNovaPlaylists();
    }, []);

    useEffect(() => {
        // Fetch user submissions when the user switches to that view
        if (viewMode !== 'submissions') return;

        const fetchUserSubmissions = async () => {
            setSubsLoading(true);
            setSubsError(null);
            try {
                const res = await apiFetch('team/submissions');
                if (!res.ok) throw new Error('Failed to fetch your submissions');
                const data = await res.json();
                setUserSubmissions(data);
            } catch (err: any) {
                console.error(err);
                setSubsError(err.message || 'Error fetching submissions');
            } finally {
                setSubsLoading(false);
            }
        };

        fetchUserSubmissions();
    }, [viewMode]);

    const openSubmitDialog = (playlist: Submission) => {
        setActivePlaylist(playlist);
        form.reset({ message: '', trackId: '', playlistId: playlist.id });
    };

    const closeDialog = () => {
        setActivePlaylist(null);
        form.reset();
    };

    const onSubmit = async (values: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        try {
            const finalTrackId = extractTrackId(values.trackId) || values.trackId;
            const body = {
                message: values.message,
                trackId: finalTrackId,
                playlistId: values.playlistId,
            };

            // If the user is not authenticated, ensure a guest user exists and is logged in
            if (!isAuthenticated) {
                const { ensureGuestUser } = await import('@/lib/guestUser');
                const res = await ensureGuestUser(loginAnonymously, '', 'pending_submission', body);
                if (!res.success) return; // ensureGuestUser handles persisting and redirecting on failure
            }

            // Use a direct fetch so we can inspect 404 responses (insufficient credits)
            const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;
            const url = `${baseUrl}submission`;
            let accessToken = localStorage.getItem('access_token');
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });

            if (res.status === 401) {
                // clear local tokens and either redirect to login or save pending submission
                localStorage.removeItem('access_token');
                localStorage.removeItem('musinova_user');
                if (isAuthenticated) {
                    window.location.href = '/login';
                } else {
                    // Store attempted submission in localStorage and redirect to PaymentCredits
                    localStorage.setItem('pending_submission', JSON.stringify(body));
                    window.location.href = '/payment-credits';
                }
                return;
            }

            // Helper: safely parse JSON error body or fallback to text
            const parseErrorBody = async (r: Response) => {
                try {
                    const ct = r.headers.get('content-type') || '';
                    if (ct.includes('application/json')) {
                        const data = await r.json();
                        if (typeof data === 'string') return data;
                        // Common fields: detail, message, error
                        return data.detail || data.message || data.error || JSON.stringify(data);
                    }
                    return await r.text();
                } catch (e) {
                    return 'An error occurred';
                }
            };

            if (res.status === 404) {
                // Backend uses 404 to indicate no/insufficient credits
                const bodyMsg = await parseErrorBody(res);
                toast({ title: 'Not enough credits', description: bodyMsg || 'You do not have enough credits to submit. Please top up.', variant: 'destructive' });
                // Persist pending submission so user can complete after topping up
                localStorage.setItem('pending_submission', JSON.stringify(body));
                return;
            }

            if (!res.ok) {
                const bodyMsg = await parseErrorBody(res);
                throw new Error(bodyMsg || 'Failed to submit track');
            }

            toast({ title: 'Submission sent', description: 'Your track has been submitted to the playlist.' });
            closeDialog();
            // New users receive 2 credits on signup; send them to the dashboard
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            toast({ title: 'Error', description: err.message || 'Could not submit track', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout showSidebar={isAuthenticated}>
            <div className="max-w-7xl mx-auto px-8 md:px-12 pt-24 pb-12">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-musinova-green">{viewMode === 'playlists' ? 'Our Playlists' : 'Your Submissions'}</h1>
                        <p className="text-gray-600">{viewMode === 'playlists' ? "Submit your music to possibly be featured in MusiNova's playlists!" : 'Your recent submissions and their review status.'}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Button size="sm" variant={viewMode === 'playlists' ? undefined : 'outline'} onClick={() => setViewMode('playlists')}>Playlists</Button>
                                <Button size="sm" variant={viewMode === 'submissions' ? undefined : 'outline'} onClick={() => setViewMode('submissions')}>Your Submissions</Button>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Filters for playlists view */}
                {viewMode === 'playlists' && (
                    <div className="mb-4 flex justify-center">
                        <div className="w-full bg-white p-6 rounded-2xl shadow-md">
                            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3">
                                <input className="w-full md:flex-1 min-w-[160px] border p-2 rounded" placeholder="Search by name" value={filterName} onChange={(e) => setFilterName(e.target.value)} />

                                <div className="relative w-full md:w-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="w-full text-left border p-2 rounded truncate">{filterGenres.length > 0 ? filterGenres.join(', ') : 'Filter genres'}</button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[200px]">
                                            <DropdownMenuLabel>Genres</DropdownMenuLabel>
                                            {uniqueGenres.map((g) => (
                                                <DropdownMenuCheckboxItem key={g} checked={filterGenres.includes(g)} onCheckedChange={(v) => toggleGenre(g, !!v)}>{g}</DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="relative w-full md:w-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="w-full text-left border p-2 rounded truncate">{filterMoods.length > 0 ? filterMoods.join(', ') : 'Filter moods'}</button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[200px]">
                                            <DropdownMenuLabel>Moods</DropdownMenuLabel>
                                            {uniqueMoods.map((m) => (
                                                <DropdownMenuCheckboxItem key={m} checked={filterMoods.includes(m)} onCheckedChange={(v) => toggleMood(m, !!v)}>{m}</DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <select className="w-full md:w-auto border p-2 rounded" value={filterInstrumental === null ? 'any' : filterInstrumental ? 'yes' : 'no'} onChange={(e) => setFilterInstrumental(e.target.value === 'any' ? null : e.target.value === 'yes')}>
                                    <option value="any">Any instrumentality</option>
                                    <option value="yes">Instrumental only</option>
                                    <option value="no">Contains vocals only</option>
                                </select>

                                <input type="number" className="w-full md:w-32 border p-2 rounded" placeholder="Max credits" value={filterMaxCredits ?? ''} onChange={(e) => setFilterMaxCredits(e.target.value ? Number(e.target.value) : null)} />

                                <button className="w-full md:w-auto md:ml-auto text-sm text-musinova-green py-2" onClick={() => { setFilterName(''); setFilterGenres([]); setFilterMoods([]); setFilterInstrumental(null); setFilterMaxCredits(null); }}>Clear</button>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'playlists' && loading && <div className="text-center py-12">Loading...</div>}
                {viewMode === 'playlists' && error && <div className="text-center py-6 text-destructive">{error}</div>}
                {/* {viewMode === 'submissions' && isAuthenticated && subsError && <div className="text-center py-6 text-destructive">{subsError}</div>} */}

                {viewMode === 'playlists' && (
                    <>
                        {!loading && !error && items.length === 0 && (
                            <div className="text-center py-12">No playlists found.</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items
                                .filter(item => {
                                    if (filterName && !item.playlist_name.toLowerCase().includes(filterName.toLowerCase())) return false;
                                    if (filterGenres.length > 0) {
                                        const lower = item.genres?.map((g: string) => g.toLowerCase()) || [];
                                        if (!filterGenres.every(f => lower.includes(f.toLowerCase()))) return false;
                                    }
                                    if (filterMoods.length > 0) {
                                        const lower = item.moods?.map((m: string) => m.toLowerCase()) || [];
                                        if (!filterMoods.every(f => lower.includes(f.toLowerCase()))) return false;
                                    }
                                    if (filterInstrumental !== null) {
                                        if (item.instrumental !== filterInstrumental) return false;
                                    }
                                    if (filterMaxCredits !== null) {
                                        const c = item.credit_amount ?? 0;
                                        if (c > filterMaxCredits) return false;
                                    }
                                    return true;
                                })
                                .map((item) => (
                                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="h-40 bg-gray-100 w-full flex items-center justify-center overflow-hidden">
                                            {item.image_url ? (
                                                <LazyImage src={item.image_url} alt={item.playlist_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-400">No image</div>
                                            )}
                                        </div>
                                        <CardContent className="pt-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{item.playlist_name}</h3>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="inline-block text-xs bg-musinova-brown text-white px-2 py-1 rounded-full font-semibold border-2 border-musinova-brown hover:bg-white hover:text-musinova-brown transition-colors">{item.credit_amount ?? 0} credit</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {item.genres?.map((g) => (
                                                    <span key={g} className="text-xs bg-musinova-lightgreen/30 text-musinova-darkgray px-2 py-1 rounded-full">{g}</span>
                                                ))}
                                                {item.moods?.map((m) => (
                                                    <span key={m} className="text-xs bg-musinova-lightyellow/30 text-musinova-darkgray px-2 py-1 rounded-full">{m}</span>
                                                ))}
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="text-sm text-gray-600">{item.instrumental ? 'Instrumental' : 'Contains vocals'}</div>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(item.playlist_url, '_blank')}
                                                >
                                                    View
                                                </Button>
                                                <SubmitToPlaylistDialog
                                                    playlist={item}
                                                    open={activePlaylist?.id === item.id}
                                                    onOpenChange={(open) => {
                                                        if (open) openSubmitDialog(item);
                                                        else closeDialog();
                                                    }}
                                                    trigger={<Button size="sm" className="ml-auto" onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } openSubmitDialog(item); }}>Submit to playlist</Button>}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </>
                )}

                {viewMode === 'submissions' && isAuthenticated && (
                    <UserSubmissionsList submissions={userSubmissions} loading={subsLoading} error={subsError} />
                )}
            </div>
        </PageLayout>
    );
};

export default SubmissionPage;
