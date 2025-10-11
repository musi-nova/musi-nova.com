import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Play from "@/components/ui/play";

const Hero = () => {
  const videoRef = useRef(null);
  const [showPlay, setShowPlay] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        techOrder: ["youtube"],
        sources: [
          {
            type: "video/youtube",
            src: "https://www.youtube.com/watch?v=2a9zCg060YY?controls=0&color=white&modestbranding=0&rel=0&playsinline=1&enablejsapi=1&playlist=2a9zCg060YY",
          },
        ],
        controls: true,
        autoplay: false,
        modestbranding: true,
        rel: 0,
        showinfo: 0,
      });
      player.on("play", () => setShowPlay(false));
      player.on("pause", () => setShowPlay(true));
      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, []);

  return (
    <section className="bg-gradient-to-br from-musinova-lightyellow to-musinova-lightgreen py-24">
      <style>{`
        /* Hide default Video.js play button */
        .vjs-default-skin .vjs-big-play-button {
          display: none !important;
        }
      `}</style>
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
            <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <video
                ref={videoRef}
                className="video-js vjs-default-skin absolute top-0 left-0 w-full h-full rounded-lg"
                style={{ objectFit: 'contain', background: '#000' }}
                playsInline
              />
              {showPlay && (
                <button
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 focus:outline-none"
                  onClick={() => {
                    if (videoRef.current) {
                      videojs(videoRef.current).play();
                    }
                  }}
                  aria-label="Play video"
                >
                  <Play size={60} color="#5EA47C" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
