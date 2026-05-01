import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Star, MapPin, Phone, ShoppingBag, Zap, Store, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function StoreDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const load = async () => {
      const [storeData, prods] = await Promise.all([
        base44.entities.Store.filter({ id }),
        base44.entities.Product.filter({ store_id: id, is_active: true }, '-created_date'),
      ]);
      setStore(storeData[0]);
      setProducts(prods);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>;
  if (!store) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">المتجر غير موجود</div>;

  const cats = ['all', ...new Set(products.map(p => p.category))];
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('تمت الإضافة للسلة ✓');
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Store Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/shop" className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 w-fit">
            <ArrowRight className="w-4 h-4" /> العودة للمتاجر
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shrink-0">
              {store.store_logo ? <img src={store.store_logo} className="w-full h-full object-cover rounded-2xl" alt="" /> : '🛍️'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold">{store.store_name}</h1>
                {store.is_featured && (
                  <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3" /> مميز
                  </span>
                )}
                <span className="bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full">نشط</span>
              </div>
              <p className="text-white/80 mt-1 text-sm">{store.store_description || 'متجر متنوع'}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-white/70">
                {store.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {store.location}</span>}
                {store.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {store.phone}</span>}
                <span className="flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> {products.length} منتج</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {store.rating || '4.5'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Filter */}
        {cats.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {cats.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${category === c ? 'bg-violet-600 text-white' : 'bg-white text-muted-foreground border border-slate-200 hover:border-violet-300'}`}>
                {c === 'all' ? 'الكل' : c}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Store className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p>لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition group"
              >
                <Link to={`/shop/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=300&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="font-extrabold text-violet-600">{product.price} ر.س</p>
                        {product.original_price && <p className="text-xs text-muted-foreground line-through">{product.original_price} ر.س</p>}
                      </div>
                      {product.stock === 0 && <span className="text-xs text-red-500">نفد</span>}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full py-2 text-sm font-semibold bg-violet-50 hover:bg-violet-600 hover:text-white text-violet-700 transition border-t border-slate-100 disabled:opacity-40"
                >
                  أضف للسلة
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}