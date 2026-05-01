import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, Zap, Star, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'الكل', emoji: '🛍️' },
  { id: 'clothing', label: 'ملابس', emoji: '👗' },
  { id: 'electronics', label: 'إلكترونيات', emoji: '📱' },
  { id: 'home', label: 'منزل', emoji: '🏠' },
  { id: 'sports', label: 'رياضة', emoji: '⚽' },
  { id: 'beauty', label: 'جمال', emoji: '💄' },
  { id: 'books', label: 'كتب', emoji: '📚' },
  { id: 'toys', label: 'ألعاب', emoji: '🎮' },
  { id: 'food', label: 'طعام', emoji: '🍕' },
  { id: 'general', label: 'عام', emoji: '🏪' },
];

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');

  useEffect(() => {
    if (urlCategory) setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    base44.entities.Store.filter({ status: 'active' }, '-is_featured', 100).then(data => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  const filtered = stores.filter(s => {
    const matchCat = category === 'all' || s.category === category;
    const matchSearch = !search || s.store_name?.toLowerCase().includes(search.toLowerCase()) || s.store_description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(s => s.is_featured);
  const regular = filtered.filter(s => !s.is_featured);

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-extrabold mb-4">جميع المتاجر</h1>
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن متجر..." className="w-full h-10 pr-10 pl-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${category === cat.id ? 'bg-violet-600 text-white' : 'bg-slate-100 text-muted-foreground hover:bg-slate-200'}`}>
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => <div key={i} className="h-44 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="font-bold text-lg">متاجر مميزة</h2>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">إعلان مدفوع</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featured.map((store, i) => <StoreCard key={store.id} store={store} i={i} featured />)}
                </div>
              </div>
            )}

            {/* Regular */}
            <div>
              <h2 className="font-bold text-lg mb-4">جميع المتاجر ({regular.length})</h2>
              {regular.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">لا توجد متاجر مطابقة</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regular.map((store, i) => <StoreCard key={store.id} store={store} i={i} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StoreCard({ store, i, featured }) {
  const categoryEmojis = { clothing: '👗', electronics: '📱', home: '🏠', sports: '⚽', beauty: '💄', books: '📚', toys: '🎮', food: '🍕', general: '🛍️' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <Link to={`/shop/store/${store.id}`}>
        <div className={`bg-white rounded-2xl p-5 border-2 hover:shadow-md transition cursor-pointer h-full ${featured ? 'border-amber-300' : 'border-slate-100 hover:border-violet-200'}`}>
          {featured && <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mb-2"><Zap className="w-3 h-3" /> إعلان مميز</div>}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl shrink-0">
              {categoryEmojis[store.category] || '🛍️'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{store.store_name}</h3>
              <p className="text-xs text-muted-foreground">{store.location || 'غير محدد'}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{store.store_description || 'متجر متنوع'}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold">{store.rating || '4.5'}</span>
            </div>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">تصفح المتجر ←</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}