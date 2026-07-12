import { motion } from 'framer-motion';

const stats = [
  { value: '2,400+', label: 'Happy Travelers', icon: '✈' },
  { value: '15+', label: 'Years of Excellence', icon: '★' },
  { value: '48', label: 'African Destinations', icon: '🌍' },
  { value: '99%', label: 'Satisfaction Rate', icon: '♡' },
];

const team = [
  { name: 'Zeno Mokoena', role: 'Founder & CEO', initials: 'ZM', bio: 'With 20 years of guiding experience across Africa, Zeno built ZAA on the belief that every traveller deserves a transformative African journey.' },
  { name: 'Amara Diallo', role: 'Head of Safaris', initials: 'AD', bio: "Former wildlife biologist turned safari architect. Amara's expert knowledge of African ecosystems ensures every game drive is extraordinary." },
  { name: 'Sophie Ndlovu', role: 'Visa Specialist', initials: 'SN', bio: 'Certified immigration consultant with 10+ years navigating African visa requirements. Sophie makes the complex simple.' },
  { name: 'Kofi Mensah', role: 'Operations Director', initials: 'KM', bio: 'Logistics maestro who ensures every transfer, check-in, and activity runs seamlessly — so guests only experience perfection.' },
];

export default function AboutPage() {
  return (
    <div style={{
        background: ' #f1f1f1',
      }} className="pt-20">
      {/* Hero */}
      <div className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80)', filter: 'brightness(0.25)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="section-eyebrow justify-center">Our Story</div>
          <h1 className="text-4xl md:text-7xl font-black mb-5" style={{ fontFamily:"Montserrat" }}>
            15 Years of <span className="zaa-text">African Excellence</span>
          </h1>
          <p className="text-base md:text-lg text-secondary leading-relaxed">
            Born from a deep love of Africa and its people, Zeno Africa Adventures was founded in 2009 with a singular mission: to connect the world with Africa's most extraordinary places in a way that is authentic, responsible, and truly unforgettable.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-black text-zaa-orange font-black">{s.value}</div>
              <div className="text-sm text-secondary mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section style={{
        background: ' linear-gradient(135deg, rgba(244,116,43,0.03) 0%, #f1f1f1 100%)',
      }} className="py-24 bg-obsidian">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-eyebrow justify-center">Our Mission</div>
          <h2 className=" text-muted text-3xl md:text-5xl font-black mb-6">
            Authentic Africa, <span className="zaa-text">Responsibly Shared</span>
          </h2>
          <p className="text-base text-black leading-relaxed mb-6">
            We believe travel has the power to transform — both the traveller and the communities they visit. Every itinerary we craft supports local guides, conservation projects, and community initiatives across the continent.
          </p>
          <p className="text-base text-black leading-relaxed">
            From the snow-capped peaks of Kilimanjaro to the thundering waters of Victoria Falls, from intimate gorilla encounters in Rwanda to the golden plains of the Serengeti — we don't just show you Africa, we help you feel it.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="section-eyebrow justify-center">Our People</div>
            <h2 className="text-muted text-3xl md:text-5xl font-black">Meet the <span className="zaa-text">Dream Team</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-7 text-center"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-zaa-orange to-orange-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white font-black">
                  {member.initials}
                </div>
                <h3 className="text-lg font-black mb-1">{member.name}</h3>
                <div className="text-xs text-zaa-orange tracking-wide uppercase mb-3">{member.role}</div>
                <p className="text-sm text-secondary leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
