import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Zap, Shield, RotateCcw, Headphones } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import CategoryCard from '@/components/shop/CategoryCard';

const categories = ['clothing', 'electronics', 'home', 'sports', 'beauty', 'books', 'toys', 'food'];

const heroBanners = [
  {
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
    titleKey: 'hero_title',
    subtitleKey: 'hero_subtitle',
  },
  {
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    titleKey: 'featured',
    subtitleKey: 'hero_subtitle',
  },
];

export default function Home() {
  const { t, dir } = useLang();
  const [featured, setFeatured] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [catCounts, setCatCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await base44.entities.Product.list('-created_date', 100);
      setFeatured(all.filter(p => p.is_featured).slice(0, 8));
      setNewProducts(all.filter(p => p.is_new).slice(0, 8));
      setSaleProducts(all.filter(p => p.is_on_sale).slice(0, 8));
      const counts = {};
      all.forEach(p => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1; });
      setCatCounts(counts);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % heroBanners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = heroBanners[bannerIdx];
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const features = [
    { icon: Zap, label: dir === 'rtl' ? 'توصيل سريع' : dir === 'ltr' ? 'Fast Delivery' : 'Schnelle Lieferung', sub: '24h' },
    { icon: Shield, label: dir === 'rtl' ? 'دفع آمن' : 'Secure Payment', sub: '100%' },
    { icon: RotateCcw, label: dir === 'rtl' ? 'إرجاع مجاني' : 'Free Returns', sub: '30 days' },
    { icon: Headphones, label: dir === 'rtl' ? 'دعم 24/7' : '24/7 Support', sub: '' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.section
        key={bannerIdx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative bg-gradient-to-br ${banner.gradient} text-white overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center md:text-start">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
                🛍️ {dir === 'rtl' ? 'مرحباً بك في شوب زون' : 'Welcome to ShopZone'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t[banner.titleKey]}</h1>
              <p className="text-lg text-white/80 mt-4">{t[banner.subtitleKey]}</p>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 flex-wrap justify-center md:justify-start">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl">
                {t.shop_now} <Arrow className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur text-white font-semibold rounded-full hover:bg-white/30 transition-all border border-white/30">
                {t.categories}
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ x: dir === 'rtl' ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full md:w-96 shrink-0"
          >
            <img src={banner.img} alt="hero" className="w-full rounded-3xl shadow-2xl object-cover aspect-square" />
          </motion.div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroBanners.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === bannerIdx ? 'w-6 bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.label}</p>
                  {f.sub && <p className="text-xs text-muted-foreground">{f.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold">{t.categories_title}</h2>
          <Link to="/categories" className="text-primary text-sm font-medium hover:underline">{t.view_all}</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat} category={cat} count={catCounts[cat]} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <ProductSection title={t.featured} products={featured} viewLink="/products?tab=featured" t={t} />
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <ProductSection title={t.new_arrivals} products={newProducts} viewLink="/products?tab=new" t={t} accent />
      )}

      {/* On Sale */}
      {saleProducts.length > 0 && (
        <ProductSection title={t.on_sale} products={saleProducts} viewLink="/products?tab=sale" t={t} />
      )}

      {/* Empty state */}
      {!loading && featured.length === 0 && newProducts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h3 className="text-xl font-bold mb-2">{dir === 'rtl' ? 'لا توجد منتجات بعد' : 'No products yet'}</h3>
          <p className="text-muted-foreground">{dir === 'rtl' ? 'سيتم إضافة المنتجات قريباً' : 'Products will be added soon'}</p>
        </div>
      )}
    </div>
  );
}

function ProductSection({ title, products, viewLink, t, accent }) {
  return (
    <section className={`py-12 ${accent ? 'bg-gradient-to-br from-primary/5 to-accent/5' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold">{title}</h2>
          <Link to={viewLink} className="text-primary text-sm font-medium hover:underline">{t.view_all}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}