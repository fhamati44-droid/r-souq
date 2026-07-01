import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, Truck } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

export default function CJProductCard({ product, onAddToCart, shippingCost = null }) {
  const [wished, setWished] = useState(false);
  const { t } = useLang();

  const name = typeof product.name === 'object' ? (product.name?.ar || product.name?.en || '') : product.name || '';
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : 0;

  const shippingSAR = shippingCost || 0;
  const totalWithShipping = parseFloat((product.price + shippingSAR).toFixed(2));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all group relative">
      {hasDiscount && (
        <span className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </span>
      )}
      <button onClick={() => setWished(w => !w)}
        className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition">
        <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
      </button>
      <Link to={`/shop/product/${product.id}`} className="block overflow-hidden">
        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=220&fit=crop'}
          alt={name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <Link to={`/shop/product/${product.id}`}
        className="absolute inset-0 top-auto bottom-[88px] h-8 bg-black/60 text-white text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Eye className="w-3.5 h-3.5" /> {t.quick_view}
      </Link>
      <div className="p-3">
        <p className="text-xs text-slate-400 mb-1 truncate">🏪 {product.store_name}</p>
        <Link to={`/shop/product/${product.id}`}>
          <p className="font-semibold text-sm text-slate-800 line-clamp-2 mb-2 leading-snug min-h-[2.5rem]">{name}</p>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="font-extrabold text-base" style={{ color: '#7b2d8b' }}>
              {totalWithShipping} ر.س
            </span>
            {hasDiscount && <p className="text-xs text-slate-400 line-through">{(product.original_price + shippingSAR).toFixed(2)} ر.س</p>}
            <p className="text-xs text-green-600 font-medium flex items-center gap-0.5">
              <Truck className="w-3 h-3" /> شامل الشحن للسعودية
            </p>
            {shippingSAR > 0 && (
              <p className="text-[10px] text-slate-400">+{shippingSAR} ر.س شحن</p>
            )}
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