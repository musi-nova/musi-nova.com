
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import PainPoints from '@/components/home/PainPoints';
import HowItWorks from '@/components/home/HowItWorks';
import Benefits from '@/components/home/Benefits';
import GenreStats from '@/components/home/GenreStats';
import AdExamples from '@/components/home/AdExamples';
import Testimonials from '@/components/home/Testimonials';
import Pricing from '@/components/home/Pricing';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar resizable={true} />
      
      <main className="flex-grow">
        <Hero />
        <PainPoints />
        <HowItWorks />
        <Benefits />
        <GenreStats />
        <AdExamples />
        <Testimonials />
        <Pricing />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
