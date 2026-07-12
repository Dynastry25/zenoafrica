import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiMapPin, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchMyBookings, cancelBooking } from '../../redux/slices/bookingSlice';
import { formatPrice, Spinner, EmptyState } from '../../components/common/Common';
import { Link } from 'react-router-dom';

const statusColors = { confirmed: '#27AE60', pending: '#E67E22', completed: '#8E44AD', cancelled: '#E74C3C', in_progress: '#2980B9', refunded: '#7A6B52' };

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const { items: bookings, loading } = useSelector((s) => s.bookings);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings({ status: filter !== 'all' ? filter : undefined }));
  }, [filter, dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund eligibility depends on travel date.')) return;
    setCancellingId(id);
    try {
      const result = await dispatch(cancelBooking({ id, reason: 'Cancelled by traveller' })).unwrap();
      toast.success(`Booking cancelled. Refund: ${formatPrice(result.refundAmount || 0)}`);
    } catch (err) {
      toast.error(err || 'Cancellation failed');
    } finally {
      setCancellingId(null);
    }
  };

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-full text-sm font-medium capitalize border-[1.5px] transition-colors"
            style={{
              borderColor: filter === s ? '#F4742B' : 'rgba(244,116,43,0.2)',
              background: filter === s ? 'rgba(244,116,43,0.12)' : 'transparent',
              color: filter === s ? '#F4742B' : '#B8A98A',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : bookings.length === 0 ? (
        <EmptyState icon="🧳" title="No bookings found" message="No bookings match this filter." action={<Link to="/packages" className="btn-gold">Browse Packages</Link>} />
      ) : (
        <div className="space-y-5">
          {bookings.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-5 justify-between">
                <div className="flex gap-4">
                  <img src={b.package?.coverImage?.url} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-black mb-1.5">{b.package?.title}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted mb-2">
                      <span className="flex items-center gap-1.5"><FiCalendar size={13} /> {new Date(b.travelDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><FiUsers size={13} /> {b.travelers?.adults + b.travelers?.children} guests</span>
                      <span className="flex items-center gap-1.5"><FiMapPin size={13} /> {b.package?.location?.country}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: statusColors[b.status] + '20', color: statusColors[b.status] }}>
                        {b.status?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-muted">Ref: {b.bookingReference}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-zaa-orange">{formatPrice(b.pricing?.total)}</div>
                  <div className="text-xs text-muted">Deposit: {formatPrice(b.pricing?.depositAmount)} {b.pricing?.depositPaid ? '(Paid)' : '(Pending)'}</div>
                  <div className="text-xs text-muted">Balance: {formatPrice(b.pricing?.balanceDue)}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-3">
                <Link to={`/packages/${b.package?.slug}`} className="btn-outline text-sm py-2 px-5">View Package</Link>
                {['pending', 'confirmed'].includes(b.status) && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id}
                    className="text-sm py-2 px-5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                  >
                    {cancellingId === b._id ? <Spinner size={14} /> : <FiX size={14} />} Cancel Booking
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
