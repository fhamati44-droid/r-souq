import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { SlidersHorizontal, LayoutGrid, List, Search, X, Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import CJProductCard from '@/components/shop/CJProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const categories = ['clothing', 'electronics', 'home', 'sports', 'beauty', 'books', 'toys', 'food'];

const categoryEmojis = { clothing: '👗', electronics: '📱', home: '🏠', sports: '⚽', beauty: '💄', books: '📚', toys: '🎮', food: '🍕' };

// Turns a cached CJ Dropshipping product into the same shape as a real Product,
// so it can be displayed alongside real sellers' listings (mirrors ShopHome.jsx).
function cacheToProduct(c) {
  return {
    id: `cj_${c.cj_product_id}`,
    name: c.name || c.name_en,
    description: c.description || '',
    price: c.price_sar,
    original_price: c.original_price_sar,
    cost_price: c.cost_sar,
    category: c.category,
    images: c.images?.length ? c.images : (c.image ? [c.image] : []),
    brand: c.brand || 'R souq',
    stock: c.stock || 100,
    rating: 0,
    reviews_count: 0,
    is_active: true,
    store_name: 'R souq Marketplace',
    warehouse_product_id: `cj_${c.cj_product_id}`,
    created_date: c.last_synced,
  };
}

/* ── Local product card (real sellers) ── mirrors ShopHome.jsx styling for visual consistency */
function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false);
  const { t } = useLang();
  const name = typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name || '';
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all group relative">
      {hasDiscount && (
        <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </span>
      )}
      <button onClick={() => setWished(w => !w)}
        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition">
        <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
      </button>
      <Link to={`/shop/product/${product.id}`} className="block overflow-hidden">
        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=220&fit=crop'}
          alt={name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <Link to={`/shop/product/${product.id}`}
        className="absolute inset-0 top-auto bottom-[88px] h-8 bg-black/60 text-white text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Eye className="w-3.5 h-3.5" /> {t.quick_view}
      </Link>
      <div className="p-3">
        {product.store_name && <p className="text-xs text-slate-400 mb-1 truncate">🏪 {product.store_name}</p>}
        <Link to={`/shop/product/${product.id}`}>
          <p className="font-semibold text-sm text-slate-800 line-clamp-2 mb-2 leading-snug min-h-[2.5rem]">{name}</p>
        </Link>
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
            ))}
            <span className="text-xs text-slate-400">({product.reviews_count || 0})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="font-extrabold text-base" style={{ color: '#7b2d8b' }}>{product.price} ر.س</span>
            {hasDiscount && <p className="text-xs text-slate-400 line-through">{product.original_price} ر.س</p>}
          </div>
          <button onClick={() => onAddToCart(product)}
            className="text-white text-xs px-3 py-1.5 rounded-xl font-bold hover:opacity-90 transition flex items-center gap-1 shadow"
            style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
            <ShoppingBag className="w-3 h-3" /> {t.add}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { t, dir } = useLang();
  const { addToCart } = useCart();
  const [realProducts, setRealProducts] = useState([]);
  const [cjProducts, setCjProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');

  // Read initial filters from the URL (?category=x&search=y) so links from
  // CategoryCard / search bars elsewhere in the site land on the right filter.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const q = params.get('search');
    if (cat) setSelectedCat(cat);
    if (q) setSearch(q);
  }, []);

  // Load BOTH real sellers' listings (Product) and the CJ Dropshipping cache
  // (CJProductCache) — same pattern ShopHome.jsx uses — so a category page
  // never looks empty just because no real seller has listed in it yet.
  useEffect(() => {
    setLoading(true);
    Promise.all([
      base44.entities.Product.filter({ is_active: true }, '-created_date', 200),
      base44.entities.CJProductCache.list('-last_synced', 300),
    ]).then(([prods, cache]) => {
      setRealProducts(prods);
      setCjProducts(cache.map(cacheToProduct));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...realProducts, ...cjProducts];
    if (selectedCat !== 'all') result = result.filter(p => p.category === selectedCat);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => {
        const name = typeof p.name === 'object' ? Object.values(p.name || {}).join(' ') : (p.name || '');
        return name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q);
      });
    }
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else result.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
    setFiltered(result);
  }, [realProducts, cjProducts, selectedCat, search, sortBy]);

  const handleAddToCart = (product) => { addToCart(product, 1); toast.success('✅ ' + t.added_to_cart); };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={t.search}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full h-9 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${dir === 'rtl' ? 'pr-9 pl-9' : 'pl-9 pr-9'}`}
              />
              {search && (
                <button onClick={() => setSearch('')} className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-9 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.sort_newest}</SelectItem>
                <SelectItem value="price_asc">{t.sort_price_asc}</SelectItem>
                <SelectItem value="price_desc">{t.sort_price_desc}</SelectItem>
                <SelectItem value="rating">{t.sort_rating}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center bg-muted rounded-full p-0.5">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded-full transition ${view === 'grid' ? 'bg-white shadow' : ''}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded-full transition ${view === 'list' ? 'bg-white shadow' : ''}`}>
                <List className="w-4 h-4" />
              </button>
            </div>

            <span className="text-sm text-muted-foreground ml-auto">
              {filtered.length} {t.items}
            </span>
          </div>

          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCat === 'all' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
            >
              {t.all}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${selectedCat === cat ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
              >
                <span>{categoryEmojis[cat]}</span> {t[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-lg font-bold">{t.no_results}</h3>
            <p className="text-muted-foreground mt-2">{t.no_results_sub}</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {filtered.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {p.warehouse_product_id?.startsWith('cj_')
                    ? <CJProductCard product={p} onAddToCart={handleAddToCart} />
                    : <ProductCard product={p} onAddToCart={handleAddToCart} />}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
