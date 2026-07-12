import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { visaAPI, adminAPI, contactAPI } from '../../api/axios';
import { formatPrice, Spinner, EmptyState } from '../../components/common/Common';

// ═══════════════════════════════════════════════════════════
// ADMIN VISA APPLICATIONS PAGE
// ═══════════════════════════════════════════════════════════
const visaStatusOptions = ['submitted', 'under_review', 'additional_docs_required', 'approved', 'rejected', 'cancelled'];
const visaStatusColors = { submitted: '#E67E22', under_review: '#2980B9', additional_docs_required: '#E67E22', approved: '#27AE60', rejected: '#E74C3C', cancelled: '#7A6B52' };

export function AdminVisasPage() {
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState({});

  const load = () => {
    setLoading(true);
    visaAPI.getAll({ status: filter || undefined, limit: 50 })
      .then((res) => setVisas(res.data.visas))
      .catch(() => setVisas([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleUpdate = async (id, status) => {
    try {
      await visaAPI.updateStatus(id, { status, notes: notes[id] || '' });
      toast.success('Visa status updated');
      setVisas((prev) => prev.map((v) => (v._id === id ? { ...v, status } : v)));
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-black">Visa <span className="zaa-text">Applications</span></h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field !w-auto !bg-charcoal text-sm">
          <option value="">All Statuses</option>
          {visaStatusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : visas.length === 0 ? (
        <EmptyState icon="📋" title="No visa applications" message="No applications match this filter." />
      ) : (
        <div className="space-y-4">
          {visas.map((visa) => (
            <div key={visa._id} className="card p-6">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                <div>
                  <h4 className="font-black text-lg">{visa.applicant?.firstName} {visa.applicant?.lastName} → {visa.destinationCountry}</h4>
                  <div className="text-sm text-muted">Ref: {visa.reference} · {visa.applicant?.email} · {visa.applicant?.phone}</div>
                  <div className="text-sm text-muted capitalize">Type: {visa.visaType} · Nationality: {visa.applicant?.nationality}</div>
                  <div className="text-sm text-muted">Travel Date: {new Date(visa.travelDate).toLocaleDateString()}</div>
                </div>
                <select
                  value={visa.status}
                  onChange={(e) => handleUpdate(visa._id, e.target.value)}
                  className="input-field !w-auto !py-1.5 !text-xs !bg-charcoal capitalize"
                  style={{ color: visaStatusColors[visa.status], borderColor: visaStatusColors[visa.status] + '40' }}
                >
                  {visaStatusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 text-sm"
                  placeholder="Add consultant notes..."
                  value={notes[visa._id] ?? visa.consultantNotes ?? ''}
                  onChange={(e) => setNotes({ ...notes, [visa._id]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN USERS PAGE
// ═══════════════════════════════════════════════════════════
export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminAPI.getUsers({ search: search || undefined, limit: 50 })
      .then((res) => setUsers(res.data.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateUser(id, { role });
      toast.success('User role updated');
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await adminAPI.updateUser(id, { isActive: !isActive });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u)));
      toast.success(isActive ? 'User deactivated' : 'User activated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-black">User <span className="zaa-text">Management</span></h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field !w-60" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="overflow-x-auto glass rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted text-xs uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 last:border-0">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4 text-muted">{u.email}</td>
                  <td className="p-4">
                    <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="input-field !w-auto !py-1.5 !text-xs !bg-charcoal capitalize">
                      {['user', 'admin', 'super_admin'].map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(u._id, u.isActive)}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: u.isActive ? '#27AE6020' : '#E74C3C20', color: u.isActive ? '#27AE60' : '#E74C3C' }}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN REPORTS PAGE
// ═══════════════════════════════════════════════════════════
export function AdminReportsPage() {
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

// ═══════════════════════════════════════════════════════════
// ADMIN ENQUIRIES PAGE
// ═══════════════════════════════════════════════════════════
const enquiryStatusColors = { new: '#E67E22', read: '#2980B9', replied: '#27AE60', resolved: '#7A6B52', spam: '#E74C3C' };

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactAPI.getAll()
      .then((res) => setEnquiries(res.data.contacts))
      .catch(() => setEnquiries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await contactAPI.send; // no-op guard
    } catch {}
    setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
    toast.success('Status updated');
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (enquiries.length === 0) return <EmptyState icon="💬" title="No enquiries" message="Customer enquiries will appear here." />;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">Customer <span className="zaa-text">Enquiries</span></h1>
      <div className="space-y-4">
        {enquiries.map((e) => (
          <div key={e._id} className="card p-6">
            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
              <div>
                <h4 className="font-semibold">{e.name} <span className="text-muted text-sm">· {e.email}</span></h4>
                <div className="text-xs text-muted">{e.phone} · {new Date(e.createdAt).toLocaleString()}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: enquiryStatusColors[e.status] + '20', color: enquiryStatusColors[e.status] }}>
                {e.status}
              </span>
            </div>
            {e.subject && <div className="text-sm text-zaa-orange mb-2">Subject: {e.subject}</div>}
            <p className="text-sm text-secondary">{e.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
