import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiBell, FiChevronDown,
  FiLogOut, FiGrid, FiPackage, FiSettings, FiUser,
} from 'react-icons/fi';
import { openModal, toggleMobileMenu, closeMobileMenu } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { fetchNotifications } from '../../redux/slices/notificationSlice';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Packages', to: '/packages' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { mobileMenuOpen }         = useSelector((s) => s.ui);
  const { unreadCount }            = useSelector((s) => s.notifications);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchNotifications());
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[900] transition-all duration-500"
        style={{
          padding: scrolled ? '10px 0' : '18px 0',
          background: '#fff',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(244,116,43,0.18)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => dispatch(closeMobileMenu())}
            className="flex items-center gap-3 flex-shrink-0 group"
          >
            <img
              src="/zaa-logo.png"
              alt="Zeno Africa Adventures"
              className="h-[42px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div
                className="font-black text-[15px] leading-none tracking-wide"
                style={{ fontFamily: 'Montserrat', color: '#F4742B' }}
              >
                ZENO AFRICA
              </div>
              <div
                className="text-[10px] font-semibold tracking-[3px] mt-0.5"
                style={{ color: 'black' }}
              >
                ADVENTURES
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `btn-ghost text-[13px] font-semibold tracking-wide transition-all ${
                    isActive ? '!text-zaa-orange' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* ── Right Side ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notification bell */}
                <Link
                  to="/dashboard/notifications"
                  className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ border: '1px solid rgba(244,116,43,0.2)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(244,116,43,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(244,116,43,0.2)')}
                >
                  <FiBell style={{ color: '#C4A882' }} size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-zaa-gradient rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-full transition-colors"
                    style={{
                      background: 'rgba(244,116,43,0.1)',
                      border: '1px solid rgba(244,116,43,0.25)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#F4742B,#D3763D)' }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#F5EDE0' }}>
                      {user?.name?.split(' ')[0]}
                    </span>
                    <FiChevronDown size={13} style={{ color: '#7A6148' }} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 mt-2 w-56 glass rounded-2xl p-2 shadow-deep z-50"
                      >
                        {[
                          { label: 'Dashboard',      to: '/dashboard',              icon: <FiGrid size={15} /> },
                          { label: 'My Bookings',    to: '/dashboard/bookings',     icon: <FiPackage size={15} /> },
                          { label: 'Profile',        to: '/dashboard/profile',      icon: <FiSettings size={15} /> },
                          ...(user?.role !== 'user'
                            ? [{ label: 'Admin Panel', to: '/admin', icon: <FiUser size={15} /> }]
                            : []),
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                            style={{ color: '#C4A882' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#F4742B';
                              e.currentTarget.style.background = 'rgba(244,116,43,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#C4A882';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        <div className="h-px my-1" style={{ background: 'rgba(244,116,43,0.15)' }} />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-red-400"
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(231,76,60,0.08)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <FiLogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button className="btn-ghost font-semibold" onClick={() => dispatch(openModal('login'))}>
                  Sign In
                </button>
                <button className="btn-gold" onClick={() => dispatch(openModal('register'))}>
                  Get Started ✦
                </button>
              </>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden ml-auto text-2xl transition-colors"
            style={{ color: '#F4742B' }}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[850] flex flex-col px-6 pt-24 sm:pt-28 pb-10 overflow-y-auto"
            style={{ background: 'rgba(13,11,9,0.98)', backdropFilter: 'blur(24px)' }}
          >
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8">
              <img src="/zaa-logo.png" alt="ZAA" className="h-10 w-auto" />
              <div>
                <div className="font-black text-base tracking-wide" style={{ color: '#F4742B' }}>ZENO AFRICA</div>
                <div className="text-[10px] tracking-[3px]" style={{ color: '#F5A94C' }}>ADVENTURES</div>
              </div>
            </div>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <NavLink
                  to={link.to}
                  onClick={() => dispatch(closeMobileMenu())}
                  className={({ isActive }) =>
                    `block py-4 border-b text-xl font-bold tracking-wide transition-colors ${
                      isActive ? 'text-zaa-orange' : 'text-cream'
                    }`
                  }
                  style={{ borderColor: 'rgba(244,116,43,0.15)', fontFamily: 'Montserrat' }}
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}

            <div className="mt-10 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => dispatch(closeMobileMenu())}
                  className="btn-outline justify-center"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <button
                    className="btn-outline justify-center"
                    onClick={() => { dispatch(openModal('login')); dispatch(closeMobileMenu()); }}
                  >
                    Sign In
                  </button>
                  <button
                    className="btn-gold justify-center"
                    onClick={() => { dispatch(openModal('register')); dispatch(closeMobileMenu()); }}
                  >
                    Get Started ✦
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
