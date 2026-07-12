import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1, name: 'Alexandra Morrison', country: 'United Kingdom', avatar: 'AM',
    rating: 5, package: 'Serengeti Luxury Safari', avatarGrad: 'linear-gradient(135deg,#F4742B,#D3763D)',
    text: "Words fail to describe the magnificence of the Serengeti. Zeno Africa Adventures crafted a flawless experience — from the first email to the final transfer. Our guide Emmanuel was extraordinary.",
  },
  {
    id: 2, name: 'James & Sarah Chen', country: 'Australia', avatar: 'JC',
    rating: 5, package: 'Cape Town & Winelands', avatarGrad: 'linear-gradient(135deg,#F5A94C,#F4742B)',
    text: "Our anniversary trip exceeded every expectation. The attention to detail was remarkable — every restaurant, every view, every moment felt curated just for us. We're already planning our return.",
  },
  {
    id: 3, name: 'Dr. Michael Osei', country: 'United States', avatar: 'MO',
    rating: 5, package: 'Rwanda Gorilla Trek', avatarGrad: 'linear-gradient(135deg,#D3763D,#8B4513)',
    text: "Meeting the gorillas was a life-changing experience. The team handled every detail — visa, permits, logistics — so we could focus entirely on the magic unfolding before us.",
  },
  {
    id: 4, name: 'Priya Nair', country: 'India', avatar: 'PN',
    rating: 5, package: 'Maasai Mara Migration', avatarGrad: 'linear-gradient(135deg,#FB7330,#F5A94C)',
    text: "The river crossing was the most dramatic thing I've ever witnessed. Being in a private conservancy meant we had the entire scene almost to ourselves. Unforgettable.",
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <span key={i} style={{ color: '#F4742B', fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24" style={{ background:' #ebeaea' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-eyebrow justify-center">Guest Stories</div>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Montserrat', color: '#636363' }}>
            Voices from <span className="zaa-text">Our Travelers</span>
          </h2>
        </div>

        {/* Featured large quote */}
        <div
          className="rounded-2xl bg-obsidian max-w-3xl mx-auto mb-12 text-center py-24"
          style={{ minHeight: 200}}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[active].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quote mark */}
              <div
                className="text-7xl leading-none mb-4"
                style={{
                  color: 'rgba(252, 103, 17, 0.55)',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 0.8,
                }}
              >
                "
              </div>
              <p
                className=" text-lg md:text-2xl leading-relaxed mb-8"
                style={{
                  color: '#fff',
                  fontFamily: 'Montserrat',
                  fontWeight: 400,
                  fontStyle: 'italic',
                }}
              >
                {testimonials[active].text}
              </p>
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: testimonials[active].avatarGrad }}
                >
                  {testimonials[active].avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm" style={{ color: '#F5EDE0', fontFamily: 'Montserrat' }}>
                    {testimonials[active].name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#7A6148' }}>
                    {testimonials[active].country} · {testimonials[active].package}
                  </div>
                </div>
                <Stars count={testimonials[active].rating} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide dots */}
        <div className="flex justify-center gap-2 mb-16">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-2 rounded-full transition-all duration-400"
              style={{
                width: i === active ? 32 : 8,
                background:
                  i === active
                    ? 'linear-gradient(90deg,#F4742B,#F5A94C)'
                    : 'rgba(255,255,255,0.18)',
              }}
            />
          ))}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              onClick={() => setActive(i)}
              className="bg-obsidian rounded-2xl p-6 cursor-pointer transition-all duration-300"
              style={{
                borderColor: i === active ? 'rgba(244,116,43,0.45)' : 'rgba(244,116,43,0.12)',
                boxShadow: i === active ? '0 0 24px rgba(244,116,43,0.1)' : 'none',
              }}
            >
              <Stars count={t.rating} />
              <p
                className="text-sm leading-relaxed mt-3 line-clamp-3"
                style={{ color: '#C4A882', fontStyle: 'italic' }}
              >
                "{t.text.slice(0, 100)}..."
              </p>
              <div className="flex items-center gap-2.5 mt-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: t.avatarGrad }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#F5EDE0', fontFamily: 'Montserrat' }}>
                    {t.name}
                  </div>
                  <div className="text-[11px]" style={{ color: '#7A6148' }}>{t.country}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
