import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

type Props = {
  playlist: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
};

const SubmitToPlaylistDialog: React.FC<Props> = ({ playlist, open, onOpenChange, trigger }) => {
  const { isAuthenticated, loginAnonymously } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { message: '', trackId: '', playlistId: playlist?.id || '' },
  });

  React.useEffect(() => {
    form.reset({ message: '', trackId: '', playlistId: playlist?.id || '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.id]);

  const extractTrackId = (url: string): string | null => {
    try {
      const urlMatch = url.match(/track\/([a-zA-Z0-9]+)/);
      if (urlMatch) return urlMatch[1];
      const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
      if (uriMatch) return uriMatch[1];
      if (/^[a-zA-Z0-9]+$/.test(url)) return url;
      return null;
    } catch (err) {
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    form.setValue('playlistId', playlist?.id || values.playlistId);
    try {
      const finalTrackId = extractTrackId(values.trackId) || values.trackId;
      const body = { message: values.message, trackId: finalTrackId, playlistId: values.playlistId };

      if (!isAuthenticated) {
        const { ensureGuestUser } = await import('@/lib/guestUser');
  const res = await ensureGuestUser(loginAnonymously, '', 'pending_submission', body);
        if (!res.success) return; // helper handles persistence/redirect
      }

      const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;
      const url = `${baseUrl}submission`;
      let accessToken = localStorage.getItem('access_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

      if (res.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('musinova_user');
        if (isAuthenticated) {
          window.location.href = '/login';
        } else {
          localStorage.setItem('pending_submission', JSON.stringify(body));
          window.location.href = '/payment-credits';
        }
        return;
      }

      const parseErrorBody = async (r: Response) => {
        try {
          const ct = r.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const data = await r.json();
            if (typeof data === 'string') return data;
            return data.detail || data.message || data.error || JSON.stringify(data);
          }
          return await r.text();
        } catch (e) {
          return 'An error occurred';
        }
      };

      if (res.status === 404) {
        const bodyMsg = await parseErrorBody(res);
        toast({ title: 'Not enough credits', description: bodyMsg || 'You do not have enough credits to submit. Please top up.', variant: 'destructive' });
        localStorage.setItem('pending_submission', JSON.stringify(body));
        return;
      }

      if (!res.ok) {
        const bodyMsg = await parseErrorBody(res);
        throw new Error(bodyMsg || 'Failed to submit track');
      }

      toast({ title: 'Submission sent', description: 'Your track has been submitted to the playlist.' });
      onOpenChange(false);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err.message || 'Could not submit track', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit to {playlist?.playlist_name}</DialogTitle>
          <DialogDescription>Provide your track ID and a short message to submit your track for review.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('playlistId')} />

            <FormField control={form.control} name="trackId" render={({ field }) => (
              <FormItem>
                <FormLabel>Track ID</FormLabel>
                <FormControl>
                  <Input placeholder="https://open.spotify.com/track/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="message" render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short message for the curator" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

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
  );
};

export default SubmitToPlaylistDialog;
