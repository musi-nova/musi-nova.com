import React from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Button } from "@/components/ui/button";

const cld = new Cloudinary({ cloud: { cloudName: "dudtoiunq" } });
const flyerVideo = cld.video("Musinova_introduction_video_1_l2iubx");

const CampaignFlyer: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 flex flex-col items-center border border-gray-200">
        <div className="relative w-full rounded-lg overflow-hidden mb-6 border border-gray-100" style={{ paddingTop: '65.25%' }}>
          <AdvancedVideo
            cldVid={flyerVideo}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            style={{ background: '#000', objectFit: 'cover' }}
            controls
            poster="https://res.cloudinary.com/dudtoiunq/video/upload/so_1/Musinova_introduction_video_1_l2iubx.jpg"
          />
        </div>
        <h1 className="text-3xl font-bold text-musinova-darkgray mb-4 text-center">Get your music heard!</h1>
        <p className="text-lg text-musinova-darkgray mb-6 text-center">
          Attract more listeners for your music by creating and promoting your own Spotify playlists with us, or simply submit your tracks to our curated playlists!
        </p>
        <a
          href="https://calendly.com/contact-musi-nova/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full bg-musinova-green text-white hover:bg-opacity-90 font-bold text-lg py-4 px-8 rounded-lg transition-all whitespace-normal text-center min-h-[3.5rem]">
            <span className="block md:hidden">Curious to know more?</span>
            <span className="hidden md:block">Curious to know more? Get in touch</span>
          </Button>
        </a>
        <div className="mt-6 text-center text-xs text-gray-400">
          <a href="https://musi-nova.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-musinova-green">musi-nova.com</a>
        </div>
      </div>
    </div>
  );
};

export default CampaignFlyer;
