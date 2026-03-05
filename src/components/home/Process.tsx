import React from 'react';
import PlaylistGrid from './PlaylistGrid';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { title } from 'process';

const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Tracks',
      desc: 'Choose the songs you want to promote, and let us know your email so we can keep you updated on your campaign’s performance.'
    },
    {
      number: '02',
      // title: 'Choose Your Strategy',
      title: 'We Get to Work',
      desc: 'Once we have your tracks, we get to work setting up your campaign. We handle everything.'
      // desc: 'Let us get to work on the meta ads, submit your tracks directly to our playlists or try a mix of both.'
    },
    {
      number: '03',
      title: 'Watch Your Growth',
      desc: 'Once everything is set up, track every stream and save in real-time.'
    }
  ];

  return (
    <section className="bg-white py-24">
      <div className="px-8 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Simple Process. <br />
              <span className="text-musinova-green">Powerful Results.</span>
            </h2>
            <p className="text-black/60 mb-12 text-lg">
              We've removed the guesswork from music promotion. Our platform is built to be intuitive for artists while delivering professional-grade results.
            </p>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-4xl font-display font-bold text-black/10">{step.number}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-black/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <PlaylistGrid />

            {/* Hover Card */}
            <div className="absolute -bottom-4 -left-8 hidden md:flex md:flex-col bg-white rounded-2xl border border-black/5 p-6 max-w-[240px] shadow-xl gap-4 border-l-4 border-musinova-green z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-musinova-green rounded-full flex items-center justify-center text-white">
                  <Users/>
                </div>
                <div>
                  <div className="text-xs text-black/40 font-bold uppercase">Daily Growth</div>
                  <div className="text-lg font-bold">+1,240%</div>
                </div>
              </div>
              <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden mt-auto">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} className="h-full bg-musinova-green" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
