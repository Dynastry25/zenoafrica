import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { visaAPI } from '../../api/axios';
import { Spinner, EmptyState } from '../../components/common/Common';
import { openModal } from '../../redux/slices/uiSlice';

const statusConfig = {
  submitted: { color: '#E67E22', icon: FiClock, label: 'Submitted' },
  under_review: { color: '#2980B9', icon: FiClock, label: 'Under Review' },
  additional_docs_required: { color: '#E67E22', icon: FiFileText, label: 'Documents Required' },
  approved: { color: '#27AE60', icon: FiCheckCircle, label: 'Approved' },
  rejected: { color: '#E74C3C', icon: FiXCircle, label: 'Rejected' },
  cancelled: { color: '#7A6B52', icon: FiXCircle, label: 'Cancelled' },
};

export default function VisaApplicationsPage() {
  const dispatch = useDispatch();
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visaAPI.getMy()
      .then((res) => setVisas(res.data.visas))
      .catch(() => setVisas([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  if (visas.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No visa applications"
        message="Apply for visa assistance for your next African adventure."
        action={<button onClick={() => dispatch(openModal('visa'))} className="btn-gold">Apply for Visa Assistance</button>}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => dispatch(openModal('visa'))} className="btn-gold">+ New Application</button>
      </div>
      {visas.map((visa, i) => {
        const config = statusConfig[visa.status] || statusConfig.submitted;
        const Icon = config.icon;
        return (
          <motion.div key={visa._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-black">{visa.destinationCountry} Visa — {visa.visaType}</h4>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5" style={{ background: config.color + '20', color: config.color }}>
                    <Icon size={12} /> {config.label}
                  </span>
                </div>
                <div className="text-sm text-muted">Reference: {visa.reference}</div>
                <div className="text-sm text-muted">Applicant: {visa.applicant?.firstName} {visa.applicant?.lastName} ({visa.applicant?.nationality})</div>
                <div className="text-sm text-muted">Travel Date: {new Date(visa.travelDate).toLocaleDateString()}</div>
              </div>
              <div className="text-right text-sm text-muted">
                Submitted: {new Date(visa.createdAt).toLocaleDateString()}
              </div>
            </div>
            {visa.consultantNotes && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-zaa-orange uppercase tracking-wide mb-1">Consultant Notes</div>
                <p className="text-sm text-secondary">{visa.consultantNotes}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
