
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-musinova-cream mb-6">
            <img 
              src="/logo.png" 
              alt="MusiNova Logo" 
              className="h-16 w-auto"
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-musinova-darkgray">404</h1>
          <h2 className="text-2xl font-semibold mb-2 text-musinova-darkgray">Page not found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <div className="flex flex-col gap-4">
            <Link to="/">
              <Button className="btn-primary w-full">
                Return to Home
              </Button>
            </Link>
            
            <Link to="/campaigns/new">
              <Button variant="outline" className="btn-outline-brown w-full">
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
