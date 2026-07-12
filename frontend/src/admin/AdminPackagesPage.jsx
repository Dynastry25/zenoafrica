import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { packageAPI } from '../api/axios';
import { formatPrice, Spinner, EmptyState } from '../components/common/Common';

const emptyForm = {
  title: '', subtitle: '', description: '', shortDescription: '', category: 'safari',
  location: { country: '', region: '' },
  duration: { days: 7, nights: 6 },
  price: { adult: 0, child: 0, currency: 'USD' },
  originalPrice: '',
  groupSize: { min: 2, max: 8 },
  coverImage: { url: '' },
  highlights: '', included: '', excluded: '',
  difficulty: 'easy', isFeatured: false, isActive: true,
  badge: '', badgeColor: '#F4742B',
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadPackages = () => {
    setLoading(true);
    packageAPI.getAll({ limit: 50 })
      .then((res) => setPackages(res.data.packages))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPackages(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setForm({
      ...emptyForm,
      ...pkg,
      highlights: pkg.highlights?.join(', ') || '',
      included: pkg.included?.join(', ') || '',
      excluded: pkg.excluded?.join(', ') || '',
      originalPrice: pkg.originalPrice || '',
    });
    setEditingId(pkg._id);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights.split(',').map((s) => s.trim()).filter(Boolean),
        included: form.included.split(',').map((s) => s.trim()).filter(Boolean),
        excluded: form.excluded.split(',').map((s) => s.trim()).filter(Boolean),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        price: { ...form.price, adult: Number(form.price.adult), child: Number(form.price.child) },
        duration: { days: Number(form.duration.days), nights: Number(form.duration.nights) },
        groupSize: { min: Number(form.groupSize.min), max: Number(form.groupSize.max) },
      };
      if (editingId) {
        await packageAPI.update(editingId, payload);
        toast.success('Package updated');
      } else {
        await packageAPI.create(payload);
        toast.success('Package created');
      }
      setShowModal(false);
      loadPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this package?')) return;
    try {
      await packageAPI.delete(id);
      toast.success('Package deactivated');
      loadPackages();
    } catch (err) {
      toast.error('Failed to deactivate');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black">Package <span className="zaa-text">Management</span></h1>
        <button onClick={openCreate} className="btn-gold"><FiPlus /> New Package</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : packages.length === 0 ? (
        <EmptyState icon="📦" title="No packages yet" message="Create your first travel package." action={<button onClick={openCreate} className="btn-gold">Create Package</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div key={pkg._id} className="card">
              <div className="relative h-36">
                <img src={pkg.coverImage?.url} alt="" className="w-full h-full object-cover" />
                {!pkg.isActive && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-sm font-semibold">Inactive</div>}
              </div>
              <div className="p-5">
                <h4 className="font-black text-base mb-1">{pkg.title}</h4>
                <div className="text-xs text-muted mb-2 capitalize">{pkg.category} · {pkg.location?.country}</div>
                <div className="text-lg font-bold text-zaa-orange mb-3">{formatPrice(pkg.price?.adult)}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(pkg)} className="btn-outline text-xs py-1.5 px-4 flex-1"><FiEdit2 size={12} /> Edit</button>
                  <button onClick={() => handleDelete(pkg._id)} className="text-xs py-1.5 px-4 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10"><FiTrash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content w-full max-w-2xl">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-black">{editingId ? 'Edit Package' : 'New Package'}</h2>
                <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center"><FiX /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Title *</label>
                    <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Subtitle</label>
                    <input className="input-field" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Cover Image URL *</label>
                    <input className="input-field" value={form.coverImage?.url} onChange={(e) => setForm({ ...form, coverImage: { url: e.target.value } })} placeholder="https://..." required />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Description *</label>
                    <textarea rows={3} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {['safari', 'adventure', 'luxury', 'cultural', 'wildlife', 'beach', 'mountain', 'city'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Difficulty</label>
                    <select className="input-field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                      {['easy', 'moderate', 'challenging', 'expert'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Country *</label>
                    <input className="input-field" value={form.location?.country} onChange={(e) => setForm({ ...form, location: { ...form.location, country: e.target.value } })} required />
                  </div>
                  <div>
                    <label className="form-label">Region</label>
                    <input className="input-field" value={form.location?.region} onChange={(e) => setForm({ ...form, location: { ...form.location, region: e.target.value } })} />
                  </div>
                  <div>
                    <label className="form-label">Days *</label>
                    <input type="number" className="input-field" value={form.duration?.days} onChange={(e) => setForm({ ...form, duration: { ...form.duration, days: e.target.value } })} required />
                  </div>
                  <div>
                    <label className="form-label">Nights *</label>
                    <input type="number" className="input-field" value={form.duration?.nights} onChange={(e) => setForm({ ...form, duration: { ...form.duration, nights: e.target.value } })} required />
                  </div>
                  <div>
                    <label className="form-label">Adult Price ($) *</label>
                    <input type="number" className="input-field" value={form.price?.adult} onChange={(e) => setForm({ ...form, price: { ...form.price, adult: e.target.value } })} required />
                  </div>
                  <div>
                    <label className="form-label">Original Price ($)</label>
                    <input type="number" className="input-field" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Min Group Size</label>
                    <input type="number" className="input-field" value={form.groupSize?.min} onChange={(e) => setForm({ ...form, groupSize: { ...form.groupSize, min: e.target.value } })} />
                  </div>
                  <div>
                    <label className="form-label">Max Group Size</label>
                    <input type="number" className="input-field" value={form.groupSize?.max} onChange={(e) => setForm({ ...form, groupSize: { ...form.groupSize, max: e.target.value } })} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Highlights (comma separated)</label>
                    <input className="input-field" value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Great Migration, Private Game Drives, ..." />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Included (comma separated)</label>
                    <input className="input-field" value={form.included} onChange={(e) => setForm({ ...form, included: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Excluded (comma separated)</label>
                    <input className="input-field" value={form.excluded} onChange={(e) => setForm({ ...form, excluded: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Badge Text</label>
                    <input className="input-field" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Best Seller" />
                  </div>
                  <div>
                    <label className="form-label">Badge Color</label>
                    <input type="color" className="input-field h-12" value={form.badgeColor} onChange={(e) => setForm({ ...form, badgeColor: e.target.value })} />
                  </div>
                  <div className="col-span-2 flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={saving} className="btn-gold w-full justify-center py-3">
                  {saving ? <><Spinner size={16} /> Saving...</> : editingId ? 'Update Package' : 'Create Package'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
