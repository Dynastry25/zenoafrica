import { useSelector } from 'react-redux';
import AuthModal from '../auth/AuthModal';
import BookingModal from '../booking/BookingModal';
import { VisaModal, ContactQuickModal } from '../visa/VisaAndContactModals';
import ForgotPasswordModal from '../auth/ForgotPasswordModal';

export default function ModalRouter() {
  const { activeModal } = useSelector((s) => s.ui);

  switch (activeModal) {
    case 'login':
    case 'register':
      return <AuthModal />;
    case 'forgot-password':
      return <ForgotPasswordModal />;
    case 'booking':
      return <BookingModal />;
    case 'visa':
      return <VisaModal />;
    case 'contact-quick':
      return <ContactQuickModal />;
    default:
      return null;
  }
}
