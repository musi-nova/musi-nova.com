import React from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cld = new Cloudinary({
  cloud: { cloudName: "dudtoiunq" },
});

const myVideo = cld.video("Musinova_introduction_video_1_l2iubx");

const Hero: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  return (
    <section className="bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-musinova-darkgray mb-6">
            Get your music heard!
          </h1>
          <p className="text-lg md:text-xl text-musinova-darkgray mb-10 max-w-2xl mx-auto">
            Attract more listeners for your music by creating and promoting your
            own Spotify playlists with us, or if you prefer, simply submit your
            tracks to our curated playlists!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-center items-center">
            <Link to="/campaigns/new" className="w-full sm:w-auto">
              <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-bold text-xl py-6 px-8 rounded-lg sm:rounded-l-lg sm:rounded-r-none transition-all flex items-center justify-center w-full sm:w-auto">
                Launch Campaign
              </Button>
            </Link>
            <Link to="/submit-to-playlists" className="w-full sm:w-auto">
              <Button className="bg-musinova-brown text-white hover:bg-musinova-brown/90 font-bold text-xl py-6 px-8 rounded-lg sm:rounded-r-lg sm:rounded-l-none transition-all flex items-center justify-center w-full sm:w-auto">
                Submit Your Music
              </Button>
            </Link>
          </div>

          <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: '65.25%' }}>
              <AdvancedVideo
                cldVid={myVideo}
                innerRef={videoRef}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                style={{ background: '#000', objectFit: 'cover' }}
                controls
                poster="https://res.cloudinary.com/dudtoiunq/video/upload/so_1/Musinova_introduction_video_1_l2iubx.jpg"
              />
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href="https://calendly.com/contact-musi-nova/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-musinova-green text-white hover:bg-opacity-90 font-bold text-lg py-4 px-8 rounded-lg transition-all whitespace-normal text-center min-h-[3.5rem]">
                  <span className="block md:hidden">Curious to know more?</span>
                  <span className="hidden md:block">Curious to know more? Get in touch</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
