
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const AdExamples = () => {
  return <section className="py-16 bg-white">
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
                    <img src="/assets/alt-pop-example.gif" alt="Ad Example 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-musinova-darkgray text-center">Folk Duo Campaign</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      This campaign targeted folk music enthusiasts and resulted in 12,800 new streams in the first month.
                    </p>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem className="basis-full md:basis-1/3 p-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[9/16] relative">
                    <img src="/assets/electronic-example.gif" alt="Ad Example 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-musinova-darkgray text-center">Electronic Producer Campaign</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      This electronic music producer saw 340% growth in monthly listeners through our targeted ad strategy.
                    </p>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem className="basis-full md:basis-1/3 p-1">
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[9/16] relative">
                    <img src="/assets/indie-pop-example.gif" alt="Ad Example 3" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-musinova-darkgray text-center">Indie Band Playlist Campaign</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      This indie rock band added 5,700 followers to their profile after a 3-month campaign with MusiNova.
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
    </section>;
};

export default AdExamples;
