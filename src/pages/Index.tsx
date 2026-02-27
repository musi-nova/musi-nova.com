
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import Services from '@/components/home/Services';
import Process from '@/components/home/Process';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/Footer';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Process />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
