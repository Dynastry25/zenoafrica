import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { bookingAPI } from '../api/axios';
import { formatPrice, Spinner, EmptyState } from '../components/common/Common';

const statusColors = { confirmed: '#27AE60', pending: '#E67E22', completed: '#8E44AD', cancelled: '#E74C3C', in_progress: '#2980B9', refunded: '#7A6B52' };
const statusOptions = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const loadBookings = () => {
    setLoading(true);
    bookingAPI.getAll({ status: filter || undefined, limit: 50 })
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, [filter]);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await bookingAPI.updateStatus(id, { status });
      toast.success('Booking status updated');
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-black">Booking <span className="zaa-text">Management</span></h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field !w-auto !bg-charcoal text-sm">
          <option value="">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : bookings.length === 0 ? (
        <EmptyState icon="📦" title="No bookings found" message="No bookings match this filter." />
      ) : (
        <div className="overflow-x-auto glass rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted text-xs uppercase">
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Package</th>
                <th className="p-4">Travel Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-white/5 last:border-0">
                  <td className="p-4 font-medium text-zaa-orange">{b.bookingReference}</td>
                  <td className="p-4">
                    <div>{b.user?.name}</div>
                    <div className="text-xs text-muted">{b.user?.email}</div>
                  </td>
                  <td className="p-4">{b.package?.title}</td>
                  <td className="p-4">{new Date(b.travelDate).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">{formatPrice(b.pricing?.total)}</td>
                  <td className="p-4 capitalize text-xs">{b.paymentStatus?.replace('_', ' ')}</td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      disabled={updating === b._id}
                      className="input-field !w-auto !py-1.5 !text-xs !bg-charcoal capitalize"
                      style={{ color: statusColors[b.status], borderColor: statusColors[b.status] + '40' }}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
