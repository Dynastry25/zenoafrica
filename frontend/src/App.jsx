import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ModalRouter from './components/layout/ModalRouter';
import ProtectedRoute from './components/common/ProtectedRoute';
import WhatsAppFloat from './components/common/WhatsAppFloat';
import InstagramFloat from './components/common/InstagramFloat';
import { TopBarLoader, PageLoader } from './components/common/RouteLoader';
import { fetchCurrentUser } from './redux/slices/authSlice';

// Lazy-loaded public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const PackageDetailPage = lazy(() => import('./pages/PackageDetailPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const PartnerDetailPage = lazy(() => import('./pages/PartnerDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy-loaded legal pages (default export is an object, not a component)
const PrivacyPolicyPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsPage })));
const RefundPolicyPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.RefundPolicyPage })));

// Lazy-loaded dashboard pages
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const MyBookingsPage = lazy(() => import('./pages/dashboard/MyBookingsPage'));
const VisaApplicationsPage = lazy(() => import('./pages/dashboard/VisaApplicationsPage'));
const PaymentsPage = lazy(() => import('./pages/dashboard/MiscPages').then(m => ({ default: m.PaymentsPage })));
const NotificationsPage = lazy(() => import('./pages/dashboard/MiscPages').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('./pages/dashboard/MiscPages').then(m => ({ default: m.ProfilePage })));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminBookingsPage = lazy(() => import('./admin/AdminBookingsPage'));
const AdminPackagesPage = lazy(() => import('./admin/AdminPackagesPage'));
const AdminVisasPage = lazy(() => import('./admin/AdminVisasPage'));
const AdminUsersPage = lazy(() => import('./admin/AdminUsersPage'));
const AdminReportsPage = lazy(() => import('./admin/AdminReportsPage'));
const AdminEnquiriesPage = lazy(() => import('./admin/AdminEnquiriesPage'));

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-obsidian">
      <TopBarLoader />
      {!isAdmin && <Navbar />}

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:slug" element={<PackageDetailPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/partners/:slug" element={<PartnerDetailPage />} />
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
        </Suspense>
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
      {!isAdmin && <WhatsAppFloat />}
      {!isAdmin && <InstagramFloat />}
    </div>
  );
}
