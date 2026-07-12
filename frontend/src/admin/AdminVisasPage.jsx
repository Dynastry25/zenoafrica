import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { visaAPI } from '../api/axios';
import { Spinner, EmptyState } from '../components/common/Common';

const visaStatusOptions = ['submitted', 'under_review', 'additional_docs_required', 'approved', 'rejected', 'cancelled'];
const visaStatusColors = { submitted: '#E67E22', under_review: '#2980B9', additional_docs_required: '#E67E22', approved: '#27AE60', rejected: '#E74C3C', cancelled: '#7A6B52' };

export default function AdminVisasPage() {
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
