import { motion } from 'framer-motion';

const reasons = [
  {
    title: 'Expert Local Knowledge',
    desc: "Our team of seasoned African travel experts live and breathe the continent — offering insider access no guidebook can match.",
  },
  {
    title: 'Fully Customised Journeys',
    desc: "No two journeys are identical. Every itinerary is crafted around your unique interests, budget, and travel style.",
  },
  {
    title: '24/7 In-Journey Support',
    desc: "Our dedicated support team is available around the clock during your trip, so you're never alone on your adventure.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ background: '#ebeaea' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── Image collage ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] sm:h-[420px] lg:h-[560px]"
          >
            <img
              src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80"
              className="absolute top-0 left-0 w-[70%] h-[70%] object-cover rounded-2xl"
              style={{ border: '2px solid rgba(244,116,43,0.25)' }}
              alt="Safari experience"
            />
            <img
              src="https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=400&q=80"
              className="absolute bottom-0 right-0 w-[55%] h-[55%] object-cover rounded-2xl"
              style={{ border: '2px solid rgba(244,116,43,0.25)' }}
              alt="Wildlife"
            />

            {/* Floating stat card */}
            <div
              className="absolute bottom-[28%] left-0 md:-left-8 animate-float"
              style={{
                background: 'rgba(13,11,9,0.82)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(244,116,43,0.25)',
                borderRadius: 16,
                padding: '18px 22px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {/* Logo in floating card */}
              <img src="/zaa-logo.png" alt="ZAA" style={{ height: 32, width: 'auto', marginBottom: 8 }} />
              <div
                className="text-3xl font-black"
                style={{ color: '#F4742B', fontFamily: 'Montserrat', lineHeight: 1 }}
              >
                5+
              </div>
              <div className="text-sm font-medium mt-1" style={{ color: '#C4A882' }}>
                Years of Excellence
              </div>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#F4742B', fontSize: 14 }}>★</span>
                ))}
              </div>
            </div>

            {/* Orange glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: 'radial-gradient(ellipse at 30% 70%, rgba(244,116,43,0.08) 0%, transparent 60%)',
              }}
            />
          </motion.div>

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="section-eyebrow">Why Choose Us</div>
            <h2
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ fontFamily: 'Montserrat', color:'#636363' }}
            >
              Africa's Most{' '}
              <span className="zaa-text">Trusted</span>{' '}
              Travel Partner
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: '#272625' }}>
              For over 5 years, Zeno Africa Adventures has been crafting extraordinary journeys across
              the continent. Our deep local knowledge, handpicked guides, and uncompromising commitment
              to excellence set us apart.
            </p>

            <div className="space-y-6">
              {reasons.map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-white text-sm mt-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #F4742B, #D3763D)',
                      fontFamily: 'Montserrat',
                      boxShadow: '0 4px 16px rgba(244,116,43,0.3)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4
                      className="text-base font-bold mb-1.5"
                      style={{ fontFamily: 'Montserrat', color: '#F5EDE0' }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#272625' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badge row */}
            <div
              className="flex gap-6 mt-10 pt-8"
              style={{ borderTop: '1px solid rgba(244,116,43,0.15)' }}
            >
              {[
                { val: '2,400+', lbl: 'Happy Travelers' },
                { val: '48',    lbl: 'Destinations' },
                { val: '99%',   lbl: 'Satisfaction' },
              ].map((s) => (
                <div key={s.lbl} className="text-center">
                  <div
                    className="text-2xl font-black"
                    style={{ color: '#F4742B', fontFamily: 'Montserrat' }}
                  >
                    {s.val}
                  </div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: '#7A6148' }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
