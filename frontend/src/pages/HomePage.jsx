import Hero from '../components/home/Hero';
import FeaturedPackages from '../components/home/FeaturedPackages';
import Services from '../components/home/Services';
import WhyUs from '../components/home/WhyUs';
import Partners from '../components/home/Partners';
import Testimonials from '../components/home/Testimonials';
import { VisaSection, CtaBand } from '../components/home/VisaAndCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <Services />
      <Partners />
      <WhyUs />
      <Testimonials />
      <VisaSection />
      <CtaBand />
    </>
  );
}
