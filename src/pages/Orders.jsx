import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'معلق', confirmed: 'مؤكد', processing: 'قيد المعالجة',
  shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      base44.entities.Order.filter({ customer_email: user.email }, '-created_date').then(data => {
        setOrders(data);
        setLoading(false);
      });
    }).catch(() => {
      base44.entities.Order.list('-created_date', 50).then(data => {
        setOrders(data);
        setLoading(false);
      });
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-slate-50" dir="rtl">
      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
        <Package className="w-12 h-12 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold">طلباتي</h2>
      <p className="text-muted-foreground">لا توجد طلبات بعد</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold mb-8">طلباتي</h1>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition text-right"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-bold">#{order.order_number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.created_date && format(new Date(order.created_date), 'dd/MM/yyyy')}
                    </p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-500'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="font-extrabold text-violet-600">{order.total_amount?.toFixed(2)} ر.س</p>
                    <p className="text-xs text-muted-foreground">{order.items?.length || 0} منتج</p>
                  </div>
                  {expanded === order.id ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                </div>
              </button>

              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-100"
                  >
                    <div className="p-5 space-y-4">
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <img src={item.product_image || ''} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100" onError={e => e.target.style.display = 'none'} />
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{item.product_name}</p>
                              <p className="text-muted-foreground">×{item.quantity} × {item.price?.toFixed(2)} ر.س</p>
                            </div>
                            <p className="font-bold">{(item.price * item.quantity).toFixed(2)} ر.س</p>
                          </div>
                        ))}
                      </div>
                      {order.tracking_number && (
                        <div className="bg-slate-50 rounded-xl p-3 text-sm">
                          <span className="text-muted-foreground">رقم التتبع: </span>
                          <span className="font-bold font-mono">{order.tracking_number}</span>
                        </div>
                      )}
                      {order.shipping_address && (
                        <p className="text-sm text-muted-foreground">📍 {order.shipping_address}{order.shipping_city ? `, ${order.shipping_city}` : ''}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}