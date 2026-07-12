import { SectionHeading } from '../common/Common';

const partners = [
  { name: 'Emirates', logo: '/images/partners/emirates.png' },
  { name: 'Kenya Airways', logo: '/images/partners/kenya-airways.png' },
  { name: 'Ethiopian Airlines', logo: '/images/partners/ethiopian-airlines.png' },
  { name: 'Qatar Airways', logo: '/images/partners/qatar-airways.png' },
  { name: 'South African Airways', logo: '/images/partners/south-african-airways.png' },
  { name: 'Air Tanzania', logo: '/images/partners/air-tanzania.png' },
];

const duplicated = [...partners, ...partners];

export default function Partners() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-xl mx-auto px-4 mb-10">
        <SectionHeading
          eyebrow="Trusted By"
          title="Our"
          highlight="Partners"
          subtitle="We collaborate with world-class airlines, hotels, and travel brands to deliver exceptional African experiences."
        />
      </div>

      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"  />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"  />

        {/* Row 1 — left to right */}
        <div className="flex animate-marquee mb-6">
          {duplicated.map((partner, i) => (
            <div
              key={`r1-${i}-${partner.name}`}
              className="flex-shrink-0 mx-5 flex items-center justify-center w-52 h-24 rounded-2xl border border-white/5 bg-white/[0.9] hover:border-zaa-orange/20 hover:bg-zaa-orange/5 transition-all duration-500 group cursor-default overflow-hidden"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[160px] max-h-14 object-contain  group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Row 2 — right to left */}
        <div className="flex animate-marquee-reverse" style={{ animationDelay: '-12s' }}>
          {[...duplicated].reverse().map((partner, i) => (
            <div
              key={`r2-${i}-${partner.name}`}
              className="flex-shrink-0 mx-5 flex items-center justify-center w-52 h-24 rounded-2xl border border-white/5 bg-white/[0.9] hover:border-zaa-orange/20 hover:bg-zaa-orange/5 transition-all duration-500 group cursor-default overflow-hidden"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[160px] max-h-14 object-contain group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
