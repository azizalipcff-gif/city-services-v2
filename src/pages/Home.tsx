import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedBusinesses from '../components/FeaturedBusinesses';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#071126] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedBusinesses />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home;