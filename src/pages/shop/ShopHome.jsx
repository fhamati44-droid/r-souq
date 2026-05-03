import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Store, Star, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          </Link>
          <Link to="/" className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition">الرئيسية</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">تسوّق من أفضل المتاجر</h1>
          <p className="text-white/80 mb-3">آلاف المنتجات بأفضل الأسعار</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-white/20 backdrop-blur text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
              <Store className="w-4 h-4" /> 100+ متجر نشط
            </span>
          </div>
          <Link to="/shop/stores">
            <button className="bg-white text-violet-700 font-bold px-8 py-3 rounded-full hover:bg-white/90 transition">
              تصفح المتاجر
            </button>
          </Link>
        </motion.div>
      </div>

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
                      <p className="font-semibold text-sm truncate">{product.name}</p>
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