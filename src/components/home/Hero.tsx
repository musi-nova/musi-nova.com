
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return <section className="bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-musinova-darkgray mb-6">Promote Your Playlist on Spotify and Gain Real Listeners</h1>
          <p className="text-lg md:text-xl text-musinova-darkgray mb-10 max-w-2xl mx-auto">Reach a large audience and boost your music career with our Meta Ads campaigns. Whether you're an up-and-coming artist, an established musician or a label we have the tools to help you succeed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/campaigns/new">
              <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all">
                Launch Campaign <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/playlist-checker">
              <Button variant="outline" className="border border-musinova-brown text-musinova-brown hover:bg-musinova-brown hover:text-white font-medium py-2 px-6 rounded-md transition-all">
                Check Your Playlist
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Music promotion" className="w-full h-auto rounded-lg object-cover" />
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;
