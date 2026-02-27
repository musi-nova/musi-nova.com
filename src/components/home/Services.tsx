import React from 'react';
import { motion } from 'motion/react';
import { Radio, TrendingUp, Globe, BarChart3 } from 'lucide-react';

const items = [
    {
        title: 'Meta Ad Campaigns',
        desc: 'Reach the right listeners with precision-targeted campaigns designed to grow your audience. Turn casual scrollers into loyal fans by placing your music in the feeds that matter most.',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'bg-musinova-green'
    },
    {
        title: 'Playlist Submission',
        desc: 'Submit your latest tracks to our network of genre-specific, curated playlists. Boost your visibility and get your music heard by listeners who are actively looking for their next favorite song.',
        icon: <Radio className="w-6 h-6" />,
        color: 'bg-musinova-brown'
    },
    {
        title: 'Smart URLs',
        desc: 'Create sleek, mobile-optimized landing pages that give fans a direct path to your music. Minimize friction and ensure every click has the best chance of becoming a stream.',
        icon: <Globe className="w-6 h-6" />,
        color: 'bg-musinova-brown'
    },
    {
        title: 'Analytics & Insights',
        desc: 'Monitor your momentum with real-time tracking for streams, saves, and audience growth. Use these actionable insights to understand your fans and refine your release strategy with confidence.',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'bg-musinova-green'
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
};

const Services: React.FC = () => {
    return (
        <section className="py-16 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
                    <p className="text-black/60 max-w-2xl mx-auto mt-3">Powerful tools for independent artists — playlist pitching, ads, smart links, and analytics.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-10">
                    {items.map((it, i) => (
                        <motion.div
                            key={it.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ scale: 1.03 }}
                            className="relative flex gap-4 items-start bg-white rounded-2xl p-5 shadow-sm border border-black/5 overflow-hidden"
                        >
                            <div className={`flex-shrink-0 w-3 h-14 rounded-r-md ${it.color}`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-lg bg-black/5 flex items-center justify-center">{it.icon}</div>
                                        <h3 className="font-semibold">{it.title}</h3>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-black/60">{it.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
