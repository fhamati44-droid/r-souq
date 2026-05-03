import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, ShoppingBag, Star, Plus, Minus, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ id }),
      base44.entities.Review.filter({ product_id: id }),
    ]).then(([prods, revs]) => {
      setProduct(prods[0] || null);
      setReviews(revs);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`تمت إضافة ${quantity} قطعة للسلة`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground" dir="rtl">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">المنتج غير موجود</p>
        <Link to="/shop" className="text-violet-600 hover:underline text-sm">العودة للتسوق</Link>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&h=400&fit=crop'];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to={product.store_id ? `/shop/store/${product.store_id}` : '/shop'} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <span className="font-semibold flex-1 truncate">{product.name}</span>
        <Link to="/cart" className="p-2 rounded-full hover:bg-slate-100 transition">
          <ShoppingBag className="w-5 h-5 text-slate-600" />
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <motion.img
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-72 sm:h-96 object-cover rounded-2xl border border-slate-100"
            />
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? 'border-violet-500' : 'border-slate-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-extrabold">{product.name}</h1>
              {product.brand && <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>}
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= product.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                  <span className="text-sm text-muted-foreground">({product.reviews_count || 0})</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-violet-700">{product.price} ر.س</span>
              {product.original_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">{product.original_price} ر.س</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">المخزون:</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} قطعة` : 'نفد المخزون'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">الكمية:</span>
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-slate-50 transition shadow-sm">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-slate-50 transition shadow-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full rounded-full bg-violet-600 hover:bg-violet-700 font-bold py-6 text-base gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> أضف إلى السلة
            </Button>

            {product.store_name && (
              <Link to={`/shop/store/${product.store_id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-600 transition">
                <Store className="w-4 h-4" /> {product.store_name}
              </Link>
            )}
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <h2 className="font-extrabold text-lg mb-4">التقييمات ({reviews.length})</h2>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                    </div>
                    <span className="text-sm font-semibold">{r.reviewer_name || 'مجهول'}</span>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}