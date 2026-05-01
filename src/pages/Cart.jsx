import { Link } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/lib/LanguageContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { t, dir } = useLang();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const Arrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">{t.cart_empty}</h2>
        <p className="text-muted-foreground text-center">{t.cart_empty_desc}</p>
        <Link to="/products">
          <Button className="rounded-full mt-2">{t.continue_shopping}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition">
            <Arrow className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-extrabold">{t.cart_title}</h1>
          <span className="text-muted-foreground text-sm">({cartItems.length})</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div
                  key={item.product_id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-border/50"
                >
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'}
                    alt={item.product_name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-2 text-sm">{item.product_name}</h3>
                    <p className="text-primary font-bold mt-1">{t.currency} {item.price?.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-0 border border-border rounded-full overflow-hidden">
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-3 py-1 hover:bg-muted transition">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 font-bold text-sm min-w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-3 py-1 hover:bg-muted transition">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-sm ml-auto">{t.currency} {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product_id)} className="text-muted-foreground hover:text-destructive transition self-start mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 sticky top-36">
              <h2 className="text-lg font-extrabold mb-4">{t.order_summary}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span className="font-semibold">{t.currency} {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.shipping}</span>
                  <span className="font-semibold text-green-600">{t.free}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-base">{t.total}</span>
                  <span className="font-extrabold text-lg text-primary">{t.currency} {cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="block mt-5">
                <Button className="w-full h-12 rounded-full font-bold text-base">{t.checkout}</Button>
              </Link>
              <Link to="/products" className="block mt-3">
                <Button variant="outline" className="w-full rounded-full">{t.continue_shopping}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}