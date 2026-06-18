import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiGrid, FiPackage, FiUsers, FiFileText, FiBarChart2, FiHome, FiSettings, FiMessageSquare } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: FiGrid, end: true },
  { label: 'Bookings', to: '/admin/bookings', icon: FiPackage },
  { label: 'Packages', to: '/admin/packages', icon: FiHome },
  { label: 'Visa Applications', to: '/admin/visas', icon: FiFileText },
  { label: 'Users', to: '/admin/users', icon: FiUsers },
  { label: 'Reports', to: '/admin/reports', icon: FiBarChart2 },
  { label: 'Enquiries', to: '/admin/enquiries', icon: FiMessageSquare },
];

export default function AdminLayout() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!['admin', 'super_admin'].includes(user?.role)) return <Navigate to="/" replace />;

  return (
    <div className="pt-20 min-h-screen bg-obsidian flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border p-6 fixed top-20 bottom-0 overflow-y-auto">
        <div className="mb-8">
          <div className="text-xs text-zaa-orange tracking-wider uppercase mb-1">Admin Panel</div>
          <div className="text-lg font-black">Zeno Africa</div>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-zaa-orange/10 text-zaa-orange border border-zaa-orange/20' : 'text-secondary hover:bg-zaa-orange/5 hover:text-zaa-orange'
                  }`
                }
              >
                <Icon size={16} /> {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-charcoal border-b border-border overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${isActive ? 'bg-zaa-orange/10 text-zaa-orange' : 'text-muted'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 lg:mt-0 mt-12">
        <Outlet />
      </main>
    </div>
  );
}
