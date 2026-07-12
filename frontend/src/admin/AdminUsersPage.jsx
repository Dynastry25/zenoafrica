import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../api/axios';
import { Spinner } from '../components/common/Common';

export default function AdminUsersPage() {
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
