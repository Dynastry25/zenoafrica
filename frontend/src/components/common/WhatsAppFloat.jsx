import { FaWhatsapp } from 'react-icons/fa6';

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/255674448795?text=Hi%2C%20I%27m%20interested%20in%20your%20travel%20services.%20Can%20you%20help%20me%3F"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[999] flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
      style={{
        background: 'linear-gradient(135deg, #25D366, #128C7E)',
        boxShadow: '0 4px 24px rgba(37,211,102,0.4)',
      }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} className="text-white" />
      <span
        className="absolute right-full mr-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: '#1E1E1E',
          color: '#F5F0E8',
          border: '1px solid rgba(244,116,43,0.2)',
        }}
      >
        Chat with us
      </span>
    </a>
  );
}
