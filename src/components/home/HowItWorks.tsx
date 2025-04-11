
import React from 'react';
import { CheckCircle, Music, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-12">How Musi-Nova Works?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4 mx-auto">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3 text-musinova-darkgray">1. Check Your Playlist</h3>
            <p className="text-gray-600 text-center">
              Our playlist checker ensures your playlist is optimized for promotion, with the right mix of songs and structure.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4 mx-auto">
              <Music size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3 text-musinova-darkgray">2. Create Your Campaign</h3>
            <p className="text-gray-600 text-center">
              Set your budget and duration. We'll create custom ads for your playlist, targeting the right audience.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-musinova-green rounded-full flex items-center justify-center text-white mb-4 mx-auto">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3 text-musinova-darkgray">3. Monitor Results</h3>
            <p className="text-gray-600 text-center">
              Track your campaign's performance with our detailed dashboard and watch your playlist grow.
            </p>
          </div>
        </div>
      </div>
    </section>;
};

export default HowItWorks;
