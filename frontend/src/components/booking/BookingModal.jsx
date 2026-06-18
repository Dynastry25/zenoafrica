import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { closeModal } from '../../redux/slices/uiSlice';
import { clearCartPackage, createBooking, clearBookingSuccess } from '../../redux/slices/bookingSlice';
import { paymentAPI } from '../../api/axios';
import { formatPrice, Spinner } from '../common/Common';

const STEPS = ['Details', 'Travellers', 'Payment', 'Confirmed'];

export default function BookingModal() {
  const dispatch = useDispatch();
  const { cartPackage: pkg } = useSelector((s) => s.bookings);
  const { user } = useSelector((s) => s.auth);
  const { loading: bookingLoading } = useSelector((s) => s.bookings);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    leadTraveler: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', nationality: user?.nationality || '' },
    travelDate: '',
    travelers: { adults: 2, children: 0, infants: 0 },
    specialRequests: '',
    emergencyContact: { name: '', relationship: '', phone: '' },
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [paying, setPaying] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  if (!pkg) return null;

  const totalGuests = form.travelers.adults + form.travelers.children;
  const adultPrice = pkg.price?.adult || pkg.price;
  const childPrice = pkg.price?.child || 0;
  const subtotal = adultPrice * form.travelers.adults + childPrice * form.travelers.children;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;
  const depositPercent = pkg.depositRequired || 30;
  const deposit = Math.round(total * (depositPercent / 100));
  const balance = total - deposit;

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(clearCartPackage());
    dispatch(clearBookingSuccess());
    setStep(1);
    setCreatedBooking(null);
  };

  const handleCreateBooking = async () => {
    try {
      const booking = await dispatch(createBooking({
        packageId: pkg._id || pkg.id,
        travelDate: form.travelDate,
        travelers: form.travelers,
        leadTraveler: form.leadTraveler,
        emergencyContact: form.emergencyContact,
        specialRequests: form.specialRequests,
      })).unwrap();
      setCreatedBooking(booking);
      setStep(3);
    } catch (err) {
      toast.error(err || 'Failed to create booking');
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      // In a real Stripe integration, this would use Stripe Elements.
      // Simulated here for demonstration purposes.
      await new Promise((r) => setTimeout(r, 1800));
      toast.success('Payment successful!');
      setStep(4);
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const image = pkg.coverImage?.url || pkg.image;
  const title = pkg.title;
  const location = pkg.location?.country || pkg.location;
  const duration = pkg.duration ? `${pkg.duration.days} Days / ${pkg.duration.nights} Nights` : pkg.duration;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black">Book Your Journey</h2>
            <p className="text-sm text-muted mt-0.5">{title}</p>
          </div>
          <button onClick={handleClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-secondary hover:text-zaa-orange">
            <FiX size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-7 py-5 border-b border-border flex">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: step > i + 1 ? '#F4742B' : step === i + 1 ? 'linear-gradient(135deg,#F4742B,#F5A94C)' : 'rgba(255,255,255,0.08)',
                    color: step >= i + 1 ? '#0D0D0D' : '#7A6B52',
                    border: step === i + 1 ? '2px solid #F4742B' : '2px solid transparent',
                  }}
                >
                  {step > i + 1 ? <FiCheck /> : i + 1}
                </div>
                <span className="text-[11px] mt-1" style={{ color: step === i + 1 ? '#F4742B' : '#7A6B52' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-[18px] transition-colors" style={{ background: step > i + 1 ? '#F4742B' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-7">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div>
              <div className="bg-zaa-orange/6 border border-zaa-orange/20 rounded-2xl p-5 mb-6 flex gap-4">
                <img src={image} alt={title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div>
                  {pkg.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1.5" style={{ background: pkg.badgeColor || '#F4742B', color: '#0D0D0D' }}>
                      {pkg.badge}
                    </span>
                  )}
                  <h4 className="text-base font-black">{title}</h4>
                  <p className="text-sm text-muted">📍 {location} · ⏱ {duration}</p>
                  <div className="text-lg font-bold text-zaa-orange mt-1">
                    {formatPrice(adultPrice)} <span className="text-xs font-normal text-muted">per person</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="input-field" value={form.leadTraveler.name} onChange={(e) => setForm({ ...form, leadTraveler: { ...form.leadTraveler, name: e.target.value } })} placeholder="John Doe" required />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input type="email" className="input-field" value={form.leadTraveler.email} onChange={(e) => setForm({ ...form, leadTraveler: { ...form.leadTraveler, email: e.target.value } })} placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input className="input-field" value={form.leadTraveler.phone} onChange={(e) => setForm({ ...form, leadTraveler: { ...form.leadTraveler, phone: e.target.value } })} placeholder="+1 234 567 8900" required />
                </div>
                <div>
                  <label className="form-label">Travel Date *</label>
                  <input type="date" className="input-field" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} min={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="form-label">Adults</label>
                  <input type="number" min={1} max={pkg.groupSize?.max || 20} className="input-field" value={form.travelers.adults} onChange={(e) => setForm({ ...form, travelers: { ...form.travelers, adults: Math.max(1, +e.target.value) } })} />
                </div>
                <div>
                  <label className="form-label">Children</label>
                  <input type="number" min={0} className="input-field" value={form.travelers.children} onChange={(e) => setForm({ ...form, travelers: { ...form.travelers, children: Math.max(0, +e.target.value) } })} />
                </div>
                <div>
                  <label className="form-label">Infants</label>
                  <input type="number" min={0} className="input-field" value={form.travelers.infants} onChange={(e) => setForm({ ...form, travelers: { ...form.travelers, infants: Math.max(0, +e.target.value) } })} />
                </div>
              </div>

              <button
                className="btn-gold w-full justify-center py-3.5"
                disabled={!form.leadTraveler.name || !form.leadTraveler.email || !form.leadTraveler.phone || !form.travelDate}
                onClick={() => setStep(2)}
              >
                Continue to Traveller Details →
              </button>
            </div>
          )}

          {/* STEP 2: Travellers + Summary */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-black mb-5">Additional Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Emergency Contact Name</label>
                  <input className="input-field" value={form.emergencyContact.name} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} placeholder="Name" />
                </div>
                <div>
                  <label className="form-label">Relationship</label>
                  <input className="input-field" value={form.emergencyContact.relationship} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, relationship: e.target.value } })} placeholder="e.g. Spouse" />
                </div>
                <div>
                  <label className="form-label">Emergency Contact Phone</label>
                  <input className="input-field" value={form.emergencyContact.phone} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} placeholder="+1 234 567 8900" />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Special Requests / Dietary Requirements</label>
                  <textarea rows={3} className="input-field resize-none" value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} placeholder="Any allergies, mobility needs, special occasions..." />
                </div>
              </div>

              {/* Summary */}
              <div className="glass rounded-2xl p-5 mb-6">
                <h4 className="font-semibold mb-3">Booking Summary</h4>
                {[
                  ['Package', title],
                  ['Duration', duration],
                  ['Guests', `${totalGuests} (${form.travelers.adults} adults, ${form.travelers.children} children)`],
                  ['Travel Date', form.travelDate || 'TBD'],
                  ['Subtotal', formatPrice(subtotal)],
                  ['Taxes (5%)', formatPrice(taxes)],
                  ['Total', formatPrice(total)],
                  [`Deposit (${depositPercent}%)`, formatPrice(deposit)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-white/5 text-sm last:border-0">
                    <span className="text-muted">{k}</span>
                    <span className={k === 'Total' ? 'text-zaa-orange font-bold' : k.startsWith('Deposit') ? 'font-semibold' : ''}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
                <button onClick={handleCreateBooking} disabled={bookingLoading} className="btn-gold flex-[2] justify-center">
                  {bookingLoading ? <><Spinner size={18} /> Creating Booking...</> : 'Proceed to Payment →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-black mb-5">Secure Payment</h3>

              <div className="flex gap-2 mb-6">
                {[
                  { label: '💳 Card', value: 'card' },
                  { label: '🏦 Bank Transfer', value: 'bank' },
                  { label: '📱 Mobile Money', value: 'mobile' },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className="flex-1 py-2.5 rounded-lg text-sm border-[1.5px] transition-colors"
                    style={{
                      borderColor: paymentMethod === m.value ? '#F4742B' : 'rgba(244,116,43,0.2)',
                      background: paymentMethod === m.value ? 'rgba(244,116,43,0.1)' : 'transparent',
                      color: paymentMethod === m.value ? '#F4742B' : '#B8A98A',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Card Number</label>
                    <input className="input-field" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Expiry Date</label>
                      <input className="input-field" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="form-label">CVV</label>
                      <input className="input-field" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} placeholder="123" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="glass rounded-2xl p-5">
                  <h4 className="text-zaa-orange font-semibold mb-3">Bank Transfer Details</h4>
                  {[['Bank', 'First National Bank Africa'], ['Account Name', 'Zeno Africa Adventures Ltd'], ['Account Number', '1234567890'], ['Branch Code', '250655'], ['Reference', createdBooking?.bookingReference || 'ZAA-XXXXXX']].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-border text-sm last:border-0">
                      <span className="text-muted">{k}</span><span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div className="glass rounded-2xl p-5 text-center">
                  <p className="text-secondary text-sm mb-3">Send payment to our mobile money number:</p>
                  <div className="text-3xl font-bold text-zaa-orange py-4">0674 448 795</div>
                  <p className="text-xs text-muted">Zeno Africa Adventures · Include your name as reference</p>
                </div>
              )}

              <div className="glass rounded-xl p-4 mt-5 mb-5">
                <div className="flex justify-between">
                  <span className="text-secondary">Deposit Due Today ({depositPercent}%)</span>
                  <span className="text-xl font-bold text-zaa-orange">{formatPrice(deposit)}</span>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-muted text-sm">Remaining Balance</span>
                  <span className="text-secondary text-sm">{formatPrice(balance)}</span>
                </div>
                {createdBooking?.bookingReference && (
                  <div className="flex justify-between mt-1.5">
                    <span className="text-muted text-sm">Booking Reference</span>
                    <span className="text-zaa-orange text-sm font-medium">{createdBooking.bookingReference}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 mb-5 text-xs text-muted">
                🔒 Your payment is secured with 256-bit SSL encryption. We never store your card details.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 justify-center">← Back</button>
                <button onClick={handlePayment} disabled={paying} className="btn-gold flex-[2] justify-center">
                  {paying ? <><Spinner size={18} /> Processing...</> : `Confirm & Pay ${formatPrice(deposit)}`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <div className="text-center py-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-5 text-4xl text-white">
                <FiCheck />
              </div>
              <h2 className="text-3xl font-black mb-3">
                Booking <span className="zaa-text">Confirmed!</span>
              </h2>
              <p className="text-base text-secondary leading-relaxed mb-2 max-w-md mx-auto">
                Your {title} journey has been reserved. Our travel specialist will contact you within 24 hours to finalise all details.
              </p>
              {createdBooking?.bookingReference && (
                <p className="text-sm text-muted mb-2">
                  Reference: <strong className="text-zaa-orange">{createdBooking.bookingReference}</strong>
                </p>
              )}
              <p className="text-sm text-muted mb-8">
                Confirmation sent to <strong className="text-zaa-orange">{form.leadTraveler.email}</strong>
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleClose} className="btn-outline">Close</button>
                <button onClick={handleClose} className="btn-gold">Browse More Packages</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
