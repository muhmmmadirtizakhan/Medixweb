
import Hero from '../home/Hero';
import Testimonials from '../home/Testimonials';
import About from '../home/About';
import Services from '../home/Services';
import Blogs from '../home/Blogs'
import OurTeam from '../home/OurTeam';
import Footer from '../layout/Footer';
const Home = () => {
  return (
    <>
    
      
      <section id="hero" className="hero">
        <Hero />
      </section>
      
      <section id="about">
        <About />
      </section>
      
      <section id="services">
        <Services />
      </section>
      
      <section id="team">
        <OurTeam />
      </section>
       <section id="testimonials">
        <Testimonials />
      </section>
       <section id="blogs">
        <Blogs />
      </section>
        <section id="footer">
        <Footer />
      </section>
    </>
  );
};

export default Home;