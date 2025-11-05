
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}

      <main className="flex-grow">
        <Hero />
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default Index;
