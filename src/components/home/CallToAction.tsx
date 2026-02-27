
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Music Career?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Join MusiNova today and start promoting your music to grow a steady following.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/campaigns/new" className="mx-auto">
              <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-bold text-xl py-6 px-8 rounded-lg transition-all flex items-center justify-center">
                Launch Campaign
              </Button>
            </Link>
          </div>
      </div>
    </section>;
};

export default CallToAction;
