import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiCreditCard, FiGlobe, FiStar } from 'react-icons/fi';
import { fetchMyBookings } from '../../redux/slices/bookingSlice';
import { formatPrice, Spinner } from '../../components/common/Common';

const statusColors = { confirmed: '#27AE60', pending: '#E67E22', completed: '#8E44AD', cancelled: '#E74C3C', in_progress: '#2980B9', refunded: '#7A6B52' };

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { items: bookings, loading } = useSelector((s) => s.bookings);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchMyBookings({ limit: 5 }));
  }, [dispatch]);

  const totalSpent = bookings.reduce((sum, b) => sum + (b.payments?.reduce((s, p) => s + (p.status === 'completed' ? p.amount : 0), 0) || 0), 0);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: FiPackage, color: '#F4742B' },
    { label: 'Total Spent', value: formatPrice(totalSpent), icon: FiCreditCard, color: '#27AE60' },
    { label: 'Loyalty Points', value: user?.loyaltyPoints || 0, icon: FiStar, color: '#E67E22' },
    { label: 'Trips Completed', value: bookings.filter(b => b.status === 'completed').length, icon: FiGlobe, color: '#8E44AD' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-2xl p-6">
              <Icon size={28} style={{ color: stat.color }} className="mb-3" />
              <div className="text-2xl font-bold font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-black">Recent Bookings</h3>
        <Link to="/dashboard/bookings" className="text-sm text-zaa-orange hover:underline">View all →</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : bookings.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">🧳</div>
          <h4 className="text-lg font-black mb-2">No bookings yet</h4>
          <p className="text-muted text-sm mb-5">Start planning your African adventure today!</p>
          <Link to="/packages" className="btn-gold">Browse Packages</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
            >
              <img src={b.package?.coverImage?.url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-semibold">{b.package?.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={{ background: statusColors[b.status] + '20', color: statusColors[b.status] }}>
                    {b.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-muted">Ref: {b.bookingReference} · {new Date(b.travelDate).toLocaleDateString()} · {b.travelers?.adults + b.travelers?.children} guests</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-zaa-orange">{formatPrice(b.pricing?.total)}</div>
                <div className="text-xs text-muted">Deposit: {formatPrice(b.pricing?.depositAmount)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
