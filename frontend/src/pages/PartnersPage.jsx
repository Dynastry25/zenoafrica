import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import partners from '../data/partners';

export default function PartnersPage() {
  return (
    <div className="pt-20" style={{ background: '#f1f1f1' }}>
      {/* Hero */}
      <div className="relative py-16 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=80)',
            filter: 'brightness(0.25)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="section-eyebrow justify-center">Our Network</div>
          <h1
            className="text-4xl md:text-7xl font-black mb-5"
            style={{ fontFamily: 'Montserrat' }}
          >
            Trusted <span className="zaa-text">Partners</span>
          </h1>
          <p className="text-base md:text-lg text-secondary leading-relaxed">
            We collaborate with world-class airlines and travel brands to deliver
            seamless, luxurious journeys across Africa.
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/partners/${partner.slug}`}
                className="card group block h-full"
              >
                <div className="relative h-48 overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-[200px] max-h-20 object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black">{partner.name}</h3>
                    <FiExternalLink
                      size={16}
                      className="text-muted group-hover:text-zaa-orange transition-colors"
                    />
                  </div>
                  <p className="text-sm text-zaa-orange font-medium mb-3 italic">
                    {partner.tagline}
                  </p>
                  <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                    {partner.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {partner.highlights.slice(0, 3).map((h) => (
                      <span
                        key={h}
                        className="text-[11px] px-2.5 py-1 bg-zaa-orange/8 border border-zaa-orange/15 rounded-full text-secondary"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
