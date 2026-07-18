import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiGrid, FiPackage, FiUser, FiBell, FiFileText, FiCreditCard } from 'react-icons/fi';
import SEO from '../../components/common/SEO';

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: FiGrid, end: true },
  { label: 'My Bookings', to: '/dashboard/bookings', icon: FiPackage },
  { label: 'Visa Applications', to: '/dashboard/visa', icon: FiFileText },
  { label: 'Payments', to: '/dashboard/payments', icon: FiCreditCard },
  { label: 'Notifications', to: '/dashboard/notifications', icon: FiBell },
  { label: 'Profile', to: '/dashboard/profile', icon: FiUser },
];

export default function DashboardLayout() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="pt-20 min-h-screen bg-obsidian">
      <SEO noindex />
      <div className="bg-charcoal border-b border-border pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-5 mb-8">
  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white flex-shrink-0"
               style={{ background: "linear-gradient(135deg,#F4742B,#D3763D)", fontFamily:"Montserrat", boxShadow:"0 4px 16px rgba(244,116,43,0.35)" }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                Welcome back, <span className="zaa-text">{user?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isActive ? 'text-zaa-orange border-zaa-orange' : 'text-muted border-transparent hover:text-secondary'
                    }`
                  }
                >
                  <Icon size={15} /> {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </div>
    </div>
  );
}
