
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [{
    name: "Sarah Johnson",
    role: "Indie Singer-Songwriter",
    quote: "MusiNova helped me grow my Spotify followers by 300% in just 3 months. Their playlist promotion strategy is incredibly effective!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com/artist/4bYPcJP5jwYhXdDU1q4BNx"
  }, {
    name: "Michael Rodriguez",
    role: "Electronic Music Producer",
    quote: "After struggling for years to get my music noticed, MusiNova's platform changed everything. I've tripled my monthly listeners and secured several playlist placements.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1374&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com/artist/2CIMQHirSU0MQqyYHq0eOx"
  }, {
    name: "Emma Chen",
    role: "Indie Pop Band Lead",
    quote: "The analytics and insights from MusiNova helped us focus our promotion efforts. We've seen amazing growth and our revenue has increased substantially.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1322&auto=format&fit=crop",
    spotifyUrl: "https://open.spotify.com/artist/0C0XlULifJtAgn6ZNCW2eu"
  }];
  
  return <section className="py-16 bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-musinova-darkgray mb-4">
          What Artists Say About Us
        </h2>
        <p className="text-center text-musinova-darkgray mb-12 max-w-2xl mx-auto">Don't just take our word for it. Hear directly from artists who have used Musi-Nova to grow their audience.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-musinova-darkgray">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <a 
                href={testimonial.spotifyUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-musinova-green hover:text-musinova-green/80 transition-colors"
              >
                Listen on Spotify <ExternalLink className="ml-1" size={16} />
              </a>
            </div>)}
        </div>
      </div>
    </section>;
};

export default Testimonials;
