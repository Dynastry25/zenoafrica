import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { setCartPackage } from '../../redux/slices/bookingSlice';
import { openModal } from '../../redux/slices/uiSlice';

export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: 0,
  }).format(price || 0);
}

function Stars({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar
          key={i}
          size={13}
          fill={i < Math.round(rating) ? '#F4742B' : 'transparent'}
          stroke={i < Math.round(rating) ? '#F4742B' : '#3A3020'}
        />
      ))}
    </span>
  );
}

export default function PackageCard({ pkg, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to book this adventure');
      dispatch(openModal('login'));
      return;
    }
    dispatch(setCartPackage(pkg));
    dispatch(openModal('booking'));
  };

  const price        = pkg.price?.adult || pkg.price;
  const originalPrice = pkg.originalPrice;
  const duration     = pkg.duration
    ? `${pkg.duration.days} Days / ${pkg.duration.nights} Nights`
    : pkg.duration;
  const location     = pkg.location?.country || pkg.location;
  const image        = pkg.coverImage?.url || pkg.image;
  const rating       = pkg.averageRating || pkg.rating || 4.8;
  const reviewCount  = pkg.reviewCount || pkg.reviews || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(244,116,43,0.45)' : 'rgba(244,116,43,0.18)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 48px rgba(244,116,43,0.18), 0 4px 16px rgba(0,0,0,0.4)'
          : 'none',
      }}
    >
      <Link to={`/packages/${pkg.slug}`} className="block">
        {/* Image */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={image}
            alt={pkg.title}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.7s ease',
            }}
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,11,9,0.75) 0%, transparent 55%)' }} />

          {/* Badge */}
          {pkg.badge && (
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide"
              style={{
                background: pkg.badgeColor || '#F4742B',
                color: '#ffffff',
                fontFamily: 'Montserrat',
              }}
            >
              {pkg.badge}
            </div>
          )}

          {/* Category */}
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: 'rgba(13,11,9,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(244,116,43,0.3)',
              color: '#F4742B',
              fontFamily: 'Montserrat',
            }}
          >
            {pkg.category}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <div className="text-xs mb-1 flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FiMapPin size={11} /> {location}
              </div>
              <div className="text-sm flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <FiClock size={11} /> {duration}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rating row */}
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={rating} />
            <span className="text-xs" style={{ color: '#7A6148' }}>
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-black mb-1"
            style={{ fontFamily: 'Montserrat', color: '#F5EDE0' }}
          >
            {pkg.title}
          </h3>
          {pkg.subtitle && (
            <p
              className="text-sm mb-3"
              style={{ color: '#F4742B', fontStyle: 'italic', fontFamily: 'Montserrat' }}
            >
              {pkg.subtitle}
            </p>
          )}
          <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: '#C4A882' }}>
            {pkg.shortDescription || pkg.description}
          </p>

          {/* Highlights */}
          {pkg.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {pkg.highlights.slice(0, 3).map((h) => (
                <span
                  key={h}
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(244,116,43,0.08)',
                    border: '1px solid rgba(244,116,43,0.18)',
                    color: '#C4A882',
                    fontFamily: 'Montserrat',
                  }}
                >
                  {h}
                </span>
              ))}
              {pkg.highlights.length > 3 && (
                <span className="text-[11px] px-2 py-1" style={{ color: '#7A6148' }}>
                  +{pkg.highlights.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-end justify-between">
            <div>
              <div
                className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
                style={{ color: '#7A6148', fontFamily: 'Montserrat' }}
              >
                FROM
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-black"
                  style={{ color: '#F4742B', fontFamily: 'Montserrat' }}
                >
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span
                    className="text-sm line-through"
                    style={{ color: '#7A6148' }}
                  >
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              <div className="text-[11px]" style={{ color: '#7A6148' }}>per person</div>
            </div>
            <button
              onClick={handleBookNow}
              className="btn-gold text-xs px-5 py-2.5"
            >
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
