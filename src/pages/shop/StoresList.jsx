import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, Store, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'clothing', label: 'ملابس' },
  { id: 'electronics', label: 'إلكترونيات' },
  { id: 'home', label: 'منزل' },
  { id: 'sports', label: 'رياضة' },
  { id: 'beauty', label: 'جمال' },
  { id: 'books', label: 'كتب' },
  { id: 'toys', label: 'ألعاب' },
  { id: 'food', label: 'طعام' },
  { id: 'general', label: 'عام' },
];

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    base44.entities.Store.filter({ status: 'active' }, '-created_date', 100).then(data => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  const filtered = stores.filter(s => {
    const matchSearch = !search || s.store_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || s.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to="/shop" className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن متجر..."
            className="w-full h-9 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <Link to="/cart" className="p-2 rounded-full hover:bg-slate-100 transition">
          <Store className="w-5 h-5 text-slate-600" />
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <h1 className="text-xl font-extrabold">المتاجر ({filtered.length})</h1>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${category === cat.id ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا توجد متاجر</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((store, i) => (
              <motion.div key={store.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/shop/store/${store.id}`} className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition">
                  {store.store_banner && (
                    <img src={store.store_banner} alt="" className="w-full h-20 object-cover rounded-xl mb-3" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-lg shrink-0">
                      {store.store_logo ? <img src={store.store_logo} alt="" className="w-full h-full object-cover rounded-xl" /> : store.store_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{store.store_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{store.store_description || store.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {store.rating > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold">{store.rating}</span>
                          </div>
                        )}
                        {store.is_featured && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">مميز</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}