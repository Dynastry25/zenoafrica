import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCreditCard, FiBell, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { paymentAPI } from '../../api/axios';
import { fetchNotifications, markAllNotificationsRead } from '../../redux/slices/notificationSlice';
import { updateProfile, changePassword, logout } from '../../redux/slices/authSlice';
import { formatPrice, Spinner, EmptyState } from '../../components/common/Common';

// ═══════════════════════════════════════════════════════════
// PAYMENTS PAGE
// ═══════════════════════════════════════════════════════════
export function PaymentsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentAPI.getHistory()
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (bookings.length === 0) return <EmptyState icon="💳" title="No payment history" message="Your payment receipts will appear here once you book a journey." />;

  return (
    <div className="space-y-5">
      {bookings.map((b) => (
        <div key={b._id} className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-black text-lg">{b.package?.title}</h4>
              <div className="text-sm text-muted">Ref: {b.bookingReference}</div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: '#27AE6020', color: '#27AE60' }}>
              {b.paymentStatus?.replace('_', ' ')}
            </span>
          </div>
          <div className="space-y-2">
            {b.payments?.map((p, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-sm">
                <div className="flex items-center gap-2">
                  <FiCreditCard className="text-zaa-orange" />
                  <span className="capitalize">{p.method?.replace('_', ' ')}</span>
                  <span className="text-muted">· {new Date(p.paidAt).toLocaleDateString()}</span>
                </div>
                <span className="font-semibold text-zaa-orange">{formatPrice(p.amount, p.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS PAGE
// ═══════════════════════════════════════════════════════════
export function NotificationsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (items.length === 0) return <EmptyState icon="🔔" title="No notifications" message="We'll notify you about bookings, payments, and updates here." />;

  return (
    <div>
      <div className="flex justify-end mb-5">
        <button onClick={handleMarkAllRead} className="text-sm text-zaa-orange hover:underline flex items-center gap-1.5">
          <FiCheck /> Mark all as read
        </button>
      </div>
      <div className="space-y-3">
        {items.map((notif, i) => (
          <motion.div
            key={notif._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass rounded-2xl p-5"
            style={{ borderLeft: notif.isRead ? '1px solid var(--border)' : '3px solid #F4742B' }}
          >
            <div className="flex justify-between mb-1.5">
              <span className="font-semibold flex items-center gap-2">
                {notif.icon} {notif.title}
              </span>
              <span className="text-xs text-muted">{new Date(notif.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-secondary">{notif.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════
export function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', nationality: user?.nationality || '',
    dietaryRequirements: user?.dietaryRequirements || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await dispatch(updateProfile(form)).unwrap();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err || 'Password change failed');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Info */}
      <div className="glass rounded-2xl p-7">
        <h3 className="text-xl font-black mb-5">Profile Settings</h3>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Full Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="input-field opacity-60" value={user?.email} disabled />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="form-label">Nationality</label>
            <input className="input-field" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Dietary Requirements</label>
            <input className="input-field" value={form.dietaryRequirements} onChange={(e) => setForm({ ...form, dietaryRequirements: e.target.value })} placeholder="e.g. Vegetarian, Gluten-free" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={savingProfile} className="btn-gold w-full justify-center py-3">
              {savingProfile ? <><Spinner size={16} /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="glass rounded-2xl p-7">
        <h3 className="text-xl font-black mb-5">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input type="password" className="input-field" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">New Password</label>
              <input type="password" className="input-field" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} minLength={8} required />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="input-field" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
            </div>
          </div>
          <button type="submit" disabled={savingPassword} className="btn-gold w-full justify-center py-3">
            {savingPassword ? <><Spinner size={16} /> Updating...</> : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl p-7 border-red-500/20">
        <h3 className="text-xl font-black mb-3">Account</h3>
        <button onClick={() => dispatch(logout())} className="px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-sm font-medium hover:bg-red-500/20 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
