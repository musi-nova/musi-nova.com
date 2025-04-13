import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const AdExamples = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">
          Our Ad Campaigns in Action
        </h2>
        <p className="text-center text-musinova-darkgray mb-12 max-w-2xl mx-auto">
          See examples of Meta campaigns we've created for artists just like you.
        </p>

        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem className="basis-full md:basis-1/3 p-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[9/16] relative">
                    <img src="/assets/alt-pop-example.gif" alt="Alternative Pop Campaign" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-musinova-darkgray text-center">Alternative Pop Campaign</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      This campaign introduced alternative pop music to a wider audience, boosting streams and engagement significantly.
                    </p>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="basis-full md:basis-1/3 p-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[9/16] relative">
                    <img src="/assets/electronic-example.gif" alt="Electronic Music Campaign" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-musinova-darkgray text-center">Electronic Music Campaign</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      This campaign helped an electronic music producer grow their audience and increase listener engagement.
                    </p>
                  </div>
                </div>
              </CarouselItem>

              <CarouselItem className="basis-full md:basis-1/3 p-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[9/16] relative">
                    <img src="/assets/indie-pop-example.gif" alt="Indie Pop Campaign" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-musinova-darkgray text-center">Indie Pop Campaign</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      This campaign connected an indie pop band with new fans and increased their playlist presence.
                    </p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AdExamples;