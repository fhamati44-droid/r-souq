import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { ArrowRight, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cartItems: items, removeFromCart: removeItem, updateQuantity, cartTotal: total, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to="/shop" className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="font-bold flex-1">سلة التسوق</h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-xs text-red-500 hover:underline">إفراغ السلة</button>
        )}
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-muted-foreground mb-6">سلتك فارغة</p>
            <Link to="/shop">
              <Button className="rounded-full bg-violet-600">تسوق الآن</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4"
                >
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=80&h=80&fit=crop'}
                    alt={item.product_name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{typeof item.product_name === 'object' ? (item.product_name?.ar || item.product_name?.en || '') : item.product_name}</p>
                    <p className="text-violet-600 font-extrabold text-sm mt-0.5">{item.price} ر.س</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm hover:bg-slate-50">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm hover:bg-slate-50">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.product_id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>عدد المنتجات</span>
                <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg border-t border-slate-100 pt-3">
                <span>المجموع</span>
                <span className="text-violet-700">{total.toFixed(2)} ر.س</span>
              </div>
              <Button onClick={() => navigate('/checkout')} className="w-full rounded-full bg-violet-600 hover:bg-violet-700 font-bold py-6 text-base">
                إتمام الشراء
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}