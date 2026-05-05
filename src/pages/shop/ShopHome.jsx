import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Store, Star, TrendingUp, CheckCircle, ChevronLeft, ChevronRight, Search, Shield, Truck, RotateCcw, Headphones, Tag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ── Hero Slider ─────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/03d4baf5d_fPFsET2AgQI7TVZIlgRlv5MizZyNlsn2PkNVK2WB.png',
  'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/c5dcda3f2_exJIj1WB1xXKzBHfeLblKpBDpOJccRStFXLEi0d3.png',
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full overflow-hidden" style={{ background: '#7b1fa2' }}>
      <AnimatePresence mode="wait">
        <motion.img key={current} src={HERO_SLIDES[current]} alt="hero"
          initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }} className="w-full object-cover" style={{ maxHeight: '320px', objectPosition: 'center' }} />
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50'}`} />
        ))}
      </div>
      <button onClick={() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % HERO_SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ── Purchase Notification ───────────────────────────────────────────────── */
const PURCHASE_NOTIFICATIONS = [
  { name: 'أحمد من الرياض', product: 'سماعات لاسلكية', time: 'منذ دقيقتين' },
  { name: 'سارة من جدة', product: 'عطر روز', time: 'منذ 3 دقائق' },
  { name: 'محمد من الدمام', product: 'ساعة ذكية', time: 'منذ 5 دقائق' },
  { name: 'فاطمة من مكة', product: 'حقيبة يد', time: 'منذ دقيقة' },
  { name: 'خالد من المدينة', product: 'جهاز لابتوب', time: 'للتو' },
];

function PurchaseNotification() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const show = () => {
      setIndex(i => (i + 1) % PURCHASE_NOTIFICATIONS.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    const timer = setInterval(show, 7000);
    const initial = setTimeout(show, 2000);
    return () => { clearInterval(timer); clearTimeout(initial); };
  }, []);
  const notif = PURCHASE_NOTIFICATIONS[index];
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-3 max-w-xs">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{notif.name} اشترى للتو</p>
              <p className="text-xs text-violet-600 font-semibold">{notif.product}</p>
              <p className="text-xs text-slate-400">{notif.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Categories ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'clothing', label: 'ملابس', emoji: '👕', bg: 'from-pink-100 to-rose-100', border: 'border-pink-200' },
  { id: 'electronics', label: 'إلكترونيات', emoji: '📱', bg: 'from-blue-100 to-cyan-100', border: 'border-blue-200' },
  { id: 'home', label: 'منزل', emoji: '🏠', bg: 'from-amber-100 to-yellow-100', border: 'border-amber-200' },
  { id: 'sports', label: 'رياضة', emoji: '⚽', bg: 'from-green-100 to-emerald-100', border: 'border-green-200' },
  { id: 'beauty', label: 'جمال', emoji: '💄', bg: 'from-purple-100 to-violet-100', border: 'border-purple-200' },
  { id: 'books', label: 'كتب', emoji: '📚', bg: 'from-orange-100 to-amber-100', border: 'border-orange-200' },
  { id: 'toys', label: 'ألعاب', emoji: '🎮', bg: 'from-indigo-100 to-blue-100', border: 'border-indigo-200' },
  { id: 'food', label: 'طعام', emoji: '🍕', bg: 'from-red-100 to-orange-100', border: 'border-red-200' },
  { id: 'general', label: 'عام', emoji: '🛍️', bg: 'from-slate-100 to-gray-100', border: 'border-slate-200' },
];

/* ── Trust Badges ────────────────────────────────────────────────────────── */
const TRUST = [
  { icon: Truck, label: 'شحن سريع', sub: 'لجميع المناطق' },
  { icon: Shield, label: 'دفع آمن 100%', sub: 'بيانات محمية' },
  { icon: RotateCcw, label: 'إرجاع مجاني', sub: 'خلال 7 أيام' },
  { icon: Headphones, label: 'دعم 24/7', sub: 'نحن هنا دائماً' },
];

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function ShopHome() {
  const [featuredStores, setFeaturedStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    Promise.all([
      base44.entities.Store.filter({ status: 'active' }, '-created_date', 6),
      base44.entities.Product.filter({ is_active: true }, '-created_date', 12),
    ]).then(([stores, prods]) => {
      setFeaturedStores(stores);
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const filteredProducts = search
    ? products.filter(p => {
        const name = typeof p.name === 'object' ? (p.name?.ar || p.name?.en || '') : p.name || '';
        return name.toLowerCase().includes(search.toLowerCase());
      })
    : products;

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success('✅ تمت الإضافة للسلة');
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50" dir="rtl">

        {/* ── Navbar ── */}
        <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7b2d8b, #6a1b9a)' }}>
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg" style={{ color: '#6a1b9a' }}>R souq</span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full h-10 pr-10 pl-4 rounded-full border-2 border-slate-200 focus:border-violet-400 text-sm focus:outline-none transition"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <Link to="/shop/stores" className="hidden sm:block text-sm text-slate-600 hover:text-violet-600 font-medium transition">المتاجر</Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold" style={{ background: '#7b2d8b' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <Link to="/" className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition">الرئيسية</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <HeroBanner />

        {/* ── Mobile Search ── */}
        <div className="md:hidden px-4 py-3 bg-white border-b border-slate-100">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full h-10 pr-10 pl-4 rounded-full border-2 border-slate-200 focus:border-violet-400 text-sm focus:outline-none"
            />
          </form>
        </div>

        {/* ── Trust Badges ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {TRUST.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-violet-50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#ede7f6' }}>
                  <t.icon className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">

          {/* ── Categories ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-xl text-slate-800">تصفح حسب الفئة</h2>
              <Link to="/shop/stores" className="text-sm font-semibold hover:underline" style={{ color: '#7b2d8b' }}>عرض الكل</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to={`/shop/stores?category=${cat.id}`}
                    className={`flex flex-col items-center gap-2 bg-gradient-to-br ${cat.bg} rounded-2xl p-3 border ${cat.border} hover:shadow-md hover:scale-105 transition-all text-center`}>
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Featured Stores ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#ede7f6' }}>
                  <Store className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                </span>
                أبرز المتاجر
              </h2>
              <Link to="/shop/stores" className="text-sm font-semibold hover:underline" style={{ color: '#7b2d8b' }}>عرض الكل</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {featuredStores.map((store, i) => (
                <motion.div key={store.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={`/shop/store/${store.id}`}
                    className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-lg hover:border-violet-200 transition-all text-center group">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white group-hover:scale-110 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
                      {store.store_name?.[0]}
                    </div>
                    <p className="font-bold text-xs text-slate-800 truncate w-full text-center">{store.store_name}</p>
                    {store.rating > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-slate-600">{store.rating}</span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Flash Deal Banner ── */}
          <section className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white text-center sm:text-right">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <Tag className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-300 font-extrabold text-sm">عروض حصرية</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1">خصومات تصل إلى 50%</h3>
                <p className="text-white/70 text-sm">على آلاف المنتجات من أفضل المتاجر</p>
              </div>
              <Link to="/shop/stores">
                <button className="bg-white font-extrabold px-8 py-3 rounded-full hover:bg-white/90 transition text-sm" style={{ color: '#7b2d8b' }}>
                  تسوق الآن
                </button>
              </Link>
            </div>
          </section>

          {/* ── Latest Products ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#ede7f6' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                </span>
                {search ? `نتائج "${search}"` : 'أحدث المنتجات'}
              </h2>
              {search && (
                <button onClick={() => { setSearch(''); setSearchInput(''); }}
                  className="text-sm text-slate-500 hover:text-red-500 transition">✕ مسح البحث</button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-56 animate-pulse" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-semibold">لا توجد نتائج لـ "{search}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((product, i) => {
                  const name = typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name;
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all group">
                      <Link to={`/shop/product/${product.id}`} className="block relative overflow-hidden">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=200&fit=crop'}
                          alt={name}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.original_price && product.original_price > product.price && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{Math.round((1 - product.price / product.original_price) * 100)}%
                          </span>
                        )}
                      </Link>
                      <div className="p-3">
                        <Link to={`/shop/product/${product.id}`}>
                          <p className="font-semibold text-sm text-slate-800 truncate mb-1">{name}</p>
                        </Link>
                        {product.store_name && (
                          <p className="text-xs text-slate-400 mb-2 truncate">🏪 {product.store_name}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-sm" style={{ color: '#7b2d8b' }}>{product.price} ر.س</p>
                            {product.original_price && product.original_price > product.price && (
                              <p className="text-xs text-slate-400 line-through">{product.original_price} ر.س</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="text-white text-xs px-3 py-1.5 rounded-xl font-bold hover:opacity-90 transition flex items-center gap-1"
                            style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}
                          >
                            <ShoppingBag className="w-3 h-3" /> أضف
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Bottom CTA ── */}
          <section className="text-center py-8">
            <p className="text-slate-500 text-sm mb-3">هل أنت بائع؟ افتح متجرك اليوم</p>
            <Link to="/seller/register">
              <button className="font-bold px-8 py-3 rounded-full text-white text-sm hover:opacity-90 transition" style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
                ابدأ البيع مجاناً →
              </button>
            </Link>
          </section>

        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
          © 2026 R souq — جميع الحقوق محفوظة
        </footer>

      </div>
      <PurchaseNotification />
    </>
  );
}