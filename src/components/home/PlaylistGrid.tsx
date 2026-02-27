import React from 'react';
import { motion } from 'motion/react';

const PlaylistGrid: React.FC = () => {
  const covers = [
    'https://picsum.photos/seed/afrobeats/400/400',
    'https://picsum.photos/seed/summerhits/400/400',
    'https://picsum.photos/seed/rock/400/400',
    'https://picsum.photos/seed/run/400/400',
    'https://picsum.photos/seed/tropical/400/400',
    'https://picsum.photos/seed/quiet/400/400',
    'https://picsum.photos/seed/indie/400/400',
    'https://picsum.photos/seed/trap/400/400',
    'https://picsum.photos/seed/festival/400/400',
  ];

  return (
    <div className="relative perspective-1000 py-12 px-8 md:px-12">
      <motion.div
        initial={{ rotateY: -20, rotateX: 20, opacity: 0 }}
        whileInView={{ rotateY: -15, rotateX: 15, opacity: 1 }}
        animate={{
          y: [0, -20, 0],
          rotateY: [-15, -12, -15],
          rotateX: [15, 18, 15]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          opacity: { duration: 1 }
        }}
        className="grid grid-cols-3 gap-3 w-full max-w-[500px] mx-auto transform-gpu"
      >
        {covers.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, z: 50 }}
            className="aspect-square rounded-lg overflow-hidden shadow-xl border border-white/20 bg-zinc-800"
          >
            <img src={src} alt={`Playlist ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-musinova-green/10 blur-[100px] -z-10" />
    </div>
  );
};

export default PlaylistGrid;
