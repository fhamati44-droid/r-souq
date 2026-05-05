import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Store, Star, TrendingUp, Zap, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.img
          key={current}
          src={HERO_SLIDES[current]}
          alt="hero"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full object-cover"
          style={{ maxHeight: '320px', objectPosition: 'center' }}
        />
      </AnimatePresence>
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50'}`}
          />
        ))}
      </div>
      {/* Arrows */}
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

const PURCHASE_NOTIFICATIONS = [
  { name: 'أحمد من الرياض', product: 'سماعات لاسلكية', time: 'منذ دقيقتين' },
  { name: 'سارة من جدة', product: 'عطر روز', time: 'منذ 3 دقائق' },
  { name: 'محمد من الدمام', product: 'ساعة ذكية', time: 'منذ 5 دقائق' },
  { name: 'فاطمة من مكة', product: 'حقيبة يد', time: 'منذ دقيقة' },
  { name: 'خالد من المدينة', product: 'جهاز لابتوب', time: 'للتو' },
  { name: 'نورة من الطائف', product: 'كريم بشرة', time: 'منذ 4 دقائق' },
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
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-3 max-w-xs"
          >
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

const CATEGORIES = [
  { id: 'clothing', label: 'ملابس', emoji: '👕' },
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartCount } = useCart();

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

  return (
    <><div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-violet-700">سوق بلس</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/shop/stores" className="text-sm text-slate-600 hover:text-violet-600 font-medium">المتاجر</Link>
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition">
            <ShoppingBag className="w-5 h-5 text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
          <Link to="/" className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition">الرئيسية</Link>
        </div>
      </nav>

      {/* Hero Slider */}
      <HeroBanner />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Categories */}
        <section>
          <h2 className="font-extrabold text-lg mb-4">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/shop/stores?category=${cat.id}`}
                  className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-3 border border-slate-100 hover:border-violet-300 hover:shadow-md transition text-center">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Stores */}
        <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-lg flex items-center gap-2"><Store className="w-5 h-5 text-violet-500" /> أبرز المتاجر</h2>
              <Link to="/shop/stores" className="text-sm text-violet-600 hover:underline">عرض الكل</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredStores.map((store, i) => (
                <motion.div key={store.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={`/shop/store/${store.id}`} className="block bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-lg">
                        {store.store_name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold">{store.store_name}</p>
                        <p className="text-xs text-muted-foreground">{store.category}</p>
                        {store.rating > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold">{store.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

        {/* Latest Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-500" /> أحدث المنتجات</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to={`/shop/product/${product.id}`} className="block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=200&fit=crop'}
                      alt={product.name}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate">{typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name}</p>
                      <p className="text-violet-600 font-extrabold text-sm mt-1">{product.price} ر.س</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    <PurchaseNotification />
    </>
  );
}