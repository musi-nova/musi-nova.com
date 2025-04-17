
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return <section className="py-16 bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen text-musinova-darkgray">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Music Career?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Join Musi-Nova today and start promoting your music in a fair and organic way.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/campaigns/new">
            <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all">
              Start Now <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link to="/playlist-checker">
            <Button variant="outline" className="border border-musinova-brown text-musinova-brown hover:bg-musinova-brown hover:text-white font-medium py-2 px-6 rounded-md transition-all">
              Check Your Playlist
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};

export default CallToAction;
