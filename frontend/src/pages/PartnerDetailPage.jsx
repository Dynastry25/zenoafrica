import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiCheckCircle } from 'react-icons/fi';
import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import { getPartnerBySlug } from '../data/partners';

export default function PartnerDetailPage() {
  const { slug } = useParams();
  const partner = getPartnerBySlug(slug);

  if (!partner) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center" style={{ background: '#f1f1f1' }}>
        <SEO title="Partner Not Found" description="The partner you're looking for doesn't exist." noindex />
        <div className="text-center px-6">
          <h1 className="text-3xl font-black mb-3">Partner Not Found</h1>
          <p className="text-secondary mb-6">The partner you're looking for doesn't exist.</p>
          <Link to="/partners" className="btn-primary">
            View All Partners
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20" style={{ background: '#f1f1f1' }}>
      <SEO
        title={partner.name}
        description={partner.tagline + ' — ' + partner.description?.slice(0, 150)}
        url={`/partners/${partner.slug}`}
        type="article"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Partners', url: '/partners' },
          { name: partner.name, url: `/partners/${partner.slug}` },
        ])}
      />
      {/* Hero */}
      <div className="relative py-16 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=80)',
            filter: 'brightness(0.2)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-zaa-orange transition-colors mb-8"
          >
            <FiArrowLeft size={16} /> All Partners
          </Link>
          <img
            src={partner.logo}
            alt={partner.name}
            className="h-20 md:h-28 w-auto mx-auto mb-6 object-contain"
          />
          <h1
            className="text-4xl md:text-6xl font-black mb-3"
            style={{ fontFamily: 'Montserrat' }}
          >
            {partner.name}
          </h1>
          <p className="text-lg text-zaa-orange font-medium italic mb-2">
            {partner.tagline}
          </p>
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs text-secondary uppercase tracking-wider">
            {partner.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* About */}
          <div className="card p-8 mb-8">
            <h2
              className="text-2xl font-black mb-4"
              style={{ fontFamily: 'Montserrat' }}
            >
              About {partner.name}
            </h2>
            <p className="text-secondary leading-relaxed text-base">
              {partner.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="card p-8 mb-8">
            <h2
              className="text-2xl font-black mb-5"
              style={{ fontFamily: 'Montserrat' }}
            >
              Why We Partner
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {partner.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-3 p-4 rounded-xl bg-zaa-orange/5 border border-zaa-orange/10"
                >
                  <FiCheckCircle size={18} className="text-zaa-orange flex-shrink-0" />
                  <span className="text-sm font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="card p-8 text-center">
            <h2
              className="text-2xl font-black mb-3"
              style={{ fontFamily: 'Montserrat' }}
            >
              Fly with {partner.name}
            </h2>
            <p className="text-secondary mb-6">
              Let us include {partner.name} in your next African adventure itinerary.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                Visit Website <FiExternalLink size={16} />
              </a>
              <Link to="/contact" className="btn-outline">
                Plan My Trip
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
