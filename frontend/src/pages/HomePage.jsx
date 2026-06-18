import Hero from '../components/home/Hero';
import FeaturedPackages from '../components/home/FeaturedPackages';
import Services from '../components/home/Services';
import WhyUs from '../components/home/WhyUs';
import Testimonials from '../components/home/Testimonials';
import { VisaSection, CtaBand } from '../components/home/VisaAndCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <Services />
      <WhyUs />
      <Testimonials />
      <VisaSection />
      <CtaBand />
    </>
  );
}
