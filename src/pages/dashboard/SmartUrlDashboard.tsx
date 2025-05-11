import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';


// Cache object to store fetched data
const cache: Record<string, any> = {};

type MetaMetadata = {
  ad_account_id: string;
  business_id: string;
  pixel_id: string;
}


// Function to fetch data with caching
const fetchWithCache = async (key: string, fetcher: () => Promise<any>) => {
  if (cache[key]) {
    console.log(`Cache hit for key: ${key}`);
    return cache[key];
  }

  console.log(`Cache miss for key: ${key}`);
  const data = await fetcher();
  cache[key] = data; // Store the result in the cache
  return data;
};


const SmartUrlDashboard = () => {
  const [error, setError] = useState<string | null>(null);
  const [metaMetadata, setMetaMetadata] = useState<MetaMetadata[]>([]);
  const [selectedMetaMetadata, setSelectedMetaMetadata] = useState<string>('all');
  const [loadingMetaMetadata, setLoadingMetaMetadata] = useState(true);
  const [playlistId, setPlaylistId] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractPlaylistId = (url: string): string | null => {
    try {
      const regex = /playlist\/([a-zA-Z0-9]+)/; // Match "playlist/" followed by alphanumeric characters
      const match = url.match(regex);
      return match ? match[1] : null; // Return the playlist ID if found, otherwise null
    } catch (error) {
      console.error('Error extracting playlist ID:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Find the selected metadata object
    const selectedMetadata = metaMetadata.find(
      (metadata) => metadata.ad_account_id === selectedMetaMetadata
    );

    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      toast({
        title: "Error",
        description: "Invalid playlist URL. Please provide a valid Spotify playlist link.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMetadata || !playlistId) {
      toast({
        title: 'Error',
        description: 'All fields are required. Please fill out the form completely.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Make an API call to add the Meta Metadata
      const postResponse = await apiFetch(`team/meta-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_id: selectedMetadata.business_id,
          ad_account_id: selectedMetadata.ad_account_id,
          pixel_id: selectedMetadata.pixel_id,
        }),
      });

      const response = await apiFetch(
        `spotify/playlist/${playlistId}/smart-url?ad_account_id=${selectedMetadata.ad_account_id}&pixel_id=${selectedMetadata.pixel_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast({
        title: 'Success',
        description: 'Smart URL created successfully!',
        variant: 'default',
      });

      // Open the Smart URL in a new window
      const smartUrl = `https://mn-api.jms.rocks/spotify/playlist/${playlistId}/smart-url?ad_account_id=${selectedMetadata.ad_account_id}&pixel_id=${selectedMetadata.pixel_id}`;
      window.open(smartUrl, '_blank');
    } catch (error) {
      console.error('Error creating Smart URL:', error);
      toast({
        title: 'Error',
        description: (
          <>
            <p>Your Facebook business is not registered with Musi-Nova.</p>
            <p>Please send us your business ID, pixel ID, and ad account ID.</p>
            <a href="/help" className="text-musinova-green underline">
              Contact Support
            </a>
          </>
        ),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch meta-metadata from `team/meta-metadata` with caching
  useEffect(() => {
    const fetchMetaMetadata = async () => {
      try {
        const data = await fetchWithCache('team/meta-metadata', async () => {
          const response = await apiFetch('team/meta-metadata');
          if (!response.ok) {
            throw new Error('Failed to fetch meta-metadata');
          }
          return response.json();
        });
        setMetaMetadata(data);

        // Set the default selected metadata to the first item in the list
        if (data.length > 0) {
          setSelectedMetaMetadata(data[0].ad_account_id);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching meta-metadata');
      } finally {
        setLoadingMetaMetadata(false);
      }
    };

    fetchMetaMetadata();
  }, []);

  return (
    <PageLayout showSidebar={true} className="bg-musinova-cream/30 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-musinova-navy mb-2">Smart Url Page</h1>
      </div>
      <Card>
        <CardContent className='p-6'>
          <Select value={selectedMetaMetadata} onValueChange={setSelectedMetaMetadata}>
            <label className="block text-sm font-medium mb-2">
              Select Metadata
            </label>
            <SelectTrigger className="w-full md:w-80 text-sm">
              <SelectValue placeholder="Select Metadata" />
            </SelectTrigger>
            <SelectContent>
              {metaMetadata.map((metadata) => (
                <SelectItem key={metadata.ad_account_id} value={metadata.ad_account_id}>
                  {metadata.ad_account_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-8">
              <label htmlFor="playlistUrl" className="block text-sm font-medium mb-2">
                Paste your Spotify playlist link <span className="text-red-500">*</span>
              </label>
              <Input
                id="playlistUrl"
                type="url"
                placeholder="https://open.spotify.com/playlist/..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="w-full"
              />
              {!playlistUrl && (
                <p className="text-sm text-red-500 mt-1">Playlist URL is required.</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Smart URL'}
            </Button>
          </form>
        </CardContent>

      </Card>

    </PageLayout>
  );
};

export default SmartUrlDashboard;