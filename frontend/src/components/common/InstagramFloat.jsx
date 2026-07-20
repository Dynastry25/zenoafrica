import { FaInstagram } from 'react-icons/fa6';

export default function InstagramFloat() {
  return (
    <a
      href="https://www.instagram.com/zenoafrica_adventures?igsh=cWN6dTF1ZWMzZHVs"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-[999] flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
      style={{
        background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)',
        boxShadow: '0 4px 24px rgba(225,48,108,0.4)',
      }}
      aria-label="Follow on Instagram"
    >
      <FaInstagram size={28} className="text-white" />
      <span
        className="absolute right-full mr-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: '#1E1E1E',
          color: '#F5F0E8',
          border: '1px solid rgba(244,116,43,0.2)',
        }}
      >
        Follow us
      </span>
    </a>
  );
}
