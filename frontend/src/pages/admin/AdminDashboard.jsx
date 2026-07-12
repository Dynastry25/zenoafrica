import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiPackage, FiDollarSign, FiClock, FiTrendingUp } from 'react-icons/fi';
import { adminAPI } from '../../api/axios';
import { formatPrice, Spinner } from '../../components/common/Common';

const COLORS = ['#F4742B', '#8E44AD', '#2980B9', '#27AE60', '#E67E22', '#C0392B'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setData(res.data.dashboard))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!data) return <p className="text-muted">Failed to load dashboard data.</p>;

  const { stats, recentBookings, topPackages, monthlyRevenue, bookingsByStatus } = data;

  const statCards = [
    { label: 'Total Users', value: stats.users.total, sub: `+${stats.users.new} this month`, icon: FiUsers, color: '#F4742B' },
    { label: 'Active Packages', value: stats.packages.active, sub: `${stats.packages.total} total`, icon: FiPackage, color: '#8E44AD' },
    { label: 'Total Revenue', value: formatPrice(stats.revenue.total), sub: `${formatPrice(stats.revenue.thisMonth)} this month`, icon: FiDollarSign, color: '#27AE60' },
    { label: 'Pending Bookings', value: stats.bookings.pending, sub: `${stats.bookings.confirmed} confirmed`, icon: FiClock, color: '#E67E22' },
  ];

  const pieData = Object.entries(bookingsByStatus || {}).map(([key, value]) => ({ name: key.replace('_', ' '), value }));

  return (
    <div>
      <h1 className="text-3xl font-black mb-1">Dashboard <span className="zaa-text">Overview</span></h1>
      <p className="text-muted text-sm mb-8">Welcome back! Here's what's happening with your business.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Icon size={24} style={{ color: stat.color }} />
                <FiTrendingUp className="text-green-400" size={14} />
              </div>
              <div className="text-2xl font-bold font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
              <div className="text-xs text-secondary mt-1">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-black text-lg mb-4">Revenue Trend (12 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,116,43,0.1)" />
              <XAxis dataKey="month" stroke="#7A6B52" fontSize={12} />
              <YAxis stroke="#7A6B52" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(244,116,43,0.2)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="#F4742B" strokeWidth={2} dot={{ fill: '#F4742B' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-black text-lg mb-4">Bookings by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(244,116,43,0.2)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Bookings */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-black text-lg mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings?.map((b) => (
              <div key={b._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm font-medium">{b.package?.title}</div>
                  <div className="text-xs text-muted">{b.user?.name} · {b.bookingReference}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-zaa-orange">{formatPrice(b.pricing?.total)}</div>
                  <div className="text-xs text-muted capitalize">{b.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Packages */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-black text-lg mb-4">Top Performing Packages</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topPackages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,116,43,0.1)" />
              <XAxis type="number" stroke="#7A6B52" fontSize={11} />
              <YAxis dataKey="title" type="category" stroke="#7A6B52" fontSize={11} width={120} />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(244,116,43,0.2)', borderRadius: 8 }} />
              <Bar dataKey="totalBookings" fill="#F4742B" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
