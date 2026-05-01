import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Badge as BadgeIcon, Zap } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { t, lang } = useLang();
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  const name = product.name?.[lang] || product.name?.en || product.name?.ar || 'Product';
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    toast.success(t.added_to_cart, { duration: 1500 });
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50"
    >
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || `https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">NEW</span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">-{discount}%</span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
          {/* Add to cart overlay */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`absolute bottom-0 left-0 right-0 py-2.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 translate-y-full group-hover:translate-y-0 ${
              product.stock === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? t.out_of_stock : t.add_to_cart}
          </button>
        </div>

        <div className="p-3">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{product.brand}</p>
          )}
          {/* Name */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2 text-foreground">{name}</h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
              ))}
              <span className="text-xs text-muted-foreground ml-1">({product.reviews_count || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">{t.currency} {product.price?.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-xs text-muted-foreground line-through ml-2">{t.currency} {product.original_price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}