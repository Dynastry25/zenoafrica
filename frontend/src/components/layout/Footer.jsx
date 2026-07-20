import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { openModal } from '../../redux/slices/uiSlice';

const exploreLinks = [
  { label: 'Safari Packages',   to: '/packages?category=safari' },
  { label: 'Luxury Retreats',   to: '/packages?category=luxury' },
  { label: 'Adventure Tours',   to: '/packages?category=adventure' },
  { label: 'Our Partners',       to: '/partners' },
  { label: 'Visa Services',     to: '/services#visa' },
];
const destinationLinks = [
  { label: 'Tanzania',      to: '/packages?search=tanzania' },
  { label: 'Kenya',         to: '/packages?search=kenya' },
  { label: 'South Africa',  to: '/packages?search=south+africa' },
  { label: 'Rwanda',        to: '/packages?search=rwanda' },
  { label: 'Zimbabwe',      to: '/packages?search=zimbabwe' },
];
const socials = [
  { Icon: FiInstagram, href: 'https://www.instagram.com/zenoafrica_adventures?igsh=cWN6dTF1ZWMzZHVs' },
  { Icon: FiLinkedin,  href: 'https://www.linkedin.com/in/zenobia-fidelius-506686356?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
];

export default function Footer() {
  const dispatch = useDispatch();

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid rgba(244,116,43,0.15)' }}>
      {/* Top orange accent bar */}
      <div className="h-1 bg-zaa-gradient w-full" />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-14">

          {/* ── Brand ── */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-5">
              <img src="/zaa-logo.png" alt="ZAA" className="h-14 w-auto object-contain" />
              <div>
                <div className="font-black text-[15px] tracking-wide leading-tight" style={{ color: '#F4742B', fontFamily: 'Montserrat' }}>
                  ZENO AFRICA
                </div>
                <div className="font-black text-[15px] tracking-wide leading-tight" style={{ color: '#F4742B', fontFamily: 'Montserrat' }}>
                  ADVENTURES
                </div>
                <div className="text-[9px] font-semibold tracking-[3px] mt-1" style={{ color: '#F5A94C' }}>
                  YOUR GATEWAY TO AFRICA
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: '#7A6148' }}>
              Crafting extraordinary African journeys since 2009. From the Serengeti to the Cape — we make your Africa dream a reality.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ border: '1px solid rgba(244,116,43,0.2)', color: '#7A6148' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F4742B';
                    e.currentTarget.style.color = '#F4742B';
                    e.currentTarget.style.background = 'rgba(244,116,43,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(244,116,43,0.2)';
                    e.currentTarget.style.color = '#7A6148';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Explore ── */}
          <div>
            <h4 className="text-xs font-bold tracking-[2.5px] uppercase mb-5" style={{ color: '#F4742B' }}>Explore</h4>
            <div className="flex flex-col gap-2.5">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: '#7A6148' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F4742B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#7A6148')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Destinations ── */}
          <div>
            <h4 className="text-xs font-bold tracking-[2.5px] uppercase mb-5" style={{ color: '#F4742B' }}>Destinations</h4>
            <div className="flex flex-col gap-2.5">
              {destinationLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: '#7A6148' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F4742B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#7A6148')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-xs font-bold tracking-[2.5px] uppercase mb-5" style={{ color: '#F4742B' }}>Contact</h4>
            <div className="flex flex-col gap-3.5 text-sm" style={{ color: '#7A6148' }}>
              <div className="flex items-center gap-2.5">
                <FiPhone style={{ color: '#F4742B' }} size={14} />
                <span>+255 718 004 525</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiMail style={{ color: '#F4742B', flexShrink: 0, marginTop: 2 }} size={14} />
                <span className="break-all">zenoafricaadventures@gmail.com</span>
              </div>
              <a href="https://maps.app.goo.gl/E2iqVW3sjGSPKism6?g_st=aw" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 group">
                <FiMapPin style={{ color: '#F4742B', flexShrink: 0, marginTop: 2 }} size={14} />
                <span className="group-hover:underline">Victoria Noble Center, Plot No. 89 Block 25B,<br/>Bagamoyo Road, Dar es Salaam, Tanzania</span>
              </a>
              <button
                onClick={() => dispatch(openModal('contact-quick'))}
                className="text-sm font-bold mt-1 text-left transition-colors"
                style={{ color: '#F4742B', fontFamily: 'Montserrat' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5A94C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#F4742B')}
              >
                Talk to an Expert →
              </button>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="zaa-divider mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-8 text-xs" style={{ color: '#7A6148' }}>
          <p style={{ fontFamily: 'Montserrat' }}>
            © {new Date().getFullYear()} Zeno Africa Adventures. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Refund Policy', to: '/refund-policy' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-medium transition-colors"
                style={{ color: '#7A6148' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F4742B')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#7A6148')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
