import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { contactAPI } from '../api/axios';
import { Spinner, EmptyState } from '../components/common/Common';

const enquiryStatusColors = { new: '#E67E22', read: '#2980B9', replied: '#27AE60', resolved: '#7A6B52', spam: '#E74C3C' };

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactAPI.getAll()
      .then((res) => setEnquiries(res.data.contacts))
      .catch(() => setEnquiries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
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
