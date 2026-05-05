import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Store, Star, TrendingUp, CheckCircle, ChevronLeft, ChevronRight, Search, Shield, Truck, RotateCcw, Headphones, Tag, Zap, Heart, Eye, Filter, ChevronDown, Flame, Clock, Gift } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* ── Hero Slider ─────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    img: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/03d4baf5d_fPFsET2AgQI7TVZIlgRlv5MizZyNlsn2PkNVK2WB.png',
    badge: '🔥 عروض حصرية',
    title: 'خصومات تصل إلى 70%',
    sub: 'على آلاف المنتجات من أفضل المتاجر',
    cta: 'تسوق الآن',
    bg: 'from-violet-900 via-purple-800 to-indigo-900',
  },
  {
    img: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/c5dcda3f2_exJIj1WB1xXKzBHfeLblKpBDpOJccRStFXLEi0d3.png',
    badge: '⚡ وصل جديد',
    title: 'أحدث المنتجات بأفضل الأسعار',
    sub: 'اكتشف كل جديد في متجرنا يومياً',
    cta: 'اكتشف الآن',
    bg: 'from-fuchsia-900 via-violet-800 to-purple-900',
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[current];
  return (
    <div className="relative w-full overflow-hidden rounded-none" style={{ minHeight: '280px' }}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`} />
      </AnimatePresence>
      <div className="relative flex flex-col md:flex-row items-center max-w-6xl mx-auto px-6 py-8 gap-4 min-h-[280px]">
        <div className="flex-1 text-white text-right z-10">
          <span className="inline-block text-xs font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full mb-3">{slide.badge}</span>
          <AnimatePresence mode="wait">
            <motion.h2 key={current + 'title'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">{slide.title}</motion.h2>
          </AnimatePresence>
          <p className="text-white/80 mb-5 text-sm">{slide.sub}</p>
          <Link to="/shop/stores">
            <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-7 py-2.5 rounded-full text-sm transition shadow-lg">
              {slide.cta} ←
            </button>
          </Link>
        </div>
        <AnimatePresence mode="wait">
          <motion.img key={current + 'img'} src={slide.img} alt="hero"
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }} className="w-full md:w-1/2 max-h-52 object-contain drop-shadow-2xl" />
        </AnimatePresence>
      </div>
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40'}`} />
        ))}
      </div>
      <button onClick={() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition z-10">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % HERO_SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition z-10">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ── Purchase Notification ───────────────────────────────────────────────── */
const NOTIFS = [
  { name: 'أحمد من الرياض', product: 'سماعات لاسلكية' },
  { name: 'سارة من جدة', product: 'عطر روز' },
  { name: 'محمد من الدمام', product: 'ساعة ذكية' },
  { name: 'فاطمة من مكة', product: 'حقيبة يد' },
];
function PurchaseNotification() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const show = () => { setIndex(i => (i + 1) % NOTIFS.length); setVisible(true); setTimeout(() => setVisible(false), 4000); };
    const timer = setInterval(show, 7000);
    const init = setTimeout(show, 2500);
    return () => { clearInterval(timer); clearTimeout(init); };
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 max-w-xs">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{NOTIFS[index].name} اشترى للتو</p>
              <p className="text-xs font-semibold" style={{ color: '#7b2d8b' }}>{NOTIFS[index].product}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Categories ──────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'electronics', label: 'إلكترونيات', emoji: '📱', color: '#dbeafe' },
  { id: 'clothing', label: 'ملابس', emoji: '👕', color: '#fce7f3' },
  { id: 'home', label: 'المنزل', emoji: '🏠', color: '#fef9c3' },
  { id: 'beauty', label: 'جمال وعناية', emoji: '💄', color: '#ede9fe' },
  { id: 'sports', label: 'رياضة', emoji: '⚽', color: '#dcfce7' },
  { id: 'food', label: 'طعام', emoji: '🍕', color: '#fee2e2' },
  { id: 'books', label: 'كتب', emoji: '📚', color: '#ffedd5' },
  { id: 'toys', label: 'ألعاب', emoji: '🎮', color: '#e0f2fe' },
  { id: 'general', label: 'متنوع', emoji: '🛍️', color: '#f1f5f9' },
];

/* ── Trust Badges ────────────────────────────────────────────────────────── */
const TRUST = [
  { icon: Truck, label: 'شحن سريع', sub: 'لجميع المناطق' },
  { icon: Shield, label: 'دفع آمن 100%', sub: 'بيانات محمية' },
  { icon: RotateCcw, label: 'إرجاع مجاني', sub: 'خلال 7 أيام' },
  { icon: Headphones, label: 'دعم 24/7', sub: 'نحن هنا دائماً' },
];

/* ── Promo Banners ───────────────────────────────────────────────────────── */
const PROMO_BANNERS = [
  { bg: 'from-violet-600 to-purple-700', emoji: '⚡', title: 'صفقات اليوم', sub: 'خصومات تنتهي اليوم فقط', badge: 'ينتهي قريباً', icon: Clock },
  { bg: 'from-orange-500 to-amber-500', emoji: '🎁', title: 'عروض العيد', sub: 'هدايا رائعة بأسعار مذهلة', badge: 'مميز', icon: Gift },
  { bg: 'from-pink-500 to-rose-500', emoji: '🔥', title: 'الأكثر مبيعاً', sub: 'المنتجات التي يحبها الجميع', badge: 'رائج', icon: Flame },
];

/* ── Product Card ────────────────────────────────────────────────────────── */
function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false);
  const name = typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name || '';
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all group relative">
      {/* Discount badge */}
      {hasDiscount && (
        <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </span>
      )}
      {/* Wishlist */}
      <button onClick={() => setWished(w => !w)}
        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition">
        <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
      </button>
      <Link to={`/shop/product/${product.id}`} className="block overflow-hidden">
        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=220&fit=crop'}
          alt={name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      {/* Quick view overlay */}
      <Link to={`/shop/product/${product.id}`}
        className="absolute inset-0 top-auto bottom-[88px] h-8 bg-black/60 text-white text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Eye className="w-3.5 h-3.5" /> عرض سريع
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
            <ShoppingBag className="w-3 h-3" /> أضف
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section Header ──────────────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, title, linkTo, linkLabel = 'عرض الكل' }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
        {Icon && (
          <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#ede7f6' }}>
            <Icon className="w-4 h-4" style={{ color: '#7b2d8b' }} />
          </span>
        )}
        {title}
      </h2>
      {linkTo && (
        <Link to={linkTo} className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: '#7b2d8b' }}>
          {linkLabel} <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function ShopHome() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    Promise.all([
      base44.entities.Store.filter({ status: 'active' }, '-created_date', 8),
      base44.entities.Product.filter({ is_active: true }, '-created_date', 20),
      base44.entities.Product.filter({ is_active: true, is_featured: true }, '-created_date', 8),
    ]).then(([s, p, fp]) => {
      setStores(s);
      setProducts(p);
      setFeaturedProducts(fp.length > 0 ? fp : p.slice(0, 8));
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setActiveCategory(null); };

  const filteredProducts = products.filter(p => {
    const name = typeof p.name === 'object' ? (p.name?.ar || p.name?.en || '') : p.name || '';
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleAddToCart = (product) => { addToCart(product, 1); toast.success('✅ تمت الإضافة للسلة'); };

  return (
    <>
      <div className="min-h-screen bg-slate-50" dir="rtl">

        {/* ── Topbar announcement ── */}
        <div className="text-center text-xs font-bold py-2 text-white" style={{ background: 'linear-gradient(90deg, #6a1b9a, #9c27b0, #6a1b9a)' }}>
          🎉 شحن مجاني على جميع الطلبات فوق 200 ر.س | استخدم كود: RSOUQ10 لخصم 10%
        </div>

        {/* ── Navbar ── */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          {/* Top nav row */}
          <div className="px-4 sm:px-6 h-14 flex items-center gap-3 max-w-7xl mx-auto">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7b2d8b, #6a1b9a)' }}>
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg hidden sm:block" style={{ color: '#6a1b9a' }}>R souq</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-3">
              <div className="relative flex">
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="ابحث عن منتج، متجر، أو ماركة..."
                  className="w-full h-10 pr-4 pl-12 rounded-r-2xl rounded-l-none border-2 border-l-0 text-sm focus:outline-none focus:border-violet-400 transition border-slate-200" />
                <button type="submit" className="h-10 px-4 rounded-l-2xl text-white font-bold text-sm transition" style={{ background: '#7b2d8b' }}>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 shrink-0">
              <Link to="/shop/stores" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-violet-600 transition">
                <Store className="w-4 h-4" /> المتاجر
              </Link>
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-100 transition">
                <ShoppingBag className="w-5 h-5 text-slate-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-bold" style={{ background: '#7b2d8b' }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Category nav row */}
          <div className="border-t border-slate-100 overflow-x-auto">
            <div className="flex items-center gap-1 px-4 py-2 min-w-max max-w-7xl mx-auto">
              <button onClick={() => setActiveCategory(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${!activeCategory ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                style={!activeCategory ? { background: '#7b2d8b' } : {}}>
                الكل
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${activeCategory === cat.id ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  style={activeCategory === cat.id ? { background: '#7b2d8b' } : {}}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ── Hero Banner ── */}
        <HeroBanner />

        {/* ── Trust Badges ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {TRUST.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: '#f9f5ff' }}>
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

          {/* ── Category Grid ── */}
          <section>
            <SectionHeader title="تسوق حسب الفئة" linkTo="/shop/stores" />
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.button key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => { setActiveCategory(activeCategory === cat.id ? null : cat.id); window.scrollTo({ top: 600, behavior: 'smooth' }); }}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-3 border-2 transition-all hover:shadow-md hover:scale-105 text-center ${activeCategory === cat.id ? 'border-violet-500 shadow-md' : 'border-transparent'}`}
                  style={{ background: cat.color }}>
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* ── 3 Promo Banners ── */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROMO_BANNERS.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to="/shop/stores">
                  <div className={`bg-gradient-to-br ${b.bg} rounded-2xl p-5 text-white flex items-center gap-4 hover:opacity-90 transition shadow-md`}>
                    <span className="text-4xl">{b.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-extrabold text-base">{b.title}</p>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{b.badge}</span>
                      </div>
                      <p className="text-white/80 text-xs">{b.sub}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </section>

          {/* ── Featured Stores ── */}
          {stores.length > 0 && (
            <section>
              <SectionHeader icon={Store} title="أبرز المتاجر" linkTo="/shop/stores" />
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {stores.map((store, i) => (
                  <motion.div key={store.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/shop/store/${store.id}`}
                      className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-lg hover:border-violet-200 transition-all text-center group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white group-hover:scale-110 transition-transform"
                        style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
                        {store.store_logo
                          ? <img src={store.store_logo} alt="" className="w-full h-full object-cover rounded-2xl" />
                          : store.store_name?.[0]}
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
          )}

          {/* ── Flash Deal Banner ── */}
          <section className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white text-center sm:text-right">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span className="text-amber-300 font-extrabold text-sm">عروض فلاش — تنتهي خلال ساعات!</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1">خصومات تصل إلى 50%</h3>
                <p className="text-white/70 text-sm">على آلاف المنتجات من أفضل المتاجر</p>
              </div>
              <Link to="/shop/stores">
                <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-8 py-3 rounded-full text-sm transition shadow-lg">
                  تسوق الآن ←
                </button>
              </Link>
            </div>
          </section>

          {/* ── Featured Products ── */}
          <section>
            <SectionHeader icon={Flame} title="منتجات مميزة" linkTo="/shop/stores" />
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {featuredProducts.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ── All Products with filters ── */}
          <section>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#ede7f6' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                </span>
                {search ? `نتائج البحث: "${search}"` : activeCategory ? `فئة: ${CATEGORIES.find(c => c.id === activeCategory)?.label}` : 'أحدث المنتجات'}
              </h2>
              {(search || activeCategory) && (
                <button onClick={() => { setSearch(''); setSearchInput(''); setActiveCategory(null); }}
                  className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition">
                  ✕ مسح الفلتر
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-slate-500 text-lg">لا توجد نتائج</p>
                <p className="text-slate-400 text-sm mt-1">جرّب كلمة بحث أخرى أو تصفح الفئات</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ── Seller CTA ── */}
          <section className="text-center bg-white rounded-3xl border border-slate-100 py-10 px-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#ede7f6' }}>
              <Store className="w-7 h-7" style={{ color: '#7b2d8b' }} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">هل أنت بائع؟</h3>
            <p className="text-slate-500 text-sm mb-5">افتح متجرك اليوم وابدأ البيع لملايين المتسوقين</p>
            <Link to="/seller/register">
              <button className="font-bold px-8 py-3 rounded-full text-white text-sm hover:opacity-90 transition shadow-lg"
                style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
                ابدأ البيع مجاناً ←
              </button>
            </Link>
          </section>

        </div>

        {/* ── Footer ── */}
        <footer className="bg-white border-t border-slate-200 pt-10 pb-6 mt-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
              <div>
                <p className="font-extrabold text-slate-800 mb-3">R souq</p>
                <p className="text-slate-400 text-xs leading-relaxed">بوابتك للتسوق الإلكتروني الذكي والآمن</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-3">روابط سريعة</p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/shop/stores" className="hover:text-violet-600 transition">المتاجر</Link></li>
                  <li><Link to="/cart" className="hover:text-violet-600 transition">سلة التسوق</Link></li>
                  <li><Link to="/orders" className="hover:text-violet-600 transition">طلباتي</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-3">الدعم</p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/contact" className="hover:text-violet-600 transition">تواصل معنا</Link></li>
                  <li><Link to="/return-policy" className="hover:text-violet-600 transition">سياسة الإرجاع</Link></li>
                  <li><Link to="/terms" className="hover:text-violet-600 transition">شروط الاستخدام</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-3">البائعون</p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/seller/register" className="hover:text-violet-600 transition">افتح متجرك</Link></li>
                  <li><Link to="/seller/dashboard" className="hover:text-violet-600 transition">لوحة التحكم</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
              © 2026 R souq — جميع الحقوق محفوظة
            </div>
          </div>
        </footer>

      </div>
      <PurchaseNotification />
    </>
  );
}