import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, Store, Star, TrendingUp, CheckCircle, ChevronLeft, ChevronRight, Search, Shield, Truck, RotateCcw, Headphones, Tag, Zap, Heart, Eye, Filter, ChevronDown, Flame, Clock, Gift, Globe } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/lib/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ChatBot from '@/components/ChatBot';

/* ── Hero Slider ─────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    img: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/0838d331f_WhatsAppImage2026-05-05at45758PM.jpg',
  },
  {
    img: 'https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/25a2fd050_WhatsAppImage2026-05-05at45728PM.jpg',
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full overflow-hidden bg-[#2d0a4e]">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={HERO_SLIDES[current].img}
          alt="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full h-auto block"
        />
      </AnimatePresence>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-7 h-3 bg-white' : 'w-3 h-3 bg-white/40'}`} />
        ))}
      </div>
      <button onClick={() => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition z-10 backdrop-blur-sm">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCurrent(c => (c + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center text-white transition z-10 backdrop-blur-sm">
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
  { id: 'electronics', labelKey: 'cat_electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&h=120&fit=crop' },
  { id: 'clothing', labelKey: 'cat_clothing', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=120&h=120&fit=crop' },
  { id: 'home', labelKey: 'cat_home', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop' },
  { id: 'beauty', labelKey: 'cat_beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&h=120&fit=crop' },
  { id: 'sports', labelKey: 'cat_sports', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=120&h=120&fit=crop' },
  { id: 'food', labelKey: 'cat_food', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&h=120&fit=crop' },
  { id: 'books', labelKey: 'cat_books', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=120&h=120&fit=crop' },
  { id: 'toys', labelKey: 'cat_toys', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=120&h=120&fit=crop' },
  { id: 'general', labelKey: 'cat_general', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&h=120&fit=crop' },
];

/* ── Trust Badges ────────────────────────────────────────────────────────── */
const TRUST_KEYS = [
  { icon: Truck, labelKey: 'trust_shipping', subKey: 'trust_shipping_sub' },
  { icon: Shield, labelKey: 'trust_payment', subKey: 'trust_payment_sub' },
  { icon: RotateCcw, labelKey: 'trust_return', subKey: 'trust_return_sub' },
  { icon: Headphones, labelKey: 'trust_support', subKey: 'trust_support_sub' },
];



/* ── Product Card ────────────────────────────────────────────────────────── */
function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false);
  const { t } = useLang();
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

/* ── Section Header ──────────────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, title, linkTo, linkLabel }) {
  const { t } = useLang();
  const label = linkLabel || t.view_all;
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
          {label} <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
const LANGS = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function ShopHome() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { addToCart, cartCount } = useCart();
  const { lang, changeLang, t, dir } = useLang();

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

  // Close lang menu on outside click
  useEffect(() => {
    if (!showLangMenu) return;
    const handler = () => setShowLangMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showLangMenu]);

  const filteredProducts = products.filter(p => {
    const name = typeof p.name === 'object' ? (p.name?.ar || p.name?.en || '') : p.name || '';
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleAddToCart = (product) => { addToCart(product, 1); toast.success('✅ ' + t.added_to_cart); };

  return (
    <>
      <div className="min-h-screen bg-slate-50" dir={dir}>

        {/* ── Topbar announcement ── */}
        <div className="text-center text-xs font-bold py-2 text-white" style={{ background: 'linear-gradient(90deg, #6a1b9a, #9c27b0, #6a1b9a)' }}>
          {t.topbar_promo}
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
                  placeholder={t.search}
                  className="w-full h-10 pr-4 pl-12 rounded-r-2xl rounded-l-none border-2 border-l-0 text-sm focus:outline-none focus:border-violet-400 transition border-slate-200" />
                <button type="submit" className="h-10 px-4 rounded-l-2xl text-white font-bold text-sm transition" style={{ background: '#7b2d8b' }}>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 shrink-0">
              <Link to="/landing" className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-violet-600 transition">
                {t.become_seller}
              </Link>
              <Link to="/shop/stores" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-violet-600 transition">
                <Store className="w-4 h-4" /> {t.stores}
              </Link>

              {/* Language Switcher */}
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setShowLangMenu(v => !v)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-slate-50 transition text-sm font-semibold text-slate-600"
                >
                  <Globe className="w-4 h-4" />
                  <span>{LANGS.find(l => l.code === lang)?.flag}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[130px]">
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { changeLang(l.code); setShowLangMenu(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-violet-50 transition ${lang === l.code ? 'font-bold text-violet-700 bg-violet-50' : 'text-slate-700'}`}
                      >
                        <span>{l.flag}</span> {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
                {t.nav_all}
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${activeCategory === cat.id ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  style={activeCategory === cat.id ? { background: '#7b2d8b' } : {}}>
                  <img src={cat.img} alt={t[cat.labelKey]} className="w-4 h-4 rounded-full object-cover" />
                  {t[cat.labelKey]}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ── H1 for SEO (visually hidden) ── */}
        <h1 className="sr-only">تسوق أونلاين بجودة عالمية وأسعار منافسة | R Souq</h1>

        {/* ── Hero Banner ── */}
        <HeroBanner />

        {/* ── Trust Badges ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2">
            {TRUST_KEYS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: '#f9f5ff' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#ede7f6' }}>
                  <item.icon className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{t[item.labelKey]}</p>
                  <p className="text-xs text-slate-400">{t[item.subKey]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">

          {/* ── Category Grid ── */}
          <section>
            <SectionHeader title={t.shop_by_category} linkTo="/shop/stores" linkLabel={t.view_all} />
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.button key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => { setActiveCategory(activeCategory === cat.id ? null : cat.id); window.scrollTo({ top: 600, behavior: 'smooth' }); }}
                  className={`flex flex-col items-center gap-2 rounded-2xl overflow-hidden border-2 transition-all hover:shadow-md hover:scale-105 text-center ${activeCategory === cat.id ? 'border-violet-500 shadow-md' : 'border-transparent'}`}>
                  <img src={cat.img} alt={t[cat.labelKey]} className="w-full h-16 object-cover" />
                  <span className="text-xs font-bold text-slate-700 pb-2 px-1">{t[cat.labelKey]}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* ── Promo Banner 1 ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Link to="/shop/stores">
              <img
                src="https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/f948b2f51_WhatsAppImage2026-05-05at45728PM2.jpg"
                alt="promo 1"
                className="w-full h-auto block rounded-2xl hover:opacity-95 transition shadow-md"
              />
            </Link>
          </motion.div>

          {/* ── Featured Stores ── */}
          {stores.length > 0 && (
            <section>
              <SectionHeader icon={Store} title={t.featured_stores} linkTo="/shop/stores" linkLabel={t.view_all} />
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
                  <span className="text-amber-300 font-extrabold text-sm">{t.flash_deals}</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-1">{t.flash_discount}</h3>
                <p className="text-white/70 text-sm">{t.flash_sub}</p>
              </div>
              <Link to="/shop/stores">
                <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-8 py-3 rounded-full text-sm transition shadow-lg">
                  {t.shop_now_arrow}
                </button>
              </Link>
            </div>
          </section>

          {/* ── Featured Products ── */}
          <section>
            <SectionHeader icon={Flame} title={t.featured_products} linkTo="/shop/stores" linkLabel={t.view_all} />
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

          {/* ── Promo Banner 2 ── */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/shop/stores">
              <img
                src="https://media.base44.com/images/public/69f43f4e6504a7a021252c7d/9b1e38864_WhatsAppImage2026-05-05at45728PM1.jpg"
                alt="promo 2"
                className="w-full h-auto block rounded-2xl hover:opacity-95 transition shadow-md"
              />
            </Link>
          </motion.div>

          {/* ── All Products with filters ── */}
          <section>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#ede7f6' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#7b2d8b' }} />
                </span>
                {search ? `${t.search_results}: "${search}"` : activeCategory ? `${t.category_label}: ${t[CATEGORIES.find(c => c.id === activeCategory)?.labelKey]}` : t.latest_products}
              </h2>
              {(search || activeCategory) && (
                <button onClick={() => { setSearch(''); setSearchInput(''); setActiveCategory(null); }}
                  className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition">
                  {t.clear_filter}
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
                <p className="font-bold text-slate-500 text-lg">{t.no_results}</p>
                <p className="text-slate-400 text-sm mt-1">{t.no_results_sub}</p>
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
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">{t.are_you_seller}</h3>
            <p className="text-slate-500 text-sm mb-5">{t.seller_cta_sub}</p>
            <Link to="/seller/register">
              <button className="font-bold px-8 py-3 rounded-full text-white text-sm hover:opacity-90 transition shadow-lg"
                style={{ background: 'linear-gradient(135deg, #7b2d8b, #9c27b0)' }}>
                {t.start_selling}
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
                <p className="text-slate-400 text-xs leading-relaxed">{t.footer_tagline}</p>
                {/* Social Media Links */}
                <div className="flex gap-3 mt-3">
                  <a href="https://www.instagram.com/rsouq_sa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-80"
                    style={{ background: 'linear-gradient(135deg, #e1306c, #833ab4)' }}>
                    <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61588935792604" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 transition hover:opacity-80">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </div>
                {/* Local SEO */}
                <address className="not-italic mt-3 text-xs text-slate-400 leading-relaxed">
                  <span itemProp="addressLocality">المملكة العربية السعودية</span><br/>
                  <a href="mailto:support@rsouq.com" className="hover:text-violet-600 transition">support@rsouq.com</a>
                </address>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-3">{t.quick_links}</p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/shop/stores" className="hover:text-violet-600 transition">{t.footer_stores}</Link></li>
                  <li><Link to="/cart" className="hover:text-violet-600 transition">{t.footer_cart}</Link></li>
                  <li><Link to="/orders" className="hover:text-violet-600 transition">{t.footer_orders}</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-3">{t.support}</p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/contact" className="hover:text-violet-600 transition">{t.contact_us}</Link></li>
                  <li><Link to="/return-policy" className="hover:text-violet-600 transition">{t.return_policy}</Link></li>
                  <li><Link to="/terms" className="hover:text-violet-600 transition">{t.terms}</Link></li>
                  <li><Link to="/blog" className="hover:text-violet-600 transition">المدونة</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-slate-700 mb-3">{t.sellers}</p>
                <ul className="space-y-2 text-slate-400">
                  <li><Link to="/seller/register" className="hover:text-violet-600 transition">{t.open_store}</Link></li>
                  <li><Link to="/seller/dashboard" className="hover:text-violet-600 transition">{t.dashboard}</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
              {t.footer_rights}
            </div>
          </div>
        </footer>

      </div>
      <PurchaseNotification />
      <ChatBot />
    </>
  );
}