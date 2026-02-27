import React from 'react';

const Stats: React.FC = () => {
    const stats = [
        { label: 'True Fan Discovery', value: 'Natural Growth' },
        { label: 'Hand-Picked Playlists', value: 'Expertly Curated' },
        { label: 'Priority Feedback', value: 'Within 2 Days' },
        { label: 'Direct Artist Support', value: 'Here Whenever' },
    ];

    return (
        <section className="hidden md:block bg-musinova-green text-white py-16">
            <div className="max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-4 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-white/50 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
