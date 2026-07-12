import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../api/axios';
import { formatPrice, Spinner } from '../components/common/Common';

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    adminAPI.getRevenueReport({ period: 'monthly', year })
      .then((res) => setReport(res.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData = report?.report?.map((r) => ({ month: months[r._id.month - 1], revenue: Math.round(r.revenue), bookings: r.bookings })) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-black">Revenue <span className="zaa-text">Reports</span></h1>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field !w-auto !bg-charcoal text-sm">
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="font-black text-lg mb-4">Monthly Revenue & Bookings</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,116,43,0.1)" />
            <XAxis dataKey="month" stroke="#7A6B52" fontSize={12} />
            <YAxis stroke="#7A6B52" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(244,116,43,0.2)', borderRadius: 8 }} />
            <Bar dataKey="revenue" fill="#F4742B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-black text-lg mb-4">Revenue by Category</h3>
        <div className="space-y-3">
          {report?.categoryBreakdown?.map((cat) => (
            <div key={cat._id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="capitalize">{cat._id}</span>
              <div className="flex gap-6 text-sm">
                <span className="text-muted">{cat.count} bookings</span>
                <span className="font-bold text-zaa-orange">{formatPrice(cat.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
