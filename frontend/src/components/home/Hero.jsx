import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCalendar, FiUsers, FiChevronRight } from 'react-icons/fi';
import { openModal } from '../../redux/slices/uiSlice';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=85',
    label: 'East Africa Safari',
    title: "Witness Africa's",
    highlight: 'Wild Splendour',
    subtitle: 'Curated luxury safari experiences across 48 African destinations',
  },
  {
    image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=1600&q=85',
    label: 'Serengeti Plains',
    title: 'Where the Horizon',
    highlight: 'Meets Forever',
    subtitle: 'From Victoria Falls to the Serengeti — your journey begins here',
  },
  {
    image: 'https://images.unsplash.com/photo-1530968464165-7a1861cbaf5f?w=1600&q=85',
    label: 'Maasai Mara',
    title: 'Africa Awaits',
    highlight: 'Your Story',
    subtitle: "Exclusive safaris, private tours, and moments you'll never forget",
  },
];

const stats = [
  { value: '2,400+', label: 'Happy Travelers' },
  { value: '15+',    label: 'Years of Excellence' },
  { value: '48',     label: 'Destinations' },
  { value: '99%',    label: 'Satisfaction Rate' },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState({ destination: '', category: '', date: '', guests: 2 });
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.destination) params.set('search', search.destination);
    if (search.category)    params.set('category', search.category);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <section className="relative h-screen min-h-[500px] overflow-hidden">

      {/* ── Background Slides ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${s.image})`,
            opacity: i === active ? 1 : 0,
            transition: 'opacity 1.6s ease',
            animation: i === active ? 'kenBurns 14s ease infinite' : 'none',
          }}
        />
      ))}

      {/* ── Overlays ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(13,11,9,0.5) 0%, rgba(13,11,9,0.15) 35%, rgba(13,11,9,0.7) 80%, rgba(13,11,9,0.92) 100%)',
        }}
      />
      {/* ZAA orange radial glow bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 5% 90%, rgba(244,116,43,0.12) 0%, transparent 55%)',
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative z-10 h-full flex flex-col justify-center max-w-auto mx-auto px-20"
        style={{ paddingTop: 50 }}
      >
        {/* Slide label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${active}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-0.5 rounded-full" style={{ background: '#F4742B' }} />
            <span
              className="text-[11px] font-bold tracking-[3.5px] uppercase"
              style={{ color: '#F4742B', fontFamily: 'Montserrat' }}
            >
              {slide.label}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${active}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.65 }}
            className="font-black leading-[1.03] mb-2"
            style={{
              fontSize: 'clamp(28px, 8.5vw, 44px)',
              fontFamily: 'Montserrat',
              color: '#F5EDE0',
            }}
          >
            {slide.title}
            <br />
            <span className="zaa-text">{slide.highlight}</span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-base md:text-lg max-w-xl mb-4 leading-relaxed font-medium"
            style={{ color: 'rgba(245,237,224,0.78)', fontFamily: 'Montserrat' }}
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex gap-4 flex-wrap mb-14"
        >
          <button
            onClick={() => navigate('/packages')}
            className="btn-gold text-[12px] px-4 py-4 flex items-center gap-2"
          >
            Explore Packages <FiChevronRight />
          </button>
          <button
            onClick={() => dispatch(openModal('contact-quick'))}
            className="btn-outline text-[12px] px-4 py-4"
            style={{ color: '#F5EDE0', borderColor: 'rgba(245,237,224,0.4)' }}
          >
            Talk to an Expert
          </button>
        </motion.div>

        {/* Stats row */}


        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.65 }}
          className="hidden lg:block absolute bottom-10 left-6 right-6 max-w-5xl mx-auto"
          style={{
            background: 'rgba(13,11,9,0.78)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(244,116,43,0.22)',
            borderRadius: 20,
            padding: '10px 14px',
          }}
        >
          <form
            onSubmit={handleSearch}
            className="grid gap-4 items-end"
            style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto' }}
          >
            <div>
              <label className="form-label" style={{ fontSize: '10px', color: '#F4742B' }}>Destination</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7A6148' }} size={14} />
                <input
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                  placeholder="Where to, explorer?"
                  className="input-field pl-9"
                  style={{ fontSize: '11px', background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}
                />
              </div>
            </div>
            <div>
              <label className="form-label" style={{fontSize: '10px', color: '#F4742B' }}>Experience</label>
              <select
                value={search.category}
                onChange={(e) => setSearch({ ...search, category: e.target.value })}
                className="input-field"
                style={{ fontSize: '11px', background: 'rgba(22,18,16,0.95)' }}
              >
                <option value="">All Types</option>
                <option value="safari">Safari & Wildlife</option>
                <option value="adventure">Adventure</option>
                <option value="luxury">Luxury Retreat</option>
                <option value="cultural">Cultural Journey</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '10px', color: '#F4742B' }}>Travel Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7A6148' }} size={14} />
                <input
                  type="date"
                  value={search.date}
                  onChange={(e) => setSearch({ ...search, date: e.target.value })}
                  className="input-field pl-9"
                  style={{ fontSize: '11px', background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}
                />
              </div>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '10px', color: '#F4742B' }}>Guests</label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7A6148' }} size={12}  />
                <input
                  type="number"
                  min={1} max={20}
                  value={search.guests}
                  onChange={(e) => setSearch({ ...search, guests: e.target.value })}
                  className="input-field pl-9"
                  style={{ fontSize: '11px', background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}
                />
              </div>
            </div>
            <button type="submit" className="btn-gold h-[40px] px-3 text-[14px]">
              Search
            </button>
          </form>
        </motion.div>
      </div>

      {/* ── Slide dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-2 rounded-full transition-all duration-400"
            style={{
              width: i === active ? 34 : 8,
              background:
                i === active
                  ? 'linear-gradient(90deg,#F4742B,#F5A94C)'
                  : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute right-8 bottom-28 hidden lg:flex flex-col items-center gap-2"
      >
        <span
          className="text-[9px] font-bold tracking-[3px] uppercase"
          style={{ color: 'rgba(255,255,255,0.35)', writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
        <div
          className="w-0.5 h-14 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, #F4742B)',
            animation: 'pulse 2.5s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}
