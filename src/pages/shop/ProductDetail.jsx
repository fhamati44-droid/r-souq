import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShoppingCart, Star, Store, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ShopProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selImg, setSelImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [prods, revs] = await Promise.all([
        base44.entities.Product.filter({ id }),
        base44.entities.Review.filter({ product_id: id }, '-created_date'),
      ]);
      const p = prods[0];
      setProduct(p);
      setReviews(revs);
      if (p?.store_id) {
        const stores = await base44.entities.Store.filter({ id: p.store_id });
        setStore(stores[0]);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`تمت إضافة ${qty} إلى السلة ✓`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewer_name) { toast.error('أدخل اسمك'); return; }
    setSubmitting(true);
    await base44.entities.Review.create({ ...reviewForm, product_id: id, product_name: product?.name });
    const revs = await base44.entities.Review.filter({ product_id: id }, '-created_date');
    setReviews(revs);
    setReviewForm({ reviewer_name: '', rating: 5, comment: '' });
    toast.success('تم إرسال تقييمك');
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">المنتج غير موجود</div>;

  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Link to={store ? `/shop/store/${store.id}` : '/shop'} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 w-fit">
          <ArrowRight className="w-4 h-4" /> {store?.store_name || 'المتاجر'}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 mb-3">
              <img src={product.images?.[selImg] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop'} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${selImg === i ? 'border-violet-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {store && (
              <Link to={`/shop/store/${store.id}`} className="flex items-center gap-2 text-sm text-violet-600 font-medium mb-3 hover:underline">
                <Store className="w-4 h-4" /> {store.store_name}
              </Link>
            )}
            <h1 className="text-2xl font-extrabold mb-3">{product.name}</h1>

            {avgRating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}
                </div>
                <span className="text-sm font-semibold">{avgRating}</span>
                <span className="text-sm text-muted-foreground">({reviews.length} تقييم)</span>
              </div>
            )}

            <div className="mb-4">
              <span className="text-3xl font-extrabold text-violet-600">{product.price} ر.س</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through mr-3">{product.original_price} ر.س</span>
              )}
              {discount > 0 && <span className="mr-2 bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">خصم {discount}%</span>}
            </div>

            {product.description && <p className="text-muted-foreground text-sm leading-relaxed mb-5">{product.description}</p>}

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium">الكمية:</span>
              <div className="flex items-center border border-slate-200 rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-slate-100 transition"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-bold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} className="px-3 py-2 hover:bg-slate-100 transition"><Plus className="w-4 h-4" /></button>
              </div>
              <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `متوفر (${product.stock})` : 'نفد المخزون'}
              </span>
            </div>

            <Button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-base gap-2">
              <ShoppingCart className="w-5 h-5" /> أضف للسلة
            </Button>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-lg mb-5">التقييمات ({reviews.length})</h2>
          {reviews.length > 0 && (
            <div className="space-y-4 mb-6">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{r.reviewer_name}</span>
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}</div>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
          {reviews.length === 0 && <p className="text-muted-foreground text-sm mb-5">لا توجد تقييمات بعد. كن أول من يقيّم!</p>}

          <form onSubmit={submitReview} className="border-t border-slate-100 pt-5 space-y-3">
            <h3 className="font-semibold">أضف تقييمك</h3>
            <input className="w-full h-10 px-3 rounded-xl border border-input text-sm" placeholder="اسمك" value={reviewForm.reviewer_name} onChange={e => setReviewForm(f => ({ ...f, reviewer_name: e.target.value }))} />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">تقييمك:</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                    <Star className={`w-6 h-6 transition ${s <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea className="w-full px-3 py-2 rounded-xl border border-input text-sm resize-none h-20" placeholder="اكتب تعليقك..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
            <Button type="submit" disabled={submitting} className="rounded-full bg-violet-600">
              {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}