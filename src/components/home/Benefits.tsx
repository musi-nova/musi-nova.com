
import React from 'react';
import { CheckCircle, Music, BarChart3, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Benefits = () => {
  return <section className="py-16 bg-gradient-to-br from-musinova-cream to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">Why Choose Musi-Nova?</h2>
        <p className="text-center text-musinova-darkgray mb-12 max-w-2xl mx-auto">
          Promoting your own playlist with us has a big impact for your audience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="text-musinova-green flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-musinova-darkgray">Custom Ads Creation</h3>
                  <p className="text-gray-600">
                    We professionally design and create ads specifically for your playlist to maximize engagement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="text-musinova-green flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-musinova-darkgray">Daily Optimization</h3>
                  <p className="text-gray-600">
                    We adjust and refine your ads daily to ensure the best results for your campaign.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="text-musinova-green flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-musinova-darkgray">Detailed Dashboard</h3>
                  <p className="text-gray-600">
                    Track your campaign's progress with our comprehensive dashboard showing all metrics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="text-musinova-green flex-shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-musinova-darkgray">Customer Support</h3>
                  <p className="text-gray-600">
                    Our team is always available to answer questions and help optimize your campaigns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};

export default Benefits;
