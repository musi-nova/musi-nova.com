import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;

const SmartUrl = () => {
  const [businessId, setBusinessId] = useState('');
  const [adAccountId, setAdAccountId] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessId || !adAccountId || !pixelId || !playlistId) {
      toast({
        title: 'Error',
        description: 'All fields are required. Please fill out the form completely.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // make an API call to add the Meta Metadata
      const postResponse = await apiFetch(
        `team/meta-metadata`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            business_id: businessId,
            ad_account_id: adAccountId,
            pixel_id: pixelId,
          }),
        }
      );

      const response = await apiFetch(
        `spotify/playlist/${playlistId}/smart-url?ad_account_id=${adAccountId}&pixel_id=${pixelId}`,
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
      const smartUrl = `${baseUrl}spotify/playlist/${playlistId}/smart-url?ad_account_id=${adAccountId}&pixel_id=${pixelId}`;
      window.open(smartUrl, '_blank');
    } catch (error) {
      console.error('Error creating Smart URL:', error);
      toast({
        title: 'Error',
        description: (
          <>
            <p>Your facebook business is not registered with MusiNova.</p>
            <p>Please send us your business id, pixel id, and ad account id.</p>
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

  return (
    <PageLayout className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Create Smart URL</h1>
        <p className="text-center text-gray-600 mb-6">
          To be able to create a smart URL, we need to get access permissions from your Facebook Business account.
          For more information, please check our tutorial on how to create a smart URL, and contact support with the required information.
        </p>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all"
                onClick={() => {
                  window.open('https://www.youtube.com/watch?v=FhHpHJ7dg6o', '_blank');
                }}
              >
                Tutorial
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all"
                onClick={() => {
                  window.open('/help', '_blank');
                }}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="businessId" className="block text-sm font-medium mb-2">
                  Business ID
                </label>
                <input
                  id="businessId"
                  type="text"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="adAccountId" className="block text-sm font-medium mb-2">
                  Ad Account ID
                </label>
                <input
                  id="adAccountId"
                  type="text"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="pixelId" className="block text-sm font-medium mb-2">
                  Pixel ID
                </label>
                <input
                  id="pixelId"
                  type="text"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="playlistId" className="block text-sm font-medium mb-2">
                  Playlist ID
                </label>
                <input
                  id="playlistId"
                  type="text"
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
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
      </div>
    </PageLayout>
  );
};

export default SmartUrl;