import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, Star, Zap, ChevronLeft, Store, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { id: 'clothing', label: 'ملابس', emoji: '👗' },
  { id: 'electronics', label: 'إلكترونيات', emoji: '📱' },
  { id: 'home', label: 'منزل', emoji: '🏠' },
  { id: 'sports', label: 'رياضة', emoji: '⚽' },
  { id: 'beauty', label: 'جمال', emoji: '💄' },
  { id: 'books', label: 'كتب', emoji: '📚' },
  { id: 'toys', label: 'ألعاب', emoji: '🎮' },
  { id: 'food', label: 'طعام', emoji: '🍕' },
  { id: 'general', label: 'عام', emoji: '🛍️' },
];

export default function ShopHome() {
  const [featuredStores, setFeaturedStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [allStores, allProducts] = await Promise.all([
        base44.entities.Store.filter({ status: 'active' }, '-is_featured', 50),
        base44.entities.Product.filter({ is_active: true }, '-created_date', 20),
      ]);
      setFeaturedStores(allStores.filter(s => s.is_featured));
      setStores(allStores.filter(s => !s.is_featured));
      setProducts(allProducts);
      setLoading(false);
    };
    load();
  }, []);

  const filteredProducts = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Hero Search */}
      <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl font-extrabold mb-3">تسوق من أفضل المتاجر</h1>
          <p className="text-white/80 mb-8">آلاف المنتجات من مئات البائعين</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full h-14 rounded-2xl pr-12 pl-5 text-slate-900 text-base shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/shop/stores?category=${cat.id}`} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-slate-200 hover:border-violet-400 hover:shadow-sm transition shrink-0 min-w-16">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-slate-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Stores (Campaigns) */}
      {featuredStores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-extrabold">متاجر مميزة</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">مُبرز</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredStores.map(store => (
              <StoreCard key={store.id} store={store} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Stores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold">جميع المتاجر</h2>
          <Link to="/shop/stores" className="text-violet-600 text-sm font-medium flex items-center gap-1 hover:underline">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">لا توجد متاجر بعد</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.slice(0, 6).map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Products */}
      {filteredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-xl font-extrabold mb-4">{search ? `نتائج: ${search}` : 'أحدث المنتجات'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StoreCard({ store, featured }) {
  const categoryEmojis = { clothing: '👗', electronics: '📱', home: '🏠', sports: '⚽', beauty: '💄', books: '📚', toys: '🎮', food: '🍕', general: '🛍️' };

  return (
    <Link to={`/shop/store/${store.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className={`bg-white rounded-2xl p-5 border-2 transition-all hover:shadow-md cursor-pointer ${featured ? 'border-amber-300 shadow-amber-50 shadow-md' : 'border-slate-100 hover:border-violet-200'}`}
      >
        {featured && (
          <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mb-2">
            <Zap className="w-3 h-3" /> إعلان مميز
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl">
            {store.store_logo ? <img src={store.store_logo} className="w-full h-full object-cover rounded-xl" alt="" /> : categoryEmojis[store.category] || '🛍️'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{store.store_name}</h3>
            <p className="text-xs text-muted-foreground">{store.location || 'غير محدد'}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{store.store_description || 'متجر متنوع'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold">{store.rating || '4.5'}</span>
          </div>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">تسوق الآن</span>
        </div>
      </motion.div>
    </Link>
  );
}

function ProductCard({ product }) {
  return (
    <Link to={`/shop/product/${product.id}`}>
      <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition">
        <div className="aspect-square bg-slate-100 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=300&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground truncate">{product.store_name}</p>
          <h3 className="font-semibold text-sm line-clamp-2 mt-0.5">{product.name}</h3>
          <p className="text-violet-600 font-extrabold mt-1">{product.price} ر.س</p>
        </div>
      </motion.div>
    </Link>
  );
}