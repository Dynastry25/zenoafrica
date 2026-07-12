import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { closeModal } from '../../redux/slices/uiSlice';
import { visaAPI, contactAPI } from '../../api/axios';
import { Spinner } from '../common/Common';

// ═══════════════════════════════════════════════════════════
// VISA APPLICATION MODAL
// ═══════════════════════════════════════════════════════════
export function VisaModal() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: user?.phone || '',
    nationality: '', destinationCountry: '', travelDate: '', passportExpiry: '', visaType: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await visaAPI.apply({
        applicant: {
          firstName: form.firstName, lastName: form.lastName, email: form.email,
          phone: form.phone, nationality: form.nationality, passportExpiry: form.passportExpiry,
        },
        destinationCountry: form.destinationCountry,
        visaType: form.visaType,
        travelDate: form.travelDate,
      });
      setSubmitted(true);
      toast.success('Visa application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => dispatch(closeModal());

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content w-full max-w-xl">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black">Visa Assistance Application</h2>
            <p className="text-sm text-muted mt-0.5">Free consultation for all African destinations</p>
          </div>
          <button onClick={handleClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-secondary hover:text-zaa-orange">
            <FiX size={18} />
          </button>
        </div>

        <div className="p-7">
          {submitted ? (
            <div className="text-center py-5">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-black mb-3">
                Application <span className="zaa-text">Received</span>
              </h3>
              <p className="text-secondary leading-relaxed mb-6 max-w-sm mx-auto">
                Our visa specialist will review your application and contact you within 2 business hours with a personalised action plan.
              </p>
              <button onClick={handleClose} className="btn-gold">Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name *</label>
                    <input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="As in passport" required />
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="As in passport" required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" required />
                </div>
                <div>
                  <label className="form-label">Current Nationality *</label>
                  <input className="input-field" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="e.g. American" required />
                </div>
                <div>
                  <label className="form-label">Destination Country *</label>
                  <input className="input-field" value={form.destinationCountry} onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })} placeholder="e.g. Kenya" required />
                </div>
                <div>
                  <label className="form-label">Intended Travel Date *</label>
                  <input type="date" className="input-field" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Passport Expiry Date *</label>
                  <input type="date" className="input-field" value={form.passportExpiry} onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Purpose of Visit *</label>
                  <select className="input-field" value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })} required>
                    <option value="">Select purpose...</option>
                    <option value="tourist">Tourism & Safari</option>
                    <option value="business">Business</option>
                    <option value="student">Study</option>
                    <option value="transit">Transit</option>
                    <option value="medical">Medical</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-6 py-3.5">
                {loading ? <><Spinner size={18} /> Submitting...</> : 'Submit Visa Application ✦'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTACT QUICK MODAL
// ═══════════════════════════════════════════════════════════
export function ContactQuickModal() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClose = () => dispatch(closeModal());

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.send({ ...form, subject: 'Dream Trip Enquiry', type: 'general' });
      setSent(true);
      toast.success('Message sent!');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content w-full max-w-md relative">
        <div className="p-7">
          <button onClick={handleClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-secondary hover:text-zaa-orange">
            <FiX size={16} />
          </button>

          {sent ? (
            <div className="text-center py-5">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-black mb-3">Message <span className="zaa-text">Received!</span></h3>
              <p className="text-secondary text-sm mb-6">Our Africa travel expert will respond within 2 hours.</p>
              <button onClick={handleClose} className="btn-gold">Done</button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black mb-1.5">Talk to an Expert</h2>
              <p className="text-sm text-muted mb-6">Describe your dream Africa trip and we'll design it for you.</p>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="form-label">Your Name</label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
                </div>
                <div>
                  <label className="form-label">Tell us about your dream trip</label>
                  <textarea rows={4} className="input-field resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Destination, dates, budget, interests..." required />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5">
                  {loading ? <><Spinner size={18} /> Sending...</> : 'Send Message ✦'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
