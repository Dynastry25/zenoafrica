import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { fetchPackages, setFilters } from '../redux/slices/packageSlice';
import PackageCard from '../components/common/PackageCard';
import { Spinner, EmptyState } from '../components/common/Common';

const categories = ['all', 'safari', 'adventure', 'luxury', 'wildlife', 'cultural'];
const budgets = [
  { label: 'All Budgets', value: 'all' },
  { label: 'Under $3,000', value: 'under3k' },
  { label: '$3,000–$5,000', value: '3k-5k' },
  { label: 'Over $5,000', value: 'over5k' },
];
const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

export default function PackagesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, total, totalPages, currentPage } = useSelector((s) => s.packages);

  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [budget, setBudget] = useState('all');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 12, sort };
    if (category !== 'all') params.category = category;
    if (search) params.search = search;
    if (budget === 'under3k') params.maxPrice = 3000;
    if (budget === '3k-5k') { params.minPrice = 3000; params.maxPrice = 5000; }
    if (budget === 'over5k') params.minPrice = 5000;
    dispatch(fetchPackages(params));
  }, [category, search, budget, sort, page, dispatch]);

  return (
    <div className="pt-20"
          style={{
        background: ' #f1f1f1 100%',
      }}>
      {/* Header */}
      <div           style={{
        background: ' #f1f1f1',
      }}className="py-16 bg-white text-center border-b border-border">
        <div className="section-eyebrow justify-center">Our Portfolio</div>
        <h1           style={{
        color: ' #333232',
      }}className="text-4xl md:text-6xl font-bold mb-3">
          Explore <span className="zaa-text">All Packages</span>
        </h1>
        <p className="text-base text-secondary max-w-lg mx-auto px-6">
          Extraordinary journeys across Africa from budget-friendly escapes to ultra-luxury expeditions.
        </p>
      </div>

      {/* Filters */}
      <div className="py-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-full sm:w-60">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search destinations..."
                className="input-field pl-9"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className="px-[18px] py-2 rounded-full text-sm font-medium capitalize transition-all border-[1.5px]"
                  style={{
                    borderColor: category === cat ? '#F4742B' : 'rgba(244,116,43,0.2)',
                    background: category === cat ? 'rgba(244,116,43,0.12)' : 'transparent',
                    color: category === cat ? '#F4742B' : '#B8A98A',
                  }}
                >
                  {cat === 'all' ? 'All Types' : cat}
                </button>
              ))}
            </div>

            <div className="flex gap-3 ml-auto w-full sm:w-auto">
              <select value={budget} onChange={(e) => { setBudget(e.target.value); setPage(1); }} className="input-field !w-auto !bg-charcoal text-sm">
                {budgets.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !w-auto !bg-charcoal text-sm">
                {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted">
            {loading ? 'Loading...' : `Showing ${items.length} of ${total} packages`}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div 
            style={{
        background: 'linear-gradient(135deg, rgba(244,116,43,0.03) 0%, #f1f1f1 100%)',
      }}
       className="bg-white max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : items.length === 0 ? (
          <EmptyState icon="🔍" title="No packages found" message="Try adjusting your filters to see more results." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {items.map((pkg, i) => <PackageCard key={pkg._id} pkg={pkg} index={i % 6} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center flex-wrap gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-10 h-10 rounded-full text-sm font-medium transition-colors"
                    style={{
                      background: p === currentPage ? 'linear-gradient(135deg,#F4742B,#F5A94C)' : 'transparent',
                      color: p === currentPage ? '#0D0D0D' : '#B8A98A',
                      border: p === currentPage ? 'none' : '1px solid rgba(244,116,43,0.2)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
