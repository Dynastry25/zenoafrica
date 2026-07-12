import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { closeModal, openModal } from '../../redux/slices/uiSlice';
import { authAPI } from '../../api/axios';
import { Spinner } from '../common/Common';

export default function ForgotPasswordModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleClose = () => dispatch(closeModal());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content w-full max-w-sm relative">
        <div className="p-7">
          <button onClick={handleClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-secondary hover:text-zaa-orange">
            <FiX size={16} />
          </button>

          {sent ? (
            <div className="text-center py-5">
              <div className="text-5xl mb-4">✉</div>
              <h3 className="text-xl font-black mb-3">Check Your <span className="zaa-text">Email</span></h3>
              <p className="text-secondary text-sm mb-6">If an account exists with that email, we've sent a password reset link.</p>
              <button onClick={() => dispatch(openModal('login'))} className="btn-gold">Back to Sign In</button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black mb-1.5">Reset Password</h2>
              <p className="text-sm text-muted mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5">
                  {loading ? <><Spinner size={18} /> Sending...</> : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => dispatch(openModal('login'))} className="text-sm text-zaa-orange w-full text-center hover:underline">
                  ← Back to Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
