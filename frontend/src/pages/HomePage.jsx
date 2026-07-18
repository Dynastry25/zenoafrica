import SEO, { orgJsonLd } from '../components/common/SEO';
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
      <SEO
        title="Luxury Safari & Travel in Africa"
        description="Discover luxury safari tours, visa assistance, hotel reservations, and flight bookings across Africa with Zeno Africa Adventures. Book your dream African safari to Tanzania, Kenya, South Africa and more."
        url="/"
        jsonLd={orgJsonLd}
      />
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
