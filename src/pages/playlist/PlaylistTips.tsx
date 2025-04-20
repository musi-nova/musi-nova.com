
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { playlistCheckerTabs } from '@/config/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const tips = [
  {
    title: "Keep your playlist name simple and searchable",
    description: "Use a straightforward name that includes your genre and possibly the year. For example, 'Chill Electronic 2025' is better than 'Vibes for the Soul: A Journey Through Sound'."
  },
  {
    title: "Limit to 30-50 songs",
    description: "Too few songs and listeners won't stick around; too many and your songs get lost. The sweet spot is between 30-50 tracks for promotional playlists."
  },
  {
    title: "Include 4-10 of your own songs",
    description: "Don't oversaturate the playlist with your own music. Include 4-10 of your songs, spaced evenly throughout the playlist."
  },
  {
    title: "Ensure genre consistency",
    description: "Your playlist should have a consistent vibe or theme. Listeners expect cohesion, so avoid mixing vastly different genres unless that's your specific goal."
  },
  {
    title: "Update regularly",
    description: "Refresh your playlist every 2-4 weeks with new tracks. This keeps listeners coming back and shows Spotify that your playlist is active."
  },
  {
    title: "Create an attractive cover image",
    description: "Design a clear, eye-catching cover that represents your playlist's theme. Use high-quality images with minimal text."
  },
  {
    title: "Write a compelling description",
    description: "Include relevant keywords and a concise description of what listeners can expect. This helps with searchability and sets expectations."
  },
  {
    title: "Consider track order carefully",
    description: "Start with engaging tracks that hook listeners. Create a flow that makes sense, with tempo and energy changes that feel natural."
  }
];

const PlaylistTips = () => {
  return (
    <PageLayout tabs={playlistCheckerTabs} className="bg-gray-50 py-6 md:py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-musinova-navy mb-2">Playlist Optimization Tips</h1>
          <p className="text-gray-600">
            Expert advice to make your playlists more effective for promotion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tips.map((tip, index) => (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-musinova-cream flex items-center justify-center">
                      <CheckCircle size={20} className="text-musinova-green" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-musinova-darkgray mb-2">{tip.title}</h3>
                    <p className="text-gray-600 text-sm">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* <Card className="border border-musinova-lightyellow bg-musinova-cream">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-center">Expert Playlist Consultation</h2>
            <p className="text-gray-700 text-center mb-6">
              Need personalized advice for your specific genre or audience? Our music promotion experts can help optimize your playlist strategy.
            </p>
            <div className="flex justify-center">
              <button className="btn-primary">Book a Consultation</button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </PageLayout>
  );
};

export default PlaylistTips;
