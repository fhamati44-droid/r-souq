import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ShoppingBag, Store, Star, TrendingUp, CheckCircle,
  ChevronLeft, ChevronRight, Search, Shield, Truck,
  RotateCcw, Headphones, Tag, ArrowLeft
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ─── Hero Slider ────────────────────────────────────────────────────────── */
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
          transition={{ duration: 0.6 }} className="w-full object-cover"
          style={{ maxHeight: '340px', objectPosition: 'center' }} />
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

/* ─── Purchase Notification ──────────────────────────────────────────────── */
const NOTIFS = [
  { name: 'أحمد من الرياض', product: 'سماعات لاسلكية', time: 'منذ دقيقتين' },
  { name: 'سارة من جدة', product: 'عطر روز', time: 'منذ 3 دقائق' },
  { name: 'محمد من الدمام', product: 'ساعة ذكية', time: 'منذ 5 دقائق' },
  { name: 'فاطمة من مكة', product: 'حقيبة يد', time: 'منذ دقيقة' },
];

function PurchaseNotification() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const show = () => {
      setIndex(i => (i + 1) % NOTIFS.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    const t = setInterval(show, 8000);
    const init = setTimeout(show, 2500);
    return () => { clearInterval(t); clearTimeout(init); };
  }, []);
  const n = NOTIFS[index];
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
              <p className="text-xs font-bold text-slate-800">{n.name} اشترى للتو</p>
              <p className="text-xs font-semibold" style={{ color: '#7b2d8b' }}>{n.product}</p>
              <p className="text-xs text-slate-400">{n.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Categories ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'clothing',    label: 'ملابس',       emoji: '👕', grad: 'from-pink-50 to-rose-100',     border: 'border-pink-200' },
  { id: 'electronics', label: 'إلكترونيات', emoji: '📱', grad: 'from-blue-50 to-cyan-100',      border: 'border-blue-200' },
  { id: 'home',        label: 'منزل',        emoji: '🏠', grad: 'from-amber-50 to-yellow-100',  border: 'border-amber-200' },
  { id: 'sports',      label: 'رياضة',       emoji: '⚽', grad: 'from-green-50 to-emerald-100', border: 'border-green-200' },
  { id: 'beauty',      label: 'جمال',        emoji: '💄', grad: 'from-purple-50 to-violet-100', border: 'border-purple-200' },
  { id: 'books',       label: 'كتب',         emoji: '📚', grad: 'from-orange-50 to-amber-100',  border: 'border-orange-200' },
  { id: 'toys',        label: 'ألعاب',       emoji: '🎮', grad: 'from-indigo-50 to-blue-100',   border: 'border-indigo-200' },
  { id: 'food',        label: 'طعام',        emoji: '🍕', grad: 'from-red-50 to-orange-100',    border: 'border-red-200' },
  { id: 'general',     label: 'عام',         emoji: '🛍️', grad: 'from-slate-50 to-gray-100',   border: 'border-slate-200' },
];

/* ─── Trust Badges ───────────────────────────────────────────────────────── */
const TRUST = [
  { icon: Truck,      label: 'شحن سريع',    sub: 'لجميع المناطق' },
  { icon: Shield,     label: 'دفع آمن 100%', sub: 'بيانات محمية' },
  { icon: RotateCcw,  label: 'إرجاع مجاني', sub: 'خلال 7 أيام' },
  { icon: Headphones, label: 'دعم 24/7',     sub: 'نحن هنا دائماً' },
];

/* ─── Product Mini-Card ──────────────────────────────────────────────────── */
function ProductCard({ product, onAdd }) {
  const name = typeof product.name === 'object'
    ? (product.name?.ar || product.name?.en || '')
    : product.name || '';
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-violet-200 transition-all group flex flex-col">
      <Link to={`/shop/product/${product.id}`} className="relative block overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=200&fit=crop'}
          alt={name}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/shop/product/${product.id}`}>
          <p className="font-semibold text-xs text-slate-800 line-clamp-2 mb-1 leading-snug">{name}</p>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <p className="font-extrabold text-sm" style={{ color: '#7b2d8b' }}>{product.price} ر.س</p>
            {hasDiscount && <p className="text-xs text-slate-400 line-through">{product.original_price} ر.س</p>}
          </div>
          <button
            onClick={() => onAdd(product)}
            className="text-white text-xs px-2.5 py-1.5 rounded-xl font-bold hover:opacity-90 transition flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}
          >
            <ShoppingBag className="w-3 h-3" /> أضف
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Store Section ──────────────────────────────────────────────────────── */
function StoreSection({ store, products, onAdd }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Store Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100"
        style={{ background: 'linear-gradient(135deg, #f9f5ff 0%, #f3e5f5 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
            {store.store_logo
              ? <img src={store.store_logo} alt="" className="w-full h-full object-cover rounded-2xl" />
              : store.store_name?.[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-800">{store.store_name}</h3>
              {store.is_featured && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">مميز ⭐</span>
              )}
            </div>
            {store.store_description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{store.store_description}</p>
            )}
            {store.rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-600">{store.rating}</span>
              </div>
            )}
          </div>
        </div>
        <Link to={`/shop/store/${store.id}`}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border-2 transition hover:text-white hover:border-violet-600"
          style={{ color: '#7b2d8b', borderColor: '#7b2d8b', background: 'white' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#7b2d8b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#7b2d8b'; }}>
          <Store className="w-3.5 h-3.5" /> زيارة المتجر
          <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>

      {/* Products Row */}
      {products.length > 0 ? (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.slice(0, 5).map(p => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
          {products.length > 5 && (
            <Link to={`/shop/store/${store.id}`}
              className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition min-h-[180px]">
              <span className="text-3xl mb-2">+{products.length - 5}</span>
              <p className="text-xs font-bold text-slate-500">منتج آخر</p>
              <p className="text-xs text-violet-600 mt-1">عرض الكل</p>
            </Link>
          )}
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-slate-400 text-sm">لا توجد منتجات بعد</div>
      )}
    </motion.section>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function ShopHome() {
  const [stores, setStores] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    Promise.all([
      base44.entities.Store.filter({ status: 'active' }, '-created_date', 20),
      base44.entities.Product.filter({ is_active: true }, '-created_date', 100),
    ]).then(([s, p]) => {
      setStores(s);
      setAllProducts(p);
      setLoading(false);
    });
  }, []);

  const handleSearch = e => { e.preventDefault(); setSearch(searchInput); };

  const handleAdd = product => {
    addToCart(product, 1);
    toast.success('✅ تمت الإضافة للسلة');
  };

  /* Group products by store */
  const storesWithProducts = stores.map(store => ({
    store,
    products: allProducts.filter(p => p.store_id === store.id),
  })).filter(({ products }) => products.length > 0 || true); // show even empty stores

  /* Search mode: flat product list */
  const searchResults = search
    ? allProducts.filter(p => {
        const name = typeof p.name === 'object' ? (p.name?.ar || p.name?.en || '') : p.name || '';
        return name.toLowerCase().includes(search.toLowerCase());
      })
    : [];

  return (
    <>
      <div className="min-h-screen bg-slate-50" dir="rtl">

        {/* ── Navbar ── */}
        <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7b2d8b,#6a1b9a)' }}>
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg hidden sm:block" style={{ color: '#6a1b9a' }}>R souq</span>
          </div>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="ابحث عن منتج أو متجر..."
                className="w-full h-10 pr-10 pl-4 rounded-full border-2 border-slate-200 focus:border-violet-400 text-sm focus:outline-none transition" />
            </div>
            <button type="submit" className="mr-2 px-4 py-2 rounded-full text-white text-sm font-bold hover:opacity-90 transition"
              style={{ background: 'linear-gradient(135deg,#7b2d8b,#9c27b0)' }}>بحث</button>
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/shop/stores" className="hidden sm:block text-sm text-slate-600 hover:text-violet-600 font-medium transition">كل المتاجر</Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  style={{ background: '#7b2d8b' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <Link to="/" className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition hidden sm:block">الرئيسية</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <HeroBanner />

        {/* ── Trust Badges ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2">
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

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

          {/* ── Categories ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-xl text-slate-800">تصفح حسب الفئة</h2>
              <Link to="/shop/stores" className="text-sm font-semibold hover:underline" style={{ color: '#7b2d8b' }}>عرض الكل</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="shrink-0">
                  <Link to={`/shop/stores?category=${cat.id}`}
                    className={`flex flex-col items-center gap-1.5 bg-gradient-to-br ${cat.grad} rounded-2xl px-4 py-3 border ${cat.border} hover:shadow-md hover:scale-105 transition-all text-center min-w-[72px]`}>
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{cat.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Flash Deal Banner ── */}
          <section className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg,#6a1b9a 0%,#9c27b0 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white text-center sm:text-right">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <Tag className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-300 font-extrabold text-sm">عروض حصرية</span>
                </div>
                <h3 className="text-2xl font-extrabold">خصومات تصل إلى 50%</h3>
                <p className="text-white/70 text-sm mt-1">على آلاف المنتجات من أفضل المتاجر</p>
              </div>
              <Link to="/shop/stores">
                <button className="bg-white font-extrabold px-8 py-3 rounded-full hover:bg-white/90 transition text-sm" style={{ color: '#7b2d8b' }}>
                  تسوق الآن
                </button>
              </Link>
            </div>
          </section>

          {/* ── Search Results ── */}
          {search && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-xl text-slate-800">نتائج "{search}" ({searchResults.length})</h2>
                <button onClick={() => { setSearch(''); setSearchInput(''); }} className="text-sm text-red-500 hover:text-red-700 transition">✕ مسح</button>
              </div>
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">لا توجد نتائج</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}
                </div>
              )}
            </section>
          )}

          {/* ── Stores + Products (hidden when searching) ── */}
          {!search && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-2xl text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" style={{ color: '#7b2d8b' }} />
                  تسوق من المتاجر
                </h2>
                <Link to="/shop/stores" className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: '#7b2d8b' }}>
                  كل المتاجر <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
                      <div className="h-20 bg-slate-100" />
                      <div className="p-4 grid grid-cols-4 gap-3">
                        {[...Array(4)].map((_, j) => <div key={j} className="h-44 bg-slate-100 rounded-2xl" />)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : storesWithProducts.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">لا توجد متاجر نشطة حالياً</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {storesWithProducts.map(({ store, products }) => (
                    <StoreSection key={store.id} store={store} products={products} onAdd={handleAdd} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Seller CTA ── */}
          <section className="text-center py-6 bg-white rounded-3xl border border-dashed border-violet-200 px-6">
            <p className="font-extrabold text-lg text-slate-800 mb-1">أنت بائع؟ 🏪</p>
            <p className="text-slate-500 text-sm mb-4">افتح متجرك الآن وابدأ البيع لآلاف المتسوقين</p>
            <Link to="/seller/register">
              <button className="font-bold px-8 py-3 rounded-full text-white text-sm hover:opacity-90 transition" style={{ background: 'linear-gradient(135deg,#7b2d8b,#9c27b0)' }}>
                ابدأ البيع مجاناً →
              </button>
            </Link>
          </section>

        </div>

        <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
          © 2026 R souq — جميع الحقوق محفوظة
        </footer>
      </div>
      <PurchaseNotification />
    </>
  );
}