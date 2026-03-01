import React from 'react';
import { motion } from 'motion/react';

const PlaylistGrid: React.FC = () => {
    const covers = [
        '/playlist-images/slow-glow.jpeg',
        '/playlist-images/melodic-pathways.jpeg',
        '/playlist-images/heavy-riffs.jpeg',
        '/playlist-images/indie-rock-2025.jpeg',
        '/playlist-images/analog-dream.webp',
        '/playlist-images/bricks-sound.jpeg',
        '/playlist-images/arabtronica.jpeg',
        '/playlist-images/manhattan-view.jpeg',
        '/playlist-images/metal-manifesto.jpeg',
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
