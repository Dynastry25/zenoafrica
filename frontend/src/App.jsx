import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ModalRouter from './components/layout/ModalRouter';
import ProtectedRoute from './components/common/ProtectedRoute';
import { fetchCurrentUser } from './redux/slices/authSlice';

// Public pages
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HotelsPage from './pages/HotelsPage';
import NotFoundPage from './pages/NotFoundPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from './pages/LegalPages';

// Dashboard (User)
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBookingsPage from './pages/dashboard/MyBookingsPage';
import VisaApplicationsPage from './pages/dashboard/VisaApplicationsPage';
import { PaymentsPage, NotificationsPage, ProfilePage } from './pages/dashboard/MiscPages';

// Admin
import { AdminLayout, AdminDashboard, AdminBookingsPage, AdminPackagesPage, AdminVisasPage, AdminUsersPage, AdminReportsPage, AdminEnquiriesPage } from './admin';

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-obsidian">
      {!isAdmin && <Navbar />}

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:slug" element={<PackageDetailPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* User Dashboard (Protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="visa" element={<VisaApplicationsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Panel (Protected + Role-based) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="visas" element={<AdminVisasPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <ModalRouter />}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E1E',
            color: '#F5F0E8',
            border: '1px solid rgba(244,116,43,0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#27AE60', secondary: '#0D0D0D' } },
          error: { iconTheme: { primary: '#E74C3C', secondary: '#0D0D0D' } },
        }}
      />
    </div>
  );
}
