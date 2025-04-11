import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
const Pricing = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose between monthly subscription or one-time campaigns. We take 45% of ad budget up to $100, and only 35% for campaigns above $100.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-center mb-2 text-musinova-darkgray">Monthly Subscription</h3>
            <p className="text-center text-gray-600 mb-6">Ongoing campaigns with consistent growth</p>
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-musinova-green">$50</span>
              <span className="text-gray-600"> / month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">Starting at $50/month</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">Recommended $150 for good growth</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">Cancel anytime</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">Scale up to $10,000 in $50 increments</span>
              </li>
            </ul>
            <div className="text-center">
              <Link to="/subscribe">
                <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-medium py-2 px-6 rounded-md transition-all w-full">Subscribe Now</Button>
              </Link>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-center mb-2 text-musinova-darkgray">One-time campaign to try our service</h3>
            <p className="text-center text-gray-600 mb-6"> minimum</p>
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-musinova-brown">$50</span>
              <span className="text-gray-600">minimum</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">Minimum $50 campaign</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">You choose campaign duration</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">Custom campaign budget</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={18} className="text-musinova-green" />
                <span className="text-gray-600">No recurring charges</span>
              </li>
            </ul>
            <div className="text-center">
              <Link to="/campaign/one-time">
                <Button variant="outline" className="border border-musinova-brown text-musinova-brown hover:bg-musinova-brown hover:text-white font-medium py-2 px-6 rounded-md transition-all w-full">Create Campaign</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Pricing;