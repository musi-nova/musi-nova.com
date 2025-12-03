import Footer from '@/components/Footer';
import Testimonials from '@/components/home/Testimonials';
import Navbar from '@/components/Navbar';

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
