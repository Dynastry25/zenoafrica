import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { hotelAPI } from '../api/axios';
import { Spinner, EmptyState, formatPrice } from '../components/common/Common';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    hotelAPI.getAll({ category: category || undefined })
      .then((res) => setHotels(res.data.hotels))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, [category]);

  const categories = ['', 'lodge', 'hotel', 'camp', 'resort', 'villa'];

  return (
    <div className="pt-20"style={{
        background: ' #f1f1f1',
      }}>
      <div className="py-16 bg-charcoal text-center border-b border-border">
        <div className="section-eyebrow justify-center">Stay in Style</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3">Luxury <span className="zaa-text">Hotels & Lodges</span></h1>
        <p className="text-base text-secondary max-w-lg mx-auto px-6">
          Hand-selected accommodations across Africa's most breathtaking destinations.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-2 flex-wrap mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium capitalize border-[1.5px] transition-colors"
              style={{
                borderColor: category === cat ? '#F4742B' : 'rgba(244,116,43,0.2)',
                background: category === cat ? 'rgba(244,116,43,0.12)' : 'transparent',
                color: category === cat ? '#F4742B' : '#B8A98A',
              }}
            >
              {cat || 'All Types'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : hotels.length === 0 ? (
          <EmptyState icon="🏨" title="No hotels found" message="Our team is curating exceptional stays for this category. Check back soon or contact us for personalized recommendations." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {hotels.map((hotel, i) => (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={hotel.coverImage?.url} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-obsidian/70 backdrop-blur-sm border border-zaa-orange/30 rounded-full text-xs text-zaa-orange uppercase">
                    {hotel.category}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-0.5">
                    {Array.from({ length: hotel.stars }, (_, i) => <FiStar key={i} fill="#F4742B" stroke="#F4742B" size={14} />)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black mb-1">{hotel.name}</h3>
                  <p className="text-sm text-muted flex items-center gap-1.5 mb-3">
                    <FiMapPin size={13} /> {hotel.location?.city ? `${hotel.location.city}, ` : ''}{hotel.location?.country}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities?.slice(0, 3).map((a) => (
                      <span key={a} className="text-[11px] px-2.5 py-1 bg-zaa-orange/8 border border-zaa-orange/15 rounded-full text-secondary">{a}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-muted">From</div>
                      <div className="text-xl font-bold text-zaa-orange">{formatPrice(hotel.priceRange?.min, hotel.priceRange?.currency)}</div>
                      <div className="text-[11px] text-muted">per night</div>
                    </div>
                    <button className="btn-outline text-sm py-2 px-5">Enquire</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
