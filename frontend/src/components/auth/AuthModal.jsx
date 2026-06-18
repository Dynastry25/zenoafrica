import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { closeModal, openModal } from '../../redux/slices/uiSlice';
import { login, register, clearError } from '../../redux/slices/authSlice';
import { Spinner } from '../common/Common';

export default function AuthModal() {
  const dispatch = useDispatch();
  const { activeModal } = useSelector((s) => s.ui);
  const { loading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', nationality: '' });
  const [localError, setLocalError] = useState('');

  const isLogin = activeModal === 'login';

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(clearError());
    setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '', nationality: '' });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!isLogin && form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (!isLogin && form.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    try {
      if (isLogin) {
        await dispatch(login({ email: form.email, password: form.password })).unwrap();
        toast.success('Welcome back!');
      } else {
        await dispatch(register({
          name: form.name, email: form.email, password: form.password,
          phone: form.phone, nationality: form.nationality,
        })).unwrap();
        toast.success('Account created! Welcome to Zeno Africa Adventures.');
      }
      handleClose();
    } catch (err) {
      setLocalError(err || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-content w-full max-w-md relative"
      >
        <div className="p-8">
          <button onClick={handleClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-secondary hover:text-zaa-orange transition-colors">
            <FiX size={16} />
          </button>

          <div className="text-center mb-8">
            <div className="w-[52px] h-[52px] rounded-full bg-zaa-gradient flex items-center justify-center mx-auto mb-4 font-black font-extrabold text-xl text-obsidian">
              ZAA
            </div>
            <h2 className="text-2xl font-black">{isLogin ? 'Welcome Back' : 'Join the Adventure'}</h2>
            <p className="text-sm text-muted mt-1.5">{isLogin ? 'Sign in to manage your bookings' : 'Create your free account today'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="form-label">Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" className="input-field" />
                  </div>
                  <div>
                    <label className="form-label">Nationality</label>
                    <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} placeholder="American" className="input-field" />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field" required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                  minLength={isLogin ? undefined : 8}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="form-label">Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" className="input-field" required />
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" onClick={() => dispatch(openModal('forgot-password'))} className="text-xs text-zaa-orange hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {localError && (
              <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {localError}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 text-base">
              {loading ? <><Spinner size={18} /> {isLogin ? 'Signing in...' : 'Creating account...'}</> : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-5 text-sm text-muted">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => dispatch(openModal(isLogin ? 'register' : 'login'))} className="text-zaa-orange font-bold hover:underline">
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
