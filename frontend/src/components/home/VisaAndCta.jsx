import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';
import { openModal } from '../../redux/slices/uiSlice';
import { contactAPI } from '../../api/axios';

const steps = [
  { step: '01', title: 'Consultation', desc: 'Free 30-minute visa consultation with our certified documentation specialists.' },
  { step: '02', title: 'Document Review', desc: 'We assess your documents, identify requirements, and create a tailored application plan.' },
  { step: '03', title: 'Application', desc: 'Our team prepares and submits your complete application with all supporting documents.' },
  { step: '04', title: 'Approval', desc: 'We track your application and notify you the moment your visa is approved.' },
];

export function VisaSection() {
  const dispatch = useDispatch();
  return (
    <section
      className="py-2 md:py-8"
      id="visa"
      style={{
        background: 'linear-gradient(135deg, rgba(244,116,43,0.03) 0%, #f1f1f1 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-eyebrow">Visa Services</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Montserrat' }}>
              Travel Without{' '}
              <span className="zaa-text">Borders</span>
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: '#C4A882' }}>
              Navigating African visa requirements can be complex. Our accredited visa specialists handle
              everything — so the only thing on your mind is which wildlife to photograph first.
            </p>
            <button
              onClick={() => dispatch(openModal('visa'))}
              className="btn-gold inline-flex items-center gap-2"
            >
              Apply for Visa Assistance <FiArrowRight />
            </button>
          </motion.div>

          {/* Steps */}
          <div className="flex flex-col gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="glass rounded-2xl p-6 flex gap-5 group hover:border-zaa-orange transition-all duration-300"
              >
                <div
                  className="text-3xl font-black leading-none flex-shrink-0"
                  style={{
                    fontFamily: 'Montserrat',
                    color: 'rgba(244,116,43,0.22)',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(244,116,43,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,116,43,0.22)')}
                >
                  {s.step}
                </div>
                <div>
                  <h4 className="text-base font-bold mb-1.5" style={{ fontFamily: 'Montserrat' }}>
                    {s.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#C4A882' }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await contactAPI.send({
        name: 'Newsletter',
        email,
        message: 'Newsletter subscription',
        type: 'general',
        subject: 'Newsletter',
      });
      toast.success("You're on the list! Exclusive Africa deals incoming.");
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-14 md:py-20"
      style={{
        background: 'linear-gradient(135deg, rgba(244,116,43,0.07) 0%, rgba(245,169,76,0.03) 100%)',
        borderTop: '1px solid rgba(244,116,43,0.15)',
        borderBottom: '1px solid rgba(244,116,43,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* ZAA logo small */}
        <img src="/zaa-logo.png" alt="ZAA" className="h-16 w-auto mx-auto mb-4 object-contain opacity-90" />

        <h2
          className="text-3xl md:text-5xl font-black mb-3"
          style={{ fontFamily: 'Montserrat' }}
        >
          Don't Miss a Single{' '}
          <span className="zaa-text">Adventure</span>
        </h2>
        <p className="text-base max-w-lg mx-auto mb-9" style={{ color: '#C4A882' }}>
          Join 8,000+ explorers receiving exclusive deals, destination guides, and early access to new packages.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 max-w-md mx-auto justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field flex-1"
            style={{ borderColor: 'rgba(244,116,43,0.3)' }}
            required
          />
          <button type="submit" disabled={loading} className="btn-gold flex-shrink-0">
            {loading ? '...' : 'Subscribe'}
          </button>
        </form>
        <p className="text-xs mt-3" style={{ color: '#7A6148' }}>
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
