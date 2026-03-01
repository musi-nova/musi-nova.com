import React, { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, CheckCircle2, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const { trackClick } = useAnalytics();
  const playlistImages = [
    'assets/alt-pop-example.gif',
    'assets/alt-rock-example.gif',
    'assets/electronic-example.gif',
    'assets/indie-pop-example.gif',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % playlistImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-28 pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-musinova/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-musinova-brown/10 rounded-full blur-[150px]" />
      </div>

      <div className="px-8 md:px-12 max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-left"
          >
            <span className="inline-block px-4 py-1.5 bg-musinova-green/10 text-musinova-green rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Simple and effective meta campaigns
            </span>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] mb-8 tracking-tighter">
              Get Your Music <br />
              <span className="text-musinova-green italic">Heard Everywhere</span>
            </h1>
            <p className="text-xl text-black/60 max-w-xl mb-10 leading-relaxed">
              Launch high-impact ad campaigns, submit your tracks to curated playlists, and grow your audience with MusiNova's data-driven promotion tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="/campaigns/new"
                className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center"
                onClick={() => trackClick('hero_start_campaign', { label: 'Start Your Campaign', location: 'hero' })}
              >
                Start Your Campaign
              </a>
              <a
                href="/submissions"
                className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
                onClick={() => trackClick('hero_submit_playlists', { label: 'Submit To Playlists', location: 'hero' })}
              >
                Submit To Playlists
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-8 opacity-40 grayscale">
              <img src="2024_Spotify_logo_without_text.svg" alt="Spotify" className="h-6" />
              <img src="2023_Facebook_icon.svg" alt="Facebook" className="h-6" />
              <img src="Instagram_logo_2016.svg" alt="Instagram" className="h-6" />
            </div>
          </motion.div>

          {/* phone animation div (visible on mobile below the text) */}
          <div className="relative block lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-0 w-[320px] h-[640px] mx-auto bg-black rounded-[3rem] p-3 shadow-2xl border-[8px] border-zinc-800"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-zinc-800 rounded-full" />
              </div>

              <div className="w-full h-full bg-zinc-900 rounded-[2.2rem] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={playlistImages[currentImageIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-10 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2 grayscale">
                    <img src="2023_Facebook_icon.svg" alt="Facebook" className="w-4 h-4" />
                    <img src="Instagram_logo_2016.svg" alt="Instagram" className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold mb-1">Impactful Meta Campaigns</div>
                  <div className="text-xs text-white/60">Created by MusiNova</div>
                </div>
              </div>
            </motion.div>

            {/* hover graphic 1 */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-4 z-20 bg-white rounded-2xl border border-black/5 p-4 shadow-xl flex items-center gap-3 border-l-4 border-musinova-green"
            >
              <div className="w-10 h-10 bg-musinova-green/10 rounded-full flex items-center justify-center text-musinova-green">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-black/40">Status</div>
                <div className="text-sm font-bold">Added to 'Chill Vibes'</div>
              </div>
            </motion.div>

            {/* hover graphic 2 */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1/2 -left-24 z-20 bg-white rounded-2xl border border-black/5 p-4 shadow-xl flex items-center gap-3 border-l-4 border-musinova-brown"
            >
              <div className="w-10 h-10 bg-musinova-brown/10 rounded-full flex items-center justify-center text-musinova-brown">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-black/40">New Fans</div>
                <div className="text-sm font-bold">+2,450 this week</div>
              </div>
            </motion.div>

            {/* hover graphic 3 */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -right-4 z-20 bg-white rounded-2xl border border-black/5 border-l-4 border-musinova-green p-5 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-musinova-green rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase text-black/40">Live Campaign</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">12.4k</span>
                <span className="text-xs text-musinova font-bold">Streams</span>
              </div>
            </motion.div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-black/5 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;