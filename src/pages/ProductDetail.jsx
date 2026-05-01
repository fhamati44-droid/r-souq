import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart, Star, Plus, Minus, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const { t, lang, dir } = useLang();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list().then(all => all.find(p => p.id === id)),
      base44.entities.Review.filter({ product_id: id })
    ]).then(([prod, revs]) => {
      setProduct(prod);
      setReviews(revs);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!product) return <div className="p-8 text-center">{t.error}</div>;

  const name = product.name?.[lang] || product.name?.en || product.name?.ar || 'Product';
  const description = product.description?.[lang] || product.description?.en || product.description?.ar || '';
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop'];

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(t.added_to_cart);
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    const user = await base44.auth.me();
    await base44.entities.Review.create({
      product_id: id,
      product_name: name,
      reviewer_name: user.full_name || user.email,
      rating: reviewRating,
      comment: reviewComment,
    });
    const revs = await base44.entities.Review.filter({ product_id: id });
    setReviews(revs);
    setShowReviewForm(false);
    setReviewComment('');
    toast.success(t.success);
    setSubmitting(false);
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <BackArrow className="w-4 h-4" /> {t.products}
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
              <motion.img
                key={imgIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[imgIdx]}
                alt={name}
                className="w-full h-full object-cover"
              />
              {product.is_on_sale && product.original_price && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white font-bold rounded-full text-sm">
                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${i === imgIdx ? 'border-primary' : 'border-border'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {product.brand && <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{product.brand}</p>}
            <h1 className="text-3xl font-extrabold leading-tight">{name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <span className="font-bold">{avgRating}</span>
              <span className="text-muted-foreground text-sm">({reviews.length} {t.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-primary">{t.currency} {product.price?.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through">{t.currency} {product.original_price.toFixed(2)}</span>
              )}
            </div>

            {/* Description */}
            {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className={`w-4 h-4 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={product.stock > 0 ? 'text-green-700' : 'text-red-600'}>
                {product.stock > 0 ? (dir === 'rtl' ? `متوفر (${product.stock})` : `In stock (${product.stock})`) : t.out_of_stock}
              </span>
            </div>

            {/* Qty + Add to cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0 border border-border rounded-full overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-muted transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2.5 font-bold min-w-10 text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2.5 hover:bg-muted transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 h-12 rounded-full font-bold text-base">
                  <ShoppingCart className="w-5 h-5 mr-2" /> {t.add_to_cart}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold">{t.reviews_title}</h2>
            <Button variant="outline" className="rounded-full" onClick={() => setShowReviewForm(!showReviewForm)}>
              {t.write_review}
            </Button>
          </div>

          {showReviewForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-4">{t.write_review}</h3>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)}>
                    <Star className={`w-7 h-7 transition ${s <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder={t.your_review}
                className="w-full p-3 border border-border rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
              <div className="flex gap-3 mt-3">
                <Button onClick={handleSubmitReview} disabled={submitting} className="rounded-full">
                  {t.submit_review}
                </Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)} className="rounded-full">{t.cancel}</Button>
              </div>
            </motion.div>
          )}

          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t.no_reviews}</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{r.reviewer_name}</p>
                      {r.is_verified && <span className="text-xs text-green-600 font-medium">✓ Verified</span>}
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-muted-foreground text-sm">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}