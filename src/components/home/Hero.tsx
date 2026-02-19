import React, { useRef, useEffect, useState, memo, useMemo, useCallback } from "react";
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import "@/styles/videojs-cover.css"; // keep existing styles if they apply to container
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { useAnalytics } from '@/hooks/use-analytics';
// play overlay removed
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FlowType = 'campaign' | 'submit';


const MediaCard = memo(function MediaCard({ videoRef, activeCldVid }: { videoRef: React.RefObject<HTMLVideoElement>; activeCldVid: any | null }) {
  const { logEvent } = useAnalytics();

  // Track how long the user watches the video (accumulates across play/pause)
  const playStartTsRef = React.useRef<number | null>(null);
  const accumulatedMsRef = React.useRef<number>(0);

  React.useEffect(() => {
    const el = videoRef?.current as HTMLVideoElement | null;
    if (!el) return;

    const onPlay = () => {
      playStartTsRef.current = Date.now();
      void logEvent({ event_type: 'video', event_name: 'play', component: 'Hero', current_time: el.currentTime });
    };

    const onPause = () => {
      try {
        if (playStartTsRef.current) {
          const delta = Date.now() - playStartTsRef.current;
          accumulatedMsRef.current += delta;
          playStartTsRef.current = null;
        }
        const watchedSeconds = Math.round(accumulatedMsRef.current / 1000);
        void logEvent({ event_type: 'video', event_name: 'pause', component: 'Hero', watched_seconds: watchedSeconds, current_time: el.currentTime });
      } catch (e) {
        // ignore
      }
    };

    const onEnded = () => {
      try {
        if (playStartTsRef.current) {
          const delta = Date.now() - playStartTsRef.current;
          accumulatedMsRef.current += delta;
          playStartTsRef.current = null;
        }
        const watchedSeconds = Math.round(accumulatedMsRef.current / 1000);
        void logEvent({ event_type: 'video', event_name: 'complete', component: 'Hero', watched_seconds: watchedSeconds, duration: el.duration });
        // reset accumulation after complete
        accumulatedMsRef.current = 0;
      } catch (e) {
        // ignore
      }
    };

    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);

    // On unmount, if video was playing, send final watched time
    return () => {
      try {
        if (playStartTsRef.current) {
          const delta = Date.now() - playStartTsRef.current;
          accumulatedMsRef.current += delta;
          const watchedSeconds = Math.round(accumulatedMsRef.current / 1000);
          void logEvent({ event_type: 'video', event_name: 'unmount', component: 'Hero', watched_seconds: watchedSeconds });
        }
      } catch (e) {
        // ignore
      }
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, [videoRef, activeCldVid, logEvent]);
  return (
    <div className="w-full max-w-2xl md:max-w-2xl mt-4 md:mt-0 bg-white p-2 md:p-4 rounded-xl shadow-lg border border-gray-200 h-full min-h-[260px] md:min-h-[400px]">
      <div className="relative w-full rounded-lg overflow-hidden h-full min-h-0 aspect-video md:aspect-auto">
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

const LeftColumn = memo(function LeftColumn({ flow, onTrackClick }: { flow: FlowType; onTrackClick?: (event: string, data?: Record<string, any>) => void }) {
  return (
    <div className="md:col-span-6 text-left">
      <div className="mt-2 md:mt-0 h-full">
        <Card className="h-full bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="p-4 h-full flex flex-col justify-center">
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-musinova-darkgray mb-6">Get your music heard</h1>

              <p className="text-base md:text-xl text-musinova-darkgray mb-4 max-w-xl">Your personal playlist featuring your music prominently, advertised by the team that has spent over <span className="font-semibold"> $250,000 </span> in high converting playlist campaigns.</p>

              <ul className="list-disc pl-6 text-musinova-darkgray space-y-2 mb-4 max-w-xl text-sm md:text-base">
                <li>Your playlist, your music <span className="font-semibold">always</span> at the top.</li>
                <li>Playlist tailored to your genre.</li>
                <li><span className="font-semibold">High conversions</span>, find your fans immediately &amp; boost the algorithm.</li>
                <li>No pitching, <span className="font-semibold">guaranteed</span> results.</li>
              </ul>

              <div className="flex flex-wrap gap-4 sm:gap-6 items-start">
                <Link to="/pricing" className="w-full sm:w-auto" onClick={() => onTrackClick?.('launch_campaign', { component: 'Hero' })}>
                  <Button className={`font-bold text-base md:text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-green text-white`}>
                    Launch Campaign
                  </Button>
                </Link>
                <Link to="/learn-more" className="w-full sm:w-auto" onClick={() => onTrackClick?.('learn_more', { component: 'Hero' })}>
                  <Button className={`font-bold text-base md:text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-brown text-white`}>
                    Learn More
                  </Button>
                </Link>
              </div>
            </>
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

  const { trackPageView, trackClick } = useAnalytics();

  const handleSetFlow = useCallback((f: FlowType) => {
    setFlow(f);
    void trackClick('flow_change', { component: 'Hero', flow: f });
  }, [trackClick]);

  // Cloudinary client + video
  const cld = new Cloudinary({ cloud: { cloudName: 'dudtoiunq' } });
  const campaignVideo = cld.video('Musinova_introduction_video_1_l2iubx');

  const activeCldVid = useMemo(() => campaignVideo, [campaignVideo]);

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

  // Track Hero page view once on mount
  useEffect(() => {
    void trackPageView(window.location.pathname, { component: 'Hero' });
  }, [trackPageView]);

  return (
    <section className="bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen md:min-h-screen h-auto flex items-stretch py-6 md:py-4">
      <style>{`
        /* Hide default Video.js play button */
        .vjs-default-skin .vjs-big-play-button {
          display: none !important;
        }
      `}</style>
      <div className="mx-auto px-6 text-left max-w-[1400px] h-full">
        <div className="pt-4 flex flex-col h-full gap-4">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-stretch flex-1 min-h-[480px] md:min-h-[640px]">
            <LeftColumn flow={flow} onTrackClick={trackClick} />

            <div className="md:col-span-6 flex items-center justify-end md:justify-end min-h-0">
              <MediaCard videoRef={videoRef} activeCldVid={activeCldVid} />
            </div>
          </div>
          {/* Contact / Calendly card (95% width) */}
          <div className="w-full flex justify-center mt-3 mb-6">
            <Card className="w-full max-w-2xl md:w-[95%] md:max-w-[1100px] bg-white shadow-sm border border-gray-200">
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
                <div className="text-lg md:text-xl text-musinova-darkgray">
                  <span className="block md:hidden">Want to know more?</span>
                  <span className="hidden md:inline">Want to know more? Have any questions? <span className="font-semibold">Feel free to have a chat with us in person.</span></span>
                </div>
                <div>
                  <a href="https://calendly.com/contact-musi-nova/30min" target="_blank" rel="noopener noreferrer" onClick={() => void trackClick('book_call', { component: 'Hero', href: 'calendly' })}>
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
