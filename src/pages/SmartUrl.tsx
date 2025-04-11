
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Music, CheckCircle, BarChart3, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { smartUrlTabs } from '@/config/navigation';

const SmartUrl = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCreateUrl = () => {
    if (isAuthenticated) {
      navigate('/smart-url/create');
    } else {
      toast({
        title: "Authentication Required",
        description: "Please log in or register to create smart URLs",
        variant: "default",
      });
      navigate('/login', { state: { from: '/smart-url' } });
    }
  };

  return (
    <PageLayout tabs={smartUrlTabs} className="bg-white py-0">
      <div className="w-full bg-gray-50 py-16 border-b mb-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Smart URL
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions or search for specific help articles.
          </p>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-musinova-navy">What You Can Do With Smart URLs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-0 p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 bg-musinova-cream rounded-full flex items-center justify-center">
                  <Music size={28} className="text-musinova-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-musinova-navy">Share Spotify Links</h3>
              <p className="text-gray-600">
                Create branded, short links for your Spotify playlists, albums, or tracks that are easy to remember and share.
              </p>
            </Card>
            
            <Card className="bg-white border-0 p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 bg-musinova-cream rounded-full flex items-center justify-center">
                  <Link2 size={28} className="text-musinova-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-musinova-navy">Custom URLs</h3>
              <p className="text-gray-600">
                Create memorable, branded URLs that align with your artist or playlist identity for better recognition.
              </p>
            </Card>
            
            <Card className="bg-white border-0 p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 bg-musinova-cream rounded-full flex items-center justify-center">
                  <BarChart3 size={28} className="text-musinova-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-musinova-navy">Track Analytics</h3>
              <p className="text-gray-600">
                Monitor click-through rates, geographic data, and user engagement to optimize your music promotion.
              </p>
            </Card>
          </div>
        </div>
        
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-musinova-navy">Simple, Transparent Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border-0 p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 bg-musinova-cream rounded-full flex items-center justify-center">
                  <Music size={28} className="text-musinova-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-musinova-navy">For Musi-Nova Customers</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-musinova-green">Free</span>
                <span className="text-gray-600"> forever</span>
              </div>
              <p className="text-gray-600 mb-6">
                All Musi-Nova campaign customers get unlimited smart URLs as part of their service.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Unlimited smart URLs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Performance analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Custom short links</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Link to Spotify</span>
                </li>
              </ul>
              <Link to="/campaigns/new">
                <Button className="w-full bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all">
                  Start a Campaign
                </Button>
              </Link>
            </Card>
            
            <Card className="bg-white border-0 p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="w-14 h-14 bg-musinova-cream rounded-full flex items-center justify-center">
                  <Link2 size={28} className="text-musinova-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-musinova-navy">Monthly Subscription</h3>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-musinova-brown">$10</span>
                <span className="text-gray-600"> /month</span>
              </div>
              <p className="text-gray-600 mb-6">
                Just need smart URLs? Our affordable monthly subscription has you covered.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Up to 25 smart URLs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Basic analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Custom short links</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-musinova-green" />
                  <span className="text-gray-600">Cancel anytime</span>
                </li>
              </ul>
              <Link to="/subscribe">
                <Button variant="outline" className="w-full border border-musinova-brown text-musinova-brown hover:bg-musinova-brown hover:text-white font-medium py-2 px-6 rounded-md transition-all">
                  Subscribe Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-musinova-cream to-musinova-lightyellow rounded-2xl p-10 text-center mb-8 border-0 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-musinova-navy">Ready to Simplify Your Music Promotion?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Join artists and curators who are using Musi-Nova Smart URLs to connect with fans more effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleCreateUrl} 
              className="bg-musinova-green hover:bg-musinova-green/90 text-white text-lg px-8 py-4 h-auto rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {isAuthenticated ? "Create Your First Smart URL" : "Sign In to Get Started"}
            </Button>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="outline" className="border-musinova-green text-musinova-green hover:bg-musinova-green hover:text-white text-lg px-8 py-4 h-auto rounded-xl shadow-sm hover:shadow-md transition-all">
                  Register for Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SmartUrl;
