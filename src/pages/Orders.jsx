import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_LABELS = { pending: 'معلق', confirmed: 'مؤكد', processing: 'قيد المعالجة', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' };
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Order.list('-created_date', 50).then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center gap-3 sticky top-0 z-30">
        <Link to="/shop" className="p-1.5 rounded-lg hover:bg-slate-100 transition">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="font-bold">طلباتي</h1>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-muted-foreground mb-6">لا توجد طلبات بعد</p>
            <Link to="/shop" className="text-violet-600 font-semibold hover:underline">ابدأ التسوق</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">{order.items?.length} منتج</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-500'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {order.items?.slice(0, 3).map((item, j) => (
                    <img key={j} src={item.product_image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60&h=60&fit=crop'} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                  ))}
                  {order.items?.length > 3 && <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-muted-foreground">+{order.items.length - 3}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-violet-700">{order.total_amount?.toFixed(2)} ر.س</p>
                  <p className="text-xs text-muted-foreground">{order.shipping_city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}