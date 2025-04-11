
import React from 'react';
import { Music, Globe, BarChart3, Headphones } from 'lucide-react';

const PainPoints = () => {
  return <section className="py-16 bg-gradient-to-br from-white to-musinova-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">
          Struggling to Get Your Music Heard?
        </h2>
        <p className="text-center text-musinova-darkgray mb-12 max-w-2xl mx-auto">Are you tired of pitching your music to playlists that have low streams or fake listeners? You are not alone. Independent artists face these common challenges every day.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4">
              <Music size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-musinova-darkgray">Algorithm Frustration</h3>
            <p className="text-gray-600">
              Feeling invisible on streaming platforms despite creating amazing music? The algorithms seem to favor already established artists.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-musinova-darkgray">Limited Reach</h3>
            <p className="text-gray-600">
              Your local fans love you, but breaking into new markets and reaching international audiences seems impossible.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-musinova-darkgray">Wasted Ad Spend</h3>
            <p className="text-gray-600">
              Tried running your own ads but saw poor results? Without expertise, ad money often goes down the drain with little return.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4">
              <Headphones size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-musinova-darkgray">Playlist Rejections</h3>
            <p className="text-gray-600">
              Constantly submitting to playlists with no response? Getting your music on quality playlists seems like an impossible task.
            </p>
          </div>
        </div>
      </div>
    </section>;
};

export default PainPoints;
