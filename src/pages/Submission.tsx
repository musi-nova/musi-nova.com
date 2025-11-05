import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import './DashboardTopupBtn.css';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { CheckCircle, XCircle } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

// Lightweight lazy-loading image component using IntersectionObserver
const LazyImage: React.FC<{
    src: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
}> = ({ src, alt = '', className = '', style }) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = React.useState(false);
    const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                    }
                });
            });
            io.observe(node);
            return () => io.disconnect();
        }

        // Fallback: load immediately
        setVisible(true);
    }, []);

    React.useEffect(() => {
        if (visible) setLoadedSrc(src);
    }, [visible, src]);

    return (
        <div ref={ref} className={className} style={style}>
            {loadedSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={loadedSrc} alt={alt} className={className} style={style} />
            ) : (
                <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}></div>
            )}
        </div>
    );
};

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
    const { isAuthenticated } = useAuth();
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
        trackId: z.string().min(1, 'Track ID is required'),
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

    const daysSince = (iso?: string | null) => {
        if (!iso) return null;
        try {
            const then = new Date(iso);
            const now = new Date();
            const diff = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
            if (diff <= 0) return 'Today';
            if (diff === 1) return '1 day ago';
            return `${diff} days ago`;
        } catch (e) {
            return null;
        }
    };

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

            // Use a direct fetch so we can inspect 404 responses (insufficient credits)
            const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;
            const url = `${baseUrl}submission`;
            const accessToken = localStorage.getItem('access_token');
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });

            if (res.status === 401) {
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
                return;
            }

            if (!res.ok) {
                const bodyMsg = await parseErrorBody(res);
                throw new Error(bodyMsg || 'Failed to submit track');
            }

            toast({ title: 'Submission sent', description: 'Your track has been submitted to the playlist.' });
            closeDialog();
        } catch (err: any) {
            console.error(err);
            toast({ title: 'Error', description: err.message || 'Could not submit track', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout showSidebar={isAuthenticated}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-musinova-navy">{viewMode === 'playlists' ? 'Our Playlists' : 'Your Submissions'}</h1>
                        <p className="text-gray-600">{viewMode === 'playlists' ? "Submit your music to possibly be featured in MusiNova's playlists!" : 'Your recent submissions and their review status.'}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            className="text-sm md:text-base bg-musinova-brown text-white font-bold px-6 py-3 rounded-xl shadow-lg border-2 border-musinova-brown hover:bg-white hover:text-musinova-brown transition-all flex items-center gap-2 dashboard-topup-btn"
                            style={{ boxShadow: '0 0 0 2px #8B5A2B, 0 2px 8px 0 rgba(0,0,0,0.08)' }}
                            onClick={() => (window.location.href = "/payment-credits")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Buy Credits</span>
                        </Button>
                        <Button size="sm" variant={viewMode === 'playlists' ? undefined : 'outline'} onClick={() => setViewMode('playlists')}>Playlists</Button>
                        {isAuthenticated && (
                            <Button size="sm" variant={viewMode === 'submissions' ? undefined : 'outline'} onClick={() => setViewMode('submissions')}>Your Submissions</Button>
                        )}
                    </div>
                </div>

                {/* Filters for playlists view */}
                {viewMode === 'playlists' && (
                    <div className="mb-4 flex justify-center">
                        <div className="w-full max-w-6xl bg-white p-4 rounded-md shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <input className="flex-1 min-w-[160px] border p-2 rounded" placeholder="Search by name" value={filterName} onChange={(e) => setFilterName(e.target.value)} />

                                <div className="relative">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-left border p-2 rounded">{filterGenres.length > 0 ? filterGenres.join(', ') : 'Filter genres'}</button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Genres</DropdownMenuLabel>
                                            {uniqueGenres.map((g) => (
                                                <DropdownMenuCheckboxItem key={g} checked={filterGenres.includes(g)} onCheckedChange={(v) => toggleGenre(g, !!v)}>{g}</DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="relative">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-left border p-2 rounded">{filterMoods.length > 0 ? filterMoods.join(', ') : 'Filter moods'}</button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Moods</DropdownMenuLabel>
                                            {uniqueMoods.map((m) => (
                                                <DropdownMenuCheckboxItem key={m} checked={filterMoods.includes(m)} onCheckedChange={(v) => toggleMood(m, !!v)}>{m}</DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <select className="border p-2 rounded" value={filterInstrumental === null ? 'any' : filterInstrumental ? 'yes' : 'no'} onChange={(e) => setFilterInstrumental(e.target.value === 'any' ? null : e.target.value === 'yes')}>
                                    <option value="any">Any instrumentality</option>
                                    <option value="yes">Instrumental only</option>
                                    <option value="no">Contains vocals only</option>
                                </select>

                                <input type="number" className="border p-2 rounded w-32" placeholder="Max credits" value={filterMaxCredits ?? ''} onChange={(e) => setFilterMaxCredits(e.target.value ? Number(e.target.value) : null)} />

                                <button className="ml-auto text-sm text-musinova-navy" onClick={() => { setFilterName(''); setFilterGenres([]); setFilterMoods([]); setFilterInstrumental(null); setFilterMaxCredits(null); }}>Clear</button>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'playlists' && loading && <div className="text-center py-12">Loading...</div>}
                {viewMode === 'playlists' && error && <div className="text-center py-6 text-destructive">{error}</div>}
                {viewMode === 'submissions' && isAuthenticated && subsLoading && <div className="text-center py-12">Loading your submissions...</div>}
                {viewMode === 'submissions' && isAuthenticated && subsError && <div className="text-center py-6 text-destructive">{subsError}</div>}

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
                                                <Dialog open={activePlaylist?.id === item.id} onOpenChange={(open) => {
                                                    if (open) openSubmitDialog(item);
                                                    else closeDialog();
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="ml-auto" onClick={() => openSubmitDialog(item)}>Submit to playlist</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Submit to {item.playlist_name}</DialogTitle>
                                                            <DialogDescription>Provide your track ID and a short message to submit your track for review.</DialogDescription>
                                                        </DialogHeader>

                                                        <Form {...form}>
                                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                                <input type="hidden" {...form.register('playlistId')} />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="trackId"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Track ID</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="https://open.spotify.com/track/..." {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <FormField
                                                                    control={form.control}
                                                                    name="message"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Message</FormLabel>
                                                                            <FormControl>
                                                                                <Textarea placeholder="Short message for the curator" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <Button type="submit">Send Submission</Button>
                                                                </DialogFooter>
                                                            </form>
                                                        </Form>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </>
                )}

                {viewMode === 'submissions' && isAuthenticated && (
                    <>
                        {!subsLoading && !subsError && userSubmissions.length === 0 && (
                            <div className="text-center py-12">You have no submissions yet.</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userSubmissions.map((s: any) => (
                                <Card key={s.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-40 bg-gray-100 w-full flex items-center justify-center overflow-hidden">
                                        {s.track_image_url ? (
                                            <LazyImage src={s.track_image_url} alt={s.playlist?.playlist_name ?? 'Track image'} className="w-full h-full object-cover" />
                                        ) : s.playlist?.image_url ? (
                                            <LazyImage src={s.playlist.image_url} alt={s.playlist.playlist_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-gray-400">No image or track</div>
                                        )}

                                        {/* status icon overlay */}
                                        {s.reviewed && (
                                            <div className="absolute top-2 right-2 z-10">
                                                {s.accepted ? (
                                                    <CheckCircle className="text-green-600 bg-white rounded-full p-0.5" size={30} />
                                                ) : (
                                                    <XCircle className="text-red-600 bg-white rounded-full p-0.5" size={30} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="pt-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">Submission to {s.playlist?.playlist_name ?? s.playlist_id}</h3>
                                                <div className="text-sm text-gray-600 mt-1">{s.message}</div>
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                                {s.reviewed ? (
                                                    <span className="text-sm text-gray-700">{daysSince(s.reviewed_at ?? s.playlist?.reviewed_at) ?? 'Reviewed'}</span>
                                                ) : (
                                                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Pending</span>
                                                )}
                                            </div>
                                        </div>

                                        {s.review_remarks && (
                                            <div className="mt-3">
                                                <div className={`p-3 rounded text-sm ${s.accepted === true ? 'bg-green-50 border border-green-200 text-green-800' : s.accepted === false ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'}`}>
                                                    <strong className="block font-medium">Review notes</strong>
                                                    <div className="mt-1">{s.review_remarks}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => window.open(s.playlist?.playlist_url ?? s.playlist_url, '_blank')}>View Playlist</Button>
                                            <Button variant="ghost" size="sm" onClick={() => window.open(`https://open.spotify.com/track/${s.track_id}`, '_blank')}>View Track</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default SubmissionPage;
