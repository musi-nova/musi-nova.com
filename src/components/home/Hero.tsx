import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@/styles/videojs-cover.css";
import "videojs-youtube";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Link } from "react-router-dom";
import Play from "@/components/ui/play";

type FlowType = 'campaign' | 'submit';

const FlowToggle = memo(function FlowToggle({ flow, setFlow }: { flow: FlowType; setFlow: (f: FlowType) => void }) {
  // keyboard support: left/right to choose side, Enter/Space toggles
  const onPillKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      setFlow('campaign');
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setFlow('submit');
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      setFlow(flow === 'campaign' ? 'submit' : 'campaign');
      e.preventDefault();
    }
  }, [flow, setFlow]);

  return (
    <div className="flex justify-center py-3 mb-4">
      <div
        className="rounded-full bg-musinova-green px-2 py-1 w-full max-w-[92vw] md:w-[480px] select-none flex justify-center relative"
        onKeyDown={onPillKey}
        role="group"
        tabIndex={0}
        aria-label="Flow toggle"
        aria-pressed={flow === 'submit'}
      >
        <div className="flex w-full max-w-[420px] md:w-[500px] relative">
          <div
            className={`w-1/2 text-left text-sm md:text-base pl-3 md:pl-8 pr-3 py-1 md:py-3 rounded-l-full appearance-none bg-transparent border-0 focus:outline-none cursor-pointer z-10 ${flow === 'campaign' ? 'text-musinova-green font-semibold' : 'text-white/90'}`}
            onClick={() => setFlow('campaign')}
            role="button"
            tabIndex={-1}
            aria-pressed={flow === 'campaign'}
          >
            Launch Campaign
          </div>
          <div
            className={`w-1/2 text-right text-sm md:text-base pr-3 md:pr-8 pl-3 py-1 md:py-3 rounded-r-full appearance-none bg-transparent border-0 focus:outline-none cursor-pointer z-10 ${flow === 'submit' ? 'text-musinova-green font-semibold' : 'text-white/90'}`}
            onClick={() => setFlow('submit')}
            role="button"
            tabIndex={-1}
            aria-pressed={flow === 'submit'}
          >
            Submit to Playlists
          </div>
          {flow === 'campaign' ? (
            <div className="absolute left-2 top-1 bottom-1 w-5/12 rounded-full border border-musinova-green/20 bg-white/80 pointer-events-none" style={{ boxSizing: 'border-box' }} />
          ) : (
            <div className="absolute right-2 top-1 bottom-1 w-5/12 rounded-full border border-musinova-green/20 bg-white/80 pointer-events-none" style={{ boxSizing: 'border-box' }} />
          )}
        </div>
      </div>
    </div>
  );
});

  const MediaCard = memo(function MediaCard({ campaignRef, submitRef, flow, showPlay }: { campaignRef: React.RefObject<HTMLVideoElement>; submitRef: React.RefObject<HTMLVideoElement>; flow: FlowType; showPlay: boolean }) {
  const onPlayClick = useCallback(() => {
    try {
      if (flow === 'campaign' && campaignRef.current) {
        videojs(campaignRef.current).play();
      } else if (flow === 'submit' && submitRef.current) {
        videojs(submitRef.current).play();
      }
    } catch (e) {
      // swallow errors from programmatic play in some browsers
      // console.error('[Hero] error calling play()', e);
    }
  }, [flow, campaignRef, submitRef]);

    return (
     <div className="w-full max-w-2xl md:max-w-2xl mt-6 md:mt-0 bg-white p-4 rounded-xl shadow-lg border border-gray-200 h-full min-h-[280px]">
  <div className="relative w-full rounded-lg overflow-hidden h-full min-h-0">
        <video
          ref={campaignRef as any}
          className={`video-js vjs-default-skin absolute top-0 left-0 w-full h-full rounded-lg transition-opacity duration-300 ${flow === 'campaign' ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'}`}
          style={{ objectFit: 'contain', background: '#000' }}
          playsInline
        />

        <video
          ref={submitRef as any}
          className={`video-js vjs-default-skin absolute top-0 left-0 w-full h-full rounded-lg transition-opacity duration-300 ${flow === 'submit' ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'}`}
          style={{ objectFit: 'contain', background: '#000' }}
          playsInline
        />

        {showPlay && (
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 focus:outline-none"
            onClick={onPlayClick}
            aria-label="Play video"
          >
            <Play size={60} color="#5EA47C" />
          </button>
        )}
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
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
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

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <Link to="/campaigns/new" className="w-full sm:w-auto">
              <Button className={`font-bold text-lg py-4 px-6 rounded-lg transition-all flex items-center justify-center w-full sm:w-auto bg-musinova-green text-white`}>
                Launch Campaign
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
  const campaignRef = useRef<HTMLVideoElement | null>(null);
  const submitRef = useRef<HTMLVideoElement | null>(null);
  const campaignPlayerRef = useRef<any>(null);
  const submitPlayerRef = useRef<any>(null);
  const flowRef = useRef<FlowType>('campaign');
  const [showPlay, setShowPlay] = useState(true);
  const [flow, setFlow] = useState<FlowType>('campaign');

  // Initialize the player once on mount and dispose on unmount
  useEffect(() => {
    // Initialize both players once on mount
    const campaignId = '2a9zCg060YY';
    const submitId = 'SDX3RJDqLG8';

    flowRef.current = flow; // keep initial flow in sync in case event handlers fire early

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const campaignSrc = `https://www.youtube.com/watch?v=${campaignId}&controls=0&color=white&modestbranding=0&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&playlist=${campaignId}`;
    const submitSrc = `https://www.youtube.com/watch?v=${submitId}&controls=0&color=white&modestbranding=0&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&playlist=${submitId}`;

    const initPlayer = (ref: React.RefObject<HTMLVideoElement> | null, playerRef: React.MutableRefObject<any>, src: string, name: string, onPlayShouldHide: (shouldHide: boolean) => void) => {
      if (!ref || !ref.current) return;
      try {
        playerRef.current = videojs(ref.current, {
          techOrder: ['youtube'],
          sources: [{ type: 'video/youtube', src }],
          controls: true,
          autoplay: false,
          modestbranding: true,
          rel: 0,
          showinfo: 0,
        });

        playerRef.current.on('play', () => onPlayShouldHide(true));
        playerRef.current.on('pause', () => onPlayShouldHide(false));
        playerRef.current.on('error', (e: any) => console.error(`[Hero][${name}] player error`, e));

        // apply initial visibility styles
        try {
          const el = playerRef.current.el && playerRef.current.el();
          if (el && el.style) {
            const elStyle = el.style as CSSStyleDeclaration;
            // start hidden unless current flow matches
            if ((name === 'campaign' && flowRef.current === 'campaign') || (name === 'submit' && flowRef.current === 'submit')) {
              elStyle.opacity = '1';
              elStyle.zIndex = '20';
              elStyle.pointerEvents = 'auto';
            } else {
              elStyle.opacity = '0';
              elStyle.zIndex = '10';
              elStyle.pointerEvents = 'none';
            }
          }
        } catch (e) {
          // ignore
        }
      } catch (e) {
        console.error('[Hero] error initializing player', e);
      }
    };

    initPlayer(campaignRef, campaignPlayerRef, campaignSrc, 'campaign', (isPlaying: boolean) => {
      if (flowRef.current === 'campaign') setShowPlay(!isPlaying);
    });
    initPlayer(submitRef, submitPlayerRef, submitSrc, 'submit', (isPlaying: boolean) => {
      if (flowRef.current === 'submit') setShowPlay(!isPlaying);
    });

    return () => {
      try {
        if (campaignPlayerRef.current) campaignPlayerRef.current.dispose();
      } catch (e) {
        console.error('[Hero] error disposing campaign player', e);
      }
      campaignPlayerRef.current = null;
      try {
        if (submitPlayerRef.current) submitPlayerRef.current.dispose();
      } catch (e) {
        console.error('[Hero] error disposing submit player', e);
      }
      submitPlayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle visibility and pause inactive player when flow changes
  useEffect(() => {
    flowRef.current = flow;
    // Pause inactive player and update visibility styles
    try {
      if (flow === 'campaign') {
        if (submitPlayerRef.current) submitPlayerRef.current.pause();
        if (campaignPlayerRef.current) setShowPlay(!!campaignPlayerRef.current.paused && campaignPlayerRef.current.paused());
      } else {
        if (campaignPlayerRef.current) campaignPlayerRef.current.pause();
        if (submitPlayerRef.current) setShowPlay(!!submitPlayerRef.current.paused && submitPlayerRef.current.paused());
      }

      const campEl = campaignPlayerRef.current && campaignPlayerRef.current.el && campaignPlayerRef.current.el();
      const subEl = submitPlayerRef.current && submitPlayerRef.current.el && submitPlayerRef.current.el();
      if (campEl && (campEl as HTMLElement).style) {
        (campEl as HTMLElement).style.opacity = flow === 'campaign' ? '1' : '0';
        (campEl as HTMLElement).style.zIndex = flow === 'campaign' ? '20' : '10';
        (campEl as HTMLElement).style.pointerEvents = flow === 'campaign' ? 'auto' : 'none';
      }
      if (subEl && (subEl as HTMLElement).style) {
        (subEl as HTMLElement).style.opacity = flow === 'submit' ? '1' : '0';
        (subEl as HTMLElement).style.zIndex = flow === 'submit' ? '20' : '10';
        (subEl as HTMLElement).style.pointerEvents = flow === 'submit' ? 'auto' : 'none';
      }
    } catch (e) {
      setShowPlay(true);
    }
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
          <FlowToggle flow={flow} setFlow={setFlow} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
            <LeftColumn flow={flow} />

            <div className="md:col-span-6 flex items-center justify-end md:justify-end min-h-0">
              <MediaCard campaignRef={campaignRef} submitRef={submitRef} flow={flow} showPlay={showPlay} />
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
