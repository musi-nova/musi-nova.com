import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Activity, BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Area, AreaChart, BarChart, Bar, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


type DataRow = { day: string; spent: number; followers: number; streams?: number };

// ORIGINAL
// const rawGenreDatasets: Record<string, DataRow[]> = {
//     Rock: [
//         { day: 'Day 1', spent: 6, followers: 30 },
//         { day: 'Day 5', spent: 7.5, followers: 60},
//         { day: 'Day 10', spent: 15.2, followers: 167 },
//         { day: 'Day 15', spent: 22.3, followers: 312 },
//         { day: 'Day 20', spent: 29.4, followers: 513 },
//         { day: 'Day 25', spent: 37.3, followers: 681 },
//         { day: 'Day 30', spent: 43.45, followers: 832 },
//     ],
//     'R&B': [
//         { day: 'Day 1', spent: 9, followers: 60 },
//         { day: 'Day 5', spent: 11, followers: 120 },
//         { day: 'Day 10', spent: 17, followers: 212 },
//         { day: 'Day 15', spent: 29, followers:  290 },
//         { day: 'Day 20', spent: 38, followers: 390 },
//         { day: 'Day 25', spent: 43, followers: 450 },
//         { day: 'Day 30', spent: 56, followers: 637 },
//     ],
//     Indie: [
//         { day: 'Day 1', spent: 9, followers: 70 },
//         { day: 'Day 5', spent: 20, followers:  152},
//         { day: 'Day 10', spent: 36, followers:  321},
//         { day: 'Day 15', spent: 43, followers:  564},
//         { day: 'Day 20', spent: 75, followers:  952},
//         { day: 'Day 25', spent: 97, followers:  1234},
//         { day: 'Day 30', spent: 125, followers: 1864 },
//     ],
//     Electronic: [
//         { day: 'Day 1', spent: 5, followers: 20 },
//         { day: 'Day 5', spent: 21, followers: 93 },
//         { day: 'Day 10', spent: 35, followers: 183 },
//         { day: 'Day 15', spent: 41, followers: 290 },
//         { day: 'Day 20', spent: 59, followers: 312 },
//         { day: 'Day 25', spent: 71, followers: 487 },
//         { day: 'Day 30', spent: 80, followers: 579 },
//     ],
// };

// SCALED TO END UP AT THE PRICING TIERS WE OFFER
const rawGenreDatasets: Record<string, { day: string; spent: number; followers: number; }[]> = {
    Rock: [
        { day: 'Day 1', spent: 27.20, followers: 136 },
        { day: 'Day 5', spent: 34.00, followers: 272 },
        { day: 'Day 10', spent: 68.92, followers: 757 },
        { day: 'Day 15', spent: 101.11, followers: 1415 },
        { day: 'Day 20', spent: 133.30, followers: 2326 },
        { day: 'Day 25', spent: 169.12, followers: 3088 },
        { day: 'Day 30', spent: 197.00, followers: 3772 },
    ],
    'R&B': [
        { day: 'Day 1', spent: 63.80, followers: 425 },
        { day: 'Day 5', spent: 77.98, followers: 851 },
        { day: 'Day 10', spent: 120.52, followers: 1503 },
        { day: 'Day 15', spent: 205.59, followers: 2056 },
        { day: 'Day 20', spent: 269.39, followers: 2765 },
        { day: 'Day 25', spent: 304.84, followers: 3190 },
        { day: 'Day 30', spent: 397.00, followers: 4516 },
    ],
    Electronic: [
        { day: 'Day 1', spent: 24.81, followers: 99 },
        { day: 'Day 5', spent: 104.21, followers: 462 },
        { day: 'Day 10', spent: 173.69, followers: 908 },
        { day: 'Day 15', spent: 203.46, followers: 1439 },
        { day: 'Day 20', spent: 292.79, followers: 1548 },
        { day: 'Day 25', spent: 352.34, followers: 2417 },
        { day: 'Day 30', spent: 397.00, followers: 2873 },
    ],
    Indie: [
        { day: 'Day 1', spent: 57.38, followers: 446 },
        { day: 'Day 5', spent: 127.52, followers: 969 },
        { day: 'Day 10', spent: 229.54, followers: 2047 },
        { day: 'Day 15', spent: 274.17, followers: 3596 },
        { day: 'Day 20', spent: 478.20, followers: 6070 },
        { day: 'Day 25', spent: 618.47, followers: 7868 },
        { day: 'Day 30', spent: 797.00, followers: 11885 },
    ],
};

// add some variance to streams per-genre
// seeded RNG helpers to make stream variance deterministic
function stringToSeed(s: string) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    }
    return h >>> 0;
}

function mulberry32(a: number) {
    return function() {
        let t = (a += 0x6D2B79F5) >>> 0;
        t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const GLOBAL_SEED = 42;

const genreDatasets: Record<string, DataRow[]> = Object.fromEntries(
    Object.entries(rawGenreDatasets).map(([k, arr]) => {
        const seed = stringToSeed(k + '|' + GLOBAL_SEED);
        const rnd = mulberry32(seed);
        return [k, arr.map(d => ({ ...d, streams: Math.round(d.followers * (2.1231 + rnd() * 0.4)) }))];
    })
) as Record<string, DataRow[]>;

const CaseStudies = () => {
    const [selectedGenre, setSelectedGenre] = useState<'Rock'|'R&B'|'Indie'|'Electronic'>('Rock');

    const raw = genreDatasets[selectedGenre];
    const data = raw.map(d => ({
        ...d,
        costPerFollow: parseFloat((d.spent / d.followers).toFixed(2)),
        costPerStream: parseFloat((d.spent / d.streams).toFixed(4)),
    }));

    const totalSpent = data[data.length - 1].spent;
    const last = data[data.length - 1] || { followers: 0, streams: 0 };
    const fmt = (n: number) => new Intl.NumberFormat().format(n);
    const fmtCurrency = (n: number) => `$${Math.round(n)}`;
    const fmtStream = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);

    const metrics = [
        { label: 'Total Spent', value: fmtCurrency(totalSpent), icon: <DollarSign className="w-5 h-5" />, color: 'bg-musinova-green' },
        { label: 'Playlist Followers', value: fmt(last.followers), icon: <Users className="w-5 h-5" />, color: 'bg-musinova-brown' },
        { label: 'Total Streams', value: fmtStream(last.streams), icon: <Activity className="w-5 h-5" />, color: 'bg-musinova-green' },
        { label: 'Cost Per Follow', value: `$${((totalSpent / (last.followers || 1))).toFixed(2)}`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-musinova-brown' },
        { label: 'Cost Per Stream', value: `$${((totalSpent / (last.streams || 1))).toFixed(3)}`, icon: <BarChart3 className="w-5 h-5" />, color: 'bg-musinova-green' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-32 pb-24 section-padding"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h3 className="text-3xl text-black/60">30-day campaign results for an emerging {selectedGenre} Artist.</h3>
                    </div>

                    {/* Genre Toggle */}
                    <div className="mb-6">
                        <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
                            {(['Rock', 'R&B', 'Indie', 'Electronic'] as const).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGenre(g)}
                                    aria-pressed={selectedGenre === g}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${selectedGenre === g ? 'bg-musinova-green text-white' : 'text-black/70'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                        {metrics.map((stat, i) => (
                            <div key={i} className="glass-card p-6 shadow-sm border-t-4 border-black/5">
                                <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4`}>
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className="text-xs font-bold uppercase text-black/40 tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Growth Chart */}
                        <div className="glass-card p-8 shadow-xl h-[450px]">
                            <h3 className="text-xl font-bold mb-8">Follower & Stream Growth</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#5fa47c" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#5fa47c" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="followers" stroke="#5fa47c" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
                                        <Area type="monotone" dataKey="streams" stroke="#8b5a2c" strokeWidth={3} fillOpacity={0.1} fill="#8b5a2c" />
                                        <Legend />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Efficiency Chart */}
                        <div className="glass-card p-8 shadow-xl h-[450px]">
                            <h3 className="text-xl font-bold mb-8">Cost Efficiency Over Time</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line type="stepAfter" dataKey="costPerFollow" stroke="#5fa47c" strokeWidth={3} dot={{ r: 6, fill: '#5fa47c' }} />
                                        <Legend />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </div>
    );
};

export default CaseStudies;
