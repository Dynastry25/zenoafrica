import { FiStar } from 'react-icons/fi';

// ── Stars ─────────────────────────────────────────────────
export function Stars({ rating = 0, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar
          key={i}
          size={size}
          fill={i < Math.round(rating) ? '#F4742B' : 'transparent'}
          stroke={i < Math.round(rating) ? '#F4742B' : '#3A3020'}
        />
      ))}
    </span>
  );
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ size = 40 }) {
  return <div className="spinner" style={{ width: size, height: size }} />;
}

// ── PageLoader ────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--obsidian)' }}>
      <div className="text-center">
        <img src="/zaa-logo.png" alt="ZAA" className="h-16 w-auto mx-auto mb-6 opacity-80" />
        <Spinner size={44} />
        <p className="mt-4 text-sm font-medium" style={{ color: '#7A6148', fontFamily: 'Montserrat' }}>
          Loading your African adventure...
        </p>
      </div>
    </div>
  );
}

// ── Section Heading ────────────────────────────────────────
export function SectionHeading({ eyebrow, title, highlight, subtitle, center = true }) {
  return (
    <div className={center ? 'text-center max-w-2xl mx-auto' : ''}>
      {eyebrow && <div className="section-eyebrow" style={{ justifyContent: center ? 'center' : 'flex-start' }}>{eyebrow}</div>}
      <h2
        className="text-4xl md:text-5xl font-black mb-5"
        style={{ fontFamily: 'Montserrat', color: '#F5EDE0' }}
      >
        {title}{' '}
        {highlight && <span className="zaa-text">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-base leading-relaxed" style={{ color: '#C4A882' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ children, color = '#F4742B', textColor = '#ffffff', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${className}`}
      style={{ background: color, color: textColor, fontFamily: 'Montserrat' }}
    >
      {children}
    </span>
  );
}

// ── Tag ────────────────────────────────────────────────────
export function Tag({ children }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase"
      style={{
        background: 'rgba(244,116,43,0.1)',
        border: '1px solid rgba(244,116,43,0.25)',
        color: '#F4742B',
        fontFamily: 'Montserrat',
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </span>
  );
}

// ── Format Price ───────────────────────────────────────────
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: 0,
  }).format(price || 0);
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ icon = '🔍', title, message, action }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">{icon}</div>
      <h3
        className="text-2xl font-black mb-2"
        style={{ fontFamily: 'Montserrat', color: '#F5EDE0' }}
      >
        {title}
      </h3>
      <p className="mb-6 text-sm" style={{ color: '#7A6148' }}>{message}</p>
      {action}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────
export function ZaaDivider() {
  return <div className="zaa-divider" />;
}
