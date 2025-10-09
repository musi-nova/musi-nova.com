import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const SubmissionPromo: React.FC = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img src="https://images.pexels.com/photos/4162581/pexels-photo-4162581.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Artist performing" className="rounded-lg w-full h-64 object-cover shadow-md" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-musinova-navy">Get your music heard</h1>
            <p className="mt-4 text-lg text-gray-700">Submit your best tracks to our curated playlists. Join for free, pitch thoughtfully, and let our curators do the rest.</p>

            <div className="mt-6 flex items-center gap-3">
              <Link to="/register">
                <Button className="btn-primary px-6 py-3">Sign up — it's free</Button>
              </Link>
              <Link to="/login" className="text-sm text-gray-600 underline">Already a member? Log in</Link>
            </div>

            <div className="mt-6 text-sm text-gray-600">No subscription. Pay only when you decide to submit.</div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <img src="https://images.pexels.com/photos/5965930/pexels-photo-5965930.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Streams" className="w-full h-36 object-cover rounded-t-lg" />
            <CardContent className="pt-4">
              <div className="text-lg font-semibold">Real exposure</div>
              <p className="text-sm text-gray-600 mt-2">Playlists targeted to your genre, delivering real listeners.</p>
            </CardContent>
          </Card>

          <Card>
            <img src="https://images.pexels.com/photos/4418531/pexels-photo-4418531.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Curator" className="w-full h-36 object-cover rounded-t-lg" />
            <CardContent className="pt-4">
              <div className="text-lg font-semibold">Human curators</div>
              <p className="text-sm text-gray-600 mt-2">Our team reviews every submission — quality over quantity.</p>
            </CardContent>
          </Card>

          <Card>
            <img src="https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Growth" className="w-full h-36 object-cover rounded-t-lg" />
            <CardContent className="pt-4">
              <div className="text-lg font-semibold">Track growth</div>
              <p className="text-sm text-gray-600 mt-2">See how playlist placements impact your streams and listeners.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SubmissionPromo;
