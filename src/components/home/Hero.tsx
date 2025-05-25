
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return <section className="bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-musinova-darkgray mb-6">Get your music heard!</h1>
          <p className="text-lg md:text-xl text-musinova-darkgray mb-10 max-w-2xl mx-auto">Attract more listeners for your music by creating and promoting your own Spotify playlist with us!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/campaigns/new" className="mx-auto">
              <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-bold text-xl py-6 px-8 rounded-lg transition-all flex items-center justify-center">
                Launch Campaign
              </Button>
            </Link>
          </div>
          
          {/* <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Music promotion" className="w-full h-auto rounded-lg object-cover" />
          </div> */}
        </div>
      </div>
    </section>;
};

export default Hero;
