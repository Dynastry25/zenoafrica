import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiUsers, FiCheck, FiX as FiXIcon, FiCalendar, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO, { tourJsonLd, breadcrumbJsonLd } from '../components/common/SEO';
import { fetchPackageBySlug, clearCurrentPackage } from '../redux/slices/packageSlice';
import { setCartPackage } from '../redux/slices/bookingSlice';
import { openModal } from '../redux/slices/uiSlice';
import { Stars, formatPrice, Spinner, Tag } from '../components/common/Common';

const tabs = ['Overview', 'Itinerary', "What's Included", 'Reviews'];

export default function PackageDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { current: pkg, loading } = useSelector((s) => s.packages);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(fetchPackageBySlug(slug));
    return () => dispatch(clearCurrentPackage());
  }, [slug, dispatch]);

  if (loading || !pkg) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <Spinner size={48} />
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book this adventure');
      dispatch(openModal('login'));
      return;
    }
    dispatch(setCartPackage(pkg));
    dispatch(openModal('booking'));
  };

  const images = [pkg.coverImage?.url, ...(pkg.gallery?.map((g) => g.url) || [])].filter(Boolean);
  const price = pkg.price?.adult;

  return (
    <div className="pt-20">
      <SEO
        title={pkg.metaTitle || pkg.title}
        description={pkg.metaDescription || pkg.shortDescription || pkg.description?.slice(0, 160)}
        image={pkg.coverImage?.url}
        url={`/packages/${pkg.slug}`}
        type="article"
        jsonLd={[
          tourJsonLd(pkg),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Packages', url: '/packages' },
            { name: pkg.title, url: `/packages/${pkg.slug}` },
          ]),
        ]}
      />
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[280px] md:min-h-[400px]">
        <img src={images[activeImage] || images[0]} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10">
          <div className="flex gap-2 mb-4">
            {pkg.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: pkg.badgeColor || '#F4742B', color: '#0D0D0D' }}>
                {pkg.badge}
              </span>
            )}
            <Tag>{pkg.category}</Tag>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-2">{pkg.title}</h1>
          {pkg.subtitle && <p className="text-lg text-zaa-orange font-accent italic mb-4">{pkg.subtitle}</p>}
          <div className="flex flex-wrap gap-5 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><FiMapPin /> {pkg.location?.country}{pkg.location?.region ? `, ${pkg.location.region}` : ''}</span>
            <span className="flex items-center gap-1.5"><FiClock /> {pkg.duration?.days} Days / {pkg.duration?.nights} Nights</span>
            <span className="flex items-center gap-1.5"><FiUsers /> {pkg.groupSize?.min}–{pkg.groupSize?.max} Guests</span>
            <span className="flex items-center gap-1.5"><Stars rating={pkg.averageRating || 4.8} /> {(pkg.averageRating || 4.8).toFixed(1)} ({pkg.reviewCount || 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 -mt-2 relative z-10">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-4">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className="flex-shrink-0">
                <img src={img} alt="" className="w-24 h-16 object-cover rounded-lg border-2 transition-colors" style={{ borderColor: i === activeImage ? '#F4742B' : 'transparent' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-12">
        {/* Main content */}
        <div>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2"
                style={{ borderColor: activeTab === tab ? '#F4742B' : 'transparent', color: activeTab === tab ? '#F4742B' : '#7A6B52' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-2xl font-black mb-4">About This Journey</h3>
              <p className="text-secondary leading-relaxed mb-8">{pkg.description}</p>

              <h3 className="text-2xl font-black mb-4">Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {pkg.highlights?.map((h) => (
                  <div key={h} className="flex items-center gap-2.5 text-sm">
                    <FiAward className="text-zaa-orange flex-shrink-0" /> {h}
                  </div>
                ))}
              </div>

              {pkg.destinations?.length > 0 && (
                <>
                  <h3 className="text-2xl font-black mb-4">Destinations Visited</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {pkg.destinations.map((d) => <Tag key={d}>{d}</Tag>)}
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Difficulty', value: pkg.difficulty },
                  { label: 'Best Months', value: pkg.availableMonths?.length ? `${pkg.availableMonths.length} months/yr` : 'Year-round' },
                  { label: 'Languages', value: pkg.languages?.join(', ') || 'English' },
                  { label: 'Min Age', value: pkg.minAge ? `${pkg.minAge}+` : 'All ages' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-4 text-center">
                    <div className="text-xs text-muted uppercase mb-1">{item.label}</div>
                    <div className="text-sm font-semibold capitalize">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Itinerary */}
          {activeTab === 'Itinerary' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {pkg.itinerary?.length > 0 ? pkg.itinerary.map((day) => (
                <div key={day.day} className="glass rounded-2xl p-6 flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-zaa-gradient flex items-center justify-center font-bold text-obsidian">
                      {day.day}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-2">{day.title}</h4>
                    <p className="text-sm text-secondary leading-relaxed mb-3">{day.description}</p>
                    {day.activities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {day.activities.map((a) => <Tag key={a}>{a}</Tag>)}
                      </div>
                    )}
                    <div className="flex gap-4 text-xs text-muted">
                      {day.meals?.breakfast && <span>🍳 Breakfast</span>}
                      {day.meals?.lunch && <span>🥗 Lunch</span>}
                      {day.meals?.dinner && <span>🍽 Dinner</span>}
                      {day.accommodation && <span>🏨 {day.accommodation}</span>}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-muted text-center py-10">Detailed itinerary available upon booking. Contact us for a full day-by-day breakdown.</p>
              )}
            </motion.div>
          )}

          {/* What's Included */}
          {activeTab === "What's Included" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-black mb-4 text-green-400">✓ Included</h3>
                <div className="space-y-3">
                  {pkg.included?.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-secondary">
                      <FiCheck className="text-green-400 flex-shrink-0 mt-0.5" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black mb-4 text-red-400">✕ Not Included</h3>
                <div className="space-y-3">
                  {pkg.excluded?.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-secondary">
                      <FiXIcon className="text-red-400 flex-shrink-0 mt-0.5" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews */}
          {activeTab === 'Reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {pkg.reviews?.length > 0 ? (
                <div className="space-y-5">
                  {pkg.reviews.map((review) => (
                    <div key={review._id} className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zaa-orange to-orange-700 flex items-center justify-center font-bold text-white text-sm">
                          {review.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{review.user?.name}</div>
                          <Stars rating={review.rating} />
                        </div>
                      </div>
                      <h5 className="font-semibold mb-1.5">{review.title}</h5>
                      <p className="text-sm text-secondary leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-10">No reviews yet. Be the first to share your experience after booking!</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Sticky booking sidebar */}
        <div>
          <div className="glass rounded-2xl p-6 sticky top-24">
            <div className="text-sm text-muted mb-1">Starting from</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-zaa-orange">{formatPrice(price)}</span>
              {pkg.originalPrice && <span className="text-base text-muted line-through">{formatPrice(pkg.originalPrice)}</span>}
            </div>
            <div className="text-xs text-muted mb-6">per person · {pkg.depositRequired || 30}% deposit to secure</div>

            <div className="space-y-3 mb-6">
              {[
                { icon: <FiCalendar />, label: 'Duration', value: `${pkg.duration?.days} Days / ${pkg.duration?.nights} Nights` },
                { icon: <FiUsers />, label: 'Group Size', value: `${pkg.groupSize?.min}–${pkg.groupSize?.max} Guests` },
                { icon: <FiMapPin />, label: 'Starting Point', value: pkg.startLocation || pkg.location?.country },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-zaa-orange/10 flex items-center justify-center text-zaa-orange">{item.icon}</div>
                  <div>
                    <div className="text-xs text-muted">{item.label}</div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleBookNow} className="btn-gold w-full justify-center py-4 text-base mb-3">
              Book This Journey ✦
            </button>
            <button onClick={() => dispatch(openModal('contact-quick'))} className="btn-outline w-full justify-center py-3.5">
              Ask a Question
            </button>

            <div className="mt-5 pt-5 border-t border-border text-center text-xs text-muted">
              🔒 Secure booking · Free cancellation up to 60 days before travel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
