import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';
import { daysSince, toShort } from '@/lib/uiUtils';
import { CheckCircle, XCircle } from 'lucide-react';

type Props = {
  submissions: any[];
  loading?: boolean;
  error?: string | null;
};

const UserSubmissionsList: React.FC<Props> = ({ submissions, loading, error }) => {
  if (loading) return <div className="text-center py-12">Loading your submissions...</div>;

  // Friendly empty state when API returns "No submissions" or when the list is empty
  const isNoSubmissionsError = typeof error === 'string' && error.toLowerCase().includes('no submissions');
  if (isNoSubmissionsError || !submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">You currently don't have any submissions</h3>
        <p className="text-sm text-gray-600 mt-2">When you do, they'll show up here.</p>
        <div className="mt-4">
          <Button onClick={() => { window.location.href = '/submissions'; }}>Go to submissions page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {submissions.map((s: any) => (
        <Card key={s.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-40 bg-gray-100 w-full flex items-center justify-center overflow-hidden">
            {s.track_image_url ? (
              <LazyImage src={s.track_image_url} alt={s.playlist?.playlist_name ?? 'Track image'} className="w-full h-full object-cover" />
            ) : s.playlist?.image_url ? (
              <LazyImage src={s.playlist.image_url} alt={s.playlist.playlist_name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400">No image or track</div>
            )}

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
                <div className="text-sm text-gray-600 mt-1">{toShort(s.message)}</div>
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
  );
};

export default UserSubmissionsList;
