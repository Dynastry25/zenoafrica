import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SEO, { orgJsonLd, breadcrumbJsonLd } from '../components/common/SEO';
import { contactAPI } from '../api/axios';
import { Spinner } from '../components/common/Common';

const contactInfo = [
  { icon: FiPhone, label: 'Phone / WhatsApp', value: '+255 718 004 525', sub: 'Mon–Sat, 8am–8pm SAST' },
  { icon: FiMail, label: 'Email', value: 'zenoafricaadventures@gmail.com', sub: 'Replies within 2 hours' },
  { icon: FiMapPin, label: 'Location', value: 'Victoria Noble Center, Plot No. 89 Block 25B, Bagamoyo Road, Dar es Salaam', sub: 'View on Google Maps', link: 'https://maps.app.goo.gl/E2iqVW3sjGSPKism6?g_st=aw' },
  { icon: FiClock, label: 'Business Hours', value: 'Mon–Sat: 8am–8pm', sub: 'Sun: 10am–4pm SAST' },
];

const destinations = ['Tanzania', 'Kenya', 'South Africa', 'Rwanda', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia', 'Uganda', 'Ethiopia', 'Morocco', 'Egypt'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.send({ ...form, type: form.subject === 'visa' ? 'visa' : form.subject === 'booking' ? 'booking' : 'general' });
      setSent(true);
      toast.success('Message sent!');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <SEO
        title="Contact Us"
        description="Get in touch with Zeno Africa Adventures. Contact our Africa travel experts for safari bookings, visa assistance, and custom travel planning. Phone, email, or visit us in Dar es Salaam."
        url="/contact"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />
      <div className="py-16 bg-charcoal text-center border-b border-border">
        <div className="section-eyebrow justify-center">Get in Touch</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3">Contact <span className="zaa-text">Us</span></h1>
        <p className="text-base text-secondary max-w-md mx-auto px-6">Our Africa travel experts are ready to help plan your perfect journey.</p>
      </div>

      <section className="py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Form */}
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Send us a <span className="zaa-text">Message</span></h2>
            <p className="text-secondary text-sm mb-8">Describe your dream trip and we'll design it for you.</p>

            {sent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-black mb-3">Message <span className="zaa-text">Received!</span></h3>
                <p className="text-secondary">We'll be in touch within 2 hours with a personalised Africa itinerary.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" />
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <select className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select topic...</option>
                      <option value="booking">Package Booking</option>
                      <option value="visa">Visa Assistance</option>
                      <option value="custom">Custom Itinerary</option>
                      <option value="other">General Enquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea rows={5} className="input-field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your dream Africa trip — destination, dates, budget, group size, interests..." required />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5">
                  {loading ? <><Spinner size={18} /> Sending...</> : 'Send Message ✦'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-col gap-5 mb-10">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                const Content = (
                  <div className="glass rounded-2xl p-5 flex gap-4 items-start">
                    <Icon className="text-2xl text-zaa-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-zaa-orange tracking-wide uppercase mb-1">{info.label}</div>
                      <div className="font-semibold text-base">{info.value}</div>
                      <div className="text-sm text-zaa-orange mt-0.5">{info.sub}</div>
                    </div>
                  </div>
                );
                return info.link ? (
                  <a key={info.label} href={info.link} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                    {Content}
                  </a>
                ) : (
                  <div key={info.label}>{Content}</div>
                );
              })}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-black mb-3 text-zaa-orange">🗺 Our Destinations</h3>
              <div className="flex flex-wrap gap-2">
                {destinations.map((d) => (
                  <span key={d} className="px-3 py-1 bg-zaa-orange/8 border border-zaa-orange/15 rounded-full text-xs text-secondary">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
