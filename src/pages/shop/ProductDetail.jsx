import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, ShoppingBag, Star, Plus, Minus, Store, Truck, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const USD_TO_SAR = 3.75;

function normalizeCJProduct(p) {
  const rawPrice = p.sellPrice?.split(' -- ')?.[0] || p.sellPrice || '0';
  const costSAR = parseFloat((parseFloat(rawPrice) * USD_TO_SAR).toFixed(2));
  const retailPrice = parseFloat((costSAR * 1.5).toFixed(2));
  return {
    id: `cj_${p.id}`,
    name: p.nameEn,
    description: p.description || p.nameEn,
    price: retailPrice,
    original_price: parseFloat((retailPrice * 1.3).toFixed(2)),
    cost_price: costSAR,
    category: 'general',
    images: [p.bigImage].filter(Boolean),
    brand: p.supplierName || 'R souq',
    stock: p.warehouseInventoryNum || 100,
    rating: 0,
    reviews_count: 0,
    is_active: true,
    store_name: 'R souq Marketplace',
    warehouse_product_id: `cj_${p.id}`,
  };
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  // Shipping
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    // Handle CJ marketplace products (not yet in DB)
    if (id?.startsWith('cj_')) {
      const cjId = id.replace('cj_', '');
      Promise.all([
        base44.functions.invoke('cjProducts', { action: 'getProduct', productId: cjId }),
        base44.entities.Review.filter({ product_id: id }),
      ]).then(([res, revs]) => {
        const cjProduct = res?.data?.product;
        if (cjProduct) {
          setProduct(normalizeCJProduct(cjProduct));
          setReviews(revs);
          setLoadingShipping(true);
          base44.functions.invoke('cjProducts', { action: 'getShipping', productId: cjId, quantity: 1 })
            .then(shipRes => {
              const opts = shipRes?.data?.options || [];
              setShippingOptions(opts.filter(o => o.cost > 0));
              if (opts.length > 0) {
                const cheapest = opts.filter(o => o.cost > 0).reduce((a, b) => a.cost < b.cost ? a : b, opts[0]);
                setSelectedShipping(cheapest);
              }
            }).finally(() => setLoadingShipping(false));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
      return;
    }

    Promise.all([
      base44.entities.Product.filter({ id }),
      base44.entities.Review.filter({ product_id: id }),
    ]).then(([prods, revs]) => {
      const p = prods[0] || null;
      setProduct(p);
      setReviews(revs);
      setLoading(false);

      // Fetch shipping options if product has a CJ warehouse_product_id
      if (p?.warehouse_product_id?.startsWith('cj_')) {
        const cjId = p.warehouse_product_id.replace('cj_', '');
        setLoadingShipping(true);
        base44.functions.invoke('cjProducts', { action: 'getShipping', productId: cjId, quantity: 1 })
          .then(res => {
            const opts = res?.data?.options || [];
            setShippingOptions(opts.filter(o => o.cost > 0));
            if (opts.length > 0) {
              const cheapest = opts.filter(o => o.cost > 0).reduce((a, b) => a.cost < b.cost ? a : b, opts[0]);
              setSelectedShipping(cheapest);
            }
          })
          .finally(() => setLoadingShipping(false));
      }
    });
  }, [id]);

  // SEO JSON-LD
  useEffect(() => {
    if (!product) return;
    const name = typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name;
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": name,
      "image": product.images || [],
      "description": product.description || name,
      "brand": { "@type": "Brand", "name": product.brand || "R Souq" },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "SAR",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": { "@type": "Organization", "name": product.store_name || "R Souq" }
      },
      ...(product.rating > 0 && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviews_count || 1,
          "bestRating": 5
        }
      })
    };
    let el = document.getElementById('product-jsonld');
    if (!el) { el = document.createElement('script'); el.id = 'product-jsonld'; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schema);
    return () => { const s = document.getElementById('product-jsonld'); if (s) s.remove(); };
  }, [product]);

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
  const name = typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name;

  const shippingCostSAR = selectedShipping ? parseFloat((selectedShipping.cost * 3.75).toFixed(2)) : 0;
  const totalWithShipping = selectedShipping ? parseFloat((product.price + shippingCostSAR).toFixed(2)) : product.price;

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to={product.store_id ? `/shop/store/${product.store_id}` : '/shop'} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <span className="font-semibold flex-1 truncate">{name}</span>
        <Link to="/cart" className="p-2 rounded-full hover:bg-slate-100 transition">
          <ShoppingBag className="w-5 h-5 text-slate-600" />
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8">

          {/* ── Images Gallery ── */}
          <div>
            {/* Main image with nav arrows */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-white">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={images[activeImg]}
                  alt={name}
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`rounded-full transition-all ${i === activeImg ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${activeImg === i ? 'border-violet-500' : 'border-slate-200 hover:border-violet-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-extrabold">{name}</h1>
              {product.brand && <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>}
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= product.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
                  <span className="text-sm text-muted-foreground">({product.reviews_count || 0})</span>
                </div>
              )}
            </div>

            {/* Price */}
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

            {/* ── Shipping Options ── */}
            {product.warehouse_product_id?.startsWith('cj_') && (
              <div className="border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Truck className="w-4 h-4 text-violet-600" />
                  خيارات الشحن إلى السعودية
                </div>
                {loadingShipping ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> جاري جلب خيارات الشحن...
                  </div>
                ) : shippingOptions.length === 0 ? (
                  <p className="text-xs text-slate-400">لا تتوفر خيارات شحن حالياً</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {shippingOptions.map((opt, i) => {
                      const costSAR = parseFloat((opt.cost * 3.75).toFixed(2));
                      const isSelected = selectedShipping?.name === opt.name;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedShipping(opt)}
                          className={`w-full text-right flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition ${isSelected ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 hover:border-violet-300'}`}
                        >
                          <div>
                            <p className="font-semibold">{opt.name}</p>
                            {opt.days && <p className="text-slate-400">{opt.days} يوم</p>}
                          </div>
                          <span className="font-bold">{costSAR} ر.س</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Total with shipping */}
                {selectedShipping && (
                  <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold">
                    <span>الإجمالي مع الشحن</span>
                    <span className="text-violet-700">{totalWithShipping} ر.س</span>
                  </div>
                )}
              </div>
            )}

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