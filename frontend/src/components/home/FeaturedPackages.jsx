import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { fetchFeaturedPackages } from '../../redux/slices/packageSlice';
import PackageCard from '../common/PackageCard';
import { Spinner } from '../common/Common';

export default function FeaturedPackages() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { featured, loading } = useSelector((s) => s.packages);

  useEffect(() => {
    dispatch(fetchFeaturedPackages());
  }, [dispatch]);

  return (
    <section className="py-6 md:py-8" style={{ background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
          <div className="section-eyebrow justify-center">Featured Experiences</div>
          <h2
            className="text-4xl md:text-5xl font-black mb-5"
            style={{ fontFamily: 'Montserrat', color:'#636363' }}
          >
            Handpicked{' '}
            <span className="zaa-text">African Journeys</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: '#3d372e' }}>
            Each itinerary is meticulously designed by our expert travel architects combining luxury,
            authenticity, and unforgettable wildlife encounters.
          </p>
        </div>

        {/* Grid */}
        {loading && featured.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.slice(0, 6).map((pkg, i) => (
              <PackageCard key={pkg._id || pkg.slug} pkg={pkg} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/packages')}
            className="btn-outline inline-flex items-center gap-2 px-10 py-3.5"
          >
            View All Packages <FiArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
