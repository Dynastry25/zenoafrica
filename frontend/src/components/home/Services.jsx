import { motion } from 'framer-motion';
import { FiSend, FiHome, FiTruck, FiCompass, FiFileText, FiMapPin } from 'react-icons/fi';

const services = [
  {
    icon: FiSend, title: 'First Class Flights',
    desc: "Premium flight bookings with the world's leading airlines. Business and first class seats across all major African routes.",
    color: '#F4742B', glow: 'rgba(244,116,43,0.15)',
  },
  {
    icon: FiHome, title: 'Luxury Resorts',
    desc: "Hand-selected 5-star lodges, boutique hotels, and exclusive tented camps immersed in Africa's most iconic landscapes.",
    color: '#8E44AD', glow: 'rgba(142,68,173,0.12)',
  },
  {
    icon: FiTruck, title: 'Private Tours',
    desc: 'Fully customised private itineraries with expert local guides. Every experience tailored to your interests and pace.',
    color: '#2980B9', glow: 'rgba(41,128,185,0.12)',
  },
  {
    icon: FiCompass, title: 'Exclusive Safaris',
    desc: 'Private game reserves and conservancy access for intimate wildlife encounters away from the crowds.',
    color: '#27AE60', glow: 'rgba(39,174,96,0.12)',
  },
  {
    icon: FiFileText, title: 'Visa Assistance',
    desc: 'Comprehensive visa consultation and application support for all African destinations. Stress-free documentation.',
    color: '#F5A94C', glow: 'rgba(245,169,76,0.12)',
  },
  {
    icon: FiMapPin, title: 'Airport Transfers',
    desc: 'Seamless door-to-door transfers in luxury vehicles. Meet-and-greet at all major African airports.',
    color: '#C0392B', glow: 'rgba(192,57,43,0.12)',
  },
];

export default function Services() {
  return (
    <section className="py-6 md:py-8" id="services" style={{ background: 'linear-gradient(135deg, rgba(244,116,43,0.03) 0%, #f1f1f1 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <div className="section-eyebrow justify-center">What We Offer</div>
          <h2
            className="text-4xl md:text-2xl font-black mb-5"
            style={{ fontFamily: 'Montserrat' }}
          >
            Premium{' '}
            <span className="zaa-text">Travel Services</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#C4A882' }}>
            From first-class flights to exclusive safari permits — we handle every detail so you can
            simply experience Africa.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="glass rounded-2xl p-8 group cursor-default"
                style={{ transition: 'all 0.35s ease', borderColor: 'rgba(244,116,43,0.12)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = svc.color + '50';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${svc.glow}`;
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(244,116,43,0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: svc.glow,
                    border: `1px solid ${svc.color}30`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Icon size={24} style={{ color: svc.color }} />
                </div>

                <h3
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: 'Montserrat', color: '#F5EDE0' }}
                >
                  {svc.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#C4A882' }}>
                  {svc.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-6 h-0.5 rounded-full w-0 group-hover:w-full"
                  style={{
                    background: `linear-gradient(90deg, ${svc.color}, transparent)`,
                    transition: 'width 0.5s ease',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
