
import Footer from '@/components/Footer';
import AdExamples from '@/components/home/AdExamples';
import Benefits from '@/components/home/Benefits';
import CallToAction from '@/components/home/CallToAction';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import PainPoints from '@/components/home/PainPoints';
import Testimonials from '@/components/home/Testimonials';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <PainPoints />
        <Testimonials />
        <Benefits />
        <HowItWorks />

        {/* <GenreStats /> */}
        <AdExamples />
        {/* <Pricing /> */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
