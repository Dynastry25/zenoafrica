import { Link } from 'react-router-dom';
import { SectionHeading } from '../common/Common';
import partners from '../../data/partners';

const duplicated = [...partners, ...partners];

export default function Partners() {
  return (
    <section className="py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <SectionHeading
          eyebrow="Trusted By"
          title="Our"
          highlight="Partners"
          subtitle="We collaborate with world-class airlines, hotels, and travel brands to deliver exceptional African experiences."
        />
      </div>

      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--obsidian), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--obsidian), transparent)' }} />

        {/* Row 1 — left to right */}
        <div className="flex animate-marquee mb-6">
          {duplicated.map((partner, i) => (
            <Link
              key={`r1-${i}-${partner.name}`}
              to={`/partners/${partner.slug}`}
              className="flex-shrink-0 mx-5 flex items-center justify-center w-52 h-24 rounded-2xl border border-white/5 bg-white/[0.9] hover:border-zaa-orange/20 hover:bg-zaa-orange/5 transition-all duration-500 group overflow-hidden"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[160px] max-h-14 object-contain group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
            </Link>
          ))}
        </div>

        {/* Row 2 — right to left */}
        <div className="flex animate-marquee-reverse" style={{ animationDelay: '-12s' }}>
          {[...duplicated].reverse().map((partner, i) => (
            <Link
              key={`r2-${i}-${partner.name}`}
              to={`/partners/${partner.slug}`}
              className="flex-shrink-0 mx-5 flex items-center justify-center w-52 h-24 rounded-2xl border border-white/5 bg-white/[0.9] hover:border-zaa-orange/20 hover:bg-zaa-orange/5 transition-all duration-500 group overflow-hidden"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-[160px] max-h-14 object-contain group-hover:opacity-90 transition-all duration-500"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* View All Partners CTA */}
      <div className="text-center mt-10">
        <Link
          to="/partners"
          className="inline-flex items-center gap-2 text-sm text-zaa-orange hover:underline font-medium"
        >
          View All Partners &rarr;
        </Link>
      </div>
    </section>
  );
}
