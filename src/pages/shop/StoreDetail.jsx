import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Search, ShoppingBag, Star, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id || id === ':id') return;
    Promise.all([
      base44.entities.Store.get(id),
      base44.entities.Product.filter({ store_id: id, is_active: true }, '-created_date'),
    ]).then(([store, prods]) => {
      setStore(store || null);
      setProducts(prods);
      setLoading(false);
    }).catch(() => {
      setStore(null);
      setLoading(false);
    });
  }, [id]);

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success('تمت الإضافة للسلة');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  if (!store) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground" dir="rtl">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">المتجر غير موجود</p>
        <Link to="/shop/stores" className="text-violet-600 hover:underline text-sm">العودة للمتاجر</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to="/shop/stores" className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في المتجر..."
            className="w-full h-9 pr-9 pl-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <Link to="/cart" className="p-2 rounded-full hover:bg-slate-100 transition">
          <ShoppingBag className="w-5 h-5 text-slate-600" />
        </Link>
      </nav>

      {/* Store Header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-2xl shrink-0">
            {store.store_logo ? <img src={store.store_logo} alt="" className="w-full h-full object-cover rounded-2xl" /> : store.store_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-xl">{store.store_name}</h1>
              {store.is_featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">مميز</span>}
            </div>
            {store.store_description && <p className="text-sm text-muted-foreground mt-0.5">{store.store_description}</p>}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
              {store.rating > 0 && (
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{store.rating}</span>
              )}
              {store.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{store.location}</span>}
              {store.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{store.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} منتج</p>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا توجد منتجات</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition">
                  <Link to={`/shop/product/${product.id}`}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=200&fit=crop'}
                      alt={product.name}
                      className="w-full h-36 object-cover"
                    />
                  </Link>
                  <div className="p-3">
                    <Link to={`/shop/product/${product.id}`}>
                      <p className="font-semibold text-sm truncate">{typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-violet-600 font-extrabold text-sm">{product.price} ر.س</p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="text-xs bg-violet-600 text-white px-2.5 py-1 rounded-lg hover:bg-violet-700 transition"
                      >
                        أضف
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}