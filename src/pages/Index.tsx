
import Footer from '@/components/Footer';
import AdExamples from '@/components/home/AdExamples';
import Benefits from '@/components/home/Benefits';
import CallToAction from '@/components/home/CallToAction';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import PainPoints from '@/components/home/PainPoints';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <PainPoints />
        <Benefits />
        <HowItWorks />

        {/* <GenreStats /> */}
        <AdExamples />
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
