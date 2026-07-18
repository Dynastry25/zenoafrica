import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import Services from '../components/home/Services';
import { VisaSection } from '../components/home/VisaAndCta';

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <SEO
        title="Our Services"
        description="End-to-end African travel services — safari tours, visa assistance, hotel reservations, flight bookings, and custom itinerary planning with Zeno Africa Adventures."
        url="/services"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ])}
      />
      <div className="py-16 bg-charcoal text-center border-b border-border">
        <div className="section-eyebrow justify-center">What We Do</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3">
          Our <span className="zaa-text">Services</span>
        </h1>
        <p className="text-base text-secondary max-w-lg mx-auto px-6">
          End-to-end travel services from visa to safari, we handle every detail of your African adventure.
        </p>
      </div>
      <Services />
      <VisaSection />
    </div>
  );
}
