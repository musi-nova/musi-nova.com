import React, { useRef, useEffect, useState, memo, useMemo } from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import "@/styles/videojs-cover.css"; // keep existing styles if they apply to container
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Link } from "react-router-dom";
// play overlay removed
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FlowType = 'campaign' | 'submit';


// Tabs-based FlowToggle replacement
const FlowTabs = memo(function FlowTabs({ flow, setFlow }: { flow: FlowType; setFlow: (f: FlowType) => void }) {
  return (
    <div className="flex justify-center py-3 mb-4">
      <Tabs value={flow} onValueChange={v => setFlow(v as FlowType)} className="w-full max-w-[92vw] md:w-[480px]">
        <TabsList className="w-full">
          <TabsTrigger value="campaign" className="w-1/2 data-[state=active]:bg-musinova-green data-[state=active]:text-white">Launch Campaign</TabsTrigger>
          <TabsTrigger value="submit" className="w-1/2 data-[state=active]:bg-musinova-green data-[state=active]:text-white">Submit to Playlists</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
});

const MediaCard = memo(function MediaCard({ videoRef, activeCldVid }: { videoRef: React.RefObject<HTMLVideoElement>; activeCldVid: any | null }) {
  return (
    <div className="w-full max-w-2xl md:max-w-2xl mt-6 md:mt-0 bg-white p-4 rounded-xl shadow-lg border border-gray-200 h-full min-h-[280px]">
      <div className="relative w-full rounded-lg overflow-hidden h-full min-h-0">
        <div className={`absolute top-0 left-0 w-full h-full rounded-lg transition-opacity duration-300 ${'opacity-100 z-20'}`} style={{ background: '#000' }}>
          {activeCldVid ? (
            <AdvancedVideo
              cldVid={activeCldVid}
              innerRef={videoRef}
              className="w-full h-full object-cover"
              controls
              muted={false}
              playsInline
            />
          ) : null}
        </div>
      </div>
    </div>
  );
});

const LeftColumn = memo(function LeftColumn({ flow }: { flow: FlowType }) {
  return (
    <div className="md:col-span-6 text-left">
      <div className="mt-6 md:mt-0 h-full">
        <Card className="h-full bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="p-6 h-full flex flex-col justify-center">
            {flow === 'submit' ? (
              <>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-musinova-darkgray mb-6">Do you want to submit to our playlists?</h1>
                <p className="text-lg md:text-xl text-musinova-darkgray mb-4 max-w-xl">Browse our catalogue of active playlists and pitch your track directly.</p>

                <ul className="list-disc pl-6 text-musinova-darkgray space-y-2 mb-4 max-w-xl">
                  <li>Great addition to your personal playlist. Boost your fan-finding machine even more.</li>
                  <li>Real bot-free playlists.</li>
                  <li>Low cost option, however your personal playlist will give the best results.</li>
                </ul>
                <div className="flex flex-wrap gap-4 sm:gap-6 items-start">
                  <Link to="/submissions" className="w-full sm:w-auto">
                    <Button className={`font-bold text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-green text-white`}>
                      Submit Your Music
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-musinova-darkgray mb-6">Do you want your own playlists?</h1>

                <p className="text-lg md:text-xl text-musinova-darkgray mb-4 max-w-xl">Get your personal playlist, advertised by the team that has spent over <span className="font-semibold"> $250,000 </span> in high converting playlist campaigns.</p>

                <ul className="list-disc pl-6 text-musinova-darkgray space-y-2 mb-4 max-w-xl">
                  <li>Your playlist, your music <span className="font-semibold">always</span> at the top.</li>
                  <li>Playlist tailored to your genre.</li>
                  <li><span className="font-semibold">High conversions</span>, find your fans immediately &amp; boost the algorithm.</li>
                  <li>No pitching, <span className="font-semibold">guaranteed</span> results.</li>
                </ul>

                <div className="flex flex-wrap gap-4 sm:gap-6 items-start">
                  <Link to="/campaigns/new" className="w-full sm:w-auto">
                    <Button className={`font-bold text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-green text-white`}>
                      Launch Campaign
                    </Button>
                  </Link>
                  <Link to="/testimonials" className="w-full sm:w-auto">
                    <Button className={`font-bold text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-brown text-white`}>
                      Testimonials
                    </Button>
                  </Link>
                  <Link to="/learn-more" className="w-full sm:w-auto">
                    <Button className={`font-bold text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-brown text-white`}>
                      Learn More
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showPlay, setShowPlay] = useState(true);
  const [flow, setFlow] = useState<FlowType>('campaign');

  // Cloudinary client + video
  const cld = new Cloudinary({ cloud: { cloudName: 'dudtoiunq' } });
  const campaignVideo = cld.video('Musinova_introduction_video_1_l2iubx');
  const submitVideo = cld.video('submit_feature_musinova_nkwklw');

  const activeCldVid = useMemo(() => {
    return flow === 'campaign' ? campaignVideo : submitVideo;
  }, [flow, campaignVideo, submitVideo]);

  // Pause video when flow changes
  useEffect(() => {
    try {
      if (videoRef.current && (videoRef.current as HTMLVideoElement).pause) {
        (videoRef.current as HTMLVideoElement).pause();
      }
    } catch (e) {
      // ignore
    }
    setShowPlay(true);
  }, [flow]);

  return (
    <section className="bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen md:h-screen h-auto flex items-stretch">
      <style>{`
        /* Hide default Video.js play button */
        .vjs-default-skin .vjs-big-play-button {
          display: none !important;
        }
      `}</style>
      <div className="mx-auto px-6 text-left max-w-[1400px] h-full">
        <div className="pt-8 flex flex-col h-full">
          <FlowTabs flow={flow} setFlow={setFlow} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
            <LeftColumn flow={flow} />

            <div className="md:col-span-6 flex items-center justify-end md:justify-end min-h-0">
              <MediaCard videoRef={videoRef} activeCldVid={activeCldVid} />
            </div>
          </div>
          {/* Contact / Calendly card (95% width) */}
          <div className="w-full flex justify-center mt-4 mb-8">
            <Card className="w-full max-w-2xl md:w-[95%] md:max-w-[1100px] bg-white shadow-sm border border-gray-200">
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
                <div className="text-lg md:text-xl text-musinova-darkgray">
                  <span className="block md:hidden">Want to know more?</span>
                  <span className="hidden md:inline">Want to know more? Have any questions? <span className="font-semibold">Feel free to have a chat with us in person.</span></span>
                </div>
                <div>
                  <a href="https://calendly.com/contact-musi-nova/30min" target="_blank" rel="noopener noreferrer">
                    <Button className="font-bold text-lg py-3 px-6 rounded-lg bg-musinova-green text-white hover:bg-musinova-green/90 transition-all">
                      Book a call
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
